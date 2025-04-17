import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Icon from "@/components/ui/icon";
import AlbumHeader from "@/components/details/header";
import { useMusicVideo } from "@/hooks/old/use-music-video";
import { VideoPlayer } from "@/components/player/video-player";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import usePlayer from "@/hooks/usePlayer";
import { useAlbum, useArtist, useSong } from "@/hooks";

export default function TrackPage() {
  const { song_id } = useParams<{ song_id: string }>();
  const songId = parseInt(song_id || "0");

  const { song, loading: songLoading, error: songError } = useSong();
  const { play, currentSong, isPlaying, togglePlay } = usePlayer();
  const {
    mvData,
    loading: mvLoading,
    error: mvError,
    downloadMV,
  } = useMusicVideo(songId);

  // Load album and artist data if song is loaded
  const albumId = song?.album_id ? song.album_id : 0;
  const artistId = song?.artist_id ? song.artist_id : 0;
  const { album, loading: albumLoading } = useAlbum();
  const { artist, loading: artistLoading } = useArtist();

  // Overall loading state
  const loading = songLoading || (song && (albumLoading || artistLoading));

  // Tab state
  const [activeTab, setActiveTab] = useState<string>("details");

  const handlePlayToggle = () => {
    if (currentSong?.id === song?.id) {
      togglePlay();
    } else if (song) {
      play(song);
    }
  };

  const handleDownload = () => {
    if (mvData) {
      downloadMV(songId);
    }
  };

  if (loading) {
    return (
      <div className="container space-y-8">
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

  // const dateAdded = new Date(song.release_date).toLocaleDateString("en-US", {
  //   year: "numeric",
  //   month: "long",
  //   day: "numeric",
  // });

  const dateAdded = song.release_date;

  return (
    <div className="container space-y-8">
      <AlbumHeader
        cover_url={song.album?.cover_image}
        type="Song"
        title={song.title}
        author_name={song.artist?.name}
        author_type="artist"
        author_id={song.artist_id}
        subtitle={`Duration: ${song.duration}`}
      />

      <div className="flex items-center gap-4 px-[max(2%,16px)]">
        <Button
          size="lg"
          className="flex items-center gap-2 rounded-full"
          onClick={handlePlayToggle}
        >
          <Icon size="md">
            {currentSong?.id === song.id && isPlaying ? "pause" : "play_arrow"}
          </Icon>
          {currentSong?.id === song.id && isPlaying ? "Pause" : "Play"}
        </Button>

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
                    <span>{song.duration}</span>
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
                        By {album.artist?.name} • {album.songs?.length || 0}{" "}
                        songs
                      </div>
                    </div>
                  </Link>

                  {artist && artist.genres && artist.genres.length > 0 && (
                    <div className="mt-8">
                      <h2 className="mb-2 text-xl font-semibold">Genres</h2>
                      <div className="flex flex-wrap gap-2">
                        {artist.genres.map((genre) => (
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

          {song.video_file && (
            <TabsContent value="mv" className="space-y-8">
              {mvLoading ? (
                <div className="bg-muted flex aspect-video items-center justify-center rounded-md">
                  <div className="flex flex-col items-center">
                    <Icon size="xl" className="animate-spin">
                      autorenew
                    </Icon>
                    <p className="mt-2">Loading music video...</p>
                  </div>
                </div>
              ) : mvError || !mvData ? (
                <div className="bg-muted flex aspect-video items-center justify-center rounded-md">
                  <div className="flex flex-col items-center text-center">
                    <Icon size="xl" className="text-muted-foreground">
                      error_outline
                    </Icon>
                    <p className="mt-2">Could not load music video</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setActiveTab("details")}
                    >
                      Back to Track Details
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <VideoPlayer
                    src={mvData.stream_url}
                    poster={mvData.thumbnail}
                    title={`${mvData.artist} - ${mvData.title}`}
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
                    <p className="text-muted-foreground mt-4">
                      Last updated by{" "}
                      <span className="font-medium">trucpham04</span> on
                      2025-04-04 16:52:22.
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
