import { UserResponse } from "./user.dto";

// Auth DTOs
export interface SignInRequest {
  username: string;
  password: string;
}

export interface AccessTokensResponse {
  user: UserResponse;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
}

export interface RefreshTokensRequest {
  refreshToken: string;
}
