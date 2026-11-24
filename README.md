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

## Despliegue

`vercel.json` incluye el rewrite que necesita React Router (modo `history`). Los datos del portal son de ejemplo y no se guardan al recargar.
