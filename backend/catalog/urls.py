from rest_framework.routers import DefaultRouter

from .views import (
    CategoryViewSet,
    ChatMessageViewSet,
    OrderViewSet,
    ProductViewSet,
    ScheduleExceptionViewSet,
    SearchViewSet,
    SettlementViewSet,
    StoreScheduleViewSet,
    TrackingViewSet,
)

router = DefaultRouter()
router.register("categories", CategoryViewSet, basename="category")
router.register("products", ProductViewSet, basename="product")
router.register("messages", ChatMessageViewSet, basename="message")
router.register("orders", OrderViewSet, basename="order")
router.register("tracking", TrackingViewSet, basename="tracking")
router.register("schedule", StoreScheduleViewSet, basename="schedule")
router.register("schedule-exceptions", ScheduleExceptionViewSet, basename="schedule-exception")
router.register("settlements", SettlementViewSet, basename="settlement")
router.register("search", SearchViewSet, basename="search")

urlpatterns = router.urls
