import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { UserPreferences } from "@/api/preferences";

const KEYS = {
  TOKEN: "token",
  USER_ID: "userId",
  PREFERENCES: "userPreferences",
} as const;

const isWeb = Platform.OS === "web";

const withTimeout = <T,>(p: Promise<T>, fallback: T, ms = 3000): Promise<T> =>
  Promise.race([p, new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms))]);

async function getItem(key: string): Promise<string | null> {
  try {
    if (isWeb) return globalThis.localStorage?.getItem(key) ?? null;
    return await withTimeout(SecureStore.getItemAsync(key), null);
  } catch {
    return null;
  }
}

async function setItem(key: string, value: string): Promise<void> {
  if (isWeb) {
    globalThis.localStorage?.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function removeItem(key: string): Promise<void> {
  try {
    if (isWeb) {
      globalThis.localStorage?.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  } catch {
    // Ignore unavailable or missing storage entries.
  }
}

export const storage = {
  getToken: () => getItem(KEYS.TOKEN),
  setToken: (token: string) => setItem(KEYS.TOKEN, token),
  getUserId: () => getItem(KEYS.USER_ID),
  setUserId: (userId: string) => setItem(KEYS.USER_ID, userId),
  async getPreferences(): Promise<UserPreferences | null> {
    const value = await getItem(KEYS.PREFERENCES);
    if (!value) return null;
    try {
      return JSON.parse(value) as UserPreferences;
    } catch {
      return null;
    }
  },
  setPreferences: (preferences: UserPreferences) =>
    setItem(KEYS.PREFERENCES, JSON.stringify(preferences)),
  async clear(): Promise<void> {
    await Promise.all([
      removeItem(KEYS.TOKEN),
      removeItem(KEYS.USER_ID),
      removeItem(KEYS.PREFERENCES),
    ]);
  },
};
