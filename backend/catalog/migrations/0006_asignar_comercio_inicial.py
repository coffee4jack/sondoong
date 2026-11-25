"""Asigna los datos existentes (de antes del multi-comercio) a un comercio inicial."""

from django.db import migrations


def asignar(apps, schema_editor):
    Merchant = apps.get_model("catalog", "Merchant")
    models = [apps.get_model("catalog", n) for n in ("Product", "Order", "StoreSchedule", "ScheduleException", "Settlement", "ChatMessage")]
    if not any(m.objects.filter(merchant__isnull=True).exists() for m in models):
        return  # instalación nueva: no hay nada que migrar
    merchant, _ = Merchant.objects.get_or_create(
        slug="comercio-inicial",
        defaults={"name": "Restaurante El Sabor", "category": "Restaurante", "status": "active"},
    )
    for model in models:
        model.objects.filter(merchant__isnull=True).update(merchant=merchant)


class Migration(migrations.Migration):
    dependencies = [("catalog", "0005_multi_comercio")]
    operations = [migrations.RunPython(asignar, migrations.RunPython.noop)]
