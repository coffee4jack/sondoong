# Correr en docker.
```bash
docker compose up --pull always --build
```
# La aplicación visual está en 
```bash
http://localhost:5173
```
# Django en 
```bash
http://localhost:8000
```
# MySQL se puede conectar (user sondoong - password - sondoong) desde el host en 
```bash
127.0.0.1:3306
```
<<<<<<< Updated upstream
=======
# Mobile (Expo Go SDK 58)
La app móvil usa Expo SDK 58, React Native 0.88 y Node 22 dentro de Docker. Al abrirla, elige **Cliente** o **Repartidor** (el rol se recuerda en el dispositivo).

- **Cliente:** consulta sus propios pedidos mediante tokens de seguimiento y pulsa “Rastrear pedido por GPS” para ver el mapa y estado. No se solicita GPS al cliente.
- **Repartidor:** consulta pedidos activos, selecciona uno y pulsa “Iniciar seguimiento GPS”. La app pide permisos de ubicación en primer plano y segundo plano, publica coordenadas cada ~10 segundos al API y permite detener el tracking o marcar el pedido entregado.
- **Portal:** el mapa del detalle del pedido muestra la misma última ubicación guardada.

El permiso de ubicación solo se solicita al repartidor. El tracking background requiere instalar un build propio; Expo Go no incluye todas las configuraciones nativas necesarias. Genera un APK siguiendo la sección “Build de Android en APK”. La app usa safe-area insets arriba y abajo para que header/carrito no choquen con reloj y batería y la navegación inferior quede sobre el indicador de inicio.

El bundler de desarrollo debe iniciarse con:

```bash
docker compose --profile mobile stop mobile
docker compose --profile mobile run --rm --service-ports mobile npx expo start --host lan --port 8081
```

Configura `MOBILE_DEV_HOST` y `EXPO_PUBLIC_API_URL` en `.env` con la IP LAN del equipo para escanear el QR desde Expo Go. Android Emulator normalmente usa `10.0.2.2` como host de API. El cliente HTTP usa `fetch` nativo en web y móvil; los errores JSON del API se muestran como texto plano, nunca se renderiza HTML como componentes nativos.

Para refrescar dependencias móviles en Docker después de cambios de `package.json` o de errores de Metro/cache:

```bash
docker compose --profile mobile stop mobile
docker compose run --rm --no-deps mobile npm install --no-audit --no-fund
docker compose --profile mobile up -d --force-recreate mobile
docker compose logs -f mobile
```

En Expo Go, la ubicación background de Android no está disponible; genera e instala el APK de desarrollo para probar el modo repartidor en segundo plano. QA móvil validado con `npx expo install --check`, `npx expo-doctor` (20/20 comprobaciones) y `npx expo export --platform android` dentro del contenedor.


>>>>>>> Stashed changes
# Bolt · Landing y Portal del comercio (versión React)

Landing page de movilidad y entregas, más el portal del comercio. Proyecto de práctica de frontend, no es un sitio oficial.

Esta es la **migración a React 19** de la versión en Vue 3. Hecho con Vite, React, Tailwind CSS v4, Motion (`motion/react`) y React Router 7. Colores y tipografía (PT Sans) tomados de la app móvil. El diseño, los textos, las rutas y el comportamiento son los mismos que en la versión Vue.

## Requisitos

- Docker Desktop (o Docker Engine) con Docker Compose.
- No necesitas instalar Python ni Node.js en el equipo.
- Un archivo `.env` en la raíz del repositorio. Si no existe, copia `.env.example` como `.env` y ajusta las contraseñas y `DJANGO_SECRET_KEY`.

## Arranque con Docker Compose

Desde la raíz del repositorio, construye las imágenes y arranca los servicios:

```bash
docker compose up --pull always --build -d
```

La primera construcción puede tardar unos minutos. Compose espera a que MySQL esté saludable antes de iniciar Django. Para aplicar las migraciones de Django:

```bash
docker compose exec backend python manage.py migrate
```

### Dónde ver la aplicación

| Servicio | URL / conexión | Puerto del host |
| --- | --- | --- |
| Frontend React + Vite | [http://localhost:5173](http://localhost:5173) | `5173` |
| Backend Django | [http://localhost:8000](http://localhost:8000) | `8000` |
| MySQL | Host `127.0.0.1`, puerto `3306` (DBeaver / MySQL Workbench) | `3306` |

El frontend es el resultado visual de la aplicación. El backend estará disponible en `http://localhost:8000`; crea rutas API en Django según las necesidades del frontend.

### Comandos habituales

Ver estado de los servicios:

```bash
docker compose ps
```

Ver logs en tiempo real:

```bash
docker compose logs -f backend frontend db
```

Detener los servicios sin eliminar los datos de MySQL:

```bash
docker compose down
```

Los cambios en `./backend` y `./frontend` se reflejan mediante bind mounts y hot reload. Si cambias dependencias en `backend/requirements.txt` o `frontend/package.json`, vuelve a construir y arrancar:

```bash
docker compose up --pull always --build -d
```

Los datos de MySQL se conservan en el volumen nombrado `mysql_data`. No ejecutes `docker compose down -v` salvo que quieras borrar esos datos.

### Comandos del frontend

Los scripts npm también se pueden ejecutar dentro del contenedor, sin instalar Node localmente:

```bash
docker compose exec frontend npm run lint
docker compose exec frontend npm run build
docker compose exec frontend npm run qa
```

## Rutas

| Ruta                    | Contenido                                   |
| ----------------------- | ------------------------------------------- |
| `/`                     | Landing                                     |
| `/portal/pedidos`       | Panel de pedidos, alertas, impresión y chat |
| `/portal/catalogo`      | Catálogo y existencias                      |
| `/portal/horarios`      | Pausas y horarios                           |
| `/portal/historial`     | Historial con filtros                       |
| `/portal/reportes`      | Reportes                                    |
| `/portal/liquidaciones` | Liquidaciones (solo lectura)                |
| `/portal/mensajes`      | Comunicación por pedido                     |

## Estructura

```
src/
├── main.jsx, App.jsx, index.css
├── router/index.jsx       Rutas (el portal se carga de forma diferida)
├── pages/                 Landing.jsx, NotFound.jsx y pages/portal/*.jsx
├── components/
│   ├── buttons/           Button.jsx
│   ├── landing/           Navbar, Hero, Services, ... (+ Svg.jsx, navIcons.js)
│   └── portal/            PortalLayout, Chat, OrderCard, Card, Chip, Toggle, ...
├── hooks/useNow.js        Hora actual que se refresca sola
├── data/portal.js         Datos de ejemplo del portal
└── lib/                   beep.js (sonido y formato de dinero) y cn.js (unir clases)
```

## Equivalencias Vue → React

| Vue                                              | React                                                                       |
| ------------------------------------------------ | --------------------------------------------------------------------------- |
| `ref()`                                          | `useState()`                                                                |
| `computed()`                                     | Valores calculados en el render                                             |
| `onMounted` / `onUnmounted` / `watch`            | `useEffect`                                                                 |
| `class`, `@click`, `v-model`                     | `className`, `onClick`, `value` + `onChange`                                |
| `v-if`, `v-for`                                  | `cond && <X />`, `.map()`                                                   |
| `<slot>` / slots con nombre (`#action`)          | `children` / prop `action`                                                  |
| `emit("change")` y `@change` en el padre         | Prop callback (`onChange`, `onTab`, `onAccept`...)                          |
| `vue-router` (`RouterLink`, `RouterLink custom`) | `react-router-dom` (`Link`, `NavLink` con `className` en función)           |
| `<RouterView />`                                 | `<Outlet />`                                                                |
| `() => import(...)` en las rutas                 | `lazy` de React Router                                                      |
| `scrollBehavior` del router                      | `<ScrollRestoration />` en `App.jsx`                                        |
| `motion-v`                                       | `motion/react` (`in-view-options` → `viewport`, `while-press` → `whileTap`) |
| `composables/useNow.js`                          | `hooks/useNow.js`                                                           |
| `<component :is="as">`                           | `const Tag = as` (componente `Card`)                                        |

## Tipografía

La fuente es **PT Sans** (400 y 700), instalada con el paquete `@fontsource/pt-sans` e importada en `src/main.jsx`. Así se sirve junto con la app (funciona sin internet y sin depender de Google Fonts). Se aplica globalmente con la variable `--font-sans` de Tailwind, definida en `src/index.css`.

> PT Sans solo existe en pesos 400 y 700. Las clases `font-medium` (500) se muestran con el peso 400.

### Configuración centralizada de colores

Todos los colores de la aplicación se administran desde un único archivo: [`src/index.css`](src/index.css) dentro del bloque `@theme`:

- `--color-ink`: `#010f1c` (Azul oscuro / texto principal)
- `--color-brand`: `#3bb77e` (Verde Bolt / color de acento)
- `--color-mute`: `#999999` (Gris neutro)
- `--color-sand`: `#ffffff` (Blanco)
- `--color-bg-app`: `#ffffff` (Fondo principal de la app)
- `--color-surface`: `#ffffff` (Superficies y tarjetas)

<<<<<<< Updated upstream
=======
## Build móvil

Para generar un APK de prueba con GPS en segundo plano, inicia sesión/configura EAS una vez y compila el perfil Android `preview`:

```bash
docker compose --profile mobile run --rm mobile npx eas-cli login
docker compose --profile mobile run --rm mobile npx eas-cli init
docker compose --profile mobile run --rm mobile npx eas-cli build --platform android --profile preview
```

Expo EAS devuelve un enlace para descargar e instalar el APK. La primera compilación puede tardar varios minutos.

## GPS de clientes y repartidores

Las coordenadas se normalizan en el cliente a seis decimales y Django valida rangos geográficos antes de escribir en MySQL; errores de GPS se devuelven con detalle por campo.

- El cliente rastrea su pedido mediante token privado; no recibe permiso de ubicación.
- El repartidor elige un pedido activo y usa “Iniciar seguimiento GPS”. La app solicita ubicación foreground/background y publica puntos cada 5 segundos o 5 metros al endpoint compartido.
- El portal y el cliente consultan la última coordenada guardada en `OrderLocation`; marcar entrega detiene el tracking.
- El endpoint POST GPS está abierto para desarrollo: **antes de producción hay que añadir autenticación/autorización por repartidor**, HTTPS, consentimiento y política de retención de coordenadas.

>>>>>>> Stashed changes
## Despliegue

`vercel.json` incluye el rewrite que necesita React Router (modo `history`). Los datos del portal son de ejemplo y no se guardan al recargar.
