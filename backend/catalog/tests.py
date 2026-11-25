from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase

from .models import Category, Order, Product, StoreSchedule


class PortalApiTests(APITestCase):
    def setUp(self):
        self.category = Category.objects.create(name="QA categoría")
        Product.objects.create(category=self.category, name="QA producto", price="12.50", stock=3)
        self.admin = get_user_model().objects.create_user("qa-admin@bolt.hn", "qa-admin@bolt.hn", "x-qa-pass-1", is_staff=True)

    def login(self):
        """Las rutas del portal exigen sesión; las de la app móvil y el tracking no."""
        self.client.force_authenticate(self.admin)

    def test_search_finds_products(self):
        self.login()
        response = self.client.get("/api/search/?q=QA producto")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["products"][0]["name"], "QA producto")

    def test_orders_can_be_created_and_listed(self):
        created = self.client.post("/api/orders/", {
            "code": "QA-ORDER-1",
            "items": ["QA producto"],
            "total": "12.50",
            "status": "new",
            "priority": "Media",
            "target": 10,
        }, format="json")
        self.assertEqual(created.status_code, 201)
        self.assertEqual(created.data["code"], "QA-ORDER-1")
        self.assertTrue(Order.objects.filter(code="QA-ORDER-1").exists())

    def test_schedule_endpoint_persists_pause_state(self):
        self.login()
        response = self.client.patch("/api/schedule/default/", {
            "paused": True,
            "pause_reason": "QA mantenimiento",
            "pause_duration": "30 min",
        }, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(StoreSchedule.objects.get(key="default").paused)

    def test_reports_summary_and_settlements_endpoints(self):
        self.login()
        self.assertEqual(self.client.get("/api/orders/summary/?period=7d").status_code, 200)
        self.assertEqual(self.client.get("/api/settlements/").status_code, 200)

    def test_courier_location_is_visible_to_customer_tracking_and_order_list(self):
        order = Order.objects.create(code="GPS-API-TEST", items=["QA producto"], total="12.50", status="preparing")
        token = str(order.tracking_token)
        location = self.client.post(
            f"/api/orders/{order.pk}/location/",
            {"latitude": "14.072300", "longitude": "-87.192100", "accuracy_m": 9},
            format="json",
        )
        self.assertEqual(location.status_code, 201)
        self.assertEqual(len(location.data["latitude"].split(".")[-1]), 6)

        customer_tracking = self.client.get(f"/api/tracking/{token}/")
        self.assertEqual(customer_tracking.status_code, 200)
        self.assertEqual(str(customer_tracking.data["latest_location"]["latitude"]), "14.072300")

        portal_orders = self.client.get("/api/orders/")
        listed_order = next(item for item in portal_orders.data if item["code"] == order.code)
        self.assertIsNotNone(listed_order["latest_location"])

    def test_gps_precision_is_normalized_and_invalid_coordinates_are_rejected(self):
        order = Order.objects.create(code="GPS-INVALID-TEST", items=[], total="0.00", status="preparing")
        response = self.client.post(
            f"/api/orders/{order.pk}/location/",
            {"latitude": "91.000000", "longitude": "-87.192100", "accuracy_m": -1},
            format="json",
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("latitude", response.data)
        self.assertIn("accuracy_m", response.data)

    def test_location_is_rejected_after_order_is_delivered(self):
        order = Order.objects.create(code="GPS-DONE-TEST", items=[], total="0.00", status="delivered")
        body = {"latitude": "14.072300", "longitude": "-87.192100"}
        self.assertEqual(self.client.post(f"/api/orders/{order.pk}/location/", body, format="json").status_code, 409)
        self.assertEqual(self.client.post(f"/api/tracking/{order.tracking_token}/location/", body, format="json").status_code, 409)

    def test_gps_flow_courier_updates_are_reflected_in_latest_location(self):
        order = Order.objects.create(code="GPS-FLOW-TEST", items=[], total="0.00", status="preparing")
        for lat, lng in [("14.072300", "-87.192100"), ("14.073000", "-87.191000")]:
            self.client.post(f"/api/orders/{order.pk}/location/", {"latitude": lat, "longitude": lng, "accuracy_m": 8}, format="json")
        latest = self.client.get(f"/api/tracking/{order.tracking_token}/").data["latest_location"]
        self.assertEqual(str(latest["latitude"]), "14.073000")
        self.assertEqual(self.client.get("/api/tracking/not-a-uuid/").status_code, 404)

    def test_full_precision_device_coordinates_are_accepted(self):
        order = Order.objects.create(code="GPS-PREC-TEST", items=[], total="0.00", status="preparing")
        response = self.client.post(f"/api/orders/{order.pk}/location/", {"latitude": 14.07230123456, "longitude": -87.19210987654}, format="json")
        self.assertEqual(response.status_code, 201)
