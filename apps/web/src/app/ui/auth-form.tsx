"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type Props = { mode: "login" | "register" };

export default function AuthForm({ mode }: Props) {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [language, setLanguage] = useState<"fr" | "en">("fr");
  const [currency, setCurrency] = useState("EUR");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (mode === "register" && password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(mode === "login" ? "/api/auth/login" : "/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password, ...(mode === "register" ? { language, currency } : {}) }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.message || "Une erreur est survenue. Réessaie.");
      router.push(mode === "login" ? "/dashboard" : "/login");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Une erreur est survenue. Réessaie.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <label className="field">Identifiant
        <input required autoComplete="username" value={login} onChange={(event) => setLogin(event.target.value)} placeholder="Ton identifiant" />
      </label>
      <label className="field">Mot de passe
        <input required minLength={mode === "register" ? 8 : undefined} type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Ton mot de passe" />
      </label>
      {mode === "register" && <>
        <label className="field">Confirmer le mot de passe
          <input required minLength={8} type="password" autoComplete="new-password" value={confirm} onChange={(event) => setConfirm(event.target.value)} />
        </label>
        <label className="field">Langue
          <select value={language} onChange={(event) => setLanguage(event.target.value as "fr" | "en")}><option value="fr">Français</option><option value="en">English</option></select>
        </label>
        <label className="field">Devise
          <select value={currency} onChange={(event) => setCurrency(event.target.value)}><option value="EUR">EUR — Euro</option><option value="USD">USD — Dollar américain</option><option value="GBP">GBP — Livre sterling</option><option value="CHF">CHF — Franc suisse</option></select>
        </label>
      </>}
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="btn btn-primary" disabled={loading}>{loading ? (mode === "login" ? "Connexion…" : "Création…") : (mode === "login" ? "Se connecter" : "Créer mon compte")}</button>
    </form>
  );
}
