from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from cloudinary.models import CloudinaryField
from .user import User
# User Follow Model
class UserFollow(models.Model):
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name='following')
    followed = models.ForeignKey(User, on_delete=models.CASCADE, related_name='followers')
    followed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('follower', 'followed')
        indexes = [
            models.Index(fields=['follower']),
            models.Index(fields=['followed']),
        ]