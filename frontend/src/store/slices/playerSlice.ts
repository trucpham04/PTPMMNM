import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Song } from "@/types";

interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  volume: number;
}

const initialState: PlayerState = {
  currentSong: null,
  isPlaying: false,
  queue: [],
  volume: 70,
};

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setCurrentSong: (state, action: PayloadAction<Song>) => {
      state.currentSong = action.payload;
      state.isPlaying = true;
    },
    togglePlayPause: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    setPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    addToQueue: (state, action: PayloadAction<Song>) => {
      state.queue.push(action.payload);
    },
    removeFromQueue: (state, action: PayloadAction<number>) => {
      state.queue = state.queue.filter((song) => song.id !== action.payload);
    },
    clearQueue: (state) => {
      state.queue = [];
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
    nextSong: (state) => {
      if (state.queue.length > 0) {
        state.currentSong = state.queue[0];
        state.queue = state.queue.slice(1);
        state.isPlaying = true;
      }
    },
    previousSong: (state) => {
      // You might want to implement this based on your needs
      // This is just a placeholder
    },
    updatePlayCount: (state) => {
      // This will be used to trigger the API call to increment play count
      // The actual API call will be handled in a middleware or thunk
    },
  },
});

export const {
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
} = playerSlice.actions;

export default playerSlice.reducer;
