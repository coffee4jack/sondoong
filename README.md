# Bolt · Landing, Portal del comercio y App móvil

Proyecto de práctica de un servicio de comida a domicilio inspirado en Bolt (no es un producto oficial). Tiene cuatro piezas que comparten una sola API:

| Pieza | Carpeta | Tecnología | Qué hace |
| --- | --- | --- | --- |
| Landing + Portal del comercio | `frontend/` | React 19, Vite 7, Tailwind CSS v4, React Router 7, Motion | Sitio público y panel para pedidos, catálogo, horarios, historial, reportes, liquidaciones y mensajes |
| API | `backend/` | Django 5.1, Django REST Framework, django-cors-headers | Catálogo, pedidos, GPS, horarios, liquidaciones, mensajes y búsqueda |
| Base de datos | servicio `db` | MySQL 8.0 | Persistencia (volumen `mysql_data`) |
| App móvil | `mobile/` | Expo SDK 58, React Native 0.88, React 19 | Modo **Cliente** (pedir y rastrear) y modo **Repartidor** (compartir GPS) |

Documentación de diseño y requerimientos: carpeta `Documentación/` (`Requerimientos.docx` y capturas de diseño de la app, landing y portal).

```
.
├── Docker-compose.yml     Servicios: db, backend, frontend, mobile (perfil), frontend-init (perfil)
├── .env.example           Variables de entorno (copiar a .env)
├── update.py              Menú de tareas Docker (reconstruir, levantar, build, APK)
├── backend/               API Django (app `catalog`, proyecto `core`)
├── frontend/              Landing y portal (Vite + React)
├── mobile/                App Expo / React Native
└── Documentación/         Requerimientos y diseños
```

## Inicio rápido (Docker)

Requisitos: Docker Desktop (o Docker Engine) con Compose. No necesitas Python ni Node instalados.

```bash
cp .env.example .env            # ajusta contraseñas y DJANGO_SECRET_KEY
docker compose up --pull always --build -d
```

El contenedor del backend ejecuta `migrate` automáticamente al arrancar. Compose espera a que MySQL esté saludable antes de iniciar Django. Para cargar datos de ejemplo:

```bash
docker compose exec backend python manage.py seed_products   # categorías y productos
docker compose exec backend python manage.py seed_portal     # pedidos, horarios, liquidaciones
docker compose exec backend python manage.py createsuperuser # opcional, para /admin/
```

| Servicio | URL / conexión |
| --- | --- |
| Frontend (landing y portal) | http://localhost:5173 |
| API Django | http://localhost:8000/api/ |
| Admin de Django | http://localhost:8000/admin/ |
| MySQL | `127.0.0.1:3306` (DBeaver / MySQL Workbench), usuario y contraseña del `.env` |

Comandos útiles:

```bash
docker compose ps                                  # estado
docker compose logs -f backend frontend db         # logs
docker compose down                                # detener (conserva datos)
docker compose down -v                             # detener y BORRAR la base de datos
```

`python update.py` abre un menú que envuelve estos comandos (reconstruir todo, levantar web, levantar móvil, build del frontend, APK Android).

### Variables de entorno (`.env` en la raíz)

| Variable | Uso | Ejemplo |
| --- | --- | --- |
| `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_ROOT_PASSWORD` | Credenciales de MySQL | ver `.env.example` |
| `DB_HOST`, `DB_PORT` | Dónde está MySQL para Django | `db`, `3306` |
| `DJANGO_SECRET_KEY` | Clave secreta de Django | cadena larga aleatoria |
| `EXPO_PUBLIC_API_URL` | URL de la API vista desde el teléfono | `http://192.168.1.20:8000/api` |
| `MOBILE_DEV_HOST` | IP que Expo anuncia para el QR | IP LAN del equipo |
| `VITE_API_URL` | URL de la API para el frontend (en Compose ya apunta a `http://localhost:8000/api`) | |

## Base de datos y modelos

Los modelos viven en `backend/catalog/models.py`; las migraciones en `backend/catalog/migrations/`.

| Modelo | Campos principales |
| --- | --- |
| `Category` | `name` (único) |
| `Product` | `category` (FK, PROTECT), `name`, `price`, `stock`, `available`, `options` (JSON), `image` (URL). Si `stock = 0`, `available` se fuerza a `false` |
| `Order` | `code` (único), `items` (JSON), `total`, `status` (`new`, `preparing`, `ready`, `delivered`, `rejected`, `cancelled`), `priority`, `target_minutes`, `branch`, `rejection_reason`, datos del cliente, `tracking_token` (UUID privado), `entered_at`, `updated_at` |
| `OrderLocation` | `order` (FK, CASCADE), `latitude` y `longitude` (DECIMAL 9,6), `accuracy_m`, `recorded_at`. Una fila por punto GPS |
| `StoreSchedule` | Una fila `key="default"`: pausa (`paused`, `pause_reason`, `pause_duration`, `paused_until`) y `weekly_hours` (JSON) |
| `ScheduleException` | `date`, `start_time`, `end_time`, `reason` |
| `Settlement` | `period`, `status`, `gross`, `commission`, `adjustments` |
| `ChatMessage` | `thread_id`, `contact`, `sender` (`merchant`, `operations`, `courier`), `text` |

Los modelos están registrados en el admin de Django (`/admin/`); `Order` muestra sus puntos GPS en línea.

## API REST (`/api/`)

| Ruta | Métodos | Notas |
| --- | --- | --- |
| `/categories/` | CRUD | |
| `/products/` | CRUD | |
| `/messages/` | GET, POST | `?thread_id=` filtra por conversación |
| `/orders/` | CRUD | Filtros: `search`, `status`, `branch`, `from`, `to`, `min`. Cada pedido incluye `latest_location` y `db_id` |
| `/orders/summary/?period=today\|7d\|30d` | GET | Ventas, cancelados, ticket promedio y ventas diarias |
| `/orders/{id}/location/` | POST | El repartidor publica un punto GPS (`latitude`, `longitude`, `accuracy_m`) |
| `/tracking/{token}/` | GET | Vista pública del cliente: estado, artículos y última ubicación. Token inválido → 404 |
| `/tracking/{token}/location/` | POST | Igual que el anterior, usando el token del pedido |
| `/schedule/`, `/schedule/default/` | GET, PATCH, PUT | Pausa y horarios |
| `/schedule-exceptions/` | CRUD | Excepciones de horario |
| `/settlements/` | CRUD | Liquidaciones |
| `/search/?q=` | GET | Busca productos y pedidos (mínimo 2 caracteres) |

Errores de validación se devuelven por campo, por ejemplo `{"latitude": ["Latitud debe estar entre -90 y 90."]}`.

## Frontend (landing y portal)

Rutas (`frontend/src/router/index.jsx`, carga diferida por página):

| Ruta | Contenido |
| --- | --- |
| `/` | Landing (Navbar, Hero, Servicios, Conductores, Sobre nosotros, Negocio, Bolt Send, Apps, Noticias, Footer) |
| `/portal/pedidos` | Pedidos con alertas, impresión, chat, simulación de pedido y botón de GPS del repartidor con mapa |
| `/portal/catalogo` | Catálogo y existencias |
| `/portal/horarios` | Pausas, horarios y excepciones |
| `/portal/historial` | Historial con filtros |
| `/portal/reportes` | Reportes (hoy, 7 y 30 días) |
| `/portal/liquidaciones` | Liquidaciones |
| `/portal/mensajes` | Mensajes por pedido |
| `/admin` | Configuración del portal |

Estructura de `frontend/src/`: `components/` (`landing`, `portal`, `buttons`), `pages/`, `router/`, `lib/api.js` (cliente `fetch` compartido: acepta `body` como objeto, string o `FormData`), `lib/portalSettings.js`, `hooks/useNow.js`, `data/portal.js`.

Colores y tipografía: se definen en el bloque `@theme` de `frontend/src/index.css` (`--color-ink`, `--color-brand` `#3bb77e`, etc.). La fuente es PT Sans (400 y 700) vía `@fontsource/pt-sans`.

Scripts (`cd frontend`): `npm run dev`, `npm run build`, `npm run lint`, `npm test` (Vitest), `npm run qa` (lint + test + build). También dentro de Docker: `docker compose exec frontend npm run qa`.

Despliegue: `vercel.json` trae el rewrite que necesita React Router. Configura `VITE_API_URL` apuntando a tu API.

## App móvil (`mobile/`)

App Expo SDK 58 / React Native 0.88 (JavaScript). Al abrirla se elige el modo, que se recuerda en el dispositivo (`AsyncStorage`).

- **Cliente**: Inicio (cabecera, dirección, búsqueda, categorías, banner y cuadrícula de productos), Favoritos, Pedidos, carrito, detalle de producto y seguimiento. Las pestañas inferiores también se cambian deslizando. No pide ubicación al cliente.
- **Repartidor**: lista de pedidos `preparing` y `ready`, inicio y detención del GPS y botón “Marcar como entregado”.

Archivos clave: `App.js` (estado y navegación por pantalla), `src/api.js` (cliente `fetch`), `src/locationTask.js` (tarea GPS en segundo plano), `src/styles.js` (colores y estilos; `ink` es `#0a0a0a`), `src/components/*` (pantallas y piezas), `src/TrackingMap.js` (mapa con `react-native-maps`).

Los insets del sistema se pintan aparte en `App.js`: la franja superior (reloj y batería) usa el mismo color oscuro `#0a0a0a` del header y la inferior toma el de la barra de pestañas.

### Ejecutar en desarrollo

Con Docker (perfil `mobile`):

```bash
# En .env: EXPO_PUBLIC_API_URL=http://<IP-LAN>:8000/api y MOBILE_DEV_HOST=<IP-LAN>
docker compose --profile mobile up -d mobile
docker compose logs -f mobile     # QR y URL de Expo
```

Sin Docker: `cd mobile && npm install && npx expo start`. En el emulador de Android la API suele ser `http://10.0.2.2:8000/api`; en un teléfono físico usa la IP LAN del equipo. Para reinstalar dependencias tras cambiar `package.json`: `docker compose run --rm --no-deps mobile npm install --no-audit --no-fund`.

### GPS: cómo funciona

1. El repartidor abre el modo Repartidor, elige un pedido y pulsa **Iniciar seguimiento GPS**. La app pide permiso de ubicación en primer plano y en segundo plano.
2. `locationTask.js` publica un punto cada 5 segundos o 5 metros a `POST /api/orders/{id}/location/` (con servicio en primer plano y notificación en Android).
3. Django valida rango (latitud −90..90, longitud −180..180), redondea a 6 decimales y guarda un `OrderLocation`.
4. El cliente consulta `GET /api/tracking/{token}/` cada 12 segundos y muestra el mapa; el portal muestra la misma última posición (mapa de OpenStreetMap incrustado).
5. Al marcar el pedido como entregado o detener el seguimiento, la tarea se detiene. Un pedido `delivered`, `rejected` o `cancelled` rechaza nuevos puntos con HTTP 409.

El GPS en segundo plano **no funciona en Expo Go**; requiere un build propio. Para generar un APK de prueba (necesitas una cuenta Expo):

```bash
docker compose --profile mobile run --rm mobile npx eas-cli login
docker compose --profile mobile run --rm mobile npx eas-cli init
docker compose --profile mobile run --rm mobile npx eas-cli build --platform android --profile preview
```

Para mapas de Google en un build de producción de Android hay que añadir una clave de Google Maps en `app.json`.

## Pruebas y control de calidad

```bash
# Backend (SQLite en memoria, no necesita MySQL)
cd backend && python manage.py test --settings=core.test_settings
# Frontend
cd frontend && npm run qa
# Móvil: verificar que compila
cd mobile && npx expo export --platform android
```

El backend incluye pruebas del catálogo, pedidos, horarios, reportes y GPS (precisión, rangos inválidos, pedido terminado, token inválido y flujo repartidor → cliente → portal).

## Limitaciones conocidas (antes de producción)

- **No hay autenticación.** Cualquiera con acceso a la API puede leer y escribir pedidos y puntos GPS. Falta login para repartidores y comercio, HTTPS, consentimiento de ubicación y política de retención de coordenadas.
- `DEBUG = True`, `ALLOWED_HOSTS = ["*"]` y `CORS_ALLOWED_ORIGINS` solo con `http://localhost:5173` en `backend/core/settings.py`: ajustar para producción.
- La tabla `OrderLocation` crece sin límite; conviene archivar o purgar puntos antiguos.
- Las imágenes de ejemplo de la landing son de Pexels y Unsplash; reemplázalas antes de publicar.
- Los servidores Linux distinguen mayúsculas: el nombre de cada archivo debe coincidir con su `import`.

## Versiones

Cada rama `version_X.Y.Z` es una entrega. `version_2.1.1` integra la API de pedidos y GPS (`version_2.1.0`) con la app móvil completa, el cliente `fetch` unificado y las correcciones de interfaz móvil.
