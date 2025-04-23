from rest_framework import serializers
from ..models import Playlist, PlaylistSong, Collection, CollectionSong
from music.models import Song
from user.models import User

class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = '__all__'

