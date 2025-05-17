# ai_assistant/urls.py
from django.urls import path
from .views import ai_chat_song

urlpatterns = [
    path('', ai_chat_song),
]
