from datetime import date, time, timedelta
from decimal import Decimal

from django.core.management.base import BaseCommand
from django.utils import timezone

from catalog.models import Merchant, Order, ScheduleException, Settlement, StoreSchedule


def default_merchant():
    """Comercio de ejemplo al que pertenecen los datos de demostración."""
    merchant, _ = Merchant.objects.get_or_create(
        slug="comercio-inicial",
        defaults={"name": "Restaurante El Sabor", "category": "Restaurante", "status": "active"},
    )
    return merchant


class Command(BaseCommand):
    help = "Adds repeatable sample data for portal modules."

    def handle(self, *args, **options):
        merchant = default_merchant()
        StoreSchedule.objects.get_or_create(
            key=f"m{merchant.pk}",
            defaults={
                "merchant": merchant,
                "weekly_hours": [
                    {"day": "Lun – Vie", "open": "10:00", "close": "22:00"},
                    {"day": "Sábado", "open": "10:00", "close": "23:00"},
                    {"day": "Domingo", "open": "11:00", "close": "20:00"},
                ]
            },
        )
        now = timezone.now()
        examples = [
            ("A23B567K", ["2× Hamburguesa clásica", "1× Papas medianas"], "285.00", "new", "Alta", 15, 1),
            ("A23C118M", ["1× Pollo frito", "2× Refresco"], "245.00", "new", "Media", 20, 3),
            ("A23A902K", ["3× Pizza personal"], "420.00", "preparing", "Alta", 15, 12),
            ("A23A877T", ["1× Ensalada", "1× Sopa"], "190.00", "preparing", "Baja", 25, 14),
            ("A23A640P", ["2× Hamburguesa doble"], "330.00", "ready", "Media", 15, 20),
        ]
        for code, items, total, order_status, priority, target, mins in examples:
            Order.objects.get_or_create(
                code=code,
                defaults={
                    "merchant": merchant,
                    "items": items,
                    "total": Decimal(total),
                    "status": order_status,
                    "priority": priority,
                    "target_minutes": target,
                    "entered_at": now - timedelta(minutes=mins),
                },
            )

        ScheduleException.objects.get_or_create(
            date=date.today() + timedelta(days=3),
            start_time=time(10, 0),
            end_time=time(16, 0),
            merchant=merchant,
            defaults={"reason": "Evento privado"},
        )
        for period, status, gross, commission in [
            ("Esta quincena", "Pendiente de pago", "48250.00", "9650.00"),
            ("Quincena anterior", "Pagada", "51200.00", "10240.00"),
            ("Hace un mes", "Pagada", "44800.00", "8960.00"),
        ]:
            Settlement.objects.get_or_create(
                period=period,
                merchant=merchant,
                defaults={"status": status, "gross": Decimal(gross), "commission": Decimal(commission)},
            )
        self.stdout.write(self.style.SUCCESS("Portal sample data is ready."))
