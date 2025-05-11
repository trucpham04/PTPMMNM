import os
import django

# Set up Django settings
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "SpotifyClone.settings")

# Initialize Django before any imports that might use Django models
django.setup()

# Now it's safe to import Django-dependent modules
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import supportchat.routing  # This import should be after django.setup()

# Define the ASGI application
application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            supportchat.routing.websocket_urlpatterns
        )
    ),
})