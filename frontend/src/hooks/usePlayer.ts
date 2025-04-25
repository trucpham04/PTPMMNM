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
import { useCallback, useEffect, useRef, useState } from "react";
import { Song } from "@/types/music";

/**
 * Custom hook for music player functionality
 * Integrates with Redux store and provides methods for controlling playback
 */
export function usePlayer() {
  const dispatch = useDispatch<AppDispatch>();
  const { currentSong, isPlaying, queue, volume } = useSelector(
    (state: RootState) => state.player,
  );
  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;

    console.log("Audio element created:", audio);

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoaded = () => setDuration(audio.duration || 0);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoaded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoaded);
    };
  }, []);

  // Volume synchronization
  useEffect(() => {
    audioRef.current.volume = volume / 100;
  }, [volume]);

  // Handle track changes
  useEffect(() => {
    const audio = audioRef.current;

    if (!currentSong || !currentSong.audio_file) {
      audio.src = "";
      return;
    }

    audio.src = currentSong.audio_file;
    audio.currentTime = 0;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoaded = () => setDuration(audio.duration || 0);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoaded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoaded);
    };
  }, [currentSong]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!currentSong || !currentSong.audio_file) return;

    setIsLoading(true);

    if (isPlaying) {
      setTimeout(() => {
        audio
          .play()
          .then(() => {
            setIsLoading(false);
          })
          .catch((e) => {
            console.error("Error playing audio:", e);
            dispatch(setPlaying(false));
            setIsLoading(false);
          });
      }, 100);
    } else {
      audio.pause();
      setIsLoading(false);
    }
  }, [isPlaying, currentSong, dispatch]);

  // Playback controls
  const play = useCallback(
    (song: Song) => {
      if (!song || !song.audio_file) {
        console.warn("Attempted to play a song with no audio file:", song);
        return;
      }
      dispatch(setCurrentSong(song));
      dispatch(setPlaying(true));
    },
    [dispatch],
  );

  const togglePlay = useCallback(() => dispatch(togglePlayPause()), [dispatch]);

  const playUrl = useCallback(
    (url: string) => {
      dispatch(clearQueue());
      const audio = audioRef.current;
      audio.pause();
      audio.currentTime = 0;
      audio.src = url;
      audio
        .play()
        .then(() => dispatch(setPlaying(true)))
        .catch((e) => console.error("Error playing URL:", e));
      dispatch(setCurrentSong({ id: -1, audio_file: url } as Song));
    },
    [dispatch],
  );

  // Queue controls
  const addSongToQueue = useCallback(
    (song: Song) => dispatch(addToQueue(song)),
    [dispatch],
  );
  const removeSongFromQueue = useCallback(
    (id: number) => dispatch(removeFromQueue(id)),
    [dispatch],
  );
  const clearSongQueue = useCallback(() => dispatch(clearQueue()), [dispatch]);

  // Volume control
  const changeVolume = useCallback(
    (vol: number) => dispatch(setVolume(vol)),
    [dispatch],
  );

  // Skip controls
  const playNextSong = useCallback(() => dispatch(nextSong()), [dispatch]);
  const playPreviousSong = useCallback(
    () => dispatch(previousSong()),
    [dispatch],
  );

  // Seek controls
  const seekTo = useCallback((time: number) => {
    const audio = audioRef.current;
    if (audio.duration) audio.currentTime = time;
  }, []);

  const seekByPercentage = useCallback((pct: number) => {
    const audio = audioRef.current;
    if (audio.duration) audio.currentTime = (pct / 100) * audio.duration;
  }, []);

  // Expose current playback state
  const getPlaybackInfo = useCallback(() => {
    const audio = audioRef.current;
    return {
      currentTime: audio.currentTime,
      duration: audio.duration || 0,
      progress: audio.duration ? (audio.currentTime / audio.duration) * 100 : 0,
    };
  }, []);

  // Next song on end
  useEffect(() => {
    const audio = audioRef.current;
  
    const handleEnded = () => {
      if (queue.length > 0) {
        dispatch(nextSong());
      }else{
        dispatch(setPlaying(false));
      }
     
    };
  
    audio.addEventListener("ended", handleEnded);
  
    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [dispatch, currentSong]);

  return {
    currentSong,
    isPlaying,
    isLoading,
    queue,
    volume,
    audioRef,
    currentTime,
    duration,
    play,
    playUrl,
    togglePlay,
    addSongToQueue,
    removeSongFromQueue,
    clearSongQueue,
    changeVolume,
    playNextSong,
    playPreviousSong,
    seekTo,
    seekByPercentage,
    getPlaybackInfo,
  };
}

export default usePlayer;
