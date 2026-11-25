# Cómo contribuir

1. Crea una rama desde la versión actual: `git switch -c feature/mi-cambio`.
2. Backend: `python manage.py test --settings=core.test_settings`. Cada cambio de modelo lleva su migración: `python manage.py makemigrations --settings=core.test_settings`.
3. Frontend: `npm run qa` debe pasar (lint, pruebas y build).
4. Todo endpoint nuevo del portal debe usar `IsPortalUser` y `scope_by_merchant`, y llevar una prueba que demuestre que un comercio no ve datos de otro.
5. Colores y fuente: tokens de `frontend/src/index.css` (`brand` `#3bb77e`, `ink` `#010f1c`). No agregues colores sueltos.
6. Componentes de portal y backoffice: fondo claro, bordes `border-ink/10`, sin sombras, botones con `Button`.
7. Textos de la interfaz en español; el código y los comentarios en español, como el resto del proyecto.
8. Los nombres de archivo respetan mayúsculas exactas (los servidores Linux las distinguen).
