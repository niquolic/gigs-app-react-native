import apiClient from "./client";
import { BandStat, CountryStat } from "@/types/gig";
import { withApiCache } from "./cache";

export type BandStatsPage = {
  content: BandStat[];
  page: number;
  size: number;
  hasNext: boolean;
};

export type GigStats = {
  totalNumberOfGigs: number;
  totalNumberOfGigsThisYear: number;
  totalPrice: number;
  priceThisYear: number;
};

export async function getBandsStats(page = 0): Promise<BandStatsPage> {
  return withApiCache(`stats:bands:${page}`, async () => {
    const response = await apiClient.get<BandStatsPage>("/getStatsOfUser", { params: { page } });
    return response.data;
  });
}

export async function getGigStats(): Promise<GigStats> {
  return withApiCache("stats:gigs", async () => {
    const response = await apiClient.get<GigStats>("/getGigStats");
    return response.data;
  });
}

export async function getCountryStatsOfUser(): Promise<CountryStat[]> {
  return withApiCache("stats:countries", async () => {
    const response = await apiClient.get<CountryStat[]>("/getCountryStatsOfUser");
    return response.data;
  });
}
