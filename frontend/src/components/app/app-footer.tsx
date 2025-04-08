import { cn } from "@/lib/utils";
import { Slider } from "../ui/slider";
import Icon from "../ui/icon";
import { usePlayer } from "@/hooks/use-player";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { formatTime } from "@/utils/format-time";

export default function AppFooter({ className }: { className?: string }) {
  const {
    currentTrack,
    isPlaying,
    volume,
    togglePlay,
    playNextTrack,
    changeVolume,
  } = usePlayer();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error("Failed to play:", error);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (values: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = values[0];
      setCurrentTime(values[0]);
    }
  };

  if (!currentTrack) {
    return (
      <div
        className={cn(
          "bg--100 relative flex h-16 items-center justify-between p-2",
          className,
        )}
      >
        <div className="flex items-center gap-3">
          <div className="size-14 rounded-md bg-white/10"></div>
          <div className="space-y-">
            <div className="text-muted-foreground">No track playing</div>
          </div>
        </div>
        <div className="absolute top-2/5 left-1/2 flex w-full -translate-1/2 flex-col items-center justify-center">
          <div className="flex gap-4">
            <Icon size="xl" className="text-muted-foreground/50">
              skip_previous
            </Icon>
            <Icon size="xl" className="text-muted-foreground/50">
              play_arrow
            </Icon>
            <Icon size="xl" className="text-muted-foreground/50">
              skip_next
            </Icon>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="text-muted-foreground">0:00</div>
            <Slider className="w-1/4 min-w-80" disabled />
            <div className="text-muted-foreground">0:00</div>
          </div>
        </div>
        <div className="flex gap-2">
          <Icon size="lg" className="text-muted-foreground/50">
            volume_up
          </Icon>
          <Slider
            size="small"
            max={100}
            defaultValue={[volume]}
            className="w-20"
            onValueChange={(values) => changeVolume(values[0])}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg--100 relative flex h-16 items-center justify-between p-2",
        className,
      )}
    >
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={`/api/stream/${currentTrack.id}`} // Replace with your actual streaming endpoint
        onEnded={playNextTrack}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />

      <div className="flex items-center gap-3">
        <Link to={`/album/${currentTrack.albumID}`}>
          <img
            src={currentTrack.cover_url}
            alt={currentTrack.title}
            className="size-14 rounded-md object-cover"
          />
        </Link>
        <div className="space-y-">
          <Link to={`/track/${currentTrack.id}`} className="hover:underline">
            {currentTrack.title}
          </Link>
          <Link
            to={`/artist/${currentTrack.artistID}`}
            className="block text-xs hover:underline"
          >
            {currentTrack.artistName}
          </Link>
        </div>
        <Icon className="cursor-pointer" onClick={() => {}}>
          add_circle
        </Icon>
      </div>

      <div className="absolute top-2/5 left-1/2 flex w-full -translate-1/2 flex-col items-center justify-center">
        <div className="flex gap-4">
          <Icon size="xl" className="cursor-pointer">
            skip_previous
          </Icon>
          <Icon size="xl" className="cursor-pointer" onClick={togglePlay}>
            {isPlaying ? "pause" : "play_arrow"}
          </Icon>
          <Icon size="xl" className="cursor-pointer" onClick={playNextTrack}>
            skip_next
          </Icon>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div>{formatTime(currentTime)}</div>
          <Slider
            className="w-1/4 min-w-80"
            max={duration}
            value={[currentTime]}
            onValueChange={handleSeek}
          />
          <div>{formatTime(duration)}</div>
        </div>
      </div>

      <div className="flex gap-2">
        <Icon size="lg">
          {volume === 0
            ? "volume_off"
            : volume < 50
              ? "volume_down"
              : "volume_up"}
        </Icon>
        <Slider
          size="small"
          max={100}
          value={[volume]}
          className="w-20"
          onValueChange={(values) => changeVolume(values[0])}
        />
      </div>
    </div>
  );
}
