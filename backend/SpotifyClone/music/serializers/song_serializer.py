from rest_framework import serializers
from ..models import Song, Artist, Genre, Album
from .artist_serializer import ArtistSerializer
from .genre_serializer import GenreSerializer
from .album_serializer import AlbumSerializer
import magic  # Để kiểm tra loại file (MIME)

class SongSerializer(serializers.ModelSerializer):
    # Read-only nested serializers
    artist = ArtistSerializer(read_only=True)
    genres = GenreSerializer(many=True, read_only=True)
    album = AlbumSerializer(read_only=True)
    featuring_artists = ArtistSerializer(many=True, read_only=True)
    composers = ArtistSerializer(many=True, read_only=True)
    
    # Write-only ID fields
    artist_id = serializers.PrimaryKeyRelatedField(
        queryset=Artist.objects.all(),
        write_only=True,
        source='artist'
    )
    genre_ids = serializers.PrimaryKeyRelatedField(
        queryset=Genre.objects.all(),
        many=True,
        write_only=True,
        source='genres'
    )
    album_id = serializers.PrimaryKeyRelatedField(
        queryset=Album.objects.all(),
        write_only=True,
        source='album'
    )
    featuring_artist_ids = serializers.PrimaryKeyRelatedField(
        queryset=Artist.objects.all(),
        many=True,
        write_only=True,
        source='featuring_artists'
    )
    composer_ids = serializers.PrimaryKeyRelatedField(
        queryset=Artist.objects.all(),
        many=True,
        write_only=True,
        source='composers'
    )

    class Meta:
        model = Song
        fields = [
            'id', 'title', 'artist', 'artist_id', 'album', 'album_id',
            'genres', 'genre_ids', 'featuring_artists', 'featuring_artist_ids',
            'composers', 'composer_ids', 'audio_file', 'video_file',
            'lyrics', 'duration', 'release_date', 'price',
            'is_downloadable', 'is_premium'
        ]

    def validate_audio_file(self, value):
        """ Kiểm tra MIME type của file âm thanh (hoặc video nếu dùng chung) """
        mime = magic.from_buffer(value.read(), mime=True)  # Đọc toàn bộ file
        value.seek(0)  # Reset lại con trỏ file về đầu sau khi kiểm tra MIME
        if not mime.startswith(('audio/', 'video/')):
            raise serializers.ValidationError("Chỉ chấp nhận file âm thanh hoặc video!")
        return value

