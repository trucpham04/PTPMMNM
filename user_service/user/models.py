from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    username = None
    
    user_name = models.CharField(max_length=50, unique=True)
    
    email = models.EmailField(unique=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['user_name']
