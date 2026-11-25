from django.urls import path
from rest_framework.routers import DefaultRouter

from .auth_views import LoginView, LogoutView, MeView
from .backoffice import BackofficeSummaryView, MerchantAdminViewSet, UserAdminViewSet
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
router.register("backoffice/merchants", MerchantAdminViewSet, basename="backoffice-merchant")
router.register("backoffice/users", UserAdminViewSet, basename="backoffice-user")

urlpatterns = [
    path("auth/login/", LoginView.as_view(), name="auth-login"),
    path("auth/me/", MeView.as_view(), name="auth-me"),
    path("auth/logout/", LogoutView.as_view(), name="auth-logout"),
    path("backoffice/summary/", BackofficeSummaryView.as_view(), name="backoffice-summary"),
] + router.urls
