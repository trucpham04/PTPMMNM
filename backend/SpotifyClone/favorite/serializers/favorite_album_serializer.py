from rest_framework import serializers
from ..models import FavoriteAlbum, FavoriteSong
from music.models import Album, Song
from user.models import User

# Serializer for Favorite Album
class FavoriteAlbumSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    album = serializers.StringRelatedField()  
    
    class Meta:
        model = FavoriteAlbum
        fields = ['user', 'album', 'favorited_at']
        read_only_fields = ['favorited_at']