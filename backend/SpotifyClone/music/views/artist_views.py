from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from ..models import Artist, ArtistFollow, Song
from ..serializers.artist_serializer import ArtistSerializer
from ..serializers.album_serializer import AlbumSerializer
from ..serializers.song_serializer import SongSerializer
from core.views import BaseListCreateView, BaseRetrieveUpdateDestroyView
from utils.custom_response import custom_response

# -------------------- ARTIST API --------------------
class ArtistListCreateView(BaseListCreateView):
    queryset = Artist.objects.all()
    serializer_class = ArtistSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return custom_response(ec=0, em="Fetched artists successfully", dt=serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return custom_response(ec=0, em="Artist created successfully", dt=serializer.data)


class ArtistDetailView(BaseRetrieveUpdateDestroyView):
    queryset = Artist.objects.all()
    serializer_class = ArtistSerializer
    permission_classes = [permissions.AllowAny]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return custom_response(ec=0, em="Fetched artist detail", dt=serializer.data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return custom_response(ec=0, em="Artist updated successfully", dt=serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return custom_response(ec=0, em="Artist deleted successfully")


class FollowArtistView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, artist_id):
        artist = get_object_or_404(Artist, id=artist_id)
        if ArtistFollow.objects.filter(user=request.user, artist=artist).exists():
            return custom_response(ec=1, em="You already followed this artist!")
        ArtistFollow.objects.create(user=request.user, artist=artist)
        return custom_response(em="Followed successfully!")

    def delete(self, request, artist_id):
        artist = get_object_or_404(Artist, id=artist_id)
        follow = ArtistFollow.objects.filter(user=request.user, artist=artist)
        if follow.exists():
            follow.delete()
            return custom_response(em="Unfollowed successfully!")
        return custom_response(ec=1, em="You have not followed this artist!")

class ArtistSongsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, artist_id):
        artist = get_object_or_404(Artist, pk=artist_id)
        songs = Song.objects.filter(artist=artist)
        serializer = SongSerializer(songs, many=True)
        return custom_response(em=f"Fetched songs by artist {artist.name}", dt=serializer.data)
    

class ArtistAlbumsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, artist_id):
        artist = get_object_or_404(Artist, pk=artist_id)
        albums = artist.albums.all()
        serializer = AlbumSerializer(albums, many=True)
        return custom_response(em=f"Fetched albums by artist {artist.name}", dt=serializer.data)