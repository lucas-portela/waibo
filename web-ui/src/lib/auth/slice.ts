import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserResponse } from "../api/dtos";
import { loadAuthState, saveAuthState, clearAuthState } from "./storage";

interface AuthState {
  user: UserResponse | null;
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExpiresAt: string | null;
  refreshTokenExpiresAt: string | null;
  isAuthenticated: boolean;
}

// Load initial state from localStorage
const persistedState = loadAuthState();
const initialState: AuthState = persistedState || {
  user: null,
  accessToken: null,
  refreshToken: null,
  accessTokenExpiresAt: null,
  refreshTokenExpiresAt: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: UserResponse;
        accessToken: string;
        refreshToken: string;
        accessTokenExpiresAt: string;
        refreshTokenExpiresAt: string;
      }>
    ) => {
      const {
        user,
        accessToken,
        refreshToken,
        accessTokenExpiresAt,
        refreshTokenExpiresAt,
      } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.accessTokenExpiresAt = accessTokenExpiresAt;
      state.refreshTokenExpiresAt = refreshTokenExpiresAt;
      state.isAuthenticated = true;

      // Persist to localStorage
      saveAuthState(state);
    },
    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.accessTokenExpiresAt = null;
      state.refreshTokenExpiresAt = null;
      state.isAuthenticated = false;

      // Clear from localStorage
      clearAuthState();
    },
    updateUser: (state, action: PayloadAction<UserResponse>) => {
      state.user = action.payload;

      // Persist updated user to localStorage
      saveAuthState(state);
    },
  },
});

export const { setCredentials, clearCredentials, updateUser } =
  authSlice.actions;

// Selectors
export const selectCurrentUser = (state: { auth: AuthState }) =>
  state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const selectAccessToken = (state: { auth: AuthState }) =>
  state.auth.accessToken;
export const selectRefreshToken = (state: { auth: AuthState }) =>
  state.auth.refreshToken;

export default authSlice.reducer;
