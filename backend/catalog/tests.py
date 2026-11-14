from rest_framework.test import APITestCase

from .models import Category, Order, Product, StoreSchedule


class PortalApiTests(APITestCase):
    def setUp(self):
        self.category = Category.objects.create(name="QA categoría")
        Product.objects.create(category=self.category, name="QA producto", price="12.50", stock=3)

    def test_search_finds_products(self):
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
        response = self.client.patch("/api/schedule/default/", {
            "paused": True,
            "pause_reason": "QA mantenimiento",
            "pause_duration": "30 min",
        }, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(StoreSchedule.objects.get(key="default").paused)

    def test_reports_summary_and_settlements_endpoints(self):
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

        customer_tracking = self.client.get(f"/api/tracking/{token}/")
        self.assertEqual(customer_tracking.status_code, 200)
        self.assertEqual(str(customer_tracking.data["latest_location"]["latitude"]), "14.072300")

        portal_orders = self.client.get("/api/orders/")
        listed_order = next(item for item in portal_orders.data if item["code"] == order.code)
        self.assertIsNotNone(listed_order["latest_location"])
