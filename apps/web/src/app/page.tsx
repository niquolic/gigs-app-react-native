import Link from "next/link";

const features = [
  { icon: "🎟️", title: "Tous tes concerts, enfin réunis", text: "Retrouve chaque date, chaque salle, chaque ville et chaque groupe dans un historique personnel simple à compléter." },
  { icon: "📊", title: "Ton année en musique", text: "Découvre combien de concerts tu as vus, les groupes que tu as le plus suivis et les pays où la musique t'a emmené." },
  { icon: "🌍", title: "Une collection qui te ressemble", text: "Ajoute tes concerts passés, retrouve tes souvenirs et garde une trace de ton parcours de fan." },
];

const gigs = [
  { day: "18", date: "Mai 2026", bands: "Architects", venue: "Accor Arena · Paris", price: "59 €", color: "from-violet-500 to-indigo-400" },
  { day: "02", date: "Avr 2026", bands: "Bring Me The Horizon", venue: "Zénith · Lille", price: "48 €", color: "from-amber-400 to-orange-500" },
  { day: "14", date: "Fév 2026", bands: "While She Sleeps", venue: "L'Aéronef · Lille", price: "32 €", color: "from-cyan-400 to-blue-500" },
];

export default function Home() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#080d19] text-slate-100">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[760px] bg-[radial-gradient(ellipse_at_50%_0%,rgba(99,102,241,0.22),transparent_65%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-80 -z-10 h-96 w-96 rounded-full bg-violet-600/10 blur-[110px]" />
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <header className="flex min-h-20 items-center justify-between gap-6 border-b border-white/10">
          <Link className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-white" href="/"><span className="grid size-9 place-items-center rounded-xl bg-indigo-500/15 text-xl text-indigo-300">♫</span> gigs<span className="text-indigo-300">.</span></Link>
          <nav className="hidden items-center gap-8 text-sm text-slate-400 md:flex"><a className="transition hover:text-white" href="#features">Fonctionnalités</a><a className="transition hover:text-white" href="#how">Comment ça marche</a></nav>
          <div className="flex items-center gap-2 sm:gap-3"><Link className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white sm:px-4" href="/login">Connexion</Link><Link className="rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-950/50 transition hover:-translate-y-0.5 hover:bg-indigo-400" href="/register">Créer mon compte</Link></div>
        </header>

        <section className="grid items-center gap-14 pb-24 pt-16 sm:pt-24 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12 lg:pb-32 lg:pt-28">
          <div className="max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-300/20 bg-indigo-400/10 px-4 py-2 text-[10px] font-bold tracking-[0.19em] text-indigo-200 sm:text-xs"><span className="size-1.5 rounded-full bg-amber-300 shadow-[0_0_12px_#fcd34d]" /> POUR CELLES ET CEUX QUI VIVENT LA MUSIQUE EN LIVE</div>
            <h1 className="text-5xl font-black leading-[1.06] tracking-[-0.055em] text-white sm:text-6xl lg:text-[4.35rem]">Les concerts passent.<br /><span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-amber-200 bg-clip-text text-transparent">Les souvenirs restent.</span></h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">Chaque première partie, chaque fosse, chaque rappel. Gigs te permet de garder une trace de tous les concerts que tu as vécus et de redécouvrir ton histoire musicale.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link className="inline-flex items-center justify-center rounded-xl bg-indigo-500 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-950/50 transition hover:-translate-y-0.5 hover:bg-indigo-400" href="/register">Commencer gratuitement <span className="ml-2">↗</span></Link><a className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/[0.07]" href="#features">Découvrir Gigs <span className="ml-2 text-indigo-300">↓</span></a></div>
            <p className="mt-6 flex items-center gap-2 text-xs text-slate-500"><span className="text-amber-300">✦</span> Ton historique musical. À toi, et rien qu'à toi.</p>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
            <div className="absolute -inset-6 rounded-[2rem] bg-indigo-500/15 blur-3xl" />
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#111a2b]/95 p-5 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-7">
              <div className="flex items-center justify-between border-b border-white/10 pb-5"><div><p className="text-[10px] font-bold tracking-[0.2em] text-slate-500">APERÇU · DONNÉES FICTIVES</p><h2 className="mt-2 text-lg font-bold text-white">Ton année en live <span className="text-amber-300">✦</span></h2><p className="mt-1 text-xs text-slate-500">Chaque concert raconte quelque chose.</p></div><div className="flex gap-1.5"><i className="size-2 rounded-full bg-rose-400" /><i className="size-2 rounded-full bg-amber-300" /><i className="size-2 rounded-full bg-emerald-400" /></div></div>
              <div className="grid grid-cols-3 gap-3 py-6">{[{value:"42",label:"CONCERTS"},{value:"18",label:"GROUPES"},{value:"06",label:"PAYS"}].map((stat)=><div key={stat.label} className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-3 sm:p-4"><strong className="block text-2xl font-black tracking-tight text-white sm:text-3xl">{stat.value}</strong><span className="mt-1 block text-[9px] font-bold tracking-[0.16em] text-slate-500">{stat.label}</span></div>)}</div>
              <div className="space-y-2">{gigs.map((gig)=><article key={gig.bands} className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3 transition hover:border-indigo-300/20 hover:bg-white/[0.05] sm:gap-4 sm:p-4"><div className={`grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${gig.color} text-sm font-black text-white shadow-lg`}>{gig.day}</div><div className="min-w-0 flex-1"><h3 className="truncate text-sm font-bold text-slate-100">{gig.bands}</h3><p className="mt-1 truncate text-xs text-slate-500">{gig.date} · {gig.venue}</p></div><span className="shrink-0 text-xs font-bold text-amber-200">{gig.price}</span></article>)}</div>
              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-[10px] font-semibold text-slate-500"><span>TON CARNET DE CONCERTS</span><span className="text-indigo-300">GIGS / 2026</span></div>
            </div>
          </div>
        </section>

        <section id="features" className="border-t border-white/[0.08] py-20 sm:py-24">
          <div className="mx-auto max-w-2xl text-center"><p className="text-[10px] font-bold tracking-[0.22em] text-indigo-300">TON CARNET DE CONCERTS</p><h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">Bien plus qu'une simple liste.</h2><p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">Un endroit pour conserver les moments qui font ton histoire musicale et prendre du recul sur tous ces concerts.</p></div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">{features.map((feature,index)=><article key={feature.title} className="group rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.055] to-white/[0.015] p-7 transition duration-300 hover:-translate-y-1 hover:border-indigo-300/25"><div className="grid size-12 place-items-center rounded-xl border border-indigo-300/15 bg-indigo-400/10 text-xl">{feature.icon}</div><h3 className="mt-6 text-lg font-bold text-white">{feature.title}</h3><p className="mt-3 text-sm leading-7 text-slate-400">{feature.text}</p><span className="mt-6 block text-xs font-bold text-indigo-300">0{index+1} <span className="ml-2 text-slate-600">/</span> 03</span></article>)}</div>
        </section>

        <section id="how" className="mb-16 overflow-hidden rounded-3xl border border-indigo-300/15 bg-[radial-gradient(ellipse_at_80%_0%,rgba(99,102,241,0.2),transparent_55%),linear-gradient(120deg,#121a30,#0d1423)] px-6 py-12 text-center sm:mb-24 sm:px-12 sm:py-16"><p className="text-[10px] font-bold tracking-[0.2em] text-amber-200">CHAQUE LIVE COMPTE</p><h2 className="mx-auto mt-4 max-w-2xl text-3xl font-black tracking-tight text-white sm:text-4xl">Et si tu retrouvais ton tout premier concert ?</h2><p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-400">Commence ton historique aujourd'hui. Tu pourras le compléter au fil des prochaines dates.</p><Link className="mt-8 inline-flex rounded-xl bg-indigo-500 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-400" href="/register">Créer mon espace Gigs ↗</Link></section>
        <footer className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-8 text-xs text-slate-500 sm:flex-row"><Link className="flex items-center gap-2 text-lg font-extrabold text-white" href="/">♫ gigs<span className="text-indigo-300">.</span></Link><span>Fait pour se souvenir de chaque live. © {new Date().getFullYear()} Gigs</span></footer>
      </div>
    </main>
  );
}
