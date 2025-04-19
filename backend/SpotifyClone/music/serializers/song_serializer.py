from rest_framework import serializers
from ..models import Song, Artist, Genre, Album
from .artist_serializer import ArtistSerializer
from .genre_serializer import GenreSerializer
from .album_serializer import AlbumSerializer
import magic  # Thêm thư viện magic để kiểm tra loại file

class SongSerializer(serializers.ModelSerializer):
    artist = serializers.PrimaryKeyRelatedField(queryset=Artist.objects.all())  # Cho phép nhập ID của Artist
    genres = serializers.PrimaryKeyRelatedField(queryset=Genre.objects.all(), many=True)  # Nhận danh sách ID của Genre
    album = AlbumSerializer(read_only=True)
    
    class Meta:
        model = Song
        fields = '__all__'

    def validate_file(self, value):
        """ Kiểm tra nếu là video/audio thì cho phép """
        mime = magic.from_buffer(value.read(1024), mime=True)
        value.seek(0)
        if not mime.startswith(('audio/', 'video/')):
            raise serializers.ValidationError("Chỉ chấp nhận file âm thanh hoặc video!")
        return value
    
    
