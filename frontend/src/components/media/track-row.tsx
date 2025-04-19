import React from "react";
import { cn } from "@/lib/utils";
import Icon from "../ui/icon";
import usePlayer from "@/hooks/usePlayer";
import { Song } from "@/types";

interface TrackRowProps {
  track: Song;
  index: number;
}

export function TrackRow({ track, index }: TrackRowProps) {
  const { play, currentSong, isPlaying, togglePlay, addSongToQueue } =
    usePlayer();

  const isCurrentTrack = currentSong?.id === track.id;

  const handlePlayPause = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isCurrentTrack) {
      togglePlay();
    } else {
      play(track);
    }
  };

  const handleAddToQueue = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addSongToQueue(track);
  };

  return (
    <div
      className={cn(
        "group hover:bg-accent flex items-center justify-between rounded-md p-3",
        isCurrentTrack && "bg-accent/60",
      )}
    >
      <div className="flex items-center gap-3">
        <div className="text-muted-foreground w-6 text-center group-hover:hidden">
          {index + 1}
        </div>
        <button
          onClick={handlePlayPause}
          className="hidden w-6 group-hover:block"
        >
          {isCurrentTrack && isPlaying ? (
            <Icon size="sm">pause</Icon>
          ) : (
            <Icon size="sm">play_arrow</Icon>
          )}
        </button>
        <div className="flex flex-col">
          <p className={cn("font-medium", isCurrentTrack && "text-primary")}>
            {track.title}
          </p>
          <p className="text-muted-foreground text-sm">{track.artist?.name}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={handleAddToQueue}
          className="opacity-0 transition-opacity group-hover:opacity-100"
        >
          <Icon size="sm">add</Icon>
        </button>
        <span className="text-muted-foreground">{track.duration}</span>
      </div>
    </div>
  );
}
