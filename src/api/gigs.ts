import apiClient from "./client";
import { Gig, GigFormValues } from "@/types/gig";

/** GET /getGigsByUserId?userId= */
export async function getGigsByUserId(userId: string): Promise<Gig[]> {
  const response = await apiClient.get<Gig[]>("/getGigsByUserId", {
    params: { userId },
  });
  return response.data;
}

/** GET /getGigById?id= */
export async function getGigById(id: number | string): Promise<Gig> {
  const response = await apiClient.get<Gig>("/getGigById", { params: { id } });
  return response.data;
}

/** POST /addGigToList?userId= */
export async function addGig(userId: string, values: GigFormValues): Promise<void> {
  await apiClient.post(
    "/addGigToList",
    { userId, ...values },
    { params: { userId } }
  );
}

/** POST /editGig?userId= (le body attend le gig complet, id inclus) */
export async function editGig(userId: string, gig: Gig): Promise<void> {
  await apiClient.post("/editGig", gig, {
    params: { userId },
    responseType: "text",
  });
}

/** POST /deleteGig?userId= (le body est directement l'id du gig) */
export async function deleteGig(userId: string, id: number): Promise<void> {
  await apiClient.post("/deleteGig", id, {
    params: { userId },
    responseType: "text",
    headers: { "Content-Type": "application/json" },
  });
}
