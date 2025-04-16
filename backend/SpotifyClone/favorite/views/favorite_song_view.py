from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from ..models import FavoriteSong
from ..serializers.favorite_song_serializer import FavoriteSongSerializer
from utils.custom_response import custom_response
from music.models import Song
from user.models import User

class FavoriteSongListCreateView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        favorites = FavoriteSong.objects.all()
        serializer = FavoriteSongSerializer(favorites, many=True)
        return custom_response(em="Fetched favorite songs", dt=serializer.data)

    def post(self, request):
        serializer = FavoriteSongSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return custom_response(em="Favorite song added", dt=serializer.data)
        return custom_response(ec=1, em="Validation failed", dt=serializer.errors)


class FavoriteSongByUserView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, user_id):
        favorites = FavoriteSong.objects.filter(user__id=user_id)
        serializer = FavoriteSongSerializer(favorites, many=True)
        return custom_response(em=f"Fetched favorite songs of user {user_id}", dt=serializer.data)


class FavoriteSongBySongView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, song_id):
        count = FavoriteSong.objects.filter(song__id=song_id).count()
        return custom_response(em=f"Song {song_id} is favorited by {count} users", dt={"song_id": song_id, "favorite_count": count})
