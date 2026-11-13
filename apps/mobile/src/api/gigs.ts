import type { Gig, GigFormValues } from "@/types/gig";
import { clearApiCache, withApiCache } from "./cache";
import { sharedApi } from "./shared";

/** Authenticated gig endpoints are shared with the web application. */
export async function getGigsByUserId(userId: string): Promise<Gig[]> {
  return withApiCache(`gigs:list:${userId}`, () => sharedApi.getGigs());
}

export async function getGigById(id: number | string): Promise<Gig> {
  return withApiCache(`gigs:detail:${id}`, () => sharedApi.getGig(String(id)));
}

export async function addGig(_userId: string, values: GigFormValues): Promise<void> {
  await sharedApi.addGig(values);
  clearApiCache();
}

export async function editGig(_userId: string, gig: Gig): Promise<void> {
  await sharedApi.editGig(gig);
  clearApiCache();
}

export async function deleteGig(id: string): Promise<void> {
  await sharedApi.deleteGig(id);
  clearApiCache();
}
