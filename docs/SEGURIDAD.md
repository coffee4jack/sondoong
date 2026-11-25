# Seguridad

## Qué se resolvió en 2.2.0
- Los endpoints del portal exigen sesión y filtran por comercio; un comercio no puede leer ni editar datos de otro (hay pruebas para esto).
- Contraseñas guardadas con hash de Django; tokens revocables al cerrar sesión; límite de 10 intentos de login por minuto.
- `DEBUG`, `ALLOWED_HOSTS` y CORS se configuran por entorno.
- La app del repartidor ya no recibe el teléfono del cliente y sin sesión solo puede marcar un pedido como `delivered`.
- Las contraseñas temporales se muestran una sola vez y no se guardan en claro.

## Riesgos que siguen abiertos
| Riesgo | Detalle | Siguiente paso |
| --- | --- | --- |
| App móvil sin cuentas | `GET /orders/` (activos) y `POST /orders/{id}/location/` son anónimos porque el repartidor no inicia sesión | Cuentas de repartidor con token |
| Pedidos activos visibles | Cualquiera puede ver código, artículos y dirección de los pedidos activos | Asignar pedidos a un repartidor |
| Token en `localStorage` | Un XSS podría leerlo | Cookie `HttpOnly` o tokens de vida corta |
| Sin HTTPS | El token viaja en claro en desarrollo | Proxy con TLS en producción |
| Sin correo | Contraseñas temporales manuales | Invitación por correo |
| Ubicación | Sin consentimiento ni retención definidos | Política y purga de `OrderLocation` |
| iStock | Imagen de pago enlazada en `Services.jsx` | Licencia o reemplazo |

## Producción: lista mínima
```
DJANGO_DEBUG=0
DJANGO_SECRET_KEY=<cadena larga aleatoria>
DJANGO_ALLOWED_HOSTS=midominio.com
CORS_ALLOWED_ORIGINS=https://midominio.com
```
Cambia o elimina las cuentas de `seed_backoffice` y sirve todo por HTTPS.
