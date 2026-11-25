"""API del backoffice: solo para administradores de la plataforma."""

import secrets
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.db import transaction
from django.db.models import Count, Q, Sum
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.utils.text import slugify
from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from . import analytics
from .models import Membership, Merchant, Order, Settlement
from .permissions import IsPlatformAdmin

User = get_user_model()


def temp_password():
    return secrets.token_urlsafe(9)


def unique_slug(name):
    base = slugify(name) or "comercio"
    slug, n = base, 2
    while Merchant.objects.filter(slug=slug).exists():
        slug, n = f"{base}-{n}", n + 1
    return slug


def get_or_create_user(email, name=""):
    """Devuelve ``(usuario, contraseña_temporal)``; la contraseña es ``None`` si ya existía."""
    email = email.strip().lower()
    user = User.objects.filter(username=email).first()
    if user:
        return user, None
    password = temp_password()
    return User.objects.create_user(username=email, email=email, password=password, first_name=name.strip()[:150]), password


class MerchantAdminSerializer(serializers.ModelSerializer):
    orders_today = serializers.IntegerField(read_only=True, default=0)
    sales_today = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True, default=0)
    owners = serializers.SerializerMethodField()
    owner_email = serializers.EmailField(write_only=True, required=False)
    owner_name = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Merchant
        fields = ["id", "name", "slug", "category", "zone", "address", "phone", "logo", "commission_rate", "status",
                  "created_at", "orders_today", "sales_today", "owners", "owner_email", "owner_name"]
        read_only_fields = ["slug", "created_at"]

    def validate_commission_rate(self, value):
        if not Decimal("0") <= value <= Decimal("100"):
            raise serializers.ValidationError("La comisión debe estar entre 0 y 100.")
        return value

    def get_owners(self, obj):
        return [m.user.email or m.user.username for m in obj.memberships.all() if m.role == "owner"]


class MerchantAdminViewSet(viewsets.ModelViewSet):
    serializer_class = MerchantAdminSerializer
    permission_classes = [IsPlatformAdmin]

    def get_queryset(self):
        today = timezone.localdate()
        todays = Q(orders__entered_at__date=today) & ~Q(orders__status__in=analytics.CANCELLED)
        queryset = (
            Merchant.objects.annotate(orders_today=Count("orders", filter=todays), sales_today=Sum("orders__total", filter=todays))
            .prefetch_related("memberships__user")
        )
        status = self.request.query_params.get("status")
        return queryset.filter(status=status) if status else queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        owner_email, owner_name = data.pop("owner_email", None), data.pop("owner_name", "")
        password = None
        with transaction.atomic():
            merchant = serializer.save(slug=unique_slug(data["name"]))
            if owner_email:
                user, password = get_or_create_user(owner_email, owner_name)
                Membership.objects.get_or_create(user=user, merchant=merchant, defaults={"role": "owner"})
        body = self.get_serializer(self.get_queryset().get(pk=merchant.pk)).data
        if password:
            body["owner_temp_password"] = password  # se muestra una sola vez
        return Response(body, status=201)

    @action(detail=True, methods=["post"])
    def set_status(self, request, pk=None):
        merchant = self.get_object()
        value = request.data.get("status")
        if value not in dict(Merchant.STATUSES):
            return Response({"status": "Estado no válido."}, status=400)
        merchant.status = value
        merchant.save(update_fields=["status", "updated_at"])
        return Response(self.get_serializer(self.get_queryset().get(pk=merchant.pk)).data)

    @action(detail=True, methods=["post"])
    def settle(self, request, pk=None):
        """Genera una liquidación con los pedidos entregados entre ``date_from`` y ``date_to``."""
        merchant = self.get_object()
        period = str(request.data.get("period", "")).strip()
        date_from, date_to = request.data.get("date_from"), request.data.get("date_to")
        if not (period and date_from and date_to):
            return Response({"detail": "Indica period, date_from y date_to."}, status=400)
        if Settlement.objects.filter(merchant=merchant, period=period).exists():
            return Response({"period": "Ya existe una liquidación con ese nombre."}, status=400)
        delivered = Order.objects.filter(merchant=merchant, status="delivered", entered_at__date__gte=date_from, entered_at__date__lte=date_to)
        gross = delivered.aggregate(v=Sum("total"))["v"] or Decimal("0")
        commission = (gross * merchant.commission_rate / Decimal("100")).quantize(Decimal("0.01"))
        row = Settlement.objects.create(merchant=merchant, period=period, gross=gross, commission=commission)
        return Response({"id": row.pk, "period": row.period, "gross": row.gross, "commission": row.commission, "orders": delivered.count()}, status=201)


def user_row(user):
    return {
        "id": user.pk,
        "email": user.email or user.username,
        "name": user.get_full_name(),
        "is_active": user.is_active,
        "is_admin": user.is_staff or user.is_superuser,
        "memberships": [{"merchant_id": m.merchant_id, "merchant": m.merchant.name, "role": m.role} for m in user.memberships.all()],
    }


class UserAdminViewSet(viewsets.ViewSet):
    permission_classes = [IsPlatformAdmin]

    def list(self, request):
        users = User.objects.prefetch_related("memberships__merchant").order_by("email")
        merchant = request.query_params.get("merchant")
        if merchant:
            users = users.filter(memberships__merchant_id=merchant)
        return Response([user_row(u) for u in users])

    def create(self, request):
        email = str(request.data.get("email", "")).strip().lower()
        role = request.data.get("role", "staff")
        merchant = Merchant.objects.filter(pk=request.data.get("merchant")).first()
        if "@" not in email:
            return Response({"email": "Correo no válido."}, status=400)
        if role not in dict(Membership.ROLES):
            return Response({"role": "Rol no válido."}, status=400)
        if merchant is None:
            return Response({"merchant": "Selecciona un comercio."}, status=400)
        user, password = get_or_create_user(email, str(request.data.get("name", "")))
        Membership.objects.update_or_create(user=user, merchant=merchant, defaults={"role": role})
        body = user_row(User.objects.prefetch_related("memberships__merchant").get(pk=user.pk))
        if password:
            body["temp_password"] = password
        return Response(body, status=201)

    def partial_update(self, request, pk=None):
        user = get_object_or_404(User, pk=pk)
        if "is_active" in request.data:
            if user == request.user:
                return Response({"detail": "No puedes desactivar tu propia cuenta."}, status=400)
            user.is_active = bool(request.data["is_active"])
            user.save(update_fields=["is_active"])
        return Response(user_row(User.objects.prefetch_related("memberships__merchant").get(pk=user.pk)))

    @action(detail=True, methods=["post"])
    def reset_password(self, request, pk=None):
        user = get_object_or_404(User, pk=pk)
        password = temp_password()
        user.set_password(password)
        user.save(update_fields=["password"])
        return Response({"temp_password": password})


class BackofficeSummaryView(APIView):
    """KPIs y series para los gráficos del backoffice."""

    permission_classes = [IsPlatformAdmin]

    def get(self, request):
        period = request.query_params.get("period", "14d")
        orders = analytics.orders_in_period(Order.objects.all(), period, default=14)
        completed = orders.exclude(status__in=analytics.CANCELLED)
        sales = completed.aggregate(v=Sum("total"))["v"] or Decimal("0")
        count = completed.count()
        top = (
            completed.filter(merchant__isnull=False)
            .values("merchant_id", "merchant__name")
            .annotate(sales=Sum("total"), orders=Count("id"))
            .order_by("-sales")[:5]
        )
        by_rate = completed.filter(merchant__isnull=False).values("merchant__commission_rate").annotate(sales=Sum("total"))
        commission = sum((row["sales"] * row["merchant__commission_rate"] / Decimal("100") for row in by_rate), Decimal("0"))
        return Response({
            "period": period,
            "merchants": {s: Merchant.objects.filter(status=s).count() for s, _ in Merchant.STATUSES},
            "orders": orders.count(),
            "sales": sales,
            "average_ticket": sales / count if count else Decimal("0"),
            "commission": commission.quantize(Decimal("0.01")),
            "daily": analytics.daily_series(orders, period, default=14),
            "by_status": analytics.by_status(orders),
            "top_merchants": [{"id": r["merchant_id"], "name": r["merchant__name"], "sales": r["sales"], "orders": r["orders"]} for r in top],
        })
