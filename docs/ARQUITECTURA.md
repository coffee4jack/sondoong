# Arquitectura

```
App móvil (Expo) ─┐
Landing/Login ────┼──►  API Django REST (/api)  ──►  MySQL
Portal / Backoffice ┘     │
                          └─ permisos por comercio (catalog/permissions.py)
```

## Backend (`backend/`)

| Archivo | Responsabilidad |
| --- | --- |
| `catalog/models.py` | Modelos. `Merchant` y `Membership` son la base del multi-comercio |
| `catalog/permissions.py` | Quién es administrador, usuario de comercio o anónimo; `scope_by_merchant` filtra consultas |
| `catalog/views.py` | API del portal y de la app móvil |
| `catalog/backoffice.py` | API solo para administradores (comercios, usuarios, resumen) |
| `catalog/auth_views.py` | Login, `me` y logout con token |
| `catalog/analytics.py` | Series y agrupaciones para los gráficos (consultas agrupadas) |
| `catalog/serializers.py` | Validación y formato. `CourierOrderSerializer` oculta el teléfono del cliente |
| `catalog/management/commands/` | `seed_products`, `seed_portal`, `seed_backoffice` |
| `core/settings.py` | Configuración; lee `DJANGO_DEBUG`, `DJANGO_ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS` |

### Cómo se decide el comercio de cada petición

1. Usuario de comercio: el de la cabecera `X-Merchant-Id` si le pertenece; si no, el primero de sus membresías.
2. Administrador: el de `X-Merchant-Id` (o `?merchant=`); si no hay, ve todos.
3. Anónimo (app móvil): sin comercio; ve el catálogo público y crea pedidos. Si el pedido no indica comercio, se deduce de los productos pedidos.

## Frontend (`frontend/src/`)

- `lib/session.js` guarda token y comercio activo en `localStorage`; `lib/api.js` los agrega a cada petición y cierra la sesión si el servidor responde 401.
- `lib/AuthContext.jsx` y `lib/useAuth.js`: estado de sesión para toda la app.
- `components/RequireAuth.jsx` protege `/portal` y `/backoffice`.
- `components/charts/index.jsx`: `LineChart`, `BarChart`, `DonutChart` y `HBars` en SVG. No agregan dependencias y cada gráfico tiene `aria-label` con sus datos.
- `components/portal/` y `components/backoffice/`: diseño minimalista (fondo claro, bordes finos, verde de marca solo para acciones).

## Decisiones

- **Token de DRF** (`rest_framework.authtoken`) en vez de JWT: no agrega dependencias y se puede revocar al cerrar sesión.
- **Gráficos propios en SVG** en vez de una librería: el `package-lock.json` no cambia y el bundle no crece.
- **Cambios aditivos**: `merchant` es opcional (`null`) para no romper datos ni la app móvil existentes.
