import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * React Native n'a pas de localStorage : AsyncStorage est l'équivalent
 * asynchrone utilisé ici pour stocker le token JWT et l'userId,
 * exactement comme le faisait le front Angular avec localStorage.
 */
const KEYS = {
  TOKEN: "token",
  USER_ID: "userId",
} as const;

export const storage = {
  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem(KEYS.TOKEN);
  },
  async setToken(token: string): Promise<void> {
    await AsyncStorage.setItem(KEYS.TOKEN, token);
  },
  async getUserId(): Promise<string | null> {
    return AsyncStorage.getItem(KEYS.USER_ID);
  },
  async setUserId(userId: string): Promise<void> {
    await AsyncStorage.setItem(KEYS.USER_ID, userId);
  },
  async clear(): Promise<void> {
    await AsyncStorage.removeMany([KEYS.TOKEN, KEYS.USER_ID]);
  },
};
