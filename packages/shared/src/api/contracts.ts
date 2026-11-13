import type { BandStat, CountryStat, Gig, GigFormValues } from "../types/gig";

export type AppLanguage = "fr" | "en";
export type UserPreferences = { language: AppLanguage; currency: string };
export type RegisterPreferences = Partial<UserPreferences>;
export type BandStatsPage = { content: BandStat[]; page: number; size: number; hasNext: boolean };
export type GigStats = {
  totalNumberOfGigs: number;
  totalNumberOfGigsThisYear: number;
  totalPrice: number;
  priceThisYear: number;
};

export interface GigsApi {
  getGigs(): Promise<Gig[]>;
  getGig(id: string): Promise<Gig>;
  addGig(values: Omit<GigFormValues, "price"> & { price: string | number }): Promise<Gig>;
  editGig(gig: Gig): Promise<Gig>;
  deleteGig(id: string): Promise<void>;
  getBandStats(page?: number): Promise<BandStatsPage>;
  getGigStats(): Promise<GigStats>;
  getCountryStats(): Promise<CountryStat[]>;
  getPreferences(): Promise<UserPreferences>;
  updatePreferences(preferences: UserPreferences): Promise<UserPreferences>;
}
