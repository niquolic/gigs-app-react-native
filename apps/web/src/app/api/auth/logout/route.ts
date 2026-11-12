import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = (process.env.GIGS_API_URL || "https://springboot-backend-513726246973.europe-west1.run.app").replace(/\/$/, "");

export async function POST(request: NextRequest) {
  const token = (await cookies()).get("gigs_token")?.value;
  if (token) {
    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
      });
    } catch {
      // Always clear the browser session, even if revocation is temporarily unavailable.
    }
  }
  const response = NextResponse.redirect(new URL("/", request.url), 303);
  response.cookies.set("gigs_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
