import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Icon from "@/components/ui/icon";
import { AlbumItem } from "@/components/media/album-item";
import { DataTable } from "@/components/details/data-table";
import { Album } from "@/types";
import AlbumHeader from "@/components/details/header";
import { MediaGrid } from "@/components/media/media-grid";
import { SectionSkeleton } from "@/components/media/section-skeleton";
import { usePlayer } from "@/contexts/playerContext";
import { useArtist } from "@/hooks";

export default function ArtistPage() {
  const {
    artistAlbums,
    artistSongs,
    artist,
    loading,
    error,
    getArtistById,
    getArtistSongs,
    getArtistAlbums,
  } = useArtist();
  const { artist_id } = useParams<{ artist_id: string }>();
  const artistId = parseInt(artist_id || "0");

  const {
    play,
    currentSong,
    isPlaying,
    togglePlay,
    addSongToQueue,
    clearSongQueue,
  } = usePlayer();

  useEffect(() => {
    if (artistId > 0) {
      getArtistSongs(artistId);
      getArtistById(artistId);
      getArtistAlbums(artistId);
    }
  }, [artistId, getArtistById, getArtistSongs]);

  const handlePlay = useCallback(() => {
    if (!artistSongs || artistSongs.length === 0) {
      console.warn("No songs available to play");
      return;
    }
    clearSongQueue();
    // Check if we're already playing from this album
    const isPlayingThisAlbum = artistSongs.some(
      (track) => track.id === currentSong?.id,
    );

    console.log("Is playing this album:", isPlayingThisAlbum);

    if (isPlayingThisAlbum) {
      togglePlay();
    } else {
      // Make sure the first track has an audio_file property
      const firstTrack = artistSongs[0];
      if (!firstTrack.audio_file) {
        console.warn("First track has no audio file:", firstTrack);
        return;
      }

      // Play the first track
      play(firstTrack);

      // Add remaining songs to queue
      if (artistSongs.length > 1) {
        artistSongs
          .slice(1)
          .filter((track) => track.audio_file) // Only add tracks with audio files
          .forEach((track) => {
            addSongToQueue(track);
          });
      }
    }
  }, [artistSongs, currentSong, isPlaying, play, addSongToQueue, togglePlay]);

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Skeleton for Header */}
        <div className="bg-muted flex aspect-[4] max-h-80 w-full items-end gap-4 px-[max(2%,16px)] pt-12 pb-[max(2%,16px)]">
          <Skeleton className="aspect-square w-1/5 max-w-64 min-w-32 rounded-full" />
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

        {/* Skeleton for Albums */}
        <div className="space-y-6 px-[max(2%,16px)]">
          <Skeleton className="h-8 w-40" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <SectionSkeleton key={i} />
              ))}
          </div>
        </div>

        {/* Skeleton for Tracks */}
        <div className="space-y-6 px-[max(2%,16px)]">
          <Skeleton className="h-8 w-40" />
          <div className="space-y-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="container px-[max(2%,16px)] py-8">
        <div className="flex flex-col items-center justify-center py-12">
          <Icon size="xl" className="text-muted-foreground mb-4">
            error_outline
          </Icon>
          <h1 className="text-2xl font-semibold">Error loading artist</h1>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    );
  }

  // Determine if any tracks from this artist are currently playing
  const isArtistPlaying =
    isPlaying &&
    currentSong &&
    artistSongs.some((t) => t.id === currentSong.id);

  return (
    <div className="container space-y-8">
      <AlbumHeader cover_url={artist.image} type="Artist" title={artist.name} />

      <div className="flex flex-wrap items-center gap-4 px-[max(2%,16px)]">
        <Button
          size="lg"
          className="flex items-center gap-2 rounded-full"
          onClick={handlePlay}
          disabled={artistSongs.length === 0}
        >
          <Icon size="md">{isArtistPlaying ? "pause" : "play_arrow"}</Icon>
          {isArtistPlaying ? "Pause" : "Play"}
        </Button>

        {artist.genres && artist.genres.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {artist.genres.map((genre) => (
              <span
                key={genre.id}
                className="bg-accent rounded-full px-3 py-1 text-sm"
              >
                {genre.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Albums Section */}
      <div className="px-[max(2%,16px)]">
        <h2 className="mb-4 text-2xl font-semibold">Albums</h2>
        {loading ? (
          <MediaGrid>
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} />
              ))}
          </MediaGrid>
        ) : artistAlbums.length > 0 ? (
          <MediaGrid>
            {artistAlbums.map((album) => (
              <AlbumItem key={album.id} album={album} />
            ))}
          </MediaGrid>
        ) : (
          <div className="text-muted-foreground py-4">No albums found</div>
        )}
      </div>

      {/* Popular Tracks Section */}
      <div className="px-[max(2%,16px)] pb-16">
        <h2 className="mb-4 text-2xl font-semibold">Popular Tracks</h2>
        {artistSongs.length > 0 ? (
          <DataTable data={artistSongs} />
        ) : (
          <div className="text-muted-foreground py-4">No tracks found</div>
        )}
      </div>
    </div>
  );
}
