import { createGigsApi } from "@gigs/shared/api/create-gigs-api";

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api/backend${path.startsWith("/") ? path : `/${path}`}`, {
    ...init,
    headers: { ...(init.body ? { "Content-Type": "application/json" } : {}), ...init.headers },
    cache: "no-store",
  });
  if (response.status === 401) throw new Error("Session expirée. Reconnecte-toi.");
  if (response.status === 204) return undefined as T;
  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("json") ? await response.json() : await response.text();
  if (!response.ok) {
    const message = typeof payload === "string" ? payload : payload?.detail ?? payload?.message ?? "Une erreur est survenue.";
    throw new Error(message);
  }
  return payload as T;
}

export const api = createGigsApi(request);
