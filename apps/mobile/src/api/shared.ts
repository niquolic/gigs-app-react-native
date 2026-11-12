import type { ApiRequest } from "@gigs/shared/api/create-gigs-api";
import { createGigsApi } from "@gigs/shared/api/create-gigs-api";
import apiClient from "./client";

const transport: ApiRequest = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
  const response = await apiClient.request<T>({
    url: path,
    method: init.method ?? "GET",
    data: init.body,
    ...(init.body ? { headers: { "Content-Type": "application/json" } } : {}),
  });
  return response.data;
};

export const sharedApi = createGigsApi(transport);
