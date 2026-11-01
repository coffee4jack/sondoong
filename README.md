# Bolt Landing Page

Landing page de movilidad y entregas inspirada en el diseño de Bolt. Es un proyecto de práctica de frontend, no un sitio oficial.

Hecha con:

- [Vite](https://vite.dev) como bundler y servidor de desarrollo
- [React 19](https://react.dev) usando **solo JavaScript** (archivos `.jsx` / `.js`)
- [Tailwind CSS v4](https://tailwindcss.com) mediante el plugin `@tailwindcss/vite`
- [Framer Motion](https://motion.dev) para las animaciones

## Requisitos

- Node.js **20.19 o superior** (recomendado: 22 LTS o más nuevo)
- npm (viene incluido con Node.js)

Para revisar tus versiones:

```bash
node -v
npm -v
```

## Cómo correrlo en local

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd <carpeta-del-proyecto>

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev
```

Después abre la URL que muestre la terminal en el navegador (normalmente [http://localhost:5173](http://localhost:5173), o el puerto que tengas configurado en `vite.config.js`). Los cambios se ven al instante gracias al Hot Module Replacement de Vite.

## Scripts disponibles

| Comando           | Qué hace                                              |
| ----------------- | ----------------------------------------------------- |
| `npm run dev`     | Inicia el servidor de desarrollo                      |
| `npm run build`   | Genera la versión de producción en la carpeta `dist/` |
| `npm run preview` | Sirve localmente la build de `dist/` para revisarla   |

## Secciones de la página

El orden en el que aparecen está definido en `src/main.jsx`:

| Orden | Componente         | Qué muestra                                                  |
| ----- | ------------------ | ------------------------------------------------------------ |
| 1     | `Navbar.jsx`       | Barra superior y menú desplegable a pantalla completa        |
| 2     | `Hero.jsx`         | Portada con el mensaje principal                             |
| 3     | `Services.jsx`     | "Nuestros servicios": carrusel de tarjetas                   |
| 4     | `DriveSection.jsx` | Sección oscura con llamada a registrarse como conductor      |
| 5     | `About.jsx`        | "Sobre nosotros" sobre fondo verde, con teléfono en perspectiva |
| 6     | `Business.jsx`     | "Gana dinero con Bolt": conductores, repartidores y comercios |
| 7     | `Boltsend.jsx`     | Bolt Send, entrega de paquetes                               |
| 8     | `AppDownload.jsx`  | "Descarga nuestras apps", con pestañas                       |
| 9     | `News.jsx`         | "Noticias y novedades"                                       |
| 10    | `Footer.jsx`       | Pie de página con enlaces                                    |

## Estructura del proyecto

```
.
├── index.html              # Punto de entrada HTML (metadatos, fuentes)
├── vite.config.js          # Configuración de Vite (React + Tailwind)
├── public/                 # Archivos estáticos (íconos, favicon)
└── src/
    ├── main.jsx            # Monta la app y ordena las secciones
    ├── index.css           # Tailwind CSS y estilos globales
    └── components/
        ├── Navbar.jsx
        ├── Hero.jsx
        ├── Services.jsx
        ├── DriveSection.jsx
        ├── About.jsx
        ├── Business.jsx
        ├── Boltsend.jsx
        ├── AppDownload.jsx
        ├── News.jsx
        └── Footer.jsx
```

## Editar el contenido

Cada componente guarda su contenido (textos, enlaces e imágenes) en arreglos o constantes al inicio del archivo, por ejemplo `items` en `Services.jsx`, `blocks` en `Business.jsx`, `featured` y `list` en `News.jsx` o `columns` en `Footer.jsx`. Para cambiar un texto o una imagen, edita esos datos sin tocar el JSX.

Las imágenes actuales son de ejemplo (Pexels y Unsplash). Antes de publicar, reemplázalas por las tuyas.

## Despliegue

El proyecto se puede desplegar en [Vercel](https://vercel.com), que reconoce Vite automáticamente, ejecuta `npm run build` y publica la carpeta `dist/`. También funciona en cualquier hosting estático (Netlify, GitHub Pages, etc.) si subes el contenido de `dist/`.

> Los servidores de Linux distinguen mayúsculas y minúsculas. Asegúrate de que el nombre de cada archivo coincida exactamente con su `import` (por ejemplo `Boltsend.jsx`), o el build puede fallar en producción aunque funcione en tu equipo.