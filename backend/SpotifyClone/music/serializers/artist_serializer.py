from rest_framework import serializers
from ..models import Artist, Genre, ArtistFollow
from .genre_serializer import GenreSerializer  # Nếu muốn sử dụng GenreSerializer

class ArtistSerializer(serializers.ModelSerializer):
    genres = serializers.PrimaryKeyRelatedField(
        queryset=Genre.objects.all(),
        many=True
    )
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Artist
        fields = '__all__'

class ArtistFollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArtistFollow
        fields = '__all__'