import { axiosInstance } from "@/lib/axios";
import type { AuthUser } from "@/stores/authStore";

export interface LoginPayload {
  email: string;
  password: string;
  appType: "ADMIN";
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    meta: AuthUser;
  };
}

export interface LoginResult {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export async function loginAdmin(payload: LoginPayload): Promise<LoginResult> {
  const { data } = await axiosInstance.post<LoginResponse>("/admin/auth/login", payload);

  return {
    user: data.data.meta,
    accessToken: data.data.accessToken,
    refreshToken: data.data.refreshToken,
  };
}

export async function logoutAdmin(): Promise<void> {
  await axiosInstance.post("/admin/auth/logout");
}
