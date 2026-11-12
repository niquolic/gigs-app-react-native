import type { CountryStat } from "@/types/gig";
import type { BandStatsPage, GigStats } from "@gigs/shared/api/contracts";
import { withApiCache } from "./cache";
import { sharedApi } from "./shared";

export type { BandStatsPage, GigStats };

export async function getBandsStats(page = 0): Promise<BandStatsPage> {
  return withApiCache(`stats:bands:${page}`, () => sharedApi.getBandStats(page));
}

export async function getGigStats(): Promise<GigStats> {
  return withApiCache("stats:gigs", () => sharedApi.getGigStats());
}

export async function getCountryStatsOfUser(): Promise<CountryStat[]> {
  return withApiCache("stats:countries", () => sharedApi.getCountryStats());
}
