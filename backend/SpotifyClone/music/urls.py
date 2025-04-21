from django.urls import path
from .views import (
    GenreListCreateView, GenreDetailView,
    ArtistListCreateView, ArtistDetailView, FollowArtistView,
    AlbumListCreateView, AlbumDetailView,
    SongListCreateView, SongDetailView, IncreasePlayCountView,
    SongRecommendationListView,
    ListeningHistoryListCreateView, ListeningHistoryDetailView,SmartSearchSongView, AlbumSongsView, ArtistSongsView, ArtistAlbumsView
)

urlpatterns = [
    # Genre URLs
    path('genres/', GenreListCreateView.as_view(), name='genre-list-create'),
    path('genres/<int:pk>/', GenreDetailView.as_view(), name='genre-detail'),

    # Artist URLs
    path('artists/', ArtistListCreateView.as_view(), name='artist-list-create'),
    path('artists/<int:pk>/', ArtistDetailView.as_view(), name='artist-detail'),
    path('artists/<int:artist_id>/follow/', FollowArtistView.as_view(), name='artist-follow'),
    path('artists/<int:artist_id>/songs/', ArtistSongsView.as_view(), name='artist-songs'),
    path('artists/<int:artist_id>/albums/', ArtistAlbumsView.as_view(), name='artist-albums'),

    # Album URLs
    path('albums/', AlbumListCreateView.as_view(), name='album-list-create'),
    path('albums/<int:pk>/', AlbumDetailView.as_view(), name='album-detail'),
    path('albums/<int:album_id>/songs/', AlbumSongsView.as_view(), name='album-songs'),

    # Song URLs
    path('songs/', SongListCreateView.as_view(), name='song-list-create'),
    path('songs/<int:pk>/', SongDetailView.as_view(), name='song-detail'),
    path('songs/<int:song_id>/play/', IncreasePlayCountView.as_view(), name='increase-play-count'),
    path('songs/search/', SmartSearchSongView.as_view(), name='search-songs'),
    # Song Recommendation URLs
    path('recommendations/', SongRecommendationListView.as_view(), name='song-recommendations'),

    # Listening History URLs
    path('listening-history/', ListeningHistoryListCreateView.as_view(), name='listening-history-list-create'),
    path('listening-history/<int:pk>/', ListeningHistoryDetailView.as_view(), name='listening-history-detail'),
]
