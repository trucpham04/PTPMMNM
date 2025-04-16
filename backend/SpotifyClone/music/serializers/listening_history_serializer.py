from rest_framework import serializers
from ..models import ListeningHistory
from .song_serializer import SongSerializer

class ListeningHistorySerializer(serializers.ModelSerializer):
    song = SongSerializer(read_only=True)

    class Meta:
        model = ListeningHistory
        fields = '__all__'
