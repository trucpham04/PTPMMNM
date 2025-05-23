from rest_framework import serializers
from ..models import FavoriteAlbum, FavoriteSong
from music.models import Album, Song
from user.models import User

from music.serializers.song_serializer import SongSerializer

# Serializer for Favorite Song
# class FavoriteSongSerializer(serializers.ModelSerializer):
#     user = serializers.StringRelatedField()  # Show user as a string (can be adjusted based on your needs)
#     song = serializers.StringRelatedField()  # Show song as a string (can be adjusted based on your needs)
#     # song = SongSerializer()
    
#     class Meta:
#         model = FavoriteSong
#         fields = ['user', 'song', 'favorited_at']
#         read_only_fields = ['favorited_at']

class FavoriteSongSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteSong
        fields = ['user', 'song', 'favorited_at']
        read_only_fields = ['favorited_at', 'user']

    def create(self, validated_data):
        user_id = self.context['user_id']
        user = User.objects.get(id=user_id)
        favorite_song = FavoriteSong.objects.create(user=user, **validated_data)
        return favorite_song

