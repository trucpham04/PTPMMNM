import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Track, PlayerState } from "@/types";

const initialState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  queue: [],
  volume: 70,
};

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setCurrentTrack: (state, action: PayloadAction<Track>) => {
      state.currentTrack = action.payload;
      state.isPlaying = true;
    },
    togglePlayPause: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    setPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    addToQueue: (state, action: PayloadAction<Track>) => {
      state.queue.push(action.payload);
    },
    removeFromQueue: (state, action: PayloadAction<number>) => {
      state.queue = state.queue.filter((track) => track.id !== action.payload);
    },
    clearQueue: (state) => {
      state.queue = [];
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
    nextTrack: (state) => {
      if (state.queue.length > 0) {
        state.currentTrack = state.queue[0];
        state.queue = state.queue.slice(1);
        state.isPlaying = true;
      }
    },
  },
});

export const {
  setCurrentTrack,
  togglePlayPause,
  setPlaying,
  addToQueue,
  removeFromQueue,
  clearQueue,
  setVolume,
  nextTrack,
} = playerSlice.actions;

export default playerSlice.reducer;
