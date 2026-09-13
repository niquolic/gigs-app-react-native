import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginRequest } from "@/api/auth";
import { storage } from "@/utils/storage";
import { decodeToken, isTokenExpired } from "@/utils/jwt";

type AuthContextValue = {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
  login: (login: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Au démarrage de l'app : équivalent du AuthGuard Angular qui vérifie
  // localStorage.getItem('token') avant d'autoriser l'accès aux pages.
  useEffect(() => {
    (async () => {
      const token = await storage.getToken();
      const storedUserId = await storage.getUserId();
      if (token && !isTokenExpired(token)) {
        setIsAuthenticated(true);
        setUserId(storedUserId);
      }
      setIsLoading(false);
    })();
  }, []);

  const login = async (loginValue: string, password: string) => {
    const token = await loginRequest(loginValue, password);
    const decoded = decodeToken(token);
    await storage.setToken(token);
    await storage.setUserId(decoded.userId.toString());
    setUserId(decoded.userId.toString());
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await storage.clear();
    setIsAuthenticated(false);
    setUserId(null);
  };

  const value = useMemo(
    () => ({ isAuthenticated, isLoading, userId, login, logout }),
    [isAuthenticated, isLoading, userId]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
