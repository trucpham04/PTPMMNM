from rest_framework import serializers
from ..models import Artist, Genre, ArtistFollow
from .genre_serializer import GenreSerializer  # Nếu muốn sử dụng GenreSerializer

class ArtistSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(read_only=True, many=True)  # Read-only nested field for genres
    genre_ids = serializers.PrimaryKeyRelatedField(
        queryset=Genre.objects.all(),
        many=True,
        write_only=True,  # This allows only to accept genre_ids in the request
        source='genres'  # It will link the genre_ids to the genres field in the model
    )
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Artist
        fields = ['id', 'name', 'bio', 'image', 'genres', 'genre_ids']

class ArtistFollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArtistFollow
        fields = '__all__'