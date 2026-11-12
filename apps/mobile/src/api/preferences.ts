import type { UserPreferences } from "@gigs/shared/api/contracts";
import { sharedApi } from "./shared";

export type { UserPreferences };

export async function getUserPreferences(): Promise<UserPreferences> {
  return sharedApi.getPreferences();
}

export async function updateUserPreferences(preferences: UserPreferences): Promise<UserPreferences> {
  return sharedApi.updatePreferences(preferences);
}
