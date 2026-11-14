import uuid

from rest_framework import serializers

from .models import (
    Category,
    ChatMessage,
    Order,
    OrderLocation,
    Product,
    ScheduleException,
    Settlement,
    StoreSchedule,
)


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ["id", "thread_id", "contact", "sender", "text", "created_at"]
        read_only_fields = ["id", "created_at"]


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = Product
        fields = ["id", "name", "category", "category_name", "price", "stock", "available", "options", "image", "created_at", "updated_at"]
        read_only_fields = ["created_at", "updated_at"]

    def validate(self, attrs):
        if attrs.get("stock", getattr(self.instance, "stock", 0)) == 0:
            attrs["available"] = False
        return attrs


class OrderLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderLocation
        fields = ["latitude", "longitude", "accuracy_m", "recorded_at"]
        read_only_fields = ["recorded_at"]


class OrderSerializer(serializers.ModelSerializer):
    db_id = serializers.IntegerField(source="pk", read_only=True)
    target = serializers.IntegerField(source="target_minutes", required=False)
    enteredAt = serializers.DateTimeField(source="entered_at", required=False)
    code = serializers.CharField(required=False)
    rejection_reason = serializers.CharField(required=False, allow_blank=True)
    latest_location = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ["id", "db_id", "code", "items", "total", "status", "priority", "target", "branch", "rejection_reason", "customer_name", "customer_phone", "delivery_address", "tracking_token", "latest_location", "enteredAt", "updated_at"]
        read_only_fields = ["id", "updated_at"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["id"] = instance.code
        data["db_id"] = instance.pk
        return data

    def get_latest_location(self, instance):
        point = instance.locations.first()
        return OrderLocationSerializer(point).data if point else None

    def create(self, validated_data):
        validated_data["code"] = validated_data.get("code") or uuid.uuid4().hex[:8].upper()
        return super().create(validated_data)


class StoreScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoreSchedule
        fields = ["id", "key", "paused", "pause_reason", "pause_duration", "paused_until", "weekly_hours", "updated_at"]
        read_only_fields = ["id", "updated_at"]


class ScheduleExceptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduleException
        fields = ["id", "date", "start_time", "end_time", "reason", "created_at"]
        read_only_fields = ["id", "created_at"]


class SettlementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Settlement
        fields = ["id", "period", "status", "gross", "commission", "adjustments", "created_at"]
        read_only_fields = ["id", "created_at"]
