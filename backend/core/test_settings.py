from .settings import *

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
    }
}

REST_FRAMEWORK = {**REST_FRAMEWORK, 'DEFAULT_THROTTLE_RATES': {'login': '1000/min'}}
PASSWORD_HASHERS = ['django.contrib.auth.hashers.MD5PasswordHasher']
