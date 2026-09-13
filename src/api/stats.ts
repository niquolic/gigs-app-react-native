import apiClient from "./client";
import { BandStat, CountryStat } from "@/types/gig";

export async function getBandsStats(userId: string): Promise<BandStat[]> {
  const res = await apiClient.get<BandStat[]>("/getStatsOfUser", { params: { userId } });
  return res.data;
}

export async function getTotalNumberOfGigs(userId: string): Promise<number> {
  const res = await apiClient.get<number>("/getTotalNumberOfGigs", { params: { userId } });
  return res.data;
}

export async function getTotalNumberOfGigsThisYear(userId: string): Promise<number> {
  const res = await apiClient.get<number>("/getTotalNumberOfGigsThisYear", { params: { userId } });
  return res.data;
}

export async function getCountryStatsOfUser(userId: string): Promise<CountryStat[]> {
  const res = await apiClient.get<CountryStat[]>("/getCountryStatsOfUser", { params: { userId } });
  return res.data;
}

export async function getTotalPrice(userId: string): Promise<number> {
  const res = await apiClient.get<number>("/getTotalPrice", { params: { userId } });
  return res.data;
}

export async function getPriceThisYear(userId: string): Promise<number> {
  const res = await apiClient.get<number>("/getPriceThisYear", { params: { userId } });
  return res.data;
}
