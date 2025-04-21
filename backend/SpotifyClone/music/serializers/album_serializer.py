from rest_framework import serializers
from ..models import Album, Artist, Genre
from .artist_serializer import ArtistSerializer


class AlbumSerializer(serializers.ModelSerializer):
    artist = ArtistSerializer(read_only=True)
    genres = serializers.PrimaryKeyRelatedField(
        queryset=Genre.objects.all(),
        many=True
    )
    cover_image = serializers.ImageField(required=False, allow_null=True)
    songs_count = serializers.SerializerMethodField()

    class Meta:
        model = Album
        fields = '__all__'

    def get_songs_count(self, obj):
        return obj.songs.count()
