import { cn } from "@/lib/utils";
import { Slider } from "../ui/slider";
import Icon from "../ui/icon";
import { Link } from "react-router-dom";
import { formatTime } from "@/utils/format-time";
import { usePlayer } from "@/contexts/playerContext";
import { Button } from "../ui/button";
import { useFavorite } from "@/hooks";
import { useEffect } from "react";
import { useAuth } from "@/contexts/authContext";
import { useIsMobile } from "@/hooks/use-mobile";

export default function AppFooter({ className }: { className?: string }) {
  const {
    currentSong,
    isPlaying,
    volume,
    togglePlay,
    playNextSong,
    playPreviousSong,
    changeVolume,
    audioRef,
    currentTime,
    duration,
  } = usePlayer();

  const { user } = useAuth();

  const isMobile = useIsMobile();

  const {
    isFavorited,
    getIsSongFavorited,
    addSongToFavorites,
    removeSongFromFavorites,
  } = useFavorite();

  useEffect(() => {
    if (currentSong && user) {
      getIsSongFavorited(user?.id, currentSong.id);
    }
  }, [currentSong]);

  const toggleFavorite = () => {
    if (!currentSong || !user) {
      return;
    }
    if (isFavorited) removeSongFromFavorites(user?.id, currentSong.id);
    else addSongToFavorites(user?.id, currentSong.id);
  };

  // Render placeholder if no song
  if (!currentSong) {
    return (
      <div
        className={cn(
          "bg--100 relative flex h-16 items-center justify-between p-2 pt-1",
          className,
        )}
      >
        <div className="flex items-center gap-3">
          <div className="size-14 rounded-md bg-white/10" />
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
        { "pb-14": isMobile },
        className,
      )}
    >
      {/* Track info */}
      <div className="z-10 flex items-center gap-3">
        <Link to={`/album/${currentSong.album?.id}`}>
          <img
            src={currentSong.album?.cover_image}
            alt={currentSong.title}
            className="size-12 rounded-md object-cover"
          />
        </Link>
        <div className="space-y-">
          <Link to={`/song/${currentSong.id}`} className="hover:underline">
            {currentSong.title}
          </Link>
          <Link
            to={`/artist/${currentSong.artist_id}`}
            className="block text-xs hover:underline"
          >
            {currentSong.artist?.name}
          </Link>
        </div>
        <Icon
          className={cn("cursor-pointer", { fill: isFavorited })}
          onClick={toggleFavorite}
        >
          favorite
        </Icon>
      </div>

      {/* Controls */}
      <div className="absolute top-2/5 left-1/2 flex w-full -translate-1/2 flex-col items-center justify-center">
        <div className="flex gap-4">
          <Icon size="xl" className="cursor-pointer" onClick={playPreviousSong}>
            skip_previous
          </Icon>
          <Icon size="xl" className="cursor-pointer" onClick={togglePlay}>
            {isPlaying ? "pause" : "play_arrow"}
          </Icon>
          <Icon size="xl" className="cursor-pointer" onClick={playNextSong}>
            skip_next
          </Icon>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div>{formatTime(currentTime)}</div>
          <Slider
            className="w-1/4 min-w-80"
            max={duration}
            value={[currentTime]}
            onValueChange={(values) => {
              if (audioRef.current) {
                audioRef.current.currentTime = values[0];
              }
            }}
          />
          <div>{formatTime(duration)}</div>
        </div>
      </div>

      {/* Volume */}
      <div className="z-10 flex gap-2">
        <Button
          variant={"ghost"}
          className="hover:bg-primary-foreground size-12 cursor-pointer rounded-full"
          asChild
        >
          <Link to="/queue">
            <Icon>queue_music</Icon>
          </Link>
        </Button>

        <div className="flex gap-2">
          <Icon
            size="lg"
            className="cursor-pointer"
            onClick={() => {
              changeVolume(volume === 0 ? 70 : 0);
            }}
          >
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
    </div>
  );
}
