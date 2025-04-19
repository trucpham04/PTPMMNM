from rest_framework import permissions
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from ..models import Album, Song
from ..serializers.album_serializer import AlbumSerializer
from ..serializers.song_serializer import SongSerializer
from core.views import BaseListCreateView, BaseRetrieveUpdateDestroyView
from utils.custom_response import custom_response


# -------------------- ALBUM API --------------------
class AlbumListCreateView(BaseListCreateView):
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return custom_response(em="Fetched album list", dt=serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return custom_response(em="Album created successfully", dt=serializer.data)
        return custom_response(ec=1, em="Validation failed", dt=serializer.errors)


class AlbumDetailView(BaseRetrieveUpdateDestroyView):
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer
    permission_classes = [permissions.AllowAny]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return custom_response(em="Fetched album detail", dt=serializer.data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return custom_response(em="Album updated successfully", dt=serializer.data)
        return custom_response(ec=1, em="Validation failed", dt=serializer.errors)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return custom_response(em="Album deleted successfully")

class AlbumGetByIdView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        album = get_object_or_404(Album, pk=pk)
        serializer = AlbumSerializer(album)
        return custom_response(em="Fetched album by ID", dt=serializer.data)
class AlbumSearchByNameView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        title = request.data.get("title")
        if not title:
            return custom_response(ec=1, em="Missing album title")
        
        # Sử dụng 'title' thay vì 'name' để tìm kiếm
        albums = Album.objects.filter(title__icontains=title)
        
        if not albums.exists():
            return custom_response(ec=1, em="No albums found matching the title")

        serializer = AlbumSerializer(albums, many=True)
        return custom_response(em="Fetched albums by title", dt=serializer.data)


class AlbumSongsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, album_id):
        album = get_object_or_404(Album, pk=album_id)
        songs = Song.objects.filter(album=album)
        serializer = SongSerializer(songs, many=True)
        song_data = serializer.data
        
        for song in song_data:
            song['album'] = {
                "id": album.id,
                "title": album.title
            }

        return custom_response(em="Fetched songs in album", dt=song_data)

