import apiClient from "./client";

/**
 * POST /login avec { login, password } en corps JSON.
 * Le backend renvoie directement un JWT sous forme de texte brut.
 */
export async function loginRequest(login: string, password: string): Promise<string> {
  const response = await apiClient.post<string>(
    "/login",
    { login, password },
    {
      responseType: "text",
      transformResponse: (data: string) => data, // pas de parsing JSON : c'est du texte (le JWT)
    }
  );
  return response.data;
}

/**
 * POST /register avec { login, password } en corps JSON.
 * Renvoie un message texte (ou une erreur 409/400 avec un message texte).
 */
export async function registerRequest(login: string, password: string): Promise<string> {
  const response = await apiClient.post<string>(
    "/register",
    { login, password },
    {
      responseType: "text",
      transformResponse: (data: string) => data,
    }
  );
  return response.data;
}
