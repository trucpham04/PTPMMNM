import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  setCurrentTrack,
  togglePlayPause,
  setPlaying,
  addToQueue,
  removeFromQueue,
  clearQueue,
  setVolume,
  nextTrack,
} from "@/store/slices/playerSlice";
import { Track } from "@/types";

export function usePlayer() {
  const dispatch = useDispatch();
  const playerState = useSelector((state: RootState) => state.player);

  return {
    currentTrack: playerState.currentTrack,
    isPlaying: playerState.isPlaying,
    queue: playerState.queue,
    volume: playerState.volume,
    play: (track: Track) => dispatch(setCurrentTrack(track)),
    togglePlay: () => dispatch(togglePlayPause()),
    setIsPlaying: (playing: boolean) => dispatch(setPlaying(playing)),
    addTrackToQueue: (track: Track) => dispatch(addToQueue(track)),
    removeTrackFromQueue: (id: number) => dispatch(removeFromQueue(id)),
    emptyQueue: () => dispatch(clearQueue()),
    changeVolume: (volume: number) => dispatch(setVolume(volume)),
    playNextTrack: () => dispatch(nextTrack()),
  };
}
