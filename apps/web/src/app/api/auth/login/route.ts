import { NextRequest, NextResponse } from "next/server";

const API_URL = (process.env.GIGS_API_URL || "https://springboot-backend-513726246973.europe-west1.run.app").replace(/\/$/, "");

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || !("login" in body) || !("password" in body) ||
        typeof body.login !== "string" || typeof body.password !== "string" ||
        !body.login.trim() || !body.password) {
      return NextResponse.json({ message: "Renseigne ton identifiant et ton mot de passe." }, { status: 400 });
    }
    const upstream = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "text/plain" },
      body: JSON.stringify({ login: body.login.trim(), password: body.password }),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    const token = (await upstream.text()).trim();
    if (!upstream.ok || !token) {
      return NextResponse.json({ message: upstream.ok ? "La connexion a échoué." : "Identifiant ou mot de passe incorrect." }, { status: upstream.status || 401 });
    }
    const response = NextResponse.json({ authenticated: true });
    response.cookies.set("gigs_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  } catch {
    return NextResponse.json({ message: "Le serveur est momentanément indisponible." }, { status: 503 });
  }
}
