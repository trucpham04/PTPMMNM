from django.db import models
from user.models import User
from music.models import Song
from music.models import Genre
from cloudinary.models import CloudinaryField

# Song Collection Model (Featured playlists, trending, etc.)
class Collection(models.Model):
    COLLECTION_TYPES = (
        ('featured', 'Featured'),
        ('trending', 'Trending'),
        ('new_releases', 'New Releases'),
        ('genre_based', 'Genre Based'),
        ('mood_based', 'Mood Based'),
        ('seasonal', 'Seasonal'),
    )
    
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    collection_type = models.CharField(max_length=20, choices=COLLECTION_TYPES)
    cover_image = CloudinaryField('collection_covers', null=True, blank=True)
    songs = models.ManyToManyField(Song, through='CollectionSong', related_name='collections')
    genres = models.ManyToManyField(Genre, related_name='collections', blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Bỏ slug nên không cần override save()
    
    class Meta:
        indexes = [
            models.Index(fields=['collection_type']),
            models.Index(fields=['is_active']),
        ]
