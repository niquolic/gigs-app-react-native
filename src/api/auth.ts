import apiClient from "./client";

export async function loginRequest(login: string, password: string): Promise<string> {
  const response = await apiClient.post<string>(
    "/login",
    { login, password },
    {
      responseType: "text",
      transformResponse: (data: string) => data,
    }
  );
  return response.data;
}

export type RegisterPreferences = {
  language?: "fr" | "en";
  currency?: string;
};

export async function registerRequest(
  login: string,
  password: string,
  preferences: RegisterPreferences = {}
): Promise<string> {
  const response = await apiClient.post<string>(
    "/register",
    { login, password, ...preferences },
    {
      responseType: "text",
      transformResponse: (data: string) => data,
    }
  );
  return response.data;
}
