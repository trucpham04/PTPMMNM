import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types";

interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = action.payload !== null; // Nếu payload là null, thì isAuthenticated sẽ là false
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = {
          ...state.currentUser,
          ...action.payload,
        };
      }
    },
  },
});

export const { setCurrentUser, logout, updateUser } = userSlice.actions;

export default userSlice.reducer;
