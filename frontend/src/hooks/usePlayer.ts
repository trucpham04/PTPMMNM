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
 * Added: playUrl for playing a raw mp3 URL directly
 */
export function usePlayer() {
  const dispatch = useDispatch<AppDispatch>();
  const playerState = useSelector((state: RootState) => state.player);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = playerState.volume / 100;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  // Update source when currentSong changes
  useEffect(() => {
    if (audioRef.current && playerState.currentSong) {
      audioRef.current.src = playerState.currentSong.audio_file;
      if (playerState.isPlaying) {
        audioRef.current.play().catch((e) => {
          console.error("Error playing audio:", e);
          dispatch(setPlaying(false));
        });
      }
    }
  }, [playerState.currentSong, dispatch]);

  // React to play/pause
  useEffect(() => {
    if (!audioRef.current) return;
    if (playerState.isPlaying) {
      audioRef.current.play().catch((e) => {
        console.error("Error playing audio:", e);
        dispatch(setPlaying(false));
      });
    } else {
      audioRef.current.pause();
    }
  }, [playerState.isPlaying, dispatch]);

  // Volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = playerState.volume / 100;
    }
  }, [playerState.volume]);

  // On track end
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => {
      if (playerState.currentSong) {
        songService
          .incrementPlayCount(playerState.currentSong.id)
          .then(() => dispatch(updatePlayCount()))
          .catch((e) => console.error("Error updating play count:", e));
      }
      dispatch(nextSong());
    };
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [playerState.currentSong, dispatch]);

  // Play a Song object
  const play = useCallback(
    (song: Song) => {
      dispatch(setCurrentSong(song));
    },
    [dispatch],
  );

  // Play a raw mp3 URL directly
  const playUrl = useCallback(
    (url: string) => {
      if (!audioRef.current) return;
      // Clear any queued songs
      dispatch(clearQueue());
      // Set src and play
      audioRef.current.src = url;
      audioRef.current
        .play()
        .catch((e) => console.error("Error playing URL:", e));
      // Update state
      dispatch(setPlaying(true));
      // Optionally reset currentSong if needed
      dispatch(setCurrentSong({ id: -1, audio_file: url } as Song));
    },
    [dispatch],
  );

  const togglePlay = useCallback(() => dispatch(togglePlayPause()), [dispatch]);
  const setIsPlaying = useCallback(
    (playing: boolean) => dispatch(setPlaying(playing)),
    [dispatch],
  );
  const addSongToQueue = useCallback(
    (song: Song) => dispatch(addToQueue(song)),
    [dispatch],
  );
  const removeSongFromQueue = useCallback(
    (id: number) => dispatch(removeFromQueue(id)),
    [dispatch],
  );
  const emptyQueue = useCallback(() => dispatch(clearQueue()), [dispatch]);
  const changeVolume = useCallback(
    (vol: number) => dispatch(setVolume(vol)),
    [dispatch],
  );
  const playNextSong = useCallback(() => dispatch(nextSong()), [dispatch]);
  const playPreviousSong = useCallback(
    () => dispatch(previousSong()),
    [dispatch],
  );

  const getPlaybackInfo = useCallback(() => {
    if (!audioRef.current) return { currentTime: 0, duration: 0, progress: 0 };
    const currentTime = audioRef.current.currentTime;
    const duration = audioRef.current.duration || 0;
    return {
      currentTime,
      duration,
      progress: duration ? (currentTime / duration) * 100 : 0,
    };
  }, []);

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) audioRef.current.currentTime = time;
  }, []);
  const seekByPercentage = useCallback((pct: number) => {
    if (audioRef.current?.duration)
      audioRef.current.currentTime = (pct / 100) * audioRef.current.duration;
  }, []);

  return {
    currentSong: playerState.currentSong,
    isPlaying: playerState.isPlaying,
    queue: playerState.queue,
    volume: playerState.volume,
    audioRef,
    play,
    playUrl,
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
