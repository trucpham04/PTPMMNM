from rest_framework import serializers
from ..models import Artist, Genre, ArtistFollow
from .genre_serializer import GenreSerializer 

class ArtistSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(read_only=True, many=True) 
    genre_ids = serializers.PrimaryKeyRelatedField(
        queryset=Genre.objects.all(),
        many=True,
        write_only=True,  
        source='genres'  
    )
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Artist
        fields = ['id', 'name', 'bio', 'image', 'genres', 'genre_ids']

class ArtistFollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArtistFollow
        fields = '__all__'