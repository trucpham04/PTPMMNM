# supportchat/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path("global-chat-history/", views.global_chat_history, name="global-chat-history"),
]
