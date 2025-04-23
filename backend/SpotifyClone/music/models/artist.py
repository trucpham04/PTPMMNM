
from django.db import models
from user.models import User
from music.models import Genre
from django.utils.text import slugify
from cloudinary.models import CloudinaryField
# Artist Model
class Artist(models.Model):
    name = models.CharField(max_length=255)
    bio = models.TextField(null=True, blank=True)
    image = CloudinaryField('artist_images', null=True, blank=True)
    genres = models.ManyToManyField(Genre, related_name='artists')
    slug = models.SlugField(unique=True, max_length=255)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name
    
    class Meta:
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['slug']),
        ]

# Artist Follow Model
class ArtistFollow(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='artist_follows')
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name='followers')
    followed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'artist')
        indexes = [
            models.Index(fields=['user', 'artist']),
        ]