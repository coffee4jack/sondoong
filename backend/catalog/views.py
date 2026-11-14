from datetime import timedelta
from decimal import Decimal

from django.db.models import Q, Sum
from django.utils import timezone
from rest_framework import mixins, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Category, ChatMessage, Order, OrderLocation, Product, ScheduleException, Settlement, StoreSchedule
from .serializers import (
    CategorySerializer,
    ChatMessageSerializer,
    OrderLocationSerializer,
    OrderSerializer,
    ProductSerializer,
    ScheduleExceptionSerializer,
    SettlementSerializer,
    StoreScheduleSerializer,
)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related("category").all()
    serializer_class = ProductSerializer


class ChatMessageViewSet(mixins.ListModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet):
    serializer_class = ChatMessageSerializer

    def get_queryset(self):
        queryset = ChatMessage.objects.all()
        thread_id = self.request.query_params.get("thread_id")
        return queryset.filter(thread_id=thread_id) if thread_id else queryset


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        query = self.request.query_params.get("search", "").strip()
        if query:
            queryset = queryset.filter(Q(code__icontains=query) | Q(items__icontains=query) | Q(status__icontains=query))
        status_filter = self.request.query_params.get("status")
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        branch = self.request.query_params.get("branch")
        if branch:
            queryset = queryset.filter(branch__icontains=branch)
        date_from = self.request.query_params.get("from")
        date_to = self.request.query_params.get("to")
        min_total = self.request.query_params.get("min")
        if date_from:
            queryset = queryset.filter(entered_at__date__gte=date_from)
        if date_to:
            queryset = queryset.filter(entered_at__date__lte=date_to)
        if min_total:
            queryset = queryset.filter(total__gte=min_total)
        return queryset

    @action(detail=True, methods=["post"], url_path="location")
    def location(self, request, pk=None):
        order = self.get_object()
        serializer = OrderLocationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        point = serializer.save(order=order)
        return Response(OrderLocationSerializer(point).data, status=201)

    @action(detail=False, methods=["get"])
    def summary(self, request):
        today = timezone.localdate()
        period = request.query_params.get("period", "today")
        days = 30 if period == "30d" else 7 if period == "7d" else 1
        start = today - timedelta(days=days - 1)
        orders = self.get_queryset().filter(entered_at__date__gte=start, entered_at__date__lte=today)
        completed = orders.exclude(status__in=["rejected", "cancelled"])
        sales = completed.aggregate(value=Sum("total"))["value"] or Decimal("0")
        count = completed.count()
        return Response({
            "date": today,
            "period": period,
            "orders": orders.count(),
            "sales": sales,
            "cancelled": orders.filter(status__in=["rejected", "cancelled"]).count(),
            "average_ticket": sales / count if count else Decimal("0"),
            "daily_sales": [
                {"date": day, "orders": day_orders.count(), "sales": day_orders.exclude(status__in=["rejected", "cancelled"]).aggregate(value=Sum("total"))["value"] or Decimal("0")}
                for day in [start + timedelta(days=i) for i in range(days)]
                for day_orders in [orders.filter(entered_at__date=day)]
            ],
        })


class TrackingViewSet(viewsets.ViewSet):
    authentication_classes = []
    permission_classes = []

    def get_order(self, token):
        try:
            return Order.objects.get(tracking_token=token)
        except (Order.DoesNotExist, ValueError):
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
        if order.status in ["delivered", "rejected", "cancelled"]:
            return Response({"detail": "El seguimiento de este pedido ya terminó."}, status=409)
        serializer = OrderLocationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        point = serializer.save(order=order)
        return Response(OrderLocationSerializer(point).data, status=201)


class StoreScheduleViewSet(viewsets.ViewSet):
    def list(self, request):
        schedule, _ = StoreSchedule.objects.get_or_create(
            key="default",
            defaults={"weekly_hours": [
                {"day": "Lun – Vie", "open": "10:00", "close": "22:00"},
                {"day": "Sábado", "open": "10:00", "close": "23:00"},
                {"day": "Domingo", "open": "11:00", "close": "20:00"},
            ]},
        )
        return Response(StoreScheduleSerializer(schedule).data)

    def partial_update(self, request, pk=None):
        schedule, _ = StoreSchedule.objects.get_or_create(key="default")
        serializer = StoreScheduleSerializer(schedule, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def update(self, request, pk=None):
        return self.partial_update(request, pk)


class ScheduleExceptionViewSet(viewsets.ModelViewSet):
    queryset = ScheduleException.objects.all()
    serializer_class = ScheduleExceptionSerializer


class SettlementViewSet(viewsets.ModelViewSet):
    queryset = Settlement.objects.all()
    serializer_class = SettlementSerializer


class SearchViewSet(viewsets.ViewSet):
    def list(self, request):
        query = request.query_params.get("q", "").strip()
        if len(query) < 2:
            return Response({"products": [], "orders": []})
        products = Product.objects.filter(Q(name__icontains=query) | Q(category__name__icontains=query))[:8]
        orders = Order.objects.filter(Q(code__icontains=query) | Q(items__icontains=query))[:8]
        return Response({
            "products": ProductSerializer(products, many=True).data,
            "orders": OrderSerializer(orders, many=True).data,
        })
