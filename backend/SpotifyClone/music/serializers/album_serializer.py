from rest_framework import serializers
from ..models import Album, Artist, Genre


class AlbumSerializer(serializers.ModelSerializer):
    artist = serializers.PrimaryKeyRelatedField(
        queryset=Artist.objects.all()
    )
    genres = serializers.PrimaryKeyRelatedField(
        queryset=Genre.objects.all(),
        many=True
    )
    cover_image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Album
        fields = '__all__'
