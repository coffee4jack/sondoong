from decimal import Decimal

from django.core.exceptions import ValidationError
from django.db.models import Q, Sum
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import mixins, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from . import analytics
from .models import Category, ChatMessage, Order, Product, ScheduleException, Settlement, StoreSchedule
from .permissions import (
    IsPlatformAdmin,
    IsPortalUser,
    MerchantScopedMixin,
    PublicReadPortalWrite,
    current_merchant,
    is_portal_user,
    requested_merchant_id,
    scope_by_merchant,
)
from .serializers import (
    CategorySerializer,
    ChatMessageSerializer,
    CourierOrderSerializer,
    OrderLocationSerializer,
    OrderSerializer,
    ProductSerializer,
    ScheduleExceptionSerializer,
    SettlementSerializer,
    StoreScheduleSerializer,
)

FINAL_STATUSES = ("delivered", "rejected", "cancelled")


class CategoryViewSet(viewsets.ModelViewSet):
    """Categorías compartidas por todos los comercios. Lectura pública."""

    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [PublicReadPortalWrite]


class ProductViewSet(MerchantScopedMixin, viewsets.ModelViewSet):
    """Catálogo. El público (app móvil) ve los comercios activos; el portal, solo el suyo."""

    serializer_class = ProductSerializer
    permission_classes = [PublicReadPortalWrite]

    def get_queryset(self):
        queryset = Product.objects.select_related("category")
        if is_portal_user(self.request.user):
            return self.scope_queryset(queryset)
        queryset = queryset.exclude(merchant__status__in=("pending", "suspended"))
        wanted = requested_merchant_id(self.request)
        return queryset.filter(merchant_id=wanted) if wanted else queryset


class ChatMessageViewSet(MerchantScopedMixin, mixins.ListModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet):
    serializer_class = ChatMessageSerializer
    permission_classes = [IsPortalUser]

    def get_queryset(self):
        queryset = self.scope_queryset(ChatMessage.objects.all())
        thread_id = self.request.query_params.get("thread_id")
        return queryset.filter(thread_id=thread_id) if thread_id else queryset


class OrderViewSet(viewsets.ModelViewSet):
    """Pedidos.

    - Portal: lista, edita y reporta solo los pedidos de su comercio.
    - App móvil (sin sesión): crea pedidos, el repartidor lista los activos
      (sin teléfono del cliente) y puede marcarlos como entregados.
    """

    serializer_class = OrderSerializer

    def get_permissions(self):
        public = {"list", "retrieve", "create", "partial_update", "location"}
        return [AllowAny()] if self.action in public else [IsPortalUser()]

    def get_serializer_class(self):
        if not is_portal_user(self.request.user) and self.action in {"list", "retrieve", "partial_update"}:
            return CourierOrderSerializer
        return OrderSerializer

    def get_queryset(self):
        queryset = Order.objects.select_related("merchant")
        if not is_portal_user(self.request.user):
            return queryset.exclude(status__in=FINAL_STATUSES)
        queryset = scope_by_merchant(self.request, queryset)
        params = self.request.query_params
        query = params.get("search", "").strip()
        if query:
            queryset = queryset.filter(Q(code__icontains=query) | Q(items__icontains=query) | Q(status__icontains=query))
        if params.get("status"):
            queryset = queryset.filter(status=params["status"])
        if params.get("branch"):
            queryset = queryset.filter(branch__icontains=params["branch"])
        if params.get("from"):
            queryset = queryset.filter(entered_at__date__gte=params["from"])
        if params.get("to"):
            queryset = queryset.filter(entered_at__date__lte=params["to"])
        if params.get("min"):
            queryset = queryset.filter(total__gte=params["min"])
        return queryset

    def perform_create(self, serializer):
        merchant = current_merchant(self.request) if is_portal_user(self.request.user) else None
        if merchant:
            serializer.save(merchant=merchant)
        else:
            serializer.save()

    def partial_update(self, request, *args, **kwargs):
        if not is_portal_user(request.user):
            # El repartidor sin cuenta solo puede marcar como entregado.
            if set(request.data.keys()) != {"status"} or request.data.get("status") != "delivered":
                raise PermissionDenied("Sin sesión solo se puede marcar un pedido como entregado.")
        return super().partial_update(request, *args, **kwargs)

    @action(detail=True, methods=["post"], url_path="location")
    def location(self, request, pk=None):
        queryset = Order.objects.all()
        if is_portal_user(request.user):
            queryset = scope_by_merchant(request, queryset)
        order = get_object_or_404(queryset, pk=pk)
        if order.status in FINAL_STATUSES:
            return Response({"detail": "El seguimiento de este pedido ya terminó."}, status=409)
        serializer = OrderLocationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        point = serializer.save(order=order)
        return Response(OrderLocationSerializer(point).data, status=201)

    @action(detail=False, methods=["get"])
    def summary(self, request):
        period = request.query_params.get("period", "today")
        orders = analytics.orders_in_period(self.get_queryset(), period)
        completed = orders.exclude(status__in=analytics.CANCELLED)
        sales = completed.aggregate(value=Sum("total"))["value"] or Decimal("0")
        count = completed.count()
        return Response({
            "date": timezone.localdate(),
            "period": period,
            "orders": orders.count(),
            "sales": sales,
            "cancelled": orders.filter(status__in=analytics.CANCELLED).count(),
            "average_ticket": sales / count if count else Decimal("0"),
            "daily_sales": analytics.daily_series(orders, period),
        })

    @action(detail=False, methods=["get"])
    def analytics(self, request):
        """Datos para los gráficos del portal: horas pico, estados y productos top."""
        period = request.query_params.get("period", "7d")
        orders = analytics.orders_in_period(self.get_queryset(), period)
        return Response({
            "period": period,
            "by_hour": analytics.by_hour(orders),
            "by_status": analytics.by_status(orders),
            "top_products": analytics.top_products(orders),
        })


class TrackingViewSet(viewsets.ViewSet):
    authentication_classes = []
    permission_classes = []

    def get_order(self, token):
        try:
            return Order.objects.get(tracking_token=token)
        except (Order.DoesNotExist, ValueError, ValidationError):
            return None

    def retrieve(self, request, pk=None):
        order = self.get_order(pk)
        if order is None:
            return Response({"detail": "Tracking no encontrado."}, status=404)
        latest = order.locations.first()
        return Response({
            "code": order.code,
            "status": order.status,
            "items": order.items,
            "entered_at": order.entered_at,
            "updated_at": order.updated_at,
            "latest_location": OrderLocationSerializer(latest).data if latest else None,
        })

    @action(detail=True, methods=["post"], url_path="location")
    def location(self, request, pk=None):
        order = self.get_order(pk)
        if order is None:
            return Response({"detail": "Tracking no encontrado."}, status=404)
        if order.status in FINAL_STATUSES:
            return Response({"detail": "El seguimiento de este pedido ya terminó."}, status=409)
        serializer = OrderLocationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        point = serializer.save(order=order)
        return Response(OrderLocationSerializer(point).data, status=201)


DEFAULT_WEEKLY_HOURS = [
    {"day": "Lun – Vie", "open": "10:00", "close": "22:00"},
    {"day": "Sábado", "open": "10:00", "close": "23:00"},
    {"day": "Domingo", "open": "11:00", "close": "20:00"},
]


class StoreScheduleViewSet(viewsets.ViewSet):
    """Horario y pausas. Cada comercio tiene su propio registro (``key`` = ``m<id>``)."""

    permission_classes = [IsPortalUser]

    def get_schedule(self, request):
        merchant = current_merchant(request)
        key = f"m{merchant.pk}" if merchant else "default"
        schedule, _ = StoreSchedule.objects.get_or_create(
            key=key, defaults={"merchant": merchant, "weekly_hours": DEFAULT_WEEKLY_HOURS}
        )
        return schedule

    def list(self, request):
        return Response(StoreScheduleSerializer(self.get_schedule(request)).data)

    def partial_update(self, request, pk=None):
        schedule = self.get_schedule(request)
        serializer = StoreScheduleSerializer(schedule, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def update(self, request, pk=None):
        return self.partial_update(request, pk)


class ScheduleExceptionViewSet(MerchantScopedMixin, viewsets.ModelViewSet):
    serializer_class = ScheduleExceptionSerializer
    permission_classes = [IsPortalUser]

    def get_queryset(self):
        return self.scope_queryset(ScheduleException.objects.all())


class SettlementViewSet(MerchantScopedMixin, viewsets.ModelViewSet):
    """Liquidaciones: el comercio las consulta; solo la plataforma las crea o edita."""

    serializer_class = SettlementSerializer

    def get_permissions(self):
        return [IsPortalUser()] if self.action in {"list", "retrieve"} else [IsPlatformAdmin()]

    def get_queryset(self):
        return self.scope_queryset(Settlement.objects.all())


class SearchViewSet(viewsets.ViewSet):
    permission_classes = [IsPortalUser]

    def list(self, request):
        query = request.query_params.get("q", "").strip()
        if len(query) < 2:
            return Response({"products": [], "orders": []})
        products = scope_by_merchant(request, Product.objects.select_related("category")).filter(
            Q(name__icontains=query) | Q(category__name__icontains=query)
        )[:8]
        orders = scope_by_merchant(request, Order.objects.all()).filter(
            Q(code__icontains=query) | Q(items__icontains=query)
        )[:8]
        return Response({
            "products": ProductSerializer(products, many=True).data,
            "orders": OrderSerializer(orders, many=True).data,
        })
