from django.db import models
from user.models import User
from music.models import Song
from music.models import Album
# Favorite Song Model
class FavoriteSong(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorite_songs')
    song = models.ForeignKey(Song, on_delete=models.CASCADE, related_name='favorited_by')
    favorited_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'song')
        indexes = [
            models.Index(fields=['user', 'song']),
        ]
