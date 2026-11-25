# API

Base: `http://localhost:8000/api/`. JSON. Errores de validación por campo: `{"campo": ["mensaje"]}`.

## Autenticación

```http
POST /auth/login/        {"email": "...", "password": "..."}
→ 200 {"token": "...", "user": {...}, "memberships": [{"role": "owner", "merchant": {...}}]}
GET  /auth/me/           Authorization: Token <token>
POST /auth/logout/       Authorization: Token <token>   → 204 (revoca el token)
```

Errores: 400 credenciales incorrectas · 403 cuenta sin comercio activo · 429 demasiados intentos (10/min).

Envía `Authorization: Token <token>` en el resto. Un administrador puede actuar como un comercio con `X-Merchant-Id: <id>`.

## Quién puede qué

| Recurso | Sin sesión | Comercio | Administrador |
| --- | --- | --- | --- |
| `GET /products/`, `/categories/` | Sí (comercios activos) | Solo el suyo | Todo (filtra con `X-Merchant-Id`) |
| Escribir productos y categorías | No | Sí, en su comercio | Sí |
| `POST /orders/` | Sí | Sí (queda en su comercio) | Sí |
| `GET /orders/` | Solo pedidos activos, sin teléfono | Los suyos | Todos |
| `PATCH /orders/{id}/` | Solo `{"status": "delivered"}` | Sí | Sí |
| `DELETE`, `PUT /orders/{id}/` | No | Sí | Sí |
| `POST /orders/{id}/location/`, `/tracking/{token}/…` | Sí | Sí | Sí |
| `/orders/summary/`, `/orders/analytics/`, `/search/`, `/messages/`, `/schedule/`, `/schedule-exceptions/` | No | Sí, de su comercio | Sí |
| `GET /settlements/` | No | Las suyas | Todas |
| Crear o editar liquidaciones | No | No | Sí |
| `/backoffice/*` | No | No | Sí |

## Reportes del portal

`GET /orders/summary/?period=today|7d|30d` → `{orders, sales, cancelled, average_ticket, daily_sales:[{date, orders, sales}]}`

`GET /orders/analytics/?period=7d` → `{by_hour:[{hour, orders}], by_status:[{status, count}], top_products:[{name, quantity}]}`. Los productos se leen de textos como `2× Pizza personal`.

## Backoffice

| Ruta | Descripción |
| --- | --- |
| `GET /backoffice/merchants/?status=` | Lista con `orders_today`, `sales_today` y `owners` |
| `POST /backoffice/merchants/` | Crea el comercio (estado `pending`). Con `owner_email` crea el acceso del dueño y devuelve `owner_temp_password` **una sola vez** |
| `PATCH /backoffice/merchants/{id}/` | Edita datos, comisión y estado |
| `POST /backoffice/merchants/{id}/set_status/` | `{"status": "active"\|"pending"\|"paused"\|"suspended"}` |
| `POST /backoffice/merchants/{id}/settle/` | `{"period", "date_from", "date_to"}` suma pedidos entregados y aplica la comisión del comercio |
| `GET/POST /backoffice/users/` | Lista y alta de usuarios (`email`, `name`, `merchant`, `role`) |
| `PATCH /backoffice/users/{id}/` | `{"is_active": false}` (no puedes desactivar tu propia cuenta) |
| `POST /backoffice/users/{id}/reset_password/` | Devuelve una contraseña temporal |
| `GET /backoffice/summary/?period=7d\|14d\|30d` | `{merchants, orders, sales, average_ticket, commission, daily, by_status, top_merchants}` |
