import type { BandStatsPage, GigStats, UserPreferences, GigsApi } from "./contracts";
import type { CountryStat, Gig, GigFormValues } from "../types/gig";

export type ApiRequest = <T>(path: string, init?: RequestInit) => Promise<T>;

export function createGigsApi(request: ApiRequest): GigsApi {
  return {
    getGigs: () => request<Gig[]>("/getGigsByUserId"),
    getGig: (id: string) => request<Gig>(`/getGigById?id=${encodeURIComponent(id)}`),
    addGig: (values: Omit<GigFormValues, "price"> & { price: string | number }) => request<Gig>("/addGigToList", { method: "POST", body: JSON.stringify(values) }),
    editGig: (gig: Gig) => request<Gig>("/editGig", { method: "POST", body: JSON.stringify(gig) }),
    deleteGig: (id: string) => request<void>(`/deleteGig?id=${encodeURIComponent(id)}`, { method: "DELETE" }),
    getBandStats: (page = 0) => request<BandStatsPage>(`/getStatsOfUser?page=${page}`),
    getGigStats: () => request<GigStats>("/getGigStats"),
    getCountryStats: () => request<CountryStat[]>("/getCountryStatsOfUser"),
    getPreferences: () => request<UserPreferences>("/user/preferences"),
    updatePreferences: (preferences: UserPreferences) => request<UserPreferences>("/user/preferences", { method: "PUT", body: JSON.stringify(preferences) }),
  };
}
