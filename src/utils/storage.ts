import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const KEYS = {
  TOKEN: "token",
  USER_ID: "userId",
} as const;

/**
 * expo-secure-store n'existe que sur iOS/Android (Keychain/Keystore) : sur le
 * web il n'a aucune implémentation et chaque appel lève une erreur, ce qui
 * bloquait l'écran de démarrage. Sur le web on retombe sur localStorage
 * (moins sécurisé, mais le web ne sert ici qu'au développement).
 */
const isWeb = Platform.OS === "web";

// Si le Keychain/Keystore ne répond pas en 3 s, on renvoie null plutôt que
// de bloquer le démarrage de l'app.
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
    // rien à supprimer / stockage indisponible : on ignore
  }
}

export const storage = {
  getToken: () => getItem(KEYS.TOKEN),
  setToken: (token: string) => setItem(KEYS.TOKEN, token),
  getUserId: () => getItem(KEYS.USER_ID),
  setUserId: (userId: string) => setItem(KEYS.USER_ID, userId),
  async clear(): Promise<void> {
    await Promise.all([removeItem(KEYS.TOKEN), removeItem(KEYS.USER_ID)]);
  },
};
