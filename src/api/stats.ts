import apiClient from "./client";
import { BandStat, CountryStat } from "@/types/gig";

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
  const response = await apiClient.get<BandStatsPage>("/getStatsOfUser", { params: { page } });
  return response.data;
}

export async function getGigStats(): Promise<GigStats> {
  const response = await apiClient.get<GigStats>("/getGigStats");
  return response.data;
}

export async function getCountryStatsOfUser(): Promise<CountryStat[]> {
  const response = await apiClient.get<CountryStat[]>("/getCountryStatsOfUser");
  return response.data;
}
