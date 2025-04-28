from rest_framework import serializers
from ..models import Playlist, PlaylistSong, Collection, CollectionSong
from music.models import Song
from user.models import User
from music.serializers.song_serializer import SongSerializer


class PlaylistSongSerializer(serializers.ModelSerializer):
    playlist = serializers.PrimaryKeyRelatedField(
        queryset=Playlist.objects.all()
    )

    song_id = serializers.PrimaryKeyRelatedField(
        queryset=Song.objects.all(), write_only=True, source='song'
    )

    song = SongSerializer(read_only=True)
    
    position = serializers.IntegerField(read_only=True)

    class Meta:
        model = PlaylistSong
        fields = '__all__'
    
    def create(self, validated_data):
        playlist = validated_data['playlist']
        
        # Find the last song in the playlist (if any)
        last_song = PlaylistSong.objects.filter(playlist=playlist).order_by('-position').first()
        
        # Set position to be one more than the last song, or 1 if there are no songs
        position = 1
        if last_song:
            position = last_song.position + 1
        
        # Set the position in the validated_data
        validated_data['position'] = position
        
        # Create the PlaylistSong object
        return super().create(validated_data)