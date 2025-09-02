// Common types and enums used across DTOs

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export enum ChatSender {
  USER = "USER",
  BOT = "BOT",
  RECIPIENT = "RECIPIENT",
}

export enum MessageChannelStatus {
  DISCONNECTED = "DISCONNECTED",
  OPEN = "OPEN",
  CONNECTING = "CONNECTING",
  CLOSE = "CLOSE",
}

export enum PairingType {
  QR_CODE = "QR_CODE",
  RAW = "RAW",
}

// API Response wrapper for paginated data
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Generic API error response
export interface ApiErrorResponse {
  message: string;
  error: string;
  statusCode: number;
}
