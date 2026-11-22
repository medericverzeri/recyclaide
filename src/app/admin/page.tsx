import type { Metadata } from "next";
import { getAllContent } from "@/lib/content";
import { getSession } from "@/lib/auth";
import { AdminApp } from "@/components/admin/admin-app";
import { AdminLogin } from "@/components/admin/admin-login";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Espace admin — Recycl'Aide",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = await getSession();
  if (!session) {
    return (
      <main className="wrap" style={{ minHeight: "100vh" }}>
        <AdminLogin />
      </main>
    );
  }
  const content = await getAllContent();
  return <AdminApp initial={content} email={session.email} />;
}
