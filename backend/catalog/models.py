import uuid

from django.db import models
from django.utils import timezone


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]
        verbose_name_plural = "categories"

    def __str__(self):
        return self.name


class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="products")
    name = models.CharField(max_length=160)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    available = models.BooleanField(default=True)
    options = models.JSONField(default=list, blank=True)
    image = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Order(models.Model):
    STATUSES = [
        ("new", "Nuevo"),
        ("preparing", "En preparación"),
        ("ready", "Listo"),
        ("delivered", "Entregado"),
        ("rejected", "Rechazado"),
        ("cancelled", "Cancelado"),
    ]
    PRIORITIES = [("Alta", "Alta"), ("Media", "Media"), ("Baja", "Baja")]

    code = models.CharField(max_length=32, unique=True)
    items = models.JSONField(default=list)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUSES, default="new", db_index=True)
    priority = models.CharField(max_length=10, choices=PRIORITIES, default="Media")
    target_minutes = models.PositiveSmallIntegerField(default=15)
    branch = models.CharField(max_length=100, default="Centro")
    rejection_reason = models.CharField(max_length=200, blank=True)
    customer_name = models.CharField(max_length=120, blank=True)
    customer_phone = models.CharField(max_length=30, blank=True)
    delivery_address = models.CharField(max_length=250, blank=True)
    tracking_token = models.UUIDField(default=uuid.uuid4, db_index=True, editable=False)
    entered_at = models.DateTimeField(default=timezone.now, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-entered_at"]

    def __str__(self):
        return self.code


class OrderLocation(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="locations")
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    accuracy_m = models.PositiveIntegerField(null=True, blank=True)
    recorded_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ["-recorded_at"]


class StoreSchedule(models.Model):
    key = models.CharField(max_length=30, unique=True, default="default")
    paused = models.BooleanField(default=False)
    pause_reason = models.CharField(max_length=120, blank=True)
    pause_duration = models.CharField(max_length=30, blank=True)
    paused_until = models.DateTimeField(null=True, blank=True)
    weekly_hours = models.JSONField(default=list)
    updated_at = models.DateTimeField(auto_now=True)


class ScheduleException(models.Model):
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    reason = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["date", "start_time"]


class Settlement(models.Model):
    period = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=30, default="Pendiente de pago")
    gross = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    commission = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    adjustments = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]


class ChatMessage(models.Model):
    SENDER_CHOICES = [("merchant", "Comercio"), ("operations", "Operaciones"), ("courier", "Repartidor")]

    thread_id = models.CharField(max_length=120, db_index=True)
    contact = models.CharField(max_length=80)
    sender = models.CharField(max_length=20, choices=SENDER_CHOICES, default="merchant")
    text = models.TextField(max_length=2000)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at", "id"]

    def __str__(self):
        return f"{self.thread_id}: {self.sender}"
