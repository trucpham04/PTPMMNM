from rest_framework import serializers
from ..models import SongRecommendation
from .song_serializer import SongSerializer

class SongRecommendationSerializer(serializers.ModelSerializer):
    song = SongSerializer(read_only=True)

    class Meta:
        model = SongRecommendation
        fields = '__all__'
