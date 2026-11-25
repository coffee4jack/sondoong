# Cambios

## 2.2.0 (propuesta)

Parte de `version_2.1.1`. Todo es aditivo: no se elimina ninguna ruta ni modelo; la app móvil sigue funcionando.

### Agregado
- **Multi-comercio**: modelos `Merchant` y `Membership`; `merchant` en productos, pedidos, horarios, excepciones, liquidaciones y mensajes. Migración `0005` y migración de datos `0006` (los datos existentes pasan a un comercio inicial).
- **Login** por correo y contraseña con token (`/api/auth/*`) y página `/login`.
- **Backoffice** (`/backoffice`): resumen con gráficos, comercios (alta, edición, aprobación, pausa, comisión, liquidaciones) y usuarios (alta, roles, desactivar, restablecer contraseña). API en `/api/backoffice/*`.
- **Gráficos** (SVG propio, sin dependencias): ventas, tendencia, pedidos por hora, estados, productos y comercios top.
- Portal con **resumen del día** y reportes ampliados (`/api/orders/analytics/`).
- Landing: botones **Iniciar sesión** y **Portal del comercio** en la barra, footer completo y las **imágenes de la 2.1.2**.
- Comando `seed_backoffice` y documentación en `docs/`.
- Pruebas: 24 nuevas en el backend y 3 en el frontend.

### Cambiado
- **Portal minimalista**: barra lateral y cabecera claras, tarjetas sin sombra. El color de la barra sigue siendo configurable y el texto se adapta.
- Los endpoints del portal (`/orders/`, `/schedule/`, `/settlements/`, `/search/`, `/messages/`, escritura de `/products/` y `/categories/`) ahora **exigen sesión** y filtran por comercio. Sin sesión siguen disponibles solo lo que usa la app móvil (ver `docs/SEGURIDAD.md`).
- `Settlement.period` pasó de único global a único por comercio.
- `DEBUG`, `ALLOWED_HOSTS` y `CORS_ALLOWED_ORIGINS` se leen del entorno.
- `/orders/summary/` usa una sola consulta agrupada (antes una por día).
- `seed_products` y `seed_portal` asignan los datos al comercio inicial.
- La app móvil envía `merchant` al crear un pedido.

### Pendiente
- Cuentas para la app móvil (cliente y repartidor), correos de invitación, sección "Equipo" del portal, reseñas, cupones y notificaciones.
