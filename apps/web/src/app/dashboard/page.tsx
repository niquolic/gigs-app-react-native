import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClient from "./dashboard-client";

export const metadata: Metadata = { title: "Mon espace", robots: { index: false, follow: false } };

export default async function DashboardPage() {
  const token = (await cookies()).get("gigs_token")?.value;
  if (!token) redirect("/login");
  return <DashboardClient />;
}
