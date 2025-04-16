from rest_framework import serializers
from ..models import Playlist, PlaylistSong, Collection, CollectionSong
from music.models import Song
from user.models import User


class PlaylistSongSerializer(serializers.ModelSerializer):
    playlist = serializers.PrimaryKeyRelatedField(
        queryset=Playlist.objects.all()
    )
    class Meta:
        model = PlaylistSong
        fields = '__all__'
