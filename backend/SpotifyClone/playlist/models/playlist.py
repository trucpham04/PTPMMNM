from django.db import models
from user.models import User
from music.models import Song
from music.models import Genre
from cloudinary.models import CloudinaryField

# Playlist Model
class Playlist(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='playlists')
    songs = models.ManyToManyField(Song, through='PlaylistSong', related_name='playlists')
    cover_image = CloudinaryField('playlist_covers', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_public = models.BooleanField(default=False)

    # Bỏ logic xử lý slug vì không còn slug
    def __str__(self):
        return f"{self.name} - {self.user.username}"

    class Meta:
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['created_at']),
            models.Index(fields=['is_public']),
        ]
