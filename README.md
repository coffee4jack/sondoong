# Bolt · Landing y Portal del comercio (versión Vue)

Landing page de movilidad y entregas, más el portal del comercio. Proyecto de práctica de frontend, no es un sitio oficial.

Esta es la **migración a Vue 3** del proyecto original en React. Hecho con Vite, Vue 3 (Composition API con `<script setup>`), Tailwind CSS v4, Motion for Vue (`motion-v`) y vue-router 4. Colores y tipografía (PT Sans) tomados de la app móvil.

## Requisitos

Node.js 20.19 o superior.

## Correrlo

```bash
npm install
npm run dev
```

Abre la URL que muestre la terminal (normalmente http://localhost:5173).

| Comando                | Qué hace                                                   |
| ---------------------- | ---------------------------------------------------------- |
| `npm run dev`          | Servidor de desarrollo                                     |
| `npm run build`        | Build de producción en `dist/`                             |
| `npm run preview`      | Sirve la build para revisarla                              |
| `npm run lint`         | Control de calidad con ESLint (análisis estático)          |
| `npm run lint:fix`     | Corrección automática de problemas de ESLint               |
| `npm run format`       | Formatea el código con Prettier                            |
| `npm run format:check` | Comprueba el formato de código sin modificarlo             |
| `npm run qa`           | Pipeline completo de control de calidad (`lint` + `build`) |

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
├── main.js, App.vue, index.css
├── router/index.js        Rutas (el portal se carga de forma diferida)
├── pages/                 Landing.vue, NotFound.vue y pages/portal/*.vue
├── components/
│   ├── buttons/           Button.vue
│   ├── landing/           Navbar, Hero, Services, ... (+ Svg.vue, navIcons.js)
│   └── portal/            PortalLayout, Chat, OrderCard, Card, Chip, Toggle, ...
├── composables/useNow.js  Hora actual reactiva (antes hooks/useNow.js)
├── data/portal.js         Datos de ejemplo del portal
└── lib/beep.js
```

## Equivalencias React → Vue

| React                                  | Vue                                                                     |
| -------------------------------------- | ----------------------------------------------------------------------- |
| `useState`                             | `ref()`                                                                 |
| Valores derivados (cálculos en render) | `computed()`                                                            |
| `useEffect`                            | `onMounted` / `onUnmounted` / `watch`                                   |
| `useCallback`, `useMemo`               | No hacen falta (`computed` cachea)                                      |
| `className`, `onClick`                 | `class`, `@click`                                                       |
| `{cond && <X />}`, `.map()`            | `v-if`, `v-for`                                                         |
| `children` / props con JSX             | `<slot>` / slots con nombre (`#action`)                                 |
| `onChange` de un hijo                  | `emit("change")` y `@change` en el padre                                |
| `react-router-dom` (`Link`, `NavLink`) | `vue-router` (`RouterLink`, `RouterLink custom` + `isActive`)           |
| `lazy()` + `Suspense`                  | `() => import(...)` en las rutas                                        |
| `<ScrollToTop />`                      | `scrollBehavior` del router                                             |
| `framer-motion`                        | `motion-v` (`viewport` → `in-view-options`, `whileTap` → `while-press`) |
| `ui.jsx` (varios componentes)          | Un `.vue` por componente + `ui.js` con `inputCls`                       |
| `hooks/useNow.js`                      | `composables/useNow.js`                                                 |

## Tipografía

La fuente es **PT Sans** (400 y 700), instalada con el paquete `@fontsource/pt-sans` e importada en `src/main.js`. Así se sirve junto con la app (funciona sin internet y sin depender de Google Fonts). Se aplica globalmente con la variable `--font-sans` de Tailwind, definida en `src/index.css`.

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

`vercel.json` incluye el rewrite que necesita vue-router (modo `history`). Los datos del portal son de ejemplo y no se guardan al recargar.
