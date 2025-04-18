import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Icon from "@/components/ui/icon";
import { DataTable } from "@/components/details/data-table";
import AlbumHeader from "@/components/details/header";
import AlbumAction from "@/components/details/action"; // Import the action component
import usePlayer from "@/hooks/usePlayer";
import { useAlbum } from "@/hooks";
import { useEffect } from "react";

export default function AlbumPage() {
  const { album_id } = useParams<{ album_id: string }>();
  const albumId = parseInt(album_id || "0");

  const { albumSongs, loading, error, album, getAlbumById, getAlbumSongs } =
    useAlbum();
  const { play, currentSong, isPlaying, togglePlay, addSongToQueue } =
    usePlayer();

  useEffect(() => {
    getAlbumSongs(albumId);
    getAlbumById(albumId);
  }, []);

  const handlePlay = () => {
    if (albumSongs && albumSongs.length > 0) {
      // Play the first track
      play(albumSongs[0]);

      // Add remaining songs to queue
      albumSongs.slice(1).forEach((track) => {
        addSongToQueue(track);
      });
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

        {/* Skeleton for Table */}
        <div className="px-[max(2%,16px)]">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <Skeleton key={item} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !albumSongs || !albumSongs) {
    return (
      <div className="container px-[max(2%,16px)] py-8">
        <div className="flex flex-col items-center justify-center py-12">
          <Icon size="xl" className="text-muted-foreground mb-4">
            error_outline
          </Icon>
          <h1 className="text-2xl font-semibold">Error loading album</h1>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    );
  }

  const totalDuration = albumSongs.reduce((acc, track) => {
    const [min, sec] = track.duration.split(":").map(Number);
    return acc + (min * 60 + sec);
  }, 0);

  const totalTracks = albumSongs.length;
  const durationMinutes = Math.floor(totalDuration / 60);
  const durationText = `${totalTracks} ${totalTracks === 1 ? "song" : "songs"}, ${durationMinutes} ${durationMinutes === 1 ? "minute" : "minutes"}`;

  return (
    <div className="container space-y-8">
      <AlbumHeader
        cover_url={album?.cover_image}
        type="Album"
        title={album?.title}
        author_name={album?.artist?.name}
        author_type="artist"
        author_id={album?.artist_id}
        subtitle={durationText}
      />

      <div className="flex items-center gap-4 px-[max(2%,16px)]">
        <Button
          size="lg"
          className="flex items-center gap-2 rounded-full"
          onClick={handlePlay}
        >
          <Icon size="md">
            {isPlaying && albumSongs.some((t) => t.id === currentSong?.id)
              ? "pause"
              : "play_arrow"}
          </Icon>
          {isPlaying && albumSongs.some((t) => t.id === currentSong?.id)
            ? "Pause"
            : "Play"}
        </Button>

        {/* Add the album action button */}
        <AlbumAction album={album} />
      </div>

      <div className="px-[max(2%,16px)] pb-16">
        <DataTable data={albumSongs} />
      </div>
    </div>
  );
}
