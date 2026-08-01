import { apiRequest } from "./client";
import { AuthResponse, LoginRequest, RegisterRequest } from "../types/api";

export function loginUser(credentials: LoginRequest): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/login", { method: "POST", body: credentials });
}

export function registerUser(registration: RegisterRequest): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/register", { method: "POST", body: registration });
}
