from django.db import models
from music.models import Genre
from music.models import Artist
from django.utils.text import slugify
from cloudinary.models import CloudinaryField
# Album Model
class Album(models.Model):
    title = models.CharField(max_length=255)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name='albums')
    genres = models.ManyToManyField(Genre, related_name='albums')
    release_date = models.DateField()
    cover_image = CloudinaryField('album_covers', null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    slug = models.SlugField(max_length=255)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.title} - {self.artist.name}"
    
    class Meta:
        unique_together = ('title', 'artist')
        indexes = [
            models.Index(fields=['title']),
            models.Index(fields=['release_date']),
            models.Index(fields=['slug']),
        ]