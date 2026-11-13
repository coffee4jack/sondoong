from rest_framework.routers import DefaultRouter

from .views import CategoryViewSet, ChatMessageViewSet, ProductViewSet

router = DefaultRouter()
router.register("categories", CategoryViewSet, basename="category")
router.register("products", ProductViewSet, basename="product")
router.register("messages", ChatMessageViewSet, basename="message")

urlpatterns = router.urls
