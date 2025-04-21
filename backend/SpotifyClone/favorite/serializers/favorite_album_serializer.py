from rest_framework import serializers
from ..models import FavoriteAlbum
from music.models import Album, Song
from user.models import User

# Serializer for Favorite Album
# class FavoriteAlbumSerializer(serializers.ModelSerializer):
#     user = serializers.StringRelatedField()
#     album = serializers.StringRelatedField()  
    
#     class Meta:
#         model = FavoriteAlbum
#         fields = ['user', 'album', 'favorited_at']
#         read_only_fields = ['favorited_at']

class FavoriteAlbumSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteAlbum
        fields = ['user', 'album', 'favorited_at']
        read_only_fields = ['favorited_at', 'user']

    def create(self, validated_data):
        user_id = self.context['user_id']
        user = User.objects.get(id=user_id)
        favorite_album = FavoriteAlbum.objects.create(user=user, **validated_data)
        return favorite_album