from rest_framework import serializers
from ..models import Playlist, PlaylistSong, Collection, CollectionSong
from music.models import Song
from user.models import User
class PlaylistSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all()
    )
    songs = serializers.PrimaryKeyRelatedField(
        queryset=Song.objects.all(),
        many=True,
        required=False,
        allow_null=True
    )
    cover_image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Playlist
        fields = '__all__'

