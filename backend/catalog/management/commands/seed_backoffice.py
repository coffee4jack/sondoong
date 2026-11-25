"""Crea un administrador, comercios de ejemplo, usuarios y 30 días de pedidos (para los gráficos)."""

import random
from datetime import timedelta
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.utils import timezone

from catalog.models import Category, Membership, Merchant, Order, Product, Settlement

User = get_user_model()

MERCHANTS = [
    ("Restaurante El Sabor", "Restaurante", "Centro", "15", "gerente@elsabor.hn",
     [("Hamburguesa clásica", "95"), ("Pizza personal", "110"), ("Papas medianas", "40"), ("Limonada", "30")]),
    ("Baleadas Doña Mary", "Comida típica", "Comayagüela", "15", "mary@baleadas.hn",
     [("Baleada sencilla", "35"), ("Baleada con todo", "60"), ("Plato típico", "130"), ("Jugo de maracuyá", "30")]),
    ("Café del Centro", "Café", "Centro", "18", "hola@cafedelcentro.hn",
     [("Café americano", "45"), ("Capuchino", "65"), ("Pan de banano", "40"), ("Licuado", "70")]),
]


class Command(BaseCommand):
    help = "Datos de ejemplo del backoffice. Es repetible y no duplica lo existente."

    def add_arguments(self, parser):
        parser.add_argument("--password", default="Bolt12345!", help="Contraseña de las cuentas de ejemplo")

    def handle(self, *args, **options):
        password = options["password"]
        rng = random.Random(42)
        admin, created = User.objects.get_or_create(username="admin@bolt.hn", defaults={"email": "admin@bolt.hn", "is_staff": True, "is_superuser": True, "first_name": "Admin"})
        if created:
            admin.set_password(password)
            admin.save()
        category, _ = Category.objects.get_or_create(name="General")
        now = timezone.now()
        for name, kind, zone, rate, email, products in MERCHANTS:
            merchant, _ = Merchant.objects.get_or_create(
                slug=name.lower().replace(" ", "-").replace("ñ", "n"),
                defaults={"name": name, "category": kind, "zone": zone, "commission_rate": Decimal(rate), "status": "active"},
            )
            user, made = User.objects.get_or_create(username=email, defaults={"email": email, "first_name": name})
            if made:
                user.set_password(password)
                user.save()
            Membership.objects.get_or_create(user=user, merchant=merchant, defaults={"role": "owner"})
            for pname, price in products:
                Product.objects.get_or_create(merchant=merchant, name=pname, defaults={"category": category, "price": Decimal(price), "stock": 50})
            if merchant.orders.exists():
                continue
            for day in range(30):
                for n in range(rng.randint(2, 9)):
                    lines = rng.sample(products, rng.randint(1, 3))
                    items = [f"{rng.randint(1, 3)}× {p}" for p, _ in lines]
                    total = sum(Decimal(price) * int(i.split("×")[0]) for i, (_, price) in zip(items, lines))
                    when = now - timedelta(days=day, hours=rng.choice([11, 12, 13, 14, 18, 19, 20, 21]), minutes=rng.randint(0, 59))
                    status = rng.choices(["delivered", "cancelled", "rejected"], [90, 6, 4])[0] if day else "delivered"
                    Order.objects.create(merchant=merchant, code=f"{merchant.pk}{day:02d}{n:02d}{rng.randint(100, 999)}", items=items, total=total, status=status, entered_at=when)
            Settlement.objects.get_or_create(merchant=merchant, period="Quincena anterior", defaults={"status": "Pagada", "gross": Decimal("20000"), "commission": Decimal("3000")})
        self.stdout.write(self.style.SUCCESS(f"Listo. Administrador: admin@bolt.hn · Comercios: gerente@elsabor.hn, mary@baleadas.hn, hola@cafedelcentro.hn · Contraseña: {password}"))
