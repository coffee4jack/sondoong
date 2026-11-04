# Bolt · Landing y Portal del comercio

Landing page de movilidad y entregas, más el portal del comercio. Proyecto de práctica de frontend, no es un sitio oficial.

Hecho con Vite, React 19, Tailwind CSS v4, Framer Motion y react-router-dom. Colores y tipografía (PT Sans) tomados de la app móvil.

## Requisitos

Node.js 20.19 o superior.

## Correrlo

```bash
npm install
npm run dev
```

Abre la URL que muestre la terminal (normalmente http://localhost:5173).

| Comando                  | Qué hace                                                   |
| ------------------------ | ---------------------------------------------------------- |
| `npm run dev`            | Servidor de desarrollo                                     |
| `npm run build`          | Build de producción en `dist/`                             |
| `npm run preview`        | Sirve la build para revisarla                              |
| `npm run lint`           | Control de calidad con ESLint (análisis estático)          |
| `npm run lint:fix`       | Corrección automática de problemas de ESLint               |
| `npm run format`         | Formatea el código con Prettier                            |
| `npm run format:check`   | Comprueba el formato de código sin modificarlo             |
| `npm run qa`             | Pipeline completo de control de calidad (`lint` + `build`) |

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
├── pages/            Landing.jsx y pages/portal/*
├── components/
│   ├── buttons/      Button.jsx
│   ├── landing/      Navbar, Hero, Services, ...
│   └── portal/       PortalLayout, ui, Chat
├── data/portal.js    Datos de ejemplo del portal
├── hooks/, lib/
```

### Configuración centralizada de colores

Todos los colores de la aplicación se administran desde un único archivo: [`src/index.css`](src/index.css) dentro del bloque `@theme`:

- `--color-ink`: `#010f1c` (Azul oscuro / texto principal)
- `--color-brand`: `#3bb77e` (Verde Bolt / color de acento)
- `--color-mute`: `#999999` (Gris neutro)
- `--color-sand`: `#ffffff` (Blanco)
- `--color-bg-app`: `#ffffff` (Fondo principal de la app)
- `--color-surface`: `#ffffff` (Superficies y tarjetas)

## Despliegue

`vercel.json` incluye el rewrite que necesitan las rutas de react-router. Los datos del portal son de ejemplo y no se guardan al recargar.
