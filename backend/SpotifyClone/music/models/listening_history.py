from django.db import models
from user.models import User
from music.models import Song
# Listening History Model
class ListeningHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='listening_history')
    song = models.ForeignKey(Song, on_delete=models.CASCADE, related_name='listened_by')
    listened_at = models.DateTimeField(auto_now_add=True)
    listened_duration = models.DurationField(null=True, blank=True)  # How long user listened
    play_position = models.DurationField(null=True, blank=True)  # Where user left off
    completed = models.BooleanField(default=False)  # If user listened to the entire song
    
    class Meta:
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['listened_at']),
            models.Index(fields=['completed']),
        ]
