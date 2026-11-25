"""Pruebas de multi-comercio, autenticación, backoffice y reportes."""

from datetime import timedelta
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.test import APITestCase

from .models import Category, Membership, Merchant, Order, Product, Settlement

User = get_user_model()
PASSWORD = "clave-segura-123"


def make_user(email, **extra):
    return User.objects.create_user(email, email, PASSWORD, **extra)


class BaseCase(APITestCase):
    def setUp(self):
        self.category = Category.objects.create(name="General")
        self.admin = make_user("admin@test.hn", is_staff=True, is_superuser=True)
        self.a = Merchant.objects.create(name="Comercio A", slug="a", status="active", commission_rate=10)
        self.b = Merchant.objects.create(name="Comercio B", slug="b", status="active", commission_rate=20)
        self.user_a = make_user("a@test.hn")
        self.user_b = make_user("b@test.hn")
        Membership.objects.create(user=self.user_a, merchant=self.a, role="owner")
        Membership.objects.create(user=self.user_b, merchant=self.b, role="owner")
        self.pa = Product.objects.create(merchant=self.a, category=self.category, name="Pizza A", price="100", stock=5)
        self.pb = Product.objects.create(merchant=self.b, category=self.category, name="Pizza B", price="90", stock=5)
        self.oa = Order.objects.create(merchant=self.a, code="OA1", items=["2× Pizza A"], total="200", status="delivered")
        self.ob = Order.objects.create(merchant=self.b, code="OB1", items=["1× Pizza B"], total="90", status="delivered")


class AuthTests(BaseCase):
    def test_login_returns_token_and_memberships(self):
        r = self.client.post("/api/auth/login/", {"email": "A@test.hn", "password": PASSWORD}, format="json")
        self.assertEqual(r.status_code, 200)
        self.assertTrue(r.data["token"])
        self.assertEqual(r.data["memberships"][0]["merchant"]["slug"], "a")
        self.assertFalse(r.data["user"]["is_admin"])

    def test_login_rejects_wrong_password_and_users_without_merchant(self):
        self.assertEqual(self.client.post("/api/auth/login/", {"email": "a@test.hn", "password": "mala"}, format="json").status_code, 400)
        make_user("solo@test.hn")
        self.assertEqual(self.client.post("/api/auth/login/", {"email": "solo@test.hn", "password": PASSWORD}, format="json").status_code, 403)

    def test_suspended_merchant_cannot_login(self):
        self.a.status = "suspended"
        self.a.save()
        self.assertEqual(self.client.post("/api/auth/login/", {"email": "a@test.hn", "password": PASSWORD}, format="json").status_code, 403)

    def test_token_works_and_logout_revokes_it(self):
        token = self.client.post("/api/auth/login/", {"email": "a@test.hn", "password": PASSWORD}, format="json").data["token"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
        self.assertEqual(self.client.get("/api/auth/me/").status_code, 200)
        self.assertEqual(self.client.post("/api/auth/logout/").status_code, 204)
        self.assertEqual(self.client.get("/api/auth/me/").status_code, 401)


class ScopingTests(BaseCase):
    def test_merchant_only_sees_its_own_data(self):
        self.client.force_authenticate(self.user_a)
        codes = [o["code"] for o in self.client.get("/api/orders/").data]
        self.assertEqual(codes, ["OA1"])
        self.assertEqual([p["name"] for p in self.client.get("/api/products/").data], ["Pizza A"])
        self.assertEqual(self.client.get(f"/api/orders/{self.ob.pk}/").status_code, 404)
        self.assertEqual(self.client.patch(f"/api/products/{self.pb.pk}/", {"name": "x"}, format="json").status_code, 404)

    def test_created_product_and_order_belong_to_the_logged_merchant(self):
        self.client.force_authenticate(self.user_a)
        p = self.client.post("/api/products/", {"name": "Nuevo", "category": self.category.pk, "price": "10", "stock": 1}, format="json")
        self.assertEqual(p.status_code, 201)
        self.assertEqual(Product.objects.get(pk=p.data["id"]).merchant, self.a)
        o = self.client.post("/api/orders/", {"items": ["1× Nuevo"], "total": "10", "merchant": self.b.pk}, format="json")
        self.assertEqual(Order.objects.get(code=o.data["code"]).merchant, self.a)  # no puede crear en otro comercio

    def test_admin_can_manage_a_merchant_with_header(self):
        self.client.force_authenticate(self.admin)
        self.assertEqual(len(self.client.get("/api/orders/").data), 2)
        rows = self.client.get("/api/orders/", HTTP_X_MERCHANT_ID=str(self.b.pk)).data
        self.assertEqual([o["code"] for o in rows], ["OB1"])

    def test_schedule_is_independent_per_merchant(self):
        self.client.force_authenticate(self.user_a)
        self.client.patch("/api/schedule/default/", {"paused": True, "pause_reason": "A"}, format="json")
        self.client.force_authenticate(self.user_b)
        self.assertFalse(self.client.get("/api/schedule/").data["paused"])

    def test_settlement_period_can_repeat_across_merchants_and_only_admin_writes(self):
        Settlement.objects.create(merchant=self.a, period="Esta quincena")
        Settlement.objects.create(merchant=self.b, period="Esta quincena")
        self.client.force_authenticate(self.user_a)
        self.assertEqual(len(self.client.get("/api/settlements/").data), 1)
        self.assertEqual(self.client.post("/api/settlements/", {"period": "x"}, format="json").status_code, 403)

    def test_search_and_chat_are_scoped(self):
        self.client.force_authenticate(self.user_a)
        self.assertEqual(self.client.get("/api/search/?q=Pizza").data["products"][0]["name"], "Pizza A")
        self.assertEqual(len(self.client.get("/api/search/?q=Pizza").data["products"]), 1)
        self.client.post("/api/messages/", {"thread_id": "t", "contact": "Ops", "text": "hola"}, format="json")
        self.client.force_authenticate(self.user_b)
        self.assertEqual(self.client.get("/api/messages/?thread_id=t").data, [])


class AnonymousAccessTests(BaseCase):
    def test_catalog_is_public_read_only(self):
        self.assertEqual(len(self.client.get("/api/products/").data), 2)
        self.assertEqual(len(self.client.get(f"/api/products/?merchant={self.a.pk}").data), 1)
        self.assertEqual(self.client.post("/api/products/", {"name": "x"}, format="json").status_code, 401)
        self.assertEqual(self.client.delete(f"/api/products/{self.pa.pk}/").status_code, 401)

    def test_pending_merchants_are_hidden_from_the_public_catalog(self):
        self.b.status = "pending"
        self.b.save()
        self.assertEqual([p["name"] for p in self.client.get("/api/products/").data], ["Pizza A"])

    def test_customer_can_create_order_and_merchant_is_guessed_from_items(self):
        r = self.client.post("/api/orders/", {"items": ["2× Pizza B"], "total": "180", "customer_phone": "9999"}, format="json")
        self.assertEqual(r.status_code, 201)
        self.assertEqual(Order.objects.get(code=r.data["code"]).merchant, self.b)

    def test_courier_view_hides_phone_and_final_orders(self):
        Order.objects.create(merchant=self.a, code="LIVE", items=[], total="1", status="ready", customer_phone="5555")
        rows = self.client.get("/api/orders/").data
        self.assertEqual([o["code"] for o in rows], ["LIVE"])
        self.assertNotIn("customer_phone", rows[0])

    def test_anonymous_can_only_mark_delivered(self):
        live = Order.objects.create(merchant=self.a, code="LIVE2", items=[], total="1", status="ready")
        url = f"/api/orders/{live.pk}/"
        self.assertEqual(self.client.patch(url, {"status": "rejected"}, format="json").status_code, 403)
        self.assertEqual(self.client.patch(url, {"status": "delivered", "total": "0"}, format="json").status_code, 403)
        self.assertEqual(self.client.patch(url, {"status": "delivered"}, format="json").status_code, 200)
        self.assertEqual(self.client.delete(url).status_code, 401)

    def test_portal_endpoints_require_login(self):
        for path in ("/api/orders/summary/", "/api/orders/analytics/", "/api/schedule/", "/api/settlements/", "/api/search/?q=ab", "/api/messages/", "/api/backoffice/merchants/", "/api/backoffice/summary/"):
            self.assertEqual(self.client.get(path).status_code, 401, path)


class BackofficeTests(BaseCase):
    def test_merchant_users_cannot_use_backoffice(self):
        self.client.force_authenticate(self.user_a)
        self.assertEqual(self.client.get("/api/backoffice/merchants/").status_code, 403)
        self.assertEqual(self.client.get("/api/backoffice/summary/").status_code, 403)

    def test_create_merchant_with_owner_generates_temp_password(self):
        self.client.force_authenticate(self.admin)
        r = self.client.post("/api/backoffice/merchants/", {"name": "Tacos Ñam", "category": "Tacos", "commission_rate": "12.5", "owner_email": "Dueno@Tacos.hn", "owner_name": "Ana"}, format="json")
        self.assertEqual(r.status_code, 201, r.data)
        self.assertEqual(r.data["slug"], "tacos-nam")
        self.assertEqual(r.data["status"], "pending")
        self.assertEqual(r.data["owners"], ["dueno@tacos.hn"])
        self.assertTrue(r.data["owner_temp_password"])
        login = self.client.post("/api/auth/login/", {"email": "dueno@tacos.hn", "password": r.data["owner_temp_password"]}, format="json")
        self.assertEqual(login.status_code, 200)

    def test_slug_is_unique_and_commission_is_validated(self):
        self.client.force_authenticate(self.admin)
        slugs = {self.client.post("/api/backoffice/merchants/", {"name": "Igual"}, format="json").data["slug"] for _ in range(2)}
        self.assertEqual(slugs, {"igual", "igual-2"})
        self.assertEqual(self.client.post("/api/backoffice/merchants/", {"name": "X", "commission_rate": "150"}, format="json").status_code, 400)

    def test_approve_and_change_status(self):
        self.client.force_authenticate(self.admin)
        m = Merchant.objects.create(name="Nuevo", slug="nuevo")
        self.assertEqual(self.client.post(f"/api/backoffice/merchants/{m.pk}/set_status/", {"status": "active"}, format="json").data["status"], "active")
        self.assertEqual(self.client.post(f"/api/backoffice/merchants/{m.pk}/set_status/", {"status": "zzz"}, format="json").status_code, 400)

    def test_settle_uses_merchant_commission(self):
        self.client.force_authenticate(self.admin)
        today = timezone.localdate().isoformat()
        r = self.client.post(f"/api/backoffice/merchants/{self.a.pk}/settle/", {"period": "Hoy", "date_from": today, "date_to": today}, format="json")
        self.assertEqual(r.status_code, 201)
        self.assertEqual(Decimal(str(r.data["gross"])), Decimal("200"))
        self.assertEqual(Decimal(str(r.data["commission"])), Decimal("20.00"))
        self.assertEqual(self.client.post(f"/api/backoffice/merchants/{self.a.pk}/settle/", {"period": "Hoy", "date_from": today, "date_to": today}, format="json").status_code, 400)

    def test_user_management(self):
        self.client.force_authenticate(self.admin)
        r = self.client.post("/api/backoffice/users/", {"email": "cajero@test.hn", "merchant": self.a.pk, "role": "staff"}, format="json")
        self.assertEqual(r.status_code, 201)
        self.assertTrue(r.data["temp_password"])
        uid = r.data["id"]
        self.assertFalse(self.client.patch(f"/api/backoffice/users/{uid}/", {"is_active": False}, format="json").data["is_active"])
        self.assertEqual(self.client.patch(f"/api/backoffice/users/{self.admin.pk}/", {"is_active": False}, format="json").status_code, 400)
        self.assertTrue(self.client.post(f"/api/backoffice/users/{uid}/reset_password/").data["temp_password"])
        self.assertEqual(self.client.post("/api/backoffice/users/", {"email": "mal", "merchant": self.a.pk}, format="json").status_code, 400)

    def test_summary_shape(self):
        self.client.force_authenticate(self.admin)
        data = self.client.get("/api/backoffice/summary/?period=7d").data
        self.assertEqual(len(data["daily"]), 7)
        self.assertEqual(Decimal(str(data["sales"])), Decimal("290"))
        self.assertEqual(Decimal(str(data["commission"])), Decimal("38.00"))  # 200*10% + 90*20%
        self.assertEqual(data["top_merchants"][0]["name"], "Comercio A")
        self.assertEqual(data["merchants"]["active"], 2)


class AnalyticsTests(BaseCase):
    def test_portal_summary_and_analytics(self):
        old = Order.objects.create(merchant=self.a, code="OLD", items=["3× Pizza A", "1× Soda"], total="50", status="delivered")
        Order.objects.filter(pk=old.pk).update(entered_at=timezone.now() - timedelta(days=3))
        Order.objects.create(merchant=self.a, code="CAN", items=["9× Pizza A"], total="999", status="cancelled")
        self.client.force_authenticate(self.user_a)
        s = self.client.get("/api/orders/summary/?period=7d").data
        self.assertEqual(len(s["daily_sales"]), 7)
        self.assertEqual(Decimal(str(s["sales"])), Decimal("250"))
        self.assertEqual(s["cancelled"], 1)
        a = self.client.get("/api/orders/analytics/?period=7d").data
        self.assertEqual(len(a["by_hour"]), 24)
        self.assertEqual(a["top_products"][0], {"name": "Pizza A", "quantity": 5})  # 2 + 3; lo cancelado no cuenta
        self.assertTrue(any(row["status"] == "cancelled" for row in a["by_status"]))
