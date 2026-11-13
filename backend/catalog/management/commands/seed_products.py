from django.core.management.base import BaseCommand

from catalog.models import Category, Product


PRODUCTS = [
    ("Hamburguesa clásica", "Hamburguesas", "125.00", 24, ["Sin cebolla", "Extra queso +L 15"]),
    ("Hamburguesa doble", "Hamburguesas", "165.00", 12, ["Sin cebolla"]),
    ("Pizza personal", "Pizzas", "140.00", 8, ["Extra queso +L 15"]),
    ("Pollo frito", "Hamburguesas", "150.00", 0, []),
    ("Papas medianas", "Hamburguesas", "45.00", 40, []),
    ("Ensalada", "Pizzas", "95.00", 6, []),
    ("Refresco", "Bebidas", "30.00", 60, ["Sin hielo"]),
    ("Brownie", "Postres", "55.00", 0, []),
]


class Command(BaseCommand):
    help = "Creates the example catalog categories and products if missing."

    def handle(self, *args, **options):
        for name, category_name, price, stock, product_options in PRODUCTS:
            category, _ = Category.objects.get_or_create(name=category_name)
            Product.objects.get_or_create(
                name=name,
                category=category,
                defaults={
                    "price": price,
                    "stock": stock,
                    "available": stock > 0,
                    "options": product_options,
                },
            )
        self.stdout.write(self.style.SUCCESS("Example catalog created."))
