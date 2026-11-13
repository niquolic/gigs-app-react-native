import axios from "axios";
import environment from "@/config/env";
import { storage } from "@/utils/storage";

const apiClient = axios.create({
  baseURL: environment.apiUrl,
  timeout: 15000,
});

// Le backend vérifie désormais le JWT sur toutes les routes sauf /login et
// /register : on attache automatiquement le token à chaque requête.
apiClient.interceptors.request.use(async (config) => {
  const token = await storage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Permet à AuthContext d'être notifié d'un 401 (token expiré/invalide) pour
// déclencher une déconnexion propre.
let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler;
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      onUnauthorized?.();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
