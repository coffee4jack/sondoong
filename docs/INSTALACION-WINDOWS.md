# Instalar y actualizar en Windows

## Requisitos
Docker Desktop (con WSL 2). No necesitas Python ni Node.

## Actualizar desde el comprimido
1. **Cierra** los contenedores: `docker compose down` (no uses `-v`: borra la base de datos).
2. Haz una copia de tu carpeta actual y de tu archivo `.env`.
3. Descomprime el `.zip` y **copia todo su contenido encima** de la carpeta del proyecto, aceptando *Reemplazar los archivos en el destino*.
   - No toques tu `.env`: el comprimido solo trae `.env.example`.
   - Si tienes `node_modules`, `dist` o `__pycache__`, déjalos: el comprimido no los incluye.
4. Reconstruye y levanta: `docker compose up --build -d`.
5. Las migraciones se aplican solas. Tus pedidos, productos y horarios actuales quedan en un comercio llamado **Restaurante El Sabor**.
6. Datos de ejemplo (opcional): `docker compose exec backend python manage.py seed_backoffice`.
7. Abre http://localhost:5173/login.

## Si algo falla
- Ver registros: `docker compose logs -f backend frontend`.
- La primera vez el frontend puede tardar unos minutos en instalar dependencias.
- "No such table": ejecuta `docker compose exec backend python manage.py migrate`.
