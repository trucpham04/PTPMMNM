import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
  setCurrentSong,
  togglePlayPause,
  setPlaying,
  addToQueue,
  removeFromQueue,
  clearQueue,
  setVolume,
  nextSong,
  previousSong,
  updatePlayCount,
} from "@/store/slices/playerSlice";
import { useCallback, useEffect, useRef } from "react";
import { Song } from "@/types/music";
import { songService } from "@/services";

/**
 * Custom hook for music player functionality
 * Integrates with Redux store and provides methods for controlling playback
 */
export function usePlayer() {
  const dispatch = useDispatch<AppDispatch>();
  const playerState = useSelector((state: RootState) => state.player);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element if not already done
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();

      // Set initial volume
      if (audioRef.current) {
        audioRef.current.volume = playerState.volume / 100;
      }
    }

    return () => {
      // Clean up audio element on unmount
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  // Update audio source when current song changes
  useEffect(() => {
    if (audioRef.current && playerState.currentSong) {
      audioRef.current.src = playerState.currentSong.audio_file;

      if (playerState.isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error);
          dispatch(setPlaying(false));
        });
      }
    }
  }, [playerState.currentSong, dispatch]);

  // Handle play/pause state changes
  useEffect(() => {
    if (audioRef.current) {
      if (playerState.isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error);
          dispatch(setPlaying(false));
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [playerState.isPlaying, dispatch]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = playerState.volume / 100;
    }
  }, [playerState.volume]);

  // Record play count when a song completes
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const handleEnded = () => {
      // Increment play count for the completed song
      if (playerState.currentSong) {
        songService
          .incrementPlayCount(playerState.currentSong.id)
          .then(() => {
            dispatch(updatePlayCount());
          })
          .catch((error) => {
            console.error("Error updating play count:", error);
          });
      }

      // Play next song if available
      dispatch(nextSong());
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [playerState.currentSong, dispatch]);

  // Play a song
  const play = useCallback(
    (song: Song) => {
      dispatch(setCurrentSong(song));
    },
    [dispatch],
  );

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    dispatch(togglePlayPause());
  }, [dispatch]);

  // Set playing state explicitly
  const setIsPlaying = useCallback(
    (playing: boolean) => {
      dispatch(setPlaying(playing));
    },
    [dispatch],
  );

  // Add a song to the queue
  const addSongToQueue = useCallback(
    (song: Song) => {
      dispatch(addToQueue(song));
    },
    [dispatch],
  );

  // Remove a song from the queue
  const removeSongFromQueue = useCallback(
    (id: number) => {
      dispatch(removeFromQueue(id));
    },
    [dispatch],
  );

  // Clear the queue
  const emptyQueue = useCallback(() => {
    dispatch(clearQueue());
  }, [dispatch]);

  // Change the volume
  const changeVolume = useCallback(
    (volume: number) => {
      dispatch(setVolume(volume));
    },
    [dispatch],
  );

  // Play the next song in the queue
  const playNextSong = useCallback(() => {
    dispatch(nextSong());
  }, [dispatch]);

  // Play the previous song
  const playPreviousSong = useCallback(() => {
    dispatch(previousSong());
  }, [dispatch]);

  // Get current playback time and duration
  const getPlaybackInfo = useCallback(() => {
    if (!audioRef.current) return { currentTime: 0, duration: 0, progress: 0 };

    const currentTime = audioRef.current.currentTime;
    const duration = audioRef.current.duration || 0;
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return { currentTime, duration, progress };
  }, []);

  // Seek to a specific time
  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, []);

  // Seek by percentage
  const seekByPercentage = useCallback((percentage: number) => {
    if (audioRef.current && audioRef.current.duration) {
      const newTime = (percentage / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
    }
  }, []);

  return {
    // State
    currentSong: playerState.currentSong,
    isPlaying: playerState.isPlaying,
    queue: playerState.queue,
    volume: playerState.volume,
    audioRef,

    // Methods
    play,
    togglePlay,
    setIsPlaying,
    addSongToQueue,
    removeSongFromQueue,
    emptyQueue,
    changeVolume,
    playNextSong,
    playPreviousSong,
    getPlaybackInfo,
    seekTo,
    seekByPercentage,
  };
}

export default usePlayer;
