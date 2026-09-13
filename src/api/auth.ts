import apiClient from "./client";

/**
 * Appelle GET /getUserByLoginAndPassword?login=&password=
 * Le backend renvoie directement un JWT sous forme de texte brut
 * (identique à LoginComponent.onSubmitForm dans le projet Angular).
 */
export async function loginRequest(login: string, password: string): Promise<string> {
  const response = await apiClient.get<string>("/getUserByLoginAndPassword", {
    params: { login, password },
    responseType: "text",
    transformResponse: (data) => data, // on ne veut pas de parsing JSON, c'est du texte (le JWT)
  });
  return response.data;
}
