import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTrack } from "@/hooks/use-tracks";
import { useAlbum } from "@/hooks/use-albums";
import { useArtist } from "@/hooks/use-artists";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Icon from "@/components/ui/icon";
import AlbumHeader from "@/components/details/header";
import { usePlayer } from "@/hooks/use-player";
import { useMusicVideo } from "@/hooks/use-music-video";
import { VideoPlayer } from "@/components/player/video-player";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TrackPage() {
  const { track_id } = useParams<{ track_id: string }>();
  const trackId = parseInt(track_id || "0");

  const { track, loading: trackLoading, error: trackError } = useTrack(trackId);
  const { play, currentTrack, isPlaying, togglePlay } = usePlayer();
  const {
    mvData,
    loading: mvLoading,
    error: mvError,
    downloadMV,
  } = useMusicVideo(trackId);

  // Load album and artist data if track is loaded
  const albumId = track?.albumID ? track.albumID : 0;
  const artistId = track?.artistID ? track.artistID : 0;
  const { album, loading: albumLoading } = useAlbum(albumId);
  const { artist, loading: artistLoading } = useArtist(artistId);

  // Overall loading state
  const loading = trackLoading || (track && (albumLoading || artistLoading));

  // Tab state
  const [activeTab, setActiveTab] = useState<string>("details");

  const handlePlayToggle = () => {
    if (currentTrack?.id === track?.id) {
      togglePlay();
    } else if (track) {
      play(track);
    }
  };

  const handleDownload = () => {
    if (mvData) {
      downloadMV(trackId);
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

  if (trackError || !track) {
    return (
      <div className="container px-[max(2%,16px)] py-8">
        <div className="flex flex-col items-center justify-center py-12">
          <Icon size="xl" className="text-muted-foreground mb-4">
            error_outline
          </Icon>
          <h1 className="text-2xl font-semibold">Error loading track</h1>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    );
  }

  const dateAdded = new Date(track.dateAdded).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container space-y-8">
      <AlbumHeader
        cover_url={track.cover_url}
        type="Song"
        title={track.title}
        author_name={track.artistName}
        author_type="artist"
        author_id={track.artistID}
        subtitle={`Duration: ${track.duration}`}
      />

      <div className="flex items-center gap-4 px-[max(2%,16px)]">
        <Button
          size="lg"
          className="flex items-center gap-2 rounded-full"
          onClick={handlePlayToggle}
        >
          <Icon size="md">
            {currentTrack?.id === track.id && isPlaying
              ? "pause"
              : "play_arrow"}
          </Icon>
          {currentTrack?.id === track.id && isPlaying ? "Pause" : "Play"}
        </Button>

        {track.has_mv && (
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
            {track.has_mv && <TabsTrigger value="mv">Music Video</TabsTrigger>}
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
                    <span>{track.duration}</span>
                  </div>
                  {track.albumName && track.albumID && (
                    <div className="flex justify-between border-b py-2">
                      <span className="text-muted-foreground">Album</span>
                      <Link
                        to={`/album/${track.albumID}`}
                        className="hover:underline"
                      >
                        {track.albumName}
                      </Link>
                    </div>
                  )}
                  <div className="flex justify-between border-b py-2">
                    <span className="text-muted-foreground">Artist</span>
                    <Link
                      to={`/artist/${track.artistID}`}
                      className="hover:underline"
                    >
                      {track.artistName}
                    </Link>
                  </div>
                  {track.has_mv && (
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
                      src={album.cover_url}
                      alt={album.name}
                      className="h-20 w-20 rounded-md object-cover"
                    />
                    <div>
                      <div className="font-medium">{album.name}</div>
                      <div className="text-muted-foreground text-sm">
                        By {album.authorName} • {album.tracks?.length || 0}{" "}
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
                            key={genre}
                            className="bg-accent rounded-full px-3 py-1 text-sm"
                          >
                            {genre}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          {track.has_mv && (
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
                      Official music video for "{track.title}" by{" "}
                      {track.artistName}. This music video was added to our
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
