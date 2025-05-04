from django.urls import path
from .views import (
    GenreListCreateView, GenreDetailView,
    ArtistListCreateView, ArtistDetailView, FollowArtistView,
    AlbumListCreateView, AlbumDetailView,
    SongListCreateView, SongDetailView, IncreasePlayCountView,
    SongRecommendationListView,
    ArtistAlbumsView,
    TopSongsView,
    ListeningHistoryListCreateView, ListeningHistoryDetailView,
    SmartSearchSongView, GenreSearchView, GenreGetByIDView,
    AlbumSearchByNameView, AlbumGetByIdView,
    ArtistSearchByNameView, ArtistSearchByIdView,
    AlbumSongsView, ArtistSongsView, SongSearchView, TopArtistsByPlayCountView,TopSongsViewX
)

urlpatterns = [
    # Genre URLs
    path('genres/', GenreListCreateView.as_view(), name='genre-list-create'),
    path('genres/<int:pk>/', GenreDetailView.as_view(), name='genre-detail'),
    path('genres/search/', GenreSearchView.as_view(), name='genre-search'),
    path('genres/<int:pk>/get/', GenreGetByIDView.as_view(), name='genre-get-by-id'), 

    # Artist URLs
    path('artists/', ArtistListCreateView.as_view(), name='artist-list-create'),
    path('artists/<int:pk>/', ArtistDetailView.as_view(), name='artist-detail'),
    path('artists/<int:artist_id>/follow/', FollowArtistView.as_view(), name='artist-follow'),
    path('artists/<int:artist_id>/songs/', ArtistSongsView.as_view(), name='artist-songs'),
    path('artists/<int:artist_id>/albums/', ArtistAlbumsView.as_view(), name='artist-albums'),
    path('artists/search/', ArtistSearchByNameView.as_view(), name='artist-search-by-name'),
    path('artists/<int:pk>/search-by-id/', ArtistSearchByIdView.as_view(), name='artist-search-by-id'),  

    # Album URLs
    path('albums/', AlbumListCreateView.as_view(), name='album-list-create'),
    path('albums/<int:pk>/', AlbumDetailView.as_view(), name='album-detail'),
    path('albums/<int:pk>/get/', AlbumGetByIdView.as_view(), name='album-get-by-id'), 
    path('albums/search/', AlbumSearchByNameView.as_view(), name='album-search-by-name'),
    path('albums/<int:album_id>/songs/', AlbumSongsView.as_view(), name='album-songs'),

    # Song URLs
    path('songs/', SongListCreateView.as_view(), name='song-list-create'),
    path('songs/top', TopSongsView.as_view(), name='top-songs'),
    path('songs/<int:pk>/', SongDetailView.as_view(), name='song-detail'),
    path('songs/<int:song_id>/play/', IncreasePlayCountView.as_view(), name='increase-play-count'),
    path('songs/search/', SongSearchView.as_view(), name='search-songs'),
    path('songs/smart-search/', SmartSearchSongView.as_view(), name='smart-search-songs'),
    path("artists/top/", TopArtistsByPlayCountView.as_view(), name="top-artists-by-playcount"),
    path('songs/top/', TopSongsViewX.as_view(), name='top-songs'),

    # Song Recommendation URLs
    path('recommendations/', SongRecommendationListView.as_view(), name='song-recommendations'),

    # Listening History URLs
    path('listening-history/', ListeningHistoryListCreateView.as_view(), name='listening-history-list-create'),
    path('listening-history/<int:pk>/', ListeningHistoryDetailView.as_view(), name='listening-history-detail'),
]
