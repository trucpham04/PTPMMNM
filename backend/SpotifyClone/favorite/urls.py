from django.urls import path
from .views import (
    FavoriteAlbumView, 
    FavoriteAlbumListView, 
    FavoriteAlbumByUserView, 
    FavoriteAlbumCountView,
    FavoriteSongListCreateView,
    FavoriteSongByUserView,
    FavoriteSongBySongView,
    SearchFavoriteAlbumByNameView,
    FavoriteAlbumGetByIdView,
    IsSongFavoritedView,
    IsAlbumFavoritedView
)

urlpatterns = [
    path('favorites/album/', FavoriteAlbumView.as_view(), name='favorite-album'),  # POST & DELETE
    path('favorites/album/list/', FavoriteAlbumListView.as_view(), name='favorite-album-list'),  # GET
    # path('favorite-album/user/', FavoriteAlbumByUserView.as_view(), name='favorite-album-by-user'),  # GET
    path('favorites/album/user/<int:user_id>/', FavoriteAlbumByUserView.as_view(), name='favorite-album-by-user'),
    path("favorites/album/user/<int:user_id>/album/<int:album_id>", IsAlbumFavoritedView.as_view(), name="favorite-song-by-user"),
    path('favorites/album/count/', FavoriteAlbumCountView.as_view(), name='favorite-album-count'),  # GET
    path('favorites/albums/search/', SearchFavoriteAlbumByNameView.as_view(), name='search-favorite-album-by-name'),
    path('favorites/albums/<int:pk>/', FavoriteAlbumGetByIdView.as_view(), name='get-favorite-album-by-id'),

    path("favorites/songs/", FavoriteSongListCreateView.as_view(), name="favorite-song-list-create"),
    path("favorites/songs/user/<int:user_id>/", FavoriteSongByUserView.as_view(), name="favorite-song-by-user"),
    path("favorites/songs/user/<int:user_id>/song/<int:song_id>", IsSongFavoritedView.as_view(), name="favorite-song-by-user"),
    path("favorites/songs/song/<int:song_id>/", FavoriteSongBySongView.as_view(), name="favorite-song-by-song"),
]
