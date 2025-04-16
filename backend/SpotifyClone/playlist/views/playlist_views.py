from rest_framework import permissions, status
from rest_framework.response import Response
from core.views import BaseListCreateView, BaseRetrieveUpdateDestroyView
from playlist.models import Playlist
from playlist.serializers.playlist_serializer import PlaylistSerializer
from utils.custom_response import custom_response  # Import custom_response
from rest_framework.views import APIView
class PlaylistListCreateView(BaseListCreateView):
    queryset = Playlist.objects.all()
    serializer_class = PlaylistSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return custom_response(dt=serializer.data, em="Playlist retrieved successfully")

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return custom_response(dt=serializer.data, em="Playlist created successfully")
        return custom_response(ec=1, em="Failed to create playlist", dt=serializer.errors)

class PlaylistDetailView(BaseRetrieveUpdateDestroyView):
    queryset = Playlist.objects.all()
    serializer_class = PlaylistSerializer
    permission_classes = [permissions.AllowAny]

    def retrieve(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_object())
        return custom_response(dt=serializer.data, em="Playlist details retrieved successfully")

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return custom_response(dt=serializer.data, em="Playlist updated successfully")
        return custom_response(ec=1, em="Failed to update playlist", dt=serializer.errors)

    def destroy(self, request, *args, **kwargs):
        self.get_object().delete()
        return custom_response(em="Playlist deleted successfully")
class PlaylistByUserView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk, *args, **kwargs):
        # Lọc playlist theo user_id (pk)
        playlists = Playlist.objects.filter(user_id=pk)  # Lọc playlist theo user_id
        if playlists.exists():
            serializer = PlaylistSerializer(playlists, many=True)
            return custom_response(dt=serializer.data, em="Playlists retrieved successfully for user")
        else:
            return custom_response(ec=1, em="No playlists found for this user", dt=None)