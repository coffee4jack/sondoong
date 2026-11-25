"""Inicio de sesión por correo y contraseña con token."""

from django.contrib.auth import authenticate
from rest_framework import permissions, status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from .permissions import is_platform_admin, is_portal_user
from .serializers import MerchantBriefSerializer


def session_payload(user):
    memberships = user.memberships.select_related("merchant").exclude(merchant__status="suspended")
    return {
        "user": {
            "id": user.pk,
            "email": user.email or user.username,
            "name": user.get_full_name() or user.email or user.username,
            "is_admin": is_platform_admin(user),
        },
        "memberships": [
            {"role": m.role, "merchant": MerchantBriefSerializer(m.merchant).data} for m in memberships
        ],
    }


class LoginView(APIView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "login"

    def post(self, request):
        email = str(request.data.get("email", "")).strip().lower()
        password = str(request.data.get("password", ""))
        user = authenticate(request, username=email, password=password) if email and password else None
        if user is None or not user.is_active:
            return Response({"detail": "Correo o contraseña incorrectos."}, status=status.HTTP_400_BAD_REQUEST)
        if not is_portal_user(user):
            return Response({"detail": "Tu cuenta no tiene un comercio activo. Contacta a soporte."}, status=status.HTTP_403_FORBIDDEN)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, **session_payload(user)})


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(session_payload(request.user))


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        Token.objects.filter(user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
