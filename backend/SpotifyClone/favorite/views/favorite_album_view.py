from rest_framework import permissions
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from ..models import FavoriteAlbum
from music.models import Album
from ..serializers.favorite_album_serializer import FavoriteAlbumSerializer
from music.serializers.album_serializer import AlbumSerializer
from utils.custom_response import custom_response
from user.models import User
from rapidfuzz import fuzz
class FavoriteAlbumView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        # Nhận dữ liệu từ body
        user_id = request.data.get("user_id")
        album_id = request.data.get("album_id")

        if not user_id or not album_id:
            return custom_response(ec=1, em="Missing user_id or album_id")

        album = get_object_or_404(Album, id=album_id)
        user = get_object_or_404(User, id=user_id)

        # Kiểm tra nếu album đã được yêu thích
        if FavoriteAlbum.objects.filter(user=user, album=album).exists():
            return custom_response(ec=1, em="Album already favorited")

        favorite = FavoriteAlbum.objects.create(user=user, album=album)
        serializer = FavoriteAlbumSerializer(favorite)
        return custom_response(em="Album favorited successfully", dt=serializer.data)

    def delete(self, request):
        # Nhận dữ liệu từ body
        user_id = request.data.get("user_id")
        album_id = request.data.get("album_id")

        if not user_id or not album_id:
            return custom_response(ec=1, em="Missing user_id or album_id")

        album = get_object_or_404(Album, id=album_id)
        user = get_object_or_404(User, id=user_id)

        favorite = FavoriteAlbum.objects.filter(user=user, album=album)
        if favorite.exists():
            favorite.delete()
            return custom_response(em="Album unfavorited successfully")

        return custom_response(ec=1, em="Album not in favorites")



class FavoriteAlbumListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        # Nhận user_id từ body
        user_id = request.data.get("user_id")

        if not user_id:
            return custom_response(ec=1, em="Missing user_id")

        # Lọc các album yêu thích của người dùng
        favorites = FavoriteAlbum.objects.filter(user__id=user_id)
        
        # Lấy các album tương ứng với những favorite album
        albums = [favorite.album for favorite in favorites]

        # Serialize các album
        serializer = AlbumSerializer(albums, many=True)

        return custom_response(em="Fetched favorite albums", dt=serializer.data)
class FavoriteAlbumByUserView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        # Nhận user_id từ body
        user_id = request.data.get("user_id")

        if not user_id:
            return custom_response(ec=1, em="Missing user_id")

        favorites = FavoriteAlbum.objects.filter(user__id=user_id)
        serializer = FavoriteAlbumSerializer(favorites, many=True)
        return custom_response(em="Fetched albums favorited by user", dt=serializer.data)

class FavoriteAlbumCountView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        # Nhận album_id từ body
        album_id = request.data.get("album_id")

        if not album_id:
            return custom_response(ec=1, em="Missing album_id")

        count = FavoriteAlbum.objects.filter(album__id=album_id).count()
        return custom_response(em="Fetched favorite count", dt={"album_id": album_id, "favorite_count": count})
class SearchFavoriteAlbumByNameView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        user_id = request.data.get("user_id")
        query = request.data.get("query", "").strip()

        if not user_id or not query:
            return custom_response(ec=1, em="Missing user_id or query")

        favorites = FavoriteAlbum.objects.filter(user__id=user_id)
        matched_albums = []

        for fav in favorites:
            album = fav.album
            if fuzz.partial_ratio(query.lower(), album.title.lower()) > 70:
                matched_albums.append(album)

        serializer = AlbumSerializer(matched_albums, many=True)
        return custom_response(em="Fetched matched favorite albums", dt=serializer.data)
class FavoriteAlbumGetByIdView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        favorite = get_object_or_404(FavoriteAlbum, id=pk)
        album = favorite.album
        serializer = AlbumSerializer(album)
        return custom_response(em="Fetched favorite album by ID", dt=serializer.data)