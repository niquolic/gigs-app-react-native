import * as SecureStore from "expo-secure-store";

const KEYS = {
  TOKEN: "token",
  USER_ID: "userId",
} as const;

export const storage = {
  async getToken(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.TOKEN);
  },
  async setToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(KEYS.TOKEN, token);
  },
  async getUserId(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.USER_ID);
  },
  async setUserId(userId: string): Promise<void> {
    await SecureStore.setItemAsync(KEYS.USER_ID, userId);
  },
  async clear(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(KEYS.TOKEN),
      SecureStore.deleteItemAsync(KEYS.USER_ID),
    ]);
  },
};