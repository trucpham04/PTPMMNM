# supportchat/routing.py

from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path("ws/chat/public_chat/", consumers.ChatConsumer.as_asgi()),
]
