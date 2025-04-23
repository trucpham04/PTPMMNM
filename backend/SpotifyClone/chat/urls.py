from django.urls import path
from . import views
urlpatterns = [
    path('chat-history', views.chat_history, name='chat_history'),
    path('chat', views.chat, name='chat'),
]
