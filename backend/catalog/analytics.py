"""Cálculos de reportes con consultas agrupadas (sin una consulta por día)."""

import re
from collections import Counter
from datetime import timedelta

from django.db.models import Count, Q, Sum
from django.db.models.functions import ExtractHour, TruncDate
from django.utils import timezone

CANCELLED = ("rejected", "cancelled")
PERIOD_DAYS = {"today": 1, "7d": 7, "14d": 14, "30d": 30}
_ITEM = re.compile(r"^\s*(\d+)\s*[×xX]\s*(.+?)\s*$")


def period_days(period, default=1):
    return PERIOD_DAYS.get(period, default)


def period_start(period, default=1):
    today = timezone.localdate()
    return today - timedelta(days=period_days(period, default) - 1)


def orders_in_period(queryset, period, default=1):
    today = timezone.localdate()
    start = period_start(period, default)
    return queryset.filter(entered_at__date__gte=start, entered_at__date__lte=today)


def daily_series(queryset, period, default=1):
    """Pedidos y ventas por día, con ceros en los días sin actividad."""
    start = period_start(period, default)
    rows = {
        row["day"]: row
        for row in queryset.annotate(day=TruncDate("entered_at"))
        .values("day")
        .annotate(orders=Count("id"), sales=Sum("total", filter=~Q(status__in=CANCELLED)))
    }
    series = []
    for offset in range(period_days(period, default)):
        day = start + timedelta(days=offset)
        row = rows.get(day)
        series.append({"date": day, "orders": row["orders"] if row else 0, "sales": (row["sales"] or 0) if row else 0})
    return series


def by_status(queryset):
    return [{"status": r["status"], "count": r["count"]} for r in queryset.values("status").annotate(count=Count("id")).order_by("-count")]


def by_hour(queryset):
    counts = {r["hour"]: r["count"] for r in queryset.annotate(hour=ExtractHour("entered_at")).values("hour").annotate(count=Count("id"))}
    return [{"hour": hour, "orders": counts.get(hour, 0)} for hour in range(24)]


def top_products(queryset, limit=5):
    """Productos más pedidos a partir de textos como ``2× Pizza personal``."""
    counter = Counter()
    for (items,) in queryset.exclude(status__in=CANCELLED).values_list("items"):
        for item in items if isinstance(items, list) else []:
            text = item.get("name") if isinstance(item, dict) else str(item)
            qty = int(item.get("quantity", 1)) if isinstance(item, dict) else 1
            match = _ITEM.match(text or "")
            if match:
                qty, text = int(match.group(1)), match.group(2)
            if text:
                counter[text] += qty
    return [{"name": name, "quantity": qty} for name, qty in counter.most_common(limit)]
