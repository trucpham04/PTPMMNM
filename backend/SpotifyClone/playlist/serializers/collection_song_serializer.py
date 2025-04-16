from rest_framework import serializers
from ..models import Playlist, PlaylistSong, Collection, CollectionSong
from music.models import Song
from user.models import User

class CollectionSongSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollectionSong
        fields = '__all__'