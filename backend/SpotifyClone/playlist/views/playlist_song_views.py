from rest_framework import permissions
from core.views import BaseListCreateView, BaseRetrieveUpdateDestroyView
from playlist.models import PlaylistSong
from playlist.serializers.playlist_song_serializer import PlaylistSongSerializer
from utils.custom_response import custom_response  # Import custom_response
from rest_framework.views import APIView
class PlaylistSongListCreateView(BaseListCreateView):
    queryset = PlaylistSong.objects.all()
    serializer_class = PlaylistSongSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return custom_response(dt=serializer.data, em="Playlist songs retrieved successfully")

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return custom_response(dt=serializer.data, em="Playlist song added successfully")
        return custom_response(ec=1, em="Failed to add playlist song", dt=serializer.errors)

class PlaylistSongDetailView(BaseRetrieveUpdateDestroyView):
    queryset = PlaylistSong.objects.all()
    serializer_class = PlaylistSongSerializer
    permission_classes = [permissions.AllowAny]

    def retrieve(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_object())
        return custom_response(dt=serializer.data, em="Playlist song details retrieved successfully")

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return custom_response(dt=serializer.data, em="Playlist song updated successfully")
        return custom_response(ec=1, em="Failed to update playlist song", dt=serializer.errors)

    def destroy(self, request, *args, **kwargs):
        self.get_object().delete()
        return custom_response(em="Playlist song deleted successfully")
    
class PlaylistSongByPlaylistView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk, *args, **kwargs):
        # Lọc playlist song theo pk (playlist_id)
        playlist_songs = PlaylistSong.objects.filter(playlist_id=pk)
        
        if playlist_songs.exists():
            serializer = PlaylistSongSerializer(playlist_songs, many=True)
            return custom_response(dt=serializer.data, em="Songs retrieved successfully for playlist")
        else:
            return custom_response(ec=1, em="No songs found for this playlist", dt=None)