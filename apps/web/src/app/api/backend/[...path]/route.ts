import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = (process.env.GIGS_API_URL || "https://springboot-backend-513726246973.europe-west1.run.app").replace(/\/$/, "");
const ROUTES: Record<string, string[]> = {
  getGigsByUserId: ["GET"],
  getGigById: ["GET"],
  addGigToList: ["POST"],
  editGig: ["POST"],
  deleteGig: ["DELETE"],
  getStatsOfUser: ["GET"],
  getGigStats: ["GET"],
  getCountryStatsOfUser: ["GET"],
  "user/preferences": ["GET", "PUT"],
};

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const endpoint = path.join("/");
  if (!Object.hasOwn(ROUTES, endpoint) || !ROUTES[endpoint].includes(request.method)) {
    return NextResponse.json({ message: "Endpoint not found." }, { status: 404 });
  }
  if (request.method !== "GET") {
    const origin = request.headers.get("origin");
    if (origin && origin !== request.nextUrl.origin) {
      return NextResponse.json({ message: "Cross-origin request rejected." }, { status: 403 });
    }
  }
  const token = (await cookies()).get("gigs_token")?.value;
  if (!token) return NextResponse.json({ message: "Session expirée. Reconnecte-toi." }, { status: 401 });
  const upstreamUrl = new URL(`/${endpoint}`, API_URL);
  request.nextUrl.searchParams.forEach((value, key) => upstreamUrl.searchParams.append(key, value));
  try {
    const upstream = await fetch(upstreamUrl, {
      method: request.method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(request.headers.get("content-type") ? { "Content-Type": request.headers.get("content-type")! } : {}),
        Accept: "application/json",
      },
      ...(request.method === "GET" || request.method === "DELETE" ? {} : { body: await request.text() }),
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });
    const body = await upstream.text();
    return new NextResponse(body || null, {
      status: upstream.status,
      headers: { "Content-Type": upstream.headers.get("content-type") ?? "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ message: "Le serveur est momentanément indisponible." }, { status: 503 });
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const DELETE = proxy;
