import type { Metadata } from "next";
import Link from "next/link";
import AuthForm from "../ui/auth-form";

export const metadata: Metadata = { title: "Connexion", description: "Connecte-toi à ton espace Gigs pour retrouver ton historique de concerts.", robots: { index: false, follow: false } };

export default function Login() {
  return (
    <main className="relative grid min-h-screen bg-[#080d19] text-slate-100 lg:grid-cols-2">
      <section className="relative hidden flex-col justify-between overflow-hidden border-r border-white/10 bg-[radial-gradient(ellipse_at_15%_15%,rgba(99,102,241,0.22),transparent_55%),#0b1120] p-12 lg:flex xl:p-20">
        <Link className="flex items-center gap-2 text-2xl font-extrabold text-white" href="/">♫ gigs<span className="text-indigo-300">.</span></Link>
        <div className="relative z-10 max-w-xl"><p className="text-xs font-bold tracking-[0.2em] text-indigo-300">TON CARNET DE CONCERTS</p><h1 className="mt-6 text-5xl font-black leading-tight tracking-tight text-white">Chaque concert mérite sa place dans ton histoire.</h1><p className="mt-6 text-base leading-8 text-slate-400">Gigs est ton carnet de concerts personnel. Note les groupes que tu as vus, les salles où tu as vibré et les villes qui t'ont accueilli. Retrouve ensuite ton parcours et tes statistiques en un clin d'œil.</p><div className="mt-10 space-y-4 text-sm text-slate-300"><p>🎟️ <span className="ml-2">Centralise tous tes concerts passés</span></p><p>📊 <span className="ml-2">Découvre tes statistiques musicales</span></p><p>🌍 <span className="ml-2">Garde une trace de tes salles et pays</span></p></div></div>
        <p className="text-xs text-slate-600">Ton historique musical. À toi, et rien qu'à toi.</p>
      </section>
      <section className="flex items-center justify-center px-5 py-12 sm:px-10"><div className="w-full max-w-md">
        <Link className="mb-12 inline-flex items-center gap-2 text-xl font-extrabold text-white lg:hidden" href="/">♫ gigs<span className="text-indigo-300">.</span></Link>
        <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-7 shadow-2xl shadow-black/20 sm:p-10"><p className="text-xs font-bold tracking-[0.18em] text-indigo-300">HEUREUX DE TE REVOIR</p><h2 className="mt-3 text-3xl font-black tracking-tight text-white">Content de te revoir.</h2><p className="mt-3 text-sm leading-6 text-slate-400">Connecte-toi pour retrouver tous les concerts qui font ton histoire.</p><div className="mt-8"><AuthForm mode="login" /></div><div className="mt-7 border-t border-white/10 pt-6 text-center text-sm text-slate-400">Pas encore de compte ? <Link className="font-bold text-indigo-300 hover:text-indigo-200" href="/register">Créer un compte</Link></div>
        </div><Link className="mt-6 inline-block text-sm text-slate-500 transition hover:text-white" href="/">← Retour à l'accueil</Link>
      </div></section>
    </main>
  );
}
