"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Gig } from "@gigs/shared/types/gig";
import type { AppLanguage, UserPreferences } from "@gigs/shared/api/contracts";
import { api } from "../../lib/api";

type GigDraft = { bands: string; date: string; city: string; country: string; venue: string; price: string };
const EMPTY_DRAFT: GigDraft = { bands: "", date: "", city: "", country: "", venue: "", price: "0" };

const messages = {
  fr: {
    greeting: "Ton histoire musicale", subtitle: "Retrouve tes concerts, tes statistiques et les souvenirs qui vont avec.",
    add: "Ajouter un concert", total: "Concerts enregistrés", year: "Cette année", spent: "Dépenses totales", spentYear: "Dépenses cette année",
    recent: "Ton historique", noGigs: "Pas encore de concert enregistré.", first: "Ajoute ton premier concert",
    bands: "Groupes les plus vus", countries: "Pays visités", more: "Voir plus", settings: "Préférences",
    language: "Langue", currency: "Devise", save: "Enregistrer", cancel: "Annuler", edit: "Modifier", delete: "Supprimer",
    logout: "Se déconnecter", date: "Date", artists: "Artistes (séparés par des virgules)", venue: "Salle", city: "Ville",
    country: "Pays", price: "Prix payé", create: "Enregistrer le concert", update: "Enregistrer les modifications",
    loading: "Chargement de ton espace…", error: "Impossible de charger tes données.", retry: "Réessayer",
    confirmDelete: "Supprimer ce concert ? Cette action est définitive.", prefsSaved: "Préférences enregistrées.",
  },
  en: {
    greeting: "Your music story", subtitle: "Your gigs, stats and the memories that come with them.",
    add: "Add a gig", total: "Gigs recorded", year: "This year", spent: "Total spending", spentYear: "Spending this year",
    recent: "Your history", noGigs: "No gigs recorded yet.", first: "Add your first gig",
    bands: "Most-seen bands", countries: "Countries visited", more: "Show more", settings: "Preferences",
    language: "Language", currency: "Currency", save: "Save", cancel: "Cancel", edit: "Edit", delete: "Delete",
    logout: "Log out", date: "Date", artists: "Artists (comma separated)", venue: "Venue", city: "City",
    country: "Country", price: "Price paid", create: "Save gig", update: "Save changes",
    loading: "Loading your space…", error: "Could not load your data.", retry: "Try again",
    confirmDelete: "Delete this gig? This cannot be undone.", prefsSaved: "Preferences saved.",
  },
} as const;

function formatMoney(value: number | string | null | undefined, currency: string, language: AppLanguage) {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat(language === "fr" ? "fr-FR" : "en-GB", { style: "currency", currency, maximumFractionDigits: 2 }).format(Number.isFinite(amount) ? amount : 0);
}

export default function DashboardClient() {
  const router = useRouter();
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [gigStats, setGigStats] = useState<{ totalNumberOfGigs: number; totalNumberOfGigsThisYear: number; totalPrice: number; priceThisYear: number } | null>(null);
  const [bands, setBands] = useState<{ band: string; count: number }[]>([]);
  const [countries, setCountries] = useState<{ country: string; count: number }[]>([]);
  const [hasMoreBands, setHasMoreBands] = useState(false);
  const [bandPage, setBandPage] = useState(0);
  const [preferences, setPreferences] = useState<UserPreferences>({ language: "fr", currency: "EUR" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Gig | null>(null);
  const [draft, setDraft] = useState<GigDraft>(EMPTY_DRAFT);
  const [notice, setNotice] = useState("");

  const t = messages[preferences.language];
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [gigList, stats, bandPageResult, countryStats, prefs] = await Promise.all([
        api.getGigs(), api.getGigStats(), api.getBandStats(0), api.getCountryStats(), api.getPreferences(),
      ]);
      setGigs(gigList);
      setGigStats(stats);
      setBands(bandPageResult.content);
      setHasMoreBands(bandPageResult.hasNext);
      setBandPage(0);
      setCountries(countryStats);
      setPreferences(prefs);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "";
      if (message.toLowerCase().includes("session") || message.includes("401")) router.replace("/login");
      else setError(message || t.error);
    } finally {
      setLoading(false);
    }
  }, [router, t.error]);

  useEffect(() => { void load(); }, [load]);

  const openCreate = () => { setEditing(null); setDraft(EMPTY_DRAFT); setEditorOpen(true); };
  const openEdit = (gig: Gig) => {
    setEditing(gig);
    setDraft({ bands: gig.bands.join(", "), date: gig.date.slice(0, 10), city: gig.city, country: gig.country, venue: gig.venue, price: String(gig.price ?? 0) });
    setEditorOpen(true);
  };

  async function saveGig(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const bandNames = draft.bands.split(",").map((band) => band.trim()).filter(Boolean);
    if (!bandNames.length) { setNotice(preferences.language === "fr" ? "Ajoute au moins un artiste." : "Add at least one artist."); return; }
    setSaving(true); setNotice("");
    try {
      const gig = { ...(editing ? { id: editing.id } : {}), bands: bandNames, date: draft.date, city: draft.city.trim(), country: draft.country.trim(), venue: draft.venue.trim(), price: Number(draft.price || 0) };
      if (editing) await api.editGig(gig as Gig);
      else await api.addGig(gig);
      setEditorOpen(false);
      await load();
    } catch (cause) {
      setNotice(cause instanceof Error ? cause.message : t.error);
    } finally { setSaving(false); }
  }

  async function removeGig(gig: Gig) {
    if (!window.confirm(t.confirmDelete)) return;
    try { await api.deleteGig(gig.id); setGigs((current) => current.filter((item) => item.id !== gig.id)); await load(); }
    catch (cause) { setNotice(cause instanceof Error ? cause.message : t.error); }
  }

  async function loadMoreBands() {
    const nextPage = bandPage + 1;
    try {
      const result = await api.getBandStats(nextPage);
      setBands((current) => [...current, ...result.content]);
      setBandPage(nextPage);
      setHasMoreBands(result.hasNext);
    } catch (cause) { setNotice(cause instanceof Error ? cause.message : t.error); }
  }

  async function savePreferences(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setNotice("");
    try { const saved = await api.updatePreferences(preferences); setPreferences(saved); setNotice(messages[saved.language].prefsSaved); }
    catch (cause) { setNotice(cause instanceof Error ? cause.message : t.error); }
    finally { setSaving(false); }
  }

  const sortedGigs = useMemo(() => [...gigs].sort((a, b) => b.date.localeCompare(a.date)), [gigs]);

  if (loading) return <main className="grid min-h-screen place-content-center justify-items-center gap-4 text-slate-400"><span className="flex items-center gap-2 text-xl font-extrabold text-white"><span className="grid size-9 place-items-center rounded-xl bg-indigo-500/15 text-xl text-indigo-300">♫</span> gigs</span><p className="text-sm leading-6 text-slate-400">{t.loading}</p></main>;

  return (
    <main className="min-h-screen bg-[#080d19] text-slate-100">
      <header className="flex h-16 items-center justify-between border-b border-white/10 bg-[#080d19]/80 px-4 backdrop-blur-xl sm:h-[76px] sm:px-8 lg:px-[max(24px,calc((100%-1240px)/2))]">
        <Link className="flex items-center gap-2 text-xl font-extrabold text-white" href="/"><span className="grid size-9 place-items-center rounded-xl bg-indigo-500/15 text-xl text-indigo-300">♫</span> gigs</Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <a className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08] hover:text-white" href="#preferences">{t.settings}</a>
          <form action="/api/auth/logout" method="post"><button className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08] hover:text-white" type="submit">{t.logout}</button></form>
        </div>
      </header>
      <div className="mx-auto w-[calc(100%-30px)] max-w-[1240px] py-9 sm:w-[calc(100%-48px)] sm:py-14">
        <section className="mb-7 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div><span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[.18em] text-indigo-300"><i className="size-1.5 rounded-full bg-amber-300" /> TON ESPACE PERSONNEL</span><h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">{t.greeting}<span className="bg-gradient-to-r from-indigo-300 to-amber-200 bg-clip-text text-transparent">.</span></h1><p className="text-sm leading-6 text-slate-400">{t.subtitle}</p></div>
          <button className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 bg-indigo-500 text-white shadow-lg shadow-indigo-950/40 hover:bg-indigo-400" onClick={openCreate}>＋ {t.add}</button>
        </section>
        {error && <div className="mb-5 flex flex-col items-start justify-between gap-3 rounded-xl border border-rose-400/25 bg-rose-400/10 p-4 text-sm text-rose-200 sm:flex-row sm:items-center" role="alert"><span>{error}</span><button className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08] hover:text-white" onClick={() => void load()}>{t.retry}</button></div>}
        {gigStats && <section className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <article className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#141f34] to-[#0e1626] p-4 sm:p-5"><span className="block text-xs text-slate-400">{t.total}</span><strong className="text-xl font-bold tracking-tight text-white">{gigStats.totalNumberOfGigs ?? 0}</strong><small className="absolute right-4 top-4 text-lg text-indigo-300">♫</small></article>
          <article className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#141f34] to-[#0e1626] p-4 sm:p-5"><span className="block text-xs text-slate-400">{t.year}</span><strong className="text-xl font-bold tracking-tight text-white">{gigStats.totalNumberOfGigsThisYear ?? 0}</strong><small className="absolute right-4 top-4 text-lg text-indigo-300">↗</small></article>
          <article className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#141f34] to-[#0e1626] p-4 sm:p-5"><span className="block text-xs text-slate-400">{t.spent}</span><strong className="text-xl font-bold tracking-tight text-white">{formatMoney(gigStats.totalPrice, preferences.currency, preferences.language)}</strong><small className="absolute right-4 top-4 text-lg text-indigo-300">€</small></article>
          <article className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#141f34] to-[#0e1626] p-4 sm:p-5"><span className="block text-xs text-slate-400">{t.spentYear}</span><strong className="text-xl font-bold tracking-tight text-white">{formatMoney(gigStats.priceThisYear, preferences.currency, preferences.language)}</strong><small className="absolute right-4 top-4 text-lg text-indigo-300">◷</small></article>
        </section>}
        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(280px,.8fr)]">
          <section className="min-w-0 rounded-2xl border border-white/10 bg-gradient-to-br from-[#121c30] to-[#0d1423] p-4 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3"><div><span className="text-[9px] font-bold tracking-[.15em] text-indigo-300">COLLECTION</span><h2 className="mt-1 text-lg font-bold text-white">{t.recent}</h2></div><span className="rounded-lg bg-indigo-400/10 px-3 py-1.5 text-xs text-indigo-200">{gigs.length}</span></div>
            {sortedGigs.length === 0 ? <div className="border-t border-white/[0.07] px-4 py-12 text-center"><span>🎟️</span><h3 className="mb-4 mt-3 text-sm font-semibold text-slate-200">{t.noGigs}</h3><button className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 bg-indigo-500 text-white shadow-lg shadow-indigo-950/40 hover:bg-indigo-400" onClick={openCreate}>{t.first}</button></div> :
              <div className="grid">{sortedGigs.map((gig) => <article className="grid grid-cols-[52px_minmax(0,1fr)_auto] items-center gap-3 border-t border-white/[0.07] py-4 sm:grid-cols-[68px_minmax(0,1fr)_auto] sm:gap-4" key={gig.id}>
                <div className="border-r border-dashed border-slate-500/40 pr-2 text-center sm:pr-3"><strong className="text-xl font-bold tracking-tight text-white">{new Date(gig.date).getDate()}</strong><span className="mt-1 block text-[10px] text-slate-400">{new Intl.DateTimeFormat(preferences.language === "fr" ? "fr-FR" : "en-GB", { month: "short", year: "numeric" }).format(new Date(gig.date))}</span></div>
                <div className="min-w-0"><h3 className="mb-4 mt-3 text-sm font-semibold text-slate-200">{gig.bands.join(" · ")}</h3><p className="text-sm leading-6 text-slate-400">{gig.venue} · {gig.city}, {gig.country}</p></div>
                <div className="text-right"><strong className="text-xl font-bold tracking-tight text-white">{formatMoney(gig.price, preferences.currency, preferences.language)}</strong><div className="mt-2 flex justify-end gap-1.5"><button className="grid size-7 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:bg-indigo-400/20" aria-label={t.edit} onClick={() => openEdit(gig)}>✎</button><button className="grid size-7 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:bg-rose-400/20" aria-label={t.delete} onClick={() => void removeGig(gig)}>×</button></div></div>
              </article>)}</div>}
          </section>
          <aside className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
            <section className="min-w-0 rounded-2xl border border-white/10 bg-gradient-to-br from-[#121c30] to-[#0d1423] p-4 sm:p-6"><div className="mb-5 flex items-center justify-between gap-3"><div><span className="text-[9px] font-bold tracking-[.15em] text-indigo-300">TOP 5+</span><h2 className="mt-1 text-lg font-bold text-white">{t.bands}</h2></div></div>
              {bands.length ? <ol className="m-0 list-none p-0">{bands.map((item, index) => <li className="flex items-center gap-3 border-t border-white/[0.07] py-3 text-sm" key={item.band}><span className="grid size-7 place-items-center rounded-lg bg-indigo-400/10 text-[11px] text-indigo-200">{index + 1}</span><span className="min-w-0 flex-1 text-slate-200">{item.band}</span><strong className="text-xl font-bold tracking-tight text-white">{item.count}</strong></li>)}</ol> : <p className="text-sm text-slate-400">—</p>}
              {hasMoreBands && <button className="pt-3 text-xs font-bold text-indigo-300 transition hover:text-white" onClick={() => void loadMoreBands()}>{t.more} →</button>}
            </section>
            <section className="min-w-0 rounded-2xl border border-white/10 bg-gradient-to-br from-[#121c30] to-[#0d1423] p-4 sm:p-6"><div className="mb-5 flex items-center justify-between gap-3"><div><span className="text-[9px] font-bold tracking-[.15em] text-indigo-300">TOP 5</span><h2 className="mt-1 text-lg font-bold text-white">{t.countries}</h2></div></div>
              {countries.length ? <ol className="m-0 list-none p-0">{countries.map((item) => <li className="flex items-center gap-3 border-t border-white/[0.07] py-3 text-sm" key={item.country}><span className="grid size-7 place-items-center rounded-lg bg-indigo-400/10 text-[11px] text-indigo-200">◎</span><span className="min-w-0 flex-1 text-slate-200">{item.country}</span><strong className="text-xl font-bold tracking-tight text-white">{item.count}</strong></li>)}</ol> : <p className="text-sm text-slate-400">—</p>}
            </section>
          </aside>
        </div>
        <section className="min-w-0 rounded-2xl border border-white/10 bg-gradient-to-br from-[#121c30] to-[#0d1423] p-4 sm:p-6 mt-5" id="preferences"><div className="mb-5 flex items-center justify-between gap-3"><div><span className="text-[9px] font-bold tracking-[.15em] text-indigo-300">PERSONNALISATION</span><h2 className="mt-1 text-lg font-bold text-white">{t.settings}</h2></div></div>
          <form className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end" onSubmit={savePreferences}>
            <label className="mb-4 block text-sm font-semibold text-slate-300">{t.language}<select value={preferences.language} onChange={(event) => setPreferences((current) => ({ ...current, language: event.target.value as AppLanguage }))}><option value="fr">Français</option><option value="en">English</option></select></label>
            <label className="mb-4 block text-sm font-semibold text-slate-300">{t.currency}<select value={preferences.currency} onChange={(event) => setPreferences((current) => ({ ...current, currency: event.target.value }))}><option value="EUR">EUR — Euro</option><option value="USD">USD — US dollar</option><option value="GBP">GBP — Pound sterling</option><option value="CHF">CHF — Swiss franc</option><option value="CAD">CAD — Canadian dollar</option></select></label>
            <button className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 bg-indigo-500 text-white shadow-lg shadow-indigo-950/40 hover:bg-indigo-400" disabled={saving}>{t.save}</button>
          </form>
        </section>
        {notice && <p className="mt-4 text-sm text-indigo-200" role="status">{notice}</p>}
      </div>
      {editorOpen && <div className="fixed inset-0 z-20 grid place-items-center bg-slate-950/80 p-4 backdrop-blur-md" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditorOpen(false); }}>
        <section className="max-h-[90vh] w-full max-w-xl overflow-auto rounded-2xl border border-white/15 bg-[#111a2b] p-5 shadow-2xl shadow-black/50 sm:p-7" role="dialog" aria-modal="true" aria-labelledby="max-h-[90vh] w-full max-w-xl overflow-auto rounded-2xl border border-white/15 bg-[#111a2b] p-5 shadow-2xl shadow-black/50 sm:p-7-title">
          <div className="mb-5 flex items-center justify-between gap-3"><div><span className="text-[9px] font-bold tracking-[.15em] text-indigo-300">TON HISTOIRE MUSICALE</span><h2 id="max-h-[90vh] w-full max-w-xl overflow-auto rounded-2xl border border-white/15 bg-[#111a2b] p-5 shadow-2xl shadow-black/50 sm:p-7-title">{editing ? t.edit : t.add}</h2></div><button className="grid size-8 place-items-center rounded-lg border border-white/10 bg-white/5 text-xl text-slate-300 transition hover:bg-white/10" onClick={() => setEditorOpen(false)} aria-label={t.cancel}>×</button></div>
          <form onSubmit={saveGig} className="space-y-4">
            <label className="mb-4 block text-sm font-semibold text-slate-300">{t.artists}<input required value={draft.bands} onChange={(event) => setDraft({ ...draft, bands: event.target.value })} placeholder="Architects, While She Sleeps" /></label>
            <div className="grid gap-3 sm:grid-cols-2"><label className="mb-4 block text-sm font-semibold text-slate-300">{t.date}<input required type="date" value={draft.date} onChange={(event) => setDraft({ ...draft, date: event.target.value })} /></label><label className="mb-4 block text-sm font-semibold text-slate-300">{t.price}<input type="number" min="0" step="0.01" value={draft.price} onChange={(event) => setDraft({ ...draft, price: event.target.value })} /></label></div>
            <label className="mb-4 block text-sm font-semibold text-slate-300">{t.venue}<input required value={draft.venue} onChange={(event) => setDraft({ ...draft, venue: event.target.value })} /></label>
            <div className="grid gap-3 sm:grid-cols-2"><label className="mb-4 block text-sm font-semibold text-slate-300">{t.city}<input required value={draft.city} onChange={(event) => setDraft({ ...draft, city: event.target.value })} /></label><label className="mb-4 block text-sm font-semibold text-slate-300">{t.country}<input required value={draft.country} onChange={(event) => setDraft({ ...draft, country: event.target.value })} /></label></div>
            {notice && <p className="my-3 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200" role="alert">{notice}</p>}
            <div className="mt-6 flex flex-col-reverse justify-end gap-3 sm:flex-row"><button type="button" className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08] hover:text-white" onClick={() => setEditorOpen(false)}>{t.cancel}</button><button className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 bg-indigo-500 text-white shadow-lg shadow-indigo-950/40 hover:bg-indigo-400" disabled={saving}>{editing ? t.update : t.create}</button></div>
          </form>
        </section>
      </div>}
    </main>
  );
}
