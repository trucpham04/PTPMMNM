from django.db import models
from user.models import User
from music.models import Song
from music.models import Genre
from cloudinary.models import CloudinaryField
from .playlist import Playlist
# PlaylistSong Model (for ordered songs in playlist)
class PlaylistSong(models.Model):
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE)
    song = models.ForeignKey(Song, on_delete=models.CASCADE)
    position = models.PositiveIntegerField()
    added_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('playlist', 'song')
        ordering = ['position']
        indexes = [
            models.Index(fields=['playlist', 'position']),
        ]
