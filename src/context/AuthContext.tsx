import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginRequest } from "@/api/auth";
import {
  getUserPreferences,
  updateUserPreferences,
  UserPreferences,
} from "@/api/preferences";
import { setUnauthorizedHandler } from "@/api/client";
import { storage } from "@/utils/storage";
import { decodeToken, isTokenExpired } from "@/utils/jwt";
import { translate, TranslationKey } from "@/i18n/translations";

const DEFAULT_PREFERENCES: UserPreferences = { language: "en", currency: "EUR" };

type AuthContextValue = {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
  preferences: UserPreferences;
  login: (login: string, password: string) => Promise<void>;
  updatePreferences: (preferences: UserPreferences) => Promise<void>;
  logout: () => Promise<void>;
  t: (key: TranslationKey) => string;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);

  const logout = async () => {
    await storage.clear();
    setIsAuthenticated(false);
    setUserId(null);
    setPreferences(DEFAULT_PREFERENCES);
  };

  useEffect(() => {
    setUnauthorizedHandler(() => {
      void logout();
    });

    (async () => {
      try {
        const token = await storage.getToken();
        const storedUserId = await storage.getUserId();
        const storedPreferences = await storage.getPreferences();

        if (token && storedUserId && !isTokenExpired(token)) {
          setIsAuthenticated(true);
          setUserId(storedUserId);
          if (storedPreferences) setPreferences(storedPreferences);

          try {
            const latestPreferences = await getUserPreferences();
            setPreferences(latestPreferences);
            await storage.setPreferences(latestPreferences);
          } catch {
            // Keep locally cached preferences when the API is temporarily unavailable.
          }
        }
      } catch {
        // An unreadable secure store is treated as a signed-out state.
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (loginValue: string, password: string) => {
    const token = await loginRequest(loginValue, password);
    const decoded = decodeToken(token);
    await storage.setToken(token);
    await storage.setUserId(decoded.userId.toString());

    setUserId(decoded.userId.toString());
    try {
      const userPreferences = await getUserPreferences();
      setPreferences(userPreferences);
      await storage.setPreferences(userPreferences);
    } catch {
      setPreferences(DEFAULT_PREFERENCES);
      await storage.setPreferences(DEFAULT_PREFERENCES);
    }
    setIsAuthenticated(true);
  };

  const updatePreferences = async (nextPreferences: UserPreferences) => {
    const savedPreferences = await updateUserPreferences(nextPreferences);
    setPreferences(savedPreferences);
    await storage.setPreferences(savedPreferences);
  };

  const t = (key: TranslationKey) => translate(preferences.language, key);

  const value = useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      userId,
      preferences,
      login,
      updatePreferences,
      logout,
      t,
    }),
    [isAuthenticated, isLoading, userId, preferences]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
