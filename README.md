# Son Doong Expeditions

Landing page sobre las expediciones a Son Doong, la cueva más grande del mundo (Vietnam).

Hecha con:

- [Vite](https://vite.dev) como bundler y servidor de desarrollo
- [React 19](https://react.dev) usando **solo JavaScript** (archivos `.jsx` / `.js`)
- [Tailwind CSS v4](https://tailwindcss.com) mediante el plugin `@tailwindcss/vite`
- [Motion](https://motion.dev) (antes Framer Motion) para las animaciones
- [Lucide](https://lucide.dev) para los íconos

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
git clone https://github.com/coffee4jack/sondoong.git
cd sondoong

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev
```

Después abre [http://localhost:3000](http://localhost:3000) en el navegador. Los cambios se ven al instante gracias al Hot Module Replacement de Vite.

## Scripts disponibles

| Comando           | Qué hace                                                    |
| ----------------- | ----------------------------------------------------------- |
| `npm run dev`     | Inicia el servidor de desarrollo en el puerto 3000          |
| `npm run build`   | Genera la versión de producción en la carpeta `dist/`       |
| `npm run preview` | Sirve localmente la build de `dist/` para revisarla         |

## Estructura del proyecto

```
.
├── index.html              # Punto de entrada HTML (metadatos, fuentes)
├── vite.config.js          # Configuración de Vite (React + Tailwind)
├── vercel.json             # Configuración de despliegue y headers de seguridad
├── public/                 # Archivos estáticos (íconos, favicon)
└── src/
    ├── main.jsx            # Monta la app de React
    ├── App.jsx             # Arma la página con todas las secciones
    ├── index.css           # Tailwind CSS y tokens de diseño (@theme)
    ├── data/
    │   └── site-data.js    # Textos y contenido (features, itinerario, FAQ...)
    ├── lib/
    │   └── motion.js       # Variantes de animación reutilizables
    └── components/
        ├── Navbar.jsx
        ├── Hero.jsx
        ├── Features.jsx
        ├── Journey.jsx
        ├── Faq.jsx
        ├── Contact.jsx
        ├── NewsletterForm.jsx
        └── Footer.jsx
```

## Editar el contenido

Casi todo el texto de la página está en `src/data/site-data.js`. Si lo modificas, los componentes se actualizan solos, así que no hace falta tocar el JSX.

Los colores y las fuentes se definen como tokens en el bloque `@theme` de `src/index.css`.

## Despliegue

El proyecto está listo para desplegarse en [Vercel](https://vercel.com): Vercel reconoce Vite automáticamente, ejecuta `npm run build` y publica la carpeta `dist/`. También funciona en cualquier hosting estático (Netlify, GitHub Pages, etc.) si subes el contenido de `dist/`.
