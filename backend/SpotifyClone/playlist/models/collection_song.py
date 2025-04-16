from django.db import models
from user.models import User
from music.models import Song
from music.models import Genre
from cloudinary.models import CloudinaryField
from .collection import Collection

# Collection Song Model (for ordered songs in collections)
class CollectionSong(models.Model):
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE)
    song = models.ForeignKey(Song, on_delete=models.CASCADE)
    position = models.PositiveIntegerField()
    added_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('collection', 'song')
        ordering = ['position']