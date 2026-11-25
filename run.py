#!/usr/bin/env python3
"""Menú de tareas Docker Compose para el proyecto Bolt."""

from __future__ import annotations

import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def run(command: list[str]) -> bool:
    print(f"\n> {' '.join(command)}\n", flush=True)
    try:
        result = subprocess.run(command, cwd=ROOT, check=False)
    except FileNotFoundError:
        print("No se encontró Docker Compose. Instala/Inicia Docker Desktop y vuelve a intentarlo.")
        return False

    if result.returncode == 0:
        print("\nTerminado correctamente.")
        return True
    print(f"\nEl comando terminó con código {result.returncode}.")
    return False


def update_and_rebuild() -> None:
    """Pull, rebuild and start every Compose service, including mobile profile."""
    run(["docker", "compose", "--profile", "mobile", "up", "--pull", "always", "--build", "-d"])


def start_web_stack() -> None:
    run(["docker", "compose", "up", "--pull", "always", "--build", "-d", "db", "backend", "frontend"])


def start_mobile() -> None:
    run(["docker", "compose", "--profile", "mobile", "up", "--pull", "always", "--build", "-d", "mobile"])
    print("\nExpo/Metro: revisa el QR y la URL con: docker compose logs -f mobile")


def build_frontend() -> None:
    result = subprocess.run(
        ["docker", "compose", "ps", "--status", "running", "--services"],
        cwd=ROOT,
        check=False,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0 or "frontend" not in result.stdout.split():
        print("El contenedor frontend no está corriendo. Inícialo primero con la opción 1 o 2.")
        return
    run(["docker", "compose", "exec", "-T", "frontend", "npm", "run", "build"])
    print("La salida del build queda en ./frontend/dist (bind mount al host).")


def build_android_apk() -> None:
    print("\nEAS Build compila el APK en la nube. Necesitas una cuenta Expo y vincular el proyecto la primera vez.")
    if input("¿Iniciar sesión en Expo y continuar? [s/N]: ").strip().lower() not in {"s", "si", "sí", "y", "yes"}:
        print("Build cancelado.")
        return

    command = [
        "docker", "compose", "--profile", "mobile", "run", "--rm", "mobile",
        "sh", "-lc",
        "npm install --no-audit --no-fund && npx eas-cli login && npx eas-cli init && npx eas-cli build --platform android --profile preview",
    ]
    run(command)
    print("\nCuando EAS termine, descarga el archivo .apk desde el enlace que imprimió el comando.")


def show_menu() -> None:
    print("""
========================================
 Gestor del proyecto Bolt · Docker
========================================
1. Update and rebuild todos los contenedores
2. Iniciar/rebuild DB + Backend + Frontend web
3. Iniciar/build contenedor de aplicación móvil (Expo)
4. Crear build de producción del frontend React
5. Crear APK Android de la aplicación móvil
6. Salir
""")


def main() -> int:
    if not (ROOT / "docker-compose.yml").exists():
        print("No encuentro docker-compose.yml junto a update.py.")
        return 1

    actions = {
        "1": update_and_rebuild,
        "2": start_web_stack,
        "3": start_mobile,
        "4": build_frontend,
        "5": build_android_apk,
    }

    while True:
        show_menu()
        try:
            choice = input("Selecciona una opción [1-6]: ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nSaliendo.")
            return 0

        if choice == "6":
            print("\nSaliendo.")
            return 0
        action = actions.get(choice)
        if action is None:
            print("Opción no válida. Selecciona un número del 1 al 6.")
            continue
        action()
        input("\nPulsa Enter para volver al menú...")


if __name__ == "__main__":
    raise SystemExit(main())
