import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEmployeeByRef, getSiteBundle } from "@/lib/content";
import { mediaUrl } from "@/lib/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ ref: string }> }): Promise<Metadata> {
  return { title: `Vérification de carte — Recycl'Aide`, robots: { index: false, follow: false } };
}

// Page publique de vérification d'une carte salarié (scannée via le QR code)
export default async function VerifPage({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  const employee = await getEmployeeByRef(ref);
  if (!employee) notFound();
  const { settings } = await getSiteBundle();
  const logo = mediaUrl(settings.logo || "/logo-recyclaide.png");
  const now = new Date();
  const valid = !employee.validUntil || parseValidUntil(employee.validUntil) >= now;

  return (
    <main className="wrap" style={{ paddingBlock: "4rem", maxWidth: 560, marginInline: "auto" }}>
      <div className={`card`} style={{ textAlign: "center", borderColor: valid ? "var(--ok)" : "var(--ko)", boxShadow: valid ? "0 0 0 3px #dcfce7" : "0 0 0 3px #fee2e2" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} alt={settings.siteName} style={{ height: 48, margin: "0 auto 1rem", display: "block" }} />
        {valid ? (
          <>
            <p style={{ fontSize: 42, margin: 0 }}>✅</p>
            <h1 className="h2" style={{ color: "var(--ok)" }}>Carte valide</h1>
            <p className="lead mt-2">
              <strong style={{ color: "var(--ink)" }}>
                {employee.prenom} {employee.nom}
              </strong>{" "}
              est bien salarié(e) du chantier d’insertion <strong>{settings.siteName}</strong>
              {employee.poste ? <> — {employee.poste}</> : null}.
            </p>
            <p className="muted text-sm mt-2">
              Réf. {employee.ref}
              {employee.validUntil ? ` · valable jusqu’au ${employee.validUntil}` : ""}
            </p>
          </>
        ) : (
          <>
            <p style={{ fontSize: 42, margin: 0 }}>⛔</p>
            <h1 className="h2" style={{ color: "var(--ko)" }}>Carte expirée</h1>
            <p className="lead mt-2">
              La carte de <strong>{employee.prenom} {employee.nom}</strong> ({employee.ref}) n’est plus valide
              {employee.validUntil ? ` depuis le ${employee.validUntil}` : ""}.
            </p>
          </>
        )}
        <p className="muted text-sm mt-3">
          {settings.siteName} · {settings.addressLines.join(" · ")} · <a href={`mailto:${settings.email}`}>{settings.email}</a>
        </p>
        <div className="mt-3">
          <Link href="/" className="btn btn-ghost btn-sm">Retour au site</Link>
        </div>
      </div>
    </main>
  );
}

function parseValidUntil(v: string): Date {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v.trim());
  if (!m) return new Date(8640000000000000);
  return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]), 23, 59, 59);
}
