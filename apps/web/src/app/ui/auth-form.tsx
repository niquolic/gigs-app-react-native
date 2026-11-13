"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type Props = { mode: "login" | "register" };

const fieldClass = "mt-2 block w-full rounded-xl border border-white/10 bg-[#080f1d] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/10";
const labelClass = "mb-5 block text-sm font-semibold text-slate-300";

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
    <form onSubmit={submit} className="space-y-1">
      <label className={labelClass}>Identifiant
        <input className={fieldClass} required autoComplete="username" value={login} onChange={(event) => setLogin(event.target.value)} placeholder="Ton identifiant" />
      </label>
      <label className={labelClass}>Mot de passe
        <input className={fieldClass} required minLength={mode === "register" ? 8 : undefined} type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Ton mot de passe" />
      </label>
      {mode === "register" && <>
        <label className={labelClass}>Confirmer le mot de passe
          <input className={fieldClass} required minLength={8} type="password" autoComplete="new-password" value={confirm} onChange={(event) => setConfirm(event.target.value)} />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className={labelClass}>Langue
            <select className={fieldClass} value={language} onChange={(event) => setLanguage(event.target.value as "fr" | "en")}><option value="fr">Français</option><option value="en">English</option></select>
          </label>
          <label className={labelClass}>Devise
            <select className={fieldClass} value={currency} onChange={(event) => setCurrency(event.target.value)}><option value="EUR">EUR — Euro</option><option value="USD">USD — Dollar américain</option><option value="GBP">GBP — Livre sterling</option><option value="CHF">CHF — Franc suisse</option></select>
          </label>
        </div>
      </>}
      {error && <p className="mb-4 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200" role="alert">{error}</p>}
      <button className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-indigo-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-950/40 transition hover:-translate-y-0.5 hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60" disabled={loading}>{loading ? (mode === "login" ? "Connexion…" : "Création…") : (mode === "login" ? "Se connecter" : "Créer mon compte")}</button>
    </form>
  );
}
