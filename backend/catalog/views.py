from rest_framework import mixins, viewsets

from .models import Category, ChatMessage, Product
from .serializers import CategorySerializer, ChatMessageSerializer, ProductSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related("category").all()
    serializer_class = ProductSerializer


class ChatMessageViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = ChatMessageSerializer

    def get_queryset(self):
        queryset = ChatMessage.objects.all()
        thread_id = self.request.query_params.get("thread_id")
        if thread_id:
            queryset = queryset.filter(thread_id=thread_id)
        return queryset
