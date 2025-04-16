from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Genre, Artist, ArtistFollow, Album, Song, SongRecommendation, ListeningHistory
from .serializers import (
    GenreSerializer, ArtistSerializer, AlbumSerializer, SongSerializer, 
    SongRecommendationSerializer, ListeningHistorySerializer, UserLibrarySerializer
)
from core.views import BaseListCreateView, BaseRetrieveUpdateDestroyView

def custom_response(ec=0, em="Success", dt=None):
    return Response({"EC": ec, "EM": em, "DT": dt}, status=status.HTTP_200_OK if ec == 0 else status.HTTP_400_BAD_REQUEST)

# -------------------- GENRE API --------------------
class GenreListCreateView(BaseListCreateView):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer

class GenreDetailView(BaseRetrieveUpdateDestroyView):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer

# -------------------- ARTIST API --------------------
class ArtistListCreateView(BaseListCreateView):
    queryset = Artist.objects.all()
    serializer_class = ArtistSerializer
    permission_classes = [permissions.AllowAny]

class ArtistDetailView(BaseRetrieveUpdateDestroyView):
    queryset = Artist.objects.all()
    serializer_class = ArtistSerializer
    permission_classes = [permissions.AllowAny]

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

# -------------------- ALBUM API --------------------
class AlbumListCreateView(BaseListCreateView):
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer
    permission_classes = [permissions.AllowAny]

class AlbumDetailView(BaseRetrieveUpdateDestroyView):
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer
    permission_classes = [permissions.AllowAny]

class SaveAlbumToLibraryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, album_id):
        try:
            album = Album.objects.get(id=album_id)
            if UserLibrary.objects.filter(user=request.user, album=album).exists():
                return Response({"EC": 1, "EM": "Album already in library", "DT": None}, status=400)
            saved = UserLibrary.objects.create(user=request.user, album=album)
            return Response({"EC": 0, "EM": "Album saved successfully", "DT": UserLibrarySerializer(saved).data}, status=201)
        except Album.DoesNotExist:
            return Response({"EC": 2, "EM": "Album not found", "DT": None}, status=404)

    def delete(self, request, album_id):
        try:
            album = Album.objects.get(id=album_id)
            saved = UserLibrary.objects.filter(user=request.user, album=album)
            if saved.exists():
                saved.delete()
                return Response({"EC": 0, "EM": "Album removed from library", "DT": None}, status=200)
            return Response({"EC": 1, "EM": "Album not in library", "DT": None}, status=400)
        except Album.DoesNotExist:
            return Response({"EC": 2, "EM": "Album not found", "DT": None}, status=404)
        
class UserLibraryListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        albums = UserLibrary.objects.filter(user=request.user)
        serialized = UserLibrarySerializer(albums, many=True)
        return Response({"EC": 0, "EM": "Fetched saved albums", "DT": serialized.data}, status=200)

# -------------------- SONG API --------------------
class SongListCreateView(BaseListCreateView):
    queryset = Song.objects.all()
    serializer_class = SongSerializer
    permission_classes = [permissions.AllowAny]

class SongDetailView(BaseRetrieveUpdateDestroyView):
    queryset = Song.objects.all()
    serializer_class = SongSerializer
    permission_classes = [permissions.AllowAny]

class IncreasePlayCountView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, song_id):
        song = get_object_or_404(Song, id=song_id)
        song.play_count += 1
        song.save()
        return custom_response(em="Play count updated!", dt={"play_count": song.play_count})

# -------------------- SONG RECOMMENDATION --------------------
class SongRecommendationListView(BaseListCreateView):
    serializer_class = SongRecommendationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SongRecommendation.objects.filter(user=self.request.user)

# -------------------- LISTENING HISTORY --------------------
class ListeningHistoryListCreateView(BaseListCreateView):
    serializer_class = ListeningHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ListeningHistory.objects.filter(user=self.request.user)

class ListeningHistoryDetailView(BaseRetrieveUpdateDestroyView):
    queryset = ListeningHistory.objects.all()
    serializer_class = ListeningHistorySerializer
    permission_classes = [permissions.IsAuthenticated]
