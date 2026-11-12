import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Gigs — Tous tes concerts, au même endroit", template: "%s | Gigs" },
  description: "Garde une trace de tous les concerts que tu as vécus. Construis ton historique musical, retrouve tes groupes préférés et découvre tes statistiques.",
  applicationName: "Gigs",
  openGraph: {
    type: "website",
    siteName: "Gigs",
    title: "Gigs — Tous tes concerts, au même endroit",
    description: "Ton histoire musicale mérite d'être gardée.",
  },
  twitter: { card: "summary_large_image" },
};
export const viewport: Viewport = { themeColor: "#080D19", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="fr"><body>{children}</body></html>;
}
