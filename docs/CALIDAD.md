# Control de calidad

## Resultado de la revisión de `version_2.1.1`

| # | Hallazgo | Estado |
| --- | --- | --- |
| 1 | Sistema de un solo comercio | Corregido: multi-comercio |
| 2 | API sin autenticación ni permisos | Corregido para portal y backoffice; la app móvil sigue anónima con alcance reducido |
| 3 | `DEBUG = True`, hosts `*` y CORS fijos | Corregido: se leen del entorno |
| 4 | `/orders/summary/` hacía una consulta por día | Corregido: una consulta agrupada |
| 5 | Pocas pruebas (9 backend, 2 frontend) | 33 backend y 5 frontend |
| 6 | README desactualizado | Actualizado y ampliado con `docs/` |
| 7 | `Settlement.period` único global | Corregido: único por comercio |
| 8 | Imagen de iStock enlazada | **Pendiente** (decisión tuya: se conserva la de la 2.1.2) |
| 9 | `latest_location` hace una consulta por pedido en el listado | Pendiente (optimización) |
| 10 | Búsqueda por `items__icontains` sobre JSON | Pendiente (puede ser lenta con muchos pedidos) |
| 11 | La app móvil no tiene pruebas | Pendiente |

## Cómo comprobar
```bash
cd backend  && python manage.py test --settings=core.test_settings   # 33 pruebas
cd frontend && npm run qa                                           # lint + pruebas + build
```
En la revisión de esta entrega: backend 33/33, frontend 5/5, ESLint sin avisos y `vite build` correcto. La app móvil y la interfaz no se probaron en navegador ni en un teléfono.

## Qué cubren las pruebas nuevas
Login, token y logout · cuenta sin comercio y comercio suspendido · aislamiento entre comercios (pedidos, productos, mensajes, búsqueda, horarios) · comercio asignado al crear · permisos sin sesión · repartidor solo puede marcar entregado · alta de comercio con dueño y contraseña temporal · slug único · comisión validada · liquidación con comisión · gestión de usuarios · resumen del backoffice · analítica del portal.
