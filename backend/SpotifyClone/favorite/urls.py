from django.urls import path
from .views import (
    FavoriteAlbumView, 
    FavoriteAlbumListView, 
    FavoriteAlbumByUserView, 
    FavoriteAlbumCountView,
    FavoriteSongListCreateView,
    FavoriteSongByUserView,
    FavoriteSongBySongView,
)

urlpatterns = [
    path('favorite-album/', FavoriteAlbumView.as_view(), name='favorite-album'),  # POST & DELETE
    path('favorite-album/list/', FavoriteAlbumListView.as_view(), name='favorite-album-list'),  # GET
    path('favorite-album/user/', FavoriteAlbumByUserView.as_view(), name='favorite-album-by-user'),  # GET
    path('favorite-album/count/', FavoriteAlbumCountView.as_view(), name='favorite-album-count'),  # GET
    path("favorites/songs/", FavoriteSongListCreateView.as_view(), name="favorite-song-list-create"),
    path("favorites/songs/user/<int:user_id>/", FavoriteSongByUserView.as_view(), name="favorite-song-by-user"),
    path("favorites/songs/song/<int:song_id>/", FavoriteSongBySongView.as_view(), name="favorite-song-by-song"),
]
