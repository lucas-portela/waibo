import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { useRefreshTokensMutation, useSignInMutation } from "../api/client";
import {
  setCredentials,
  clearCredentials,
  selectCurrentUser,
  selectIsAuthenticated,
  selectAccessToken,
  selectRefreshToken,
} from "./slice";
import { SignInRequest, UserRole } from "../api/dtos";
import { useMemo } from "react";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => selectCurrentUser(state));
  const isAuthenticated = useSelector((state: RootState) =>
    selectIsAuthenticated(state)
  );
  const isAdmin = useMemo(() => {
    return isAuthenticated && user && user.role === UserRole.ADMIN;
  }, [isAuthenticated, user]);

  const accessToken = useSelector((state: RootState) =>
    selectAccessToken(state)
  );
  const refreshToken = useSelector((state: RootState) =>
    selectRefreshToken(state)
  );
  const [signInMutation, { isLoading: isSigningIn, error: signInError }] =
    useSignInMutation();

  const [
    refreshTokensMutation,
    { isLoading: isRefreshing, error: refreshError },
  ] = useRefreshTokensMutation();

  const signIn = async (credentials: SignInRequest) => {
    try {
      const result = await signInMutation(credentials).unwrap();
      dispatch(setCredentials(result));
      return result;
    } catch (error) {
      throw error;
    }
  };

  const signOut = () => {
    dispatch(clearCredentials());
  };

  const refreshAuth = async () => {
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }
    try {
      const result = await refreshTokensMutation({ refreshToken }).unwrap();
      dispatch(setCredentials(result));
      return result;
    } catch (error) {
      throw error;
    }
  };

  return {
    user,
    isAuthenticated,
    isAdmin,
    accessToken,
    signIn,
    signOut,
    isSigningIn,
    signInError,
    refreshAuth,
    isRefreshing,
    refreshError,
  };
};
