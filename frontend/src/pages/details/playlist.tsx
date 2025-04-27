import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Icon from "@/components/ui/icon";
import { DataTable } from "@/components/details/data-table";
import PlaylistHeader from "@/components/details/header";
import { usePlayer } from "@/contexts/playerContext";
import { usePlaylist } from "@/hooks";
import { useCallback, useEffect } from "react";

export default function PlaylistPage() {
  const { playlist_id } = useParams<{ playlist_id: string }>();
  const playlistId = parseInt(playlist_id || "0");

  const {
    playlistSongs,
    loading,
    error,
    playlist,
    getPlaylistById,
    getPlaylistSongById,
  } = usePlaylist();

  const {
    play,
    currentSong,
    isPlaying,
    isLoading,
    togglePlay,
    addSongToQueue,
  } = usePlayer();

  useEffect(() => {
    if (playlistId > 0) {
      getPlaylistSongById(playlistId);
      getPlaylistById(playlistId);
    }
  }, [playlistId, getPlaylistSongById, getPlaylistById]);

  const handlePlay = useCallback(() => {
    if (!playlistSongs || playlistSongs.length === 0) {
      console.warn("No songs available to play");
      return;
    }

    const isPlayingThisPlaylist = playlistSongs.some(
      (track) => track.id === currentSong?.id,
    );

    console.log("Is playing this playlist:", isPlayingThisPlaylist);

    if (isPlayingThisPlaylist) {
      togglePlay();
    } else {
      // Make sure the first track has an audio_file property
      const firstTrack = playlistSongs[0];
      if (!firstTrack?.audio_file) {
        console.warn("First track has no audio file:", firstTrack);
        return;
      }

      // Play the first track
      play(firstTrack);

      // Add remaining songs to queue
      if (playlistSongs.length > 1) {
        playlistSongs
          .slice(1)
          .filter((track) => track.audio_file) // Only add tracks with audio files
          .forEach((track) => {
            addSongToQueue(track);
          });
      }
    }
  }, [playlistSongs, currentSong, isPlaying, play, addSongToQueue, togglePlay]);

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

  if (error) {
    return (
      <div className="container px-[max(2%,16px)] py-8">
        <div className="flex flex-col items-center justify-center py-12">
          <Icon size="xl" className="text-muted-foreground mb-4">
            error_outline
          </Icon>
          <h1 className="text-2xl font-semibold">Error loading playlist</h1>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    );
  }

  const isPlaylistPlaying =
    isPlaying && playlistSongs.some((track) => track.id === currentSong?.id);

  return (
    <div className="space-y-8">
      <PlaylistHeader
        cover_url={playlist?.cover_image}
        type="Playlist"
        title={playlist?.name}
        author_type="artist"
        description={playlist?.description}
      />

      <div className="flex items-center gap-4 px-[max(2%,16px)]">
        <Button
          size="lg"
          className="flex items-center gap-2 rounded-full"
          onClick={handlePlay}
          disabled={isLoading}
        >
          <Icon size="md">
            {isLoading ? "sync" : isPlaylistPlaying ? "pause" : "play_arrow"}
          </Icon>
          {isLoading ? "Loading..." : isPlaylistPlaying ? "Pause" : "Play"}
        </Button>
      </div>

      <div className="px-[max(2%,16px)] pb-16">
        <DataTable data={playlistSongs} />
      </div>
    </div>
  );
}
