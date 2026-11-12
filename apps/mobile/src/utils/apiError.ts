type ApiErrorPayload = {
  detail?: unknown;
  message?: unknown;
  title?: unknown;
  errors?: unknown;
};

function parsePayload(data: unknown): ApiErrorPayload | null {
  if (typeof data === "string") {
    try {
      const parsed: unknown = JSON.parse(data);
      return parsed && typeof parsed === "object" ? parsed as ApiErrorPayload : null;
    } catch {
      return data.trim() ? { detail: data.trim() } : null;
    }
  }

  return data && typeof data === "object" ? data as ApiErrorPayload : null;
}

/**
 * Returns a user-friendly message from the backend without exposing technical
 * Axios/network details or raw server exceptions.
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  const apiError = error as {
    response?: { status?: number; data?: unknown };
    request?: unknown;
  };

  const payload = parsePayload(apiError?.response?.data);
  const backendMessage = [payload?.detail, payload?.message, payload?.errors]
    .find((value) => typeof value === "string" && value.trim().length > 0);

  if (typeof backendMessage === "string") return backendMessage.trim();

  if (apiError?.response?.status === 400) {
    return "Certaines informations sont invalides. Vérifie les champs et réessaie.";
  }
  if (apiError?.response?.status === 401 || apiError?.response?.status === 404) {
    return "Identifiant ou mot de passe incorrect.";
  }
  if (apiError?.response?.status === 409) {
    return "Cette opération est impossible car ces informations sont déjà utilisées.";
  }
  if (apiError?.response?.status && apiError.response.status >= 500) {
    return "Le serveur rencontre un problème. Réessaie un peu plus tard.";
  }
  if (!apiError?.response && apiError?.request) {
    return "Impossible de joindre le serveur. Vérifie ta connexion et réessaie.";
  }

  return fallback;
}
