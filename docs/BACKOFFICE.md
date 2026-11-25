# Backoffice y roles

## Roles

| Rol | Cómo se crea | Qué puede hacer |
| --- | --- | --- |
| Administrador de la plataforma | `createsuperuser` o `seed_backoffice` (`admin@bolt.hn`) | Todo el backoffice; entra a cualquier comercio con **Gestionar** |
| Dueño / Gerente / Equipo | Backoffice → Usuarios, o dueño al crear el comercio | Portal de su comercio |

Hoy los tres roles de comercio tienen los mismos permisos dentro de su comercio; la diferencia es informativa y queda lista para restringir después.

## Flujo para dar de alta un comercio

1. `/backoffice/comercios` → **Nuevo comercio**.
2. Completa datos, comisión (%) y el correo del dueño.
3. Copia la **contraseña temporal** que aparece (solo se muestra una vez) y compártela por un canal seguro.
4. El comercio queda **Por aprobar** y no aparece en el catálogo público. Pulsa **Aprobar**.
5. El dueño entra en `/login` y ve únicamente su portal.

Estados: *Por aprobar* y *Suspendido* ocultan el catálogo; *Suspendido* además bloquea el acceso de sus usuarios; *Pausado* mantiene el acceso.

## Liquidaciones

En la edición de un comercio, **Generar liquidación** suma los pedidos `delivered` del rango y aplica su comisión. El nombre del período no se puede repetir dentro del mismo comercio.

## Gráficos del backoffice

Ventas por día, estado de pedidos y comercios con más ventas, para 7, 14 o 30 días. La comisión estimada usa la tasa de cada comercio.

## Datos de ejemplo

`python manage.py seed_backoffice` (repetible). Crea un administrador, tres comercios con usuarios, productos y 30 días de pedidos. **Solo para desarrollo**: cambia las contraseñas con `--password`.
