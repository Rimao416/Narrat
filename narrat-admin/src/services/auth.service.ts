import { api } from "./api";
import type { AuthResponse, LoginPayload } from "@/types";

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/login", payload);
    return data;
  },

  async me(): Promise<AuthResponse["user"]> {
    const { data } = await api.get("/auth/me");
    return data;
  },

  async refresh(refreshToken: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/refresh", { refreshToken });
    return data;
  },
};
