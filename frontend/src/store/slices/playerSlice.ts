import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Song } from "@/types";

interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  volume: number;
  history: Song[];
}

const initialState: PlayerState = {
  currentSong: null,
  isPlaying: false,
  queue: [],
  volume: 70,
  history: [],
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
      state.queue = Array.from(state.queue).filter(q => q.isSingleQueue);
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
    nextSong: (state) => {
      if (state.queue.length > 0) {
        if (state.currentSong) {
          state.history.push(state.currentSong);
        }
        state.currentSong = state.queue[0];
        state.queue = state.queue.slice(1);
        state.isPlaying = true;
      }
    },
    previousSong: (state) => {
      if (state.history.length > 0) {
        const prevSong = state.history.pop(); // lấy bài trước
        if (state.currentSong) {
          state.queue.unshift(state.currentSong); // đưa bài hiện tại vào đầu queue
        }
        state.currentSong = prevSong ?? null;
        state.isPlaying = true;
      }
    },
    updatePlayCount: (state) => {
      // This will be used to trigger the API call to increment play count
      // The actual API call will be handled in a middleware or thunk
    },
    addToHistory: (state, action: PayloadAction<Song>) => {
      if (action.payload) {
        state.history.push(action.payload);
      }
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
  addToHistory,
} = playerSlice.actions;

export default playerSlice.reducer;
