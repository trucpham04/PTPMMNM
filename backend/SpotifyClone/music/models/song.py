from django.db import models
from django.core.validators import FileExtensionValidator
from django.utils.text import slugify
from cloudinary_storage.storage import MediaCloudinaryStorage
from music.models import Genre, Artist, Album
from django.core.exceptions import ValidationError
import os
import mimetypes
# Hàm kiểm tra video (chỉ định nghĩa một lần)
def custom_validate_video(file):
    """Kiểm tra định dạng video và kích thước file"""
    if not file:
        raise ValidationError("Không có file được tải lên.")

    # Kiểm tra phần mở rộng hợp lệ
    valid_extensions = ['.mp4', '.mov', '.avi', '.wmv', '.flv', '.mkv']
    ext = os.path.splitext(file.name)[1].lower()
    if ext not in valid_extensions:
        raise ValidationError("Không hỗ trợ định dạng video này.")

    # Lấy MIME type bằng mimetypes
    mime_type, _ = mimetypes.guess_type(file.name)
    if not mime_type or not mime_type.startswith("video/"):
        raise ValidationError("File tải lên không phải là video hợp lệ.")

    # Kiểm tra kích thước file (giới hạn 500MB)
    if file.size > 500 * 1024 * 1024:
        raise ValidationError("File quá lớn, vui lòng tải lên file nhỏ hơn 500MB.")

    return file

# Định nghĩa storage cho video và audio
video_storage = MediaCloudinaryStorage(resource_type='video')
audio_storage = MediaCloudinaryStorage(resource_type='raw')


# Model Song
class Song(models.Model):
    title = models.CharField(max_length=255)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name='songs')
    featuring_artists = models.ManyToManyField(Artist, related_name='featured_in', blank=True)
    album = models.ForeignKey(Album, on_delete=models.CASCADE, null=True, blank=True, related_name='songs')
    genres = models.ManyToManyField(Genre, related_name='songs')
    composers = models.ManyToManyField(Artist, related_name='composed_songs')

    # Trường file âm thanh
    audio_file = models.FileField(
        storage=audio_storage,  # Sử dụng storage với resource_type='raw'
        validators=[FileExtensionValidator(allowed_extensions=['mp3', 'wav', 'flac'])]
    )

    # Trường file video
    video_file = models.FileField(
        storage=video_storage,  # Sử dụng storage với resource_type='video'
        validators=[custom_validate_video],  # Sử dụng hàm custom validate video
        null=True, blank=True
    )

    duration = models.DurationField()
    lyrics = models.TextField(null=True, blank=True)
    release_date = models.DateField(null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    is_downloadable = models.BooleanField(default=False)
    is_premium = models.BooleanField(default=False)
    play_count = models.PositiveIntegerField(default=0)
    slug = models.SlugField(max_length=255)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        if not self.release_date and self.album:
            self.release_date = self.album.release_date
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} - {self.artist.name}"
    
    class Meta:
        indexes = [
            models.Index(fields=['title']),
            models.Index(fields=['release_date']),
            models.Index(fields=['play_count']),
            models.Index(fields=['is_premium']),
            models.Index(fields=['slug']),
        ]
