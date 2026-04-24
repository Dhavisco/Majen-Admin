"use client";

import { create } from "zustand";

export interface UserRole {
  name: string;
  slug: string;
  permissions: string[];
}

export interface AuthUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  image: string | null;
  role: UserRole;
  businessVerificationStatus: string | null;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  hydrated: boolean;
  setAuth: (user: AuthUser, accessToken: string, refreshToken: string) => void;
  updateAccessToken: (accessToken: string) => void;
  clearAuth: () => void;
  logout: () => void;
  hydrateFromStorage: () => void;
  markHydrated: () => void;
}

const STORAGE_KEYS = {
  user: "auth_user",
  accessToken: "access_token",
  refreshToken: "refresh_token",
} as const;

const getStorage = () => (typeof window !== "undefined" ? window.sessionStorage : null);

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  hydrated: false,

  setAuth: (user, accessToken, refreshToken) => {
    const storage = getStorage();

    storage?.setItem(STORAGE_KEYS.user, JSON.stringify(user));
    storage?.setItem(STORAGE_KEYS.accessToken, accessToken);
    storage?.setItem(STORAGE_KEYS.refreshToken, refreshToken);

    set({ user, accessToken, refreshToken });
  },

  updateAccessToken: (accessToken) => {
    const storage = getStorage();
    storage?.setItem(STORAGE_KEYS.accessToken, accessToken);
    set({ accessToken });
  },

  clearAuth: () => {
    const storage = getStorage();

    storage?.removeItem(STORAGE_KEYS.user);
    storage?.removeItem(STORAGE_KEYS.accessToken);
    storage?.removeItem(STORAGE_KEYS.refreshToken);

    set({ user: null, accessToken: null, refreshToken: null });
  },

  logout: () => {
    const storage = getStorage();

    storage?.removeItem(STORAGE_KEYS.user);
    storage?.removeItem(STORAGE_KEYS.accessToken);
    storage?.removeItem(STORAGE_KEYS.refreshToken);

    set({ user: null, accessToken: null, refreshToken: null });
  },

  hydrateFromStorage: () => {
    const storage = getStorage();

    if (!storage) {
      set({ hydrated: true });
      return;
    }

    const userRaw = storage.getItem(STORAGE_KEYS.user);
    const accessToken = storage.getItem(STORAGE_KEYS.accessToken);
    const refreshToken = storage.getItem(STORAGE_KEYS.refreshToken);

    if (!userRaw || !accessToken || !refreshToken) {
      set({ user: null, accessToken: null, refreshToken: null, hydrated: true });
      return;
    }

    try {
      const user: AuthUser = JSON.parse(userRaw);
      set({ user, accessToken, refreshToken, hydrated: true });
    } catch {
      storage.removeItem(STORAGE_KEYS.user);
      storage.removeItem(STORAGE_KEYS.accessToken);
      storage.removeItem(STORAGE_KEYS.refreshToken);
      set({ user: null, accessToken: null, refreshToken: null, hydrated: true });
    }
  },

  markHydrated: () => set({ hydrated: true }),
}));
