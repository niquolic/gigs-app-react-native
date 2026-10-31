import apiClient from "./client";

export type UserPreferences = {
  language: "fr" | "en";
  currency: string;
};

export async function getUserPreferences(): Promise<UserPreferences> {
  const response = await apiClient.get<UserPreferences>("/user/preferences");
  return response.data;
}

export async function updateUserPreferences(
  preferences: UserPreferences
): Promise<UserPreferences> {
  const response = await apiClient.put<UserPreferences>("/user/preferences", preferences);
  return response.data;
}
