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

  if (loading) return <main className="dashboard-loading"><span className="brand"><span className="brand-mark">♫</span> gigs</span><p>{t.loading}</p></main>;

  return (
    <main className="dashboard-shell">
      <header className="dashboard-nav">
        <Link className="brand" href="/"><span className="brand-mark">♫</span> gigs</Link>
        <div className="dashboard-nav-actions">
          <a className="btn btn-ghost" href="#preferences">{t.settings}</a>
          <form action="/api/auth/logout" method="post"><button className="btn btn-ghost" type="submit">{t.logout}</button></form>
        </div>
      </header>
      <div className="dashboard-container">
        <section className="dashboard-heading">
          <div><span className="eyebrow"><i className="eyebrow-dot" /> TON ESPACE PERSONNEL</span><h1>{t.greeting}<span className="gradient-text">.</span></h1><p>{t.subtitle}</p></div>
          <button className="btn btn-primary" onClick={openCreate}>＋ {t.add}</button>
        </section>
        {error && <div className="dashboard-error" role="alert"><span>{error}</span><button className="btn btn-ghost" onClick={() => void load()}>{t.retry}</button></div>}
        {gigStats && <section className="dashboard-stats">
          <article className="dashboard-stat"><span>{t.total}</span><strong>{gigStats.totalNumberOfGigs ?? 0}</strong><small>♫</small></article>
          <article className="dashboard-stat"><span>{t.year}</span><strong>{gigStats.totalNumberOfGigsThisYear ?? 0}</strong><small>↗</small></article>
          <article className="dashboard-stat"><span>{t.spent}</span><strong>{formatMoney(gigStats.totalPrice, preferences.currency, preferences.language)}</strong><small>€</small></article>
          <article className="dashboard-stat"><span>{t.spentYear}</span><strong>{formatMoney(gigStats.priceThisYear, preferences.currency, preferences.language)}</strong><small>◷</small></article>
        </section>}
        <div className="dashboard-columns">
          <section className="dashboard-panel history-panel">
            <div className="panel-heading"><div><span className="panel-kicker">COLLECTION</span><h2>{t.recent}</h2></div><span className="panel-count">{gigs.length}</span></div>
            {sortedGigs.length === 0 ? <div className="empty-state"><span>🎟️</span><h3>{t.noGigs}</h3><button className="btn btn-primary" onClick={openCreate}>{t.first}</button></div> :
              <div className="gig-list">{sortedGigs.map((gig) => <article className="gig-row" key={gig.id}>
                <div className="gig-date"><strong>{new Date(gig.date).getDate()}</strong><span>{new Intl.DateTimeFormat(preferences.language === "fr" ? "fr-FR" : "en-GB", { month: "short", year: "numeric" }).format(new Date(gig.date))}</span></div>
                <div className="gig-main"><h3>{gig.bands.join(" · ")}</h3><p>{gig.venue} · {gig.city}, {gig.country}</p></div>
                <div className="gig-side"><strong>{formatMoney(gig.price, preferences.currency, preferences.language)}</strong><div className="gig-actions"><button aria-label={t.edit} onClick={() => openEdit(gig)}>✎</button><button aria-label={t.delete} onClick={() => void removeGig(gig)}>×</button></div></div>
              </article>)}</div>}
          </section>
          <aside className="dashboard-side">
            <section className="dashboard-panel"><div className="panel-heading"><div><span className="panel-kicker">TOP 5+</span><h2>{t.bands}</h2></div></div>
              {bands.length ? <ol className="rank-list">{bands.map((item, index) => <li key={item.band}><span className="rank-number">{index + 1}</span><span>{item.band}</span><strong>{item.count}</strong></li>)}</ol> : <p className="muted-copy">—</p>}
              {hasMoreBands && <button className="text-action" onClick={() => void loadMoreBands()}>{t.more} →</button>}
            </section>
            <section className="dashboard-panel"><div className="panel-heading"><div><span className="panel-kicker">TOP 5</span><h2>{t.countries}</h2></div></div>
              {countries.length ? <ol className="rank-list">{countries.map((item) => <li key={item.country}><span className="rank-dot">◎</span><span>{item.country}</span><strong>{item.count}</strong></li>)}</ol> : <p className="muted-copy">—</p>}
            </section>
          </aside>
        </div>
        <section className="dashboard-panel preferences-panel" id="preferences"><div className="panel-heading"><div><span className="panel-kicker">PERSONNALISATION</span><h2>{t.settings}</h2></div></div>
          <form className="preferences-form" onSubmit={savePreferences}>
            <label className="field">{t.language}<select value={preferences.language} onChange={(event) => setPreferences((current) => ({ ...current, language: event.target.value as AppLanguage }))}><option value="fr">Français</option><option value="en">English</option></select></label>
            <label className="field">{t.currency}<select value={preferences.currency} onChange={(event) => setPreferences((current) => ({ ...current, currency: event.target.value }))}><option value="EUR">EUR — Euro</option><option value="USD">USD — US dollar</option><option value="GBP">GBP — Pound sterling</option><option value="CHF">CHF — Swiss franc</option><option value="CAD">CAD — Canadian dollar</option></select></label>
            <button className="btn btn-primary" disabled={saving}>{t.save}</button>
          </form>
        </section>
        {notice && <p className="dashboard-notice" role="status">{notice}</p>}
      </div>
      {editorOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditorOpen(false); }}>
        <section className="gig-modal" role="dialog" aria-modal="true" aria-labelledby="gig-modal-title">
          <div className="panel-heading"><div><span className="panel-kicker">TON HISTOIRE MUSICALE</span><h2 id="gig-modal-title">{editing ? t.edit : t.add}</h2></div><button className="modal-close" onClick={() => setEditorOpen(false)} aria-label={t.cancel}>×</button></div>
          <form onSubmit={saveGig} className="gig-form">
            <label className="field">{t.artists}<input required value={draft.bands} onChange={(event) => setDraft({ ...draft, bands: event.target.value })} placeholder="Architects, While She Sleeps" /></label>
            <div className="form-grid"><label className="field">{t.date}<input required type="date" value={draft.date} onChange={(event) => setDraft({ ...draft, date: event.target.value })} /></label><label className="field">{t.price}<input type="number" min="0" step="0.01" value={draft.price} onChange={(event) => setDraft({ ...draft, price: event.target.value })} /></label></div>
            <label className="field">{t.venue}<input required value={draft.venue} onChange={(event) => setDraft({ ...draft, venue: event.target.value })} /></label>
            <div className="form-grid"><label className="field">{t.city}<input required value={draft.city} onChange={(event) => setDraft({ ...draft, city: event.target.value })} /></label><label className="field">{t.country}<input required value={draft.country} onChange={(event) => setDraft({ ...draft, country: event.target.value })} /></label></div>
            {notice && <p className="form-error" role="alert">{notice}</p>}
            <div className="modal-actions"><button type="button" className="btn btn-ghost" onClick={() => setEditorOpen(false)}>{t.cancel}</button><button className="btn btn-primary" disabled={saving}>{editing ? t.update : t.create}</button></div>
          </form>
        </section>
      </div>}
    </main>
  );
}
