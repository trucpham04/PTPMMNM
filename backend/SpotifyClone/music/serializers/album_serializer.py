from rest_framework import serializers
from ..models import Album, Artist, Genre
from .artist_serializer import ArtistSerializer
from .genre_serializer import GenreSerializer

class AlbumSerializer(serializers.ModelSerializer): 
    artist = ArtistSerializer(read_only=True)
    artist_id = serializers.PrimaryKeyRelatedField(
        queryset=Artist.objects.all(),
        write_only=True,
        source='artist'
    )
    cover_image = serializers.ImageField(required=False, allow_null=True)
    songs_count = serializers.SerializerMethodField()
    
    genres = GenreSerializer(read_only=True, many=True)
    genre_ids = serializers.PrimaryKeyRelatedField(
        queryset=Genre.objects.all(),
        many=True,
        write_only=True,
        source='genres'
    )

    class Meta:
        model = Album
        fields = '__all__'

    def get_songs_count(self, obj):
        return obj.songs.count()
