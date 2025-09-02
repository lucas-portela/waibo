import { UserResponse } from "../api/dtos";

const AUTH_STORAGE_KEY = "waibo_auth";

export interface PersistedAuthState {
  user: UserResponse | null;
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExpiresAt: string | null;
  refreshTokenExpiresAt: string | null;
  isAuthenticated: boolean;
}

export const saveAuthState = (authState: PersistedAuthState) => {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
    }
  } catch (error) {
    console.error("Failed to save auth state:", error);
  }
};

export const loadAuthState = (): PersistedAuthState | null => {
  try {
    if (typeof window === "undefined") {
      return null;
    }

    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);

      if (parsed.accessTokenExpiresAt) {
        const expirationDate = new Date(parsed.accessTokenExpiresAt);
        const now = new Date();

        if (expirationDate < now) {
          if (parsed.refreshTokenExpiresAt) {
            const refreshExpirationDate = new Date(
              parsed.refreshTokenExpiresAt
            );
            if (refreshExpirationDate < now) {
              clearAuthState();
              return null;
            }
          }
        }
      }

      return parsed;
    }
    return null;
  } catch (error) {
    console.error("Failed to load auth state:", error);
    return null;
  }
};

export const clearAuthState = () => {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch (error) {
    console.error("Failed to clear auth state:", error);
  }
};
