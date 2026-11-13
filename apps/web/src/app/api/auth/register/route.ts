import { NextRequest, NextResponse } from "next/server";

const API_URL = (process.env.GIGS_API_URL || "https://springboot-backend-513726246973.europe-west1.run.app").replace(/\/$/, "");

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) {
    return NextResponse.json({ message: "Cross-origin request rejected." }, { status: 403 });
  }
  try {
    const data: unknown = await request.json();
    if (!data || typeof data !== "object" || !("login" in data) || !("password" in data) ||
        typeof data.login !== "string" || typeof data.password !== "string" ||
        !data.login.trim() || data.password.length < 8) {
      return NextResponse.json({ message: "Vérifie ton identifiant et choisis un mot de passe d'au moins 8 caractères." }, { status: 400 });
    }
    const language = "language" in data && (data.language === "fr" || data.language === "en") ? data.language : "en";
    const currency = "currency" in data && typeof data.currency === "string" && /^[A-Z]{3}$/.test(data.currency) ? data.currency : "EUR";
    const upstream = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "text/plain" },
      body: JSON.stringify({ login: data.login.trim(), password: data.password, language, currency }),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    const message = await upstream.text();
    if (!upstream.ok) {
      let detail = message;
      try {
        const problem = JSON.parse(message);
        detail = problem.detail ?? problem.message ?? message;
      } catch { /* Plain-text backend error. */ }
      return NextResponse.json({ message: detail || "La création du compte a échoué." }, { status: upstream.status });
    }
    return NextResponse.json({ registered: true });
  } catch {
    return NextResponse.json({ message: "Le serveur est momentanément indisponible." }, { status: 503 });
  }
}
