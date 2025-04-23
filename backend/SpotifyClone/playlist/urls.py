from django.urls import path
from .views import (
    PlaylistListCreateView, PlaylistDetailView,
    PlaylistSongListCreateView, PlaylistSongDetailView,
    CollectionListCreateView, CollectionDetailView,
    CollectionSongListCreateView, CollectionSongDetailView, PlaylistByUserView,PlaylistSongByPlaylistView
)

urlpatterns = [
    path('playlists/', PlaylistListCreateView.as_view(), name='playlist-list-create'),
    path('playlists/<int:pk>/', PlaylistDetailView.as_view(), name='playlist-detail'),
    path('playlist-songs/', PlaylistSongListCreateView.as_view(), name='playlist-song-list-create'),
    path('playlist-songs/<int:pk>/', PlaylistSongDetailView.as_view(), name='playlist-song-detail'),
    path('playlist-songs/playlist/<int:pk>/', PlaylistSongByPlaylistView.as_view(), name='playlist-song-by-user'),
    path('playlists/user/<int:pk>/', PlaylistByUserView.as_view(), name='playlists-by-user'),
    path('collections/', CollectionListCreateView.as_view(), name='collection-list-create'),
    path('collections/<int:pk>/', CollectionDetailView.as_view(), name='collection-detail'),
    path('collection-songs/', CollectionSongListCreateView.as_view(), name='collection-song-list-create'),
    path('collection-songs/<int:pk>/', CollectionSongDetailView.as_view(), name='collection-song-detail'),
]