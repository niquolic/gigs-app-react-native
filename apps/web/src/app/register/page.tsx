import type { Metadata } from "next";
import Link from "next/link";
import AuthForm from "../ui/auth-form";

export const metadata: Metadata = { title: "Créer un compte", description: "Crée ton espace Gigs et commence à conserver l'historique de tes concerts.", robots: { index: false, follow: false } };

export default function Register() {
  return (
    <main className="relative grid min-h-screen bg-[#080d19] text-slate-100 lg:grid-cols-2">
      <section className="relative hidden flex-col justify-between overflow-hidden border-r border-white/10 bg-[radial-gradient(ellipse_at_15%_15%,rgba(99,102,241,0.22),transparent_55%),#0b1120] p-12 lg:flex xl:p-20">
        <Link className="flex items-center gap-2 text-2xl font-extrabold text-white" href="/">♫ gigs<span className="text-indigo-300">.</span></Link>
        <div className="relative z-10 max-w-xl"><p className="text-xs font-bold tracking-[0.2em] text-indigo-300">TON HISTOIRE MUSICALE</p><h1 className="mt-6 text-5xl font-black leading-tight tracking-tight text-white">Ta vie de fan, concert après concert.</h1><p className="mt-6 text-base leading-8 text-slate-400">Tu as vu ton premier concert il y a dix ans ou tu viens de découvrir la fosse ? Gigs te permet de construire ton historique musical, retrouver tes groupes les plus vus et suivre tes dépenses liées aux concerts.</p><div className="mt-10 space-y-4 text-sm text-slate-300"><p>🎫 <span className="ml-2">Ajoute date, artistes, salle et prix</span></p><p>📈 <span className="ml-2">Suis tes chiffres et tes classements</span></p><p>🔒 <span className="ml-2">Ton historique reste privé</span></p></div></div>
        <p className="text-xs text-slate-600">Ton historique musical. À toi, et rien qu'à toi.</p>
      </section>
      <section className="flex items-center justify-center px-5 py-12 sm:px-10"><div className="w-full max-w-md">
        <Link className="mb-8 inline-flex items-center gap-2 text-xl font-extrabold text-white lg:hidden" href="/">♫ gigs<span className="text-indigo-300">.</span></Link>
        <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-7 shadow-2xl shadow-black/20 sm:p-10"><p className="text-xs font-bold tracking-[0.18em] text-indigo-300">REJOINS LA COMMUNAUTÉ</p><h2 className="mt-3 text-3xl font-black tracking-tight text-white">Crée ton compte Gigs.</h2><p className="mt-3 text-sm leading-6 text-slate-400">C'est gratuit. Il ne te reste qu'à commencer ta collection.</p><div className="mt-8"><AuthForm mode="register" /></div><div className="mt-7 border-t border-white/10 pt-6 text-center text-sm text-slate-400">Déjà inscrit ? <Link className="font-bold text-indigo-300 hover:text-indigo-200" href="/login">Se connecter</Link></div>
        </div><Link className="mt-6 inline-block text-sm text-slate-500 transition hover:text-white" href="/">← Retour à l'accueil</Link>
      </div></section>
    </main>
  );
}
