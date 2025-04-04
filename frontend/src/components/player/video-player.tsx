import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { formatTime } from "@/utils/format-time";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  className?: string;
}

export function VideoPlayer({
  src,
  poster,
  title,
  className,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Hide controls after inactivity
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);

  const resetControlsTimer = () => {
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
    setShowControls(true);
    controlsTimeout.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const handlePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
      resetControlsTimer();
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newTime = parseFloat(e.target.value);
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      resetControlsTimer();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newVolume = parseFloat(e.target.value);
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      resetControlsTimer();
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      const videoContainer = videoRef.current?.parentElement;
      if (videoContainer) {
        videoContainer.requestFullscreen().catch((err) => {
          console.error("Error attempting to enable fullscreen:", err);
        });
        setIsFullscreen(true);
      }
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
    resetControlsTimer();
  };

  return (
    <div
      className={cn(
        "relative aspect-video w-full overflow-hidden rounded-md bg-black",
        className,
      )}
      onMouseMove={resetControlsTimer}
    >
      <video
        ref={videoRef}
        className="h-full w-full"
        src={src}
        poster={poster}
        onClick={handlePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Video title */}
      {title && showControls && (
        <div className="absolute top-0 right-0 left-0 bg-gradient-to-b from-black/70 to-transparent p-4">
          <h3 className="font-medium text-white">{title}</h3>
        </div>
      )}

      {/* Controls overlay */}
      {showControls && (
        <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          {/* Progress bar */}
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/30"
          />

          {/* Time display */}
          <div className="mt-1 flex justify-between text-xs text-white/80">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Control buttons */}
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={handlePlay}
              >
                <Icon size="lg">{isPlaying ? "pause" : "play_arrow"}</Icon>
              </Button>

              <div className="flex items-center space-x-2">
                <Icon size="sm" className="text-white">
                  volume_up
                </Icon>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="h-1 w-16 cursor-pointer appearance-none rounded-full bg-white/30"
                />
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={toggleFullscreen}
            >
              <Icon size="lg">
                {isFullscreen ? "fullscreen_exit" : "fullscreen"}
              </Icon>
            </Button>
          </div>
        </div>
      )}

      {/* Big play button when paused */}
      {!isPlaying && (
        <Button
          variant="ghost"
          className="absolute top-1/2 left-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-white/20 hover:bg-white/30"
          onClick={handlePlay}
        >
          <Icon size="xl">play_arrow</Icon>
        </Button>
      )}
    </div>
  );
}
