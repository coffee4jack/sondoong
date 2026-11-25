"""Permisos y alcance por comercio.

Reglas:
- Administrador de plataforma: ``is_staff`` o ``is_superuser``. Ve todo y puede
  "gestionar" un comercio enviando la cabecera ``X-Merchant-Id``.
- Usuario de comercio: tiene al menos una ``Membership``. Solo ve y edita datos
  de sus comercios.
- Anónimo: solo lo que necesitan la app móvil y el seguimiento público.
"""

from rest_framework.permissions import SAFE_METHODS, BasePermission

from .models import Merchant


def is_platform_admin(user):
    return bool(user and user.is_authenticated and (user.is_staff or user.is_superuser))


def merchant_ids_for(user):
    """IDs de comercios activos a los que pertenece el usuario."""
    if not (user and user.is_authenticated):
        return []
    return list(
        user.memberships.exclude(merchant__status="suspended").values_list("merchant_id", flat=True)
    )


def is_portal_user(user):
    return is_platform_admin(user) or bool(merchant_ids_for(user))


def requested_merchant_id(request):
    raw = request.headers.get("X-Merchant-Id") or request.query_params.get("merchant")
    try:
        return int(raw) if raw not in (None, "") else None
    except (TypeError, ValueError):
        return None


def current_merchant(request):
    """Comercio con el que trabaja la petición, o ``None``.

    - Usuario de comercio: el pedido en la cabecera si le pertenece; si no, el primero.
    - Administrador: el de la cabecera/consulta, si existe.
    """
    user = request.user
    wanted = requested_merchant_id(request)
    if is_platform_admin(user):
        return Merchant.objects.filter(pk=wanted).first() if wanted else None
    ids = merchant_ids_for(user)
    if not ids:
        return None
    chosen = wanted if wanted in ids else ids[0]
    return Merchant.objects.filter(pk=chosen).first()


class IsPlatformAdmin(BasePermission):
    message = "Solo el administrador de la plataforma puede hacer esto."

    def has_permission(self, request, view):
        return is_platform_admin(request.user)


class IsPortalUser(BasePermission):
    message = "Inicia sesión con una cuenta de comercio."

    def has_permission(self, request, view):
        return is_portal_user(request.user)


class PublicReadPortalWrite(BasePermission):
    """Lectura pública (catálogo); escritura solo para el portal."""

    message = "Inicia sesión con una cuenta de comercio para modificar datos."

    def has_permission(self, request, view):
        return request.method in SAFE_METHODS or is_portal_user(request.user)


def scope_by_merchant(request, queryset):
    """Limita un queryset con campo ``merchant`` a lo que la petición puede ver."""
    user = request.user
    if is_platform_admin(user):
        merchant = current_merchant(request)
        return queryset.filter(merchant=merchant) if merchant else queryset
    return queryset.filter(merchant_id__in=merchant_ids_for(user))


class MerchantScopedMixin:
    """Filtra por comercio y asigna el comercio al crear."""

    def scope_queryset(self, queryset):
        return scope_by_merchant(self.request, queryset)

    def perform_create(self, serializer):
        serializer.save(merchant=current_merchant(self.request))
