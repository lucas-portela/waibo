// User DTOs

import { UserRole } from "./common.dto";

export interface UserResponse {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  username: string;
  name: string;
  password: string;
  role?: UserRole;
}

export interface UpdateUserRequest {
  username?: string;
  name?: string;
  password?: string;
  role?: UserRole;
}
