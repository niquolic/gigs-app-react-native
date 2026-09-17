import apiClient from "./client";

/**
 * Appelle POST /login
 * Le backend renvoie directement un JWT sous forme de texte brut
 * (identique à LoginComponent.onSubmitForm dans le projet Angular).
 */
export async function loginRequest(login: string, password: string): Promise<string> {
  const response = await apiClient.post<string>("/login", {
    body: { login, password },
    responseType: "text",
    transformResponse: (data: string) => data, // on ne veut pas de parsing JSON, c'est du texte (le JWT)
  });
  return response.data;
}
