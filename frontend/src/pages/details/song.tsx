import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Icon from "@/components/ui/icon";
import AlbumHeader from "@/components/details/header";
import { VideoPlayer } from "@/components/player/video-player";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePlayer } from "@/contexts/playerContext";
import {
  useAlbum,
  useArtist,
  useFavorite,
  usePlaylist,
  useSong,
} from "@/hooks";
import { useAuth } from "@/contexts/authContext";
import { formatTime } from "@/utils/format-time";
import { useFavoriteContext } from "@/contexts/favoriteContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Playlist } from "@/types";

export default function TrackPage() {
  const { user } = useAuth();
  const { song_id } = useParams<{ song_id: string }>();
  const songId = parseInt(song_id || "0");
  const {
    song,
    loading: songLoading,
    error: songError,
    getSongById,
    downloadMusicVideo,
  } = useSong();

  const { play, currentSong, isPlaying, togglePlay, addSongToQueue } =
    usePlayer();

  const {
    isFavorited,
    getIsSongFavorited,
    addSongToFavorites,
    removeSongFromFavorites,
  } = useFavorite();

  const { addSongToPlaylist } = usePlaylist();
  const { userPlaylists } = useFavoriteContext();

  const [selectedPlaylists, setSelectedPlaylists] = useState<number[]>([]);
  const [isPlaylistSelectDropdownOpen, setIsPlaylistSelectDropdownOpen] =
    useState(false);

  const handleAddSongToQueue = () => {
    if (!song) {
      console.warn("No song available to add to queue");
      return;
    }
    const isCurrentSong = currentSong?.id === song.id;
    if (!isCurrentSong) {
      song.isSingleQueue = true;
      addSongToQueue(song);
      toast.success(`Added "${song.title}" to queue`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const songData = await getSongById(songId);
      if (songData) {
        if (songData.album?.id) getAlbumById(songData.album.id);
        if (songData.artist?.id) getArtistById(songData.artist.id);
        if (user?.id) {
          getIsSongFavorited(user.id, songId);
        }
      }
    };

    fetchData();
  }, [songId, user?.id]);

  const { album, loading: albumLoading, getAlbumById } = useAlbum();
  const { loading: artistLoading, getArtistById } = useArtist();

  const loading = songLoading || (song && (albumLoading || artistLoading));

  const [activeTab, setActiveTab] = useState<string>("details");

  const handlePlayToggle = () => {
    if (currentSong?.id === song?.id) {
      togglePlay();
    } else if (song) {
      play(song);
    }
  };

  const handleDownload = () => {
    if (!song?.video_file) return;
    downloadMusicVideo(song?.video_file, song?.title);
  };

  const handleToggleFavorite = async () => {
    if (!user?.id) {
      console.warn("User not logged in");
      return;
    }
    if (isFavorited) {
      removeSongFromFavorites(user.id, songId);
    } else {
      addSongToFavorites(user.id, songId);
    }
  };

  const handlePlaylistCheckboxChange = (playlistId: number) => {
    setSelectedPlaylists((prev) => {
      if (prev.includes(playlistId)) {
        return prev.filter((id) => id !== playlistId);
      } else {
        return [...prev, playlistId];
      }
    });
  };

  const handleAddToPlaylists = async () => {
    if (!user?.id || !song) {
      return;
    }

    try {
      for (const playlistId of selectedPlaylists) {
        await addSongToPlaylist({ playlist: playlistId, song_id: songId });
      }

      if (selectedPlaylists.length > 0) {
        toast.success(
          `Added "${song.title}" to ${selectedPlaylists.length} playlist${selectedPlaylists.length > 1 ? "s" : ""}`,
        );
        setSelectedPlaylists([]);
      }
    } catch (error) {
      console.error("Error adding song to playlists:", error);
      toast.error("Failed to add song to playlists");
    } finally {
      setIsPlaylistSelectDropdownOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Skeleton for Header */}
        <div className="bg-muted flex aspect-[4] max-h-80 w-full items-end gap-4 px-[max(2%,16px)] pt-12 pb-[max(2%,16px)]">
          <Skeleton className="aspect-square w-1/5 max-w-64 min-w-32 rounded-md" />
          <div className="w-full space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-16 w-3/4" />
            <Skeleton className="h-6 w-40" />
          </div>
        </div>

        {/* Skeleton for Actions */}
        <div className="flex items-center gap-4 px-[max(2%,16px)]">
          <Skeleton className="h-12 w-24 rounded-full" />
        </div>

        {/* Skeleton for Details */}
        <div className="space-y-6 px-[max(2%,16px)]">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (songError || !song) {
    return (
      <div className="container px-[max(2%,16px)] py-8">
        <div className="flex flex-col items-center justify-center py-12">
          <Icon size="xl" className="text-muted-foreground mb-4">
            error_outline
          </Icon>
          <h1 className="text-2xl font-semibold">Error loading song</h1>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    );
  }

  const dateAdded = song.release_date;

  return (
    <div className="container space-y-8">
      <AlbumHeader
        cover_url={song.album?.cover_image}
        type="Song"
        title={song.title}
        author_name={song.artist?.name}
        author_type="artist"
        author_id={song.artist?.id}
      />

      <div className="flex items-center gap-4 px-[max(2%,16px)]">
        <Button
          size="lg"
          className="flex cursor-pointer items-center gap-2 rounded-full"
          onClick={handlePlayToggle}
        >
          <Icon size="md">
            {currentSong?.id === song.id && isPlaying ? "pause" : "play_arrow"}
          </Icon>
          {currentSong?.id === song.id && isPlaying ? "Pause" : "Play"}
        </Button>

        <Button
          size="lg"
          className="flex cursor-pointer items-center gap-2 rounded-full"
          onClick={handleAddSongToQueue}
        >
          <Icon size="md">add_to_queue</Icon>
          Add to Queue
        </Button>

        <DropdownMenu
          open={isPlaylistSelectDropdownOpen}
          onOpenChange={setIsPlaylistSelectDropdownOpen}
        >
          <DropdownMenuTrigger>
            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2 rounded-full"
              disabled={!user || userPlaylists.length === 0}
            >
              <Icon size="md">playlist_add</Icon>
              Add to Playlist
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {!user ? (
              <DropdownMenuItem className="text-muted-foreground">
                Log in to add to playlists
              </DropdownMenuItem>
            ) : userPlaylists.length === 0 ? (
              <DropdownMenuItem className="text-muted-foreground">
                No playlists available
              </DropdownMenuItem>
            ) : (
              <>
                <div className="px-2 py-1.5 text-sm font-semibold">
                  Select playlists
                </div>
                <ScrollArea className="max-h-80">
                  <div className="space-y-1 p-2">
                    {userPlaylists.map((playlist: Playlist) => (
                      <div
                        key={playlist.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`playlist-${playlist.id}`}
                          checked={selectedPlaylists.includes(playlist.id)}
                          onCheckedChange={() =>
                            handlePlaylistCheckboxChange(playlist.id)
                          }
                        />
                        <label
                          htmlFor={`playlist-${playlist.id}`}
                          className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {playlist.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <DropdownMenuSeparator />
                <div className="p-2">
                  <Button
                    size="sm"
                    className="w-full"
                    disabled={selectedPlaylists.length === 0}
                    onClick={handleAddToPlaylists}
                  >
                    Add to Selected ({selectedPlaylists.length})
                  </Button>
                </div>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {song.video_file && (
          <Button
            variant="outline"
            size="lg"
            className="flex items-center gap-2 rounded-full"
            onClick={() => setActiveTab("mv")}
          >
            <Icon size="md">smart_display</Icon>
            Watch MV
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="size-12 cursor-pointer rounded-full"
          onClick={handleToggleFavorite}
        >
          {isFavorited ? (
            <Icon size="md" className="fill text-green-500">
              favorite
            </Icon>
          ) : (
            <Icon size="md">favorite_border</Icon>
          )}
        </Button>
      </div>

      <div className="px-[max(2%,16px)] pb-16">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="details">Track Details</TabsTrigger>
            {song.video_file && (
              <TabsTrigger value="mv">Music Video</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="details" className="space-y-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Track Details</h2>
                <div className="space-y-2">
                  <div className="flex justify-between border-b py-2">
                    <span className="text-muted-foreground">Added on</span>
                    <span>{dateAdded}</span>
                  </div>
                  <div className="flex justify-between border-b py-2">
                    <span className="text-muted-foreground">Duration</span>
                    <span>{formatTime(parseInt(song.duration))}</span>
                  </div>
                  {song.album?.title && song.album_id && (
                    <div className="flex justify-between border-b py-2">
                      <span className="text-muted-foreground">Album</span>
                      <Link
                        to={`/album/${song.album_id}`}
                        className="hover:underline"
                      >
                        {song.album.title}
                      </Link>
                    </div>
                  )}
                  <div className="flex justify-between border-b py-2">
                    <span className="text-muted-foreground">Artist</span>
                    <Link
                      to={`/artist/${song.artist_id}`}
                      className="hover:underline"
                    >
                      {song.artist?.name}
                    </Link>
                  </div>
                  {song.video_file && (
                    <div className="flex justify-between border-b py-2">
                      <span className="text-muted-foreground">Music Video</span>
                      <span>Available</span>
                    </div>
                  )}
                </div>
              </div>

              {album && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">From the Album</h2>
                  <Link
                    to={`/album/${album.id}`}
                    className="hover:bg-accent flex items-center gap-4 rounded-md p-2"
                  >
                    <img
                      src={album.cover_image}
                      alt={album.title}
                      className="h-20 w-20 rounded-md object-cover"
                    />
                    <div>
                      <div className="font-medium">{album.title}</div>
                      <div className="text-muted-foreground text-sm">
                        By {album.artist?.name} • {album.songs_count || 0} songs
                      </div>
                    </div>
                  </Link>

                  {song && song.genres && song.genres.length > 0 && (
                    <div className="mt-8">
                      <h2 className="mb-2 text-xl font-semibold">Genres</h2>
                      <div className="flex flex-wrap gap-2">
                        {song.genres.map((genre) => (
                          <div
                            key={genre.id}
                            className="bg-accent rounded-full px-3 py-1 text-sm"
                          >
                            {genre.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          {song.video_file ? (
            <TabsContent value="mv" className="space-y-8">
              <div className="space-y-4">
                <VideoPlayer
                  src={song.video_file}
                  poster={song.album?.cover_image}
                  title={`${song.artist?.name} - ${song.title}`}
                />

                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={handleDownload}
                    className="flex items-center gap-2"
                  >
                    <Icon size="sm">download</Icon>
                    Download MV
                  </Button>
                </div>

                <div className="mt-8">
                  <h2 className="mb-4 text-xl font-semibold">
                    About this Music Video
                  </h2>
                  <p className="text-muted-foreground">
                    Official music video for "{song.title}" by{" "}
                    {song.artist?.name}. This music video was added to our
                    platform on {dateAdded} and is available for streaming and
                    download.
                  </p>
                </div>
              </div>
            </TabsContent>
          ) : (
            ""
          )}
        </Tabs>
      </div>
    </div>
  );
}
