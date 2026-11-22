import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAllContent } from "@/lib/content";
import { isAdminAuthed } from "@/lib/auth";
import { BadgeFront, BadgeBack } from "@/components/badge-card";
import { PrintBodyClass, PrintButton } from "@/components/print-body-class";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = { title: "Impression des cartes salariés — admin", robots: { index: false, follow: false } };

const PER_PAGE = 9; // 3 x 3 en portrait 54x85mm sur A4

// Page d'impression des cartes salariés (toutes, ou une seule via ?ref=RA-...)
export default async function ImprimerCartesPage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  if (!(await isAdminAuthed())) redirect("/admin");
  const { ref } = await searchParams;
  const { employees, settings } = await getAllContent();
  const list = ref ? employees.filter((e) => e.ref === ref.toUpperCase().trim()) : employees;
  const sheets: (typeof list)[] = [];
  for (let i = 0; i < list.length; i += PER_PAGE) sheets.push(list.slice(i, i + PER_PAGE));
  if (sheets.length === 0) sheets.push([]);

  return (
    <main style={{ background: "#e8eaee", minHeight: "100vh", padding: "1.5rem" }}>
      <PrintBodyClass />
      <div className="no-print" style={{ maxWidth: 900, margin: "0 auto 1rem", display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
        <strong>Impression des cartes salariés</strong>
        <span className="muted text-sm">{list.length} carte(s) — format portrait 54 × 85 mm — {sheets.length} page(s) A4</span>
        <span style={{ marginLeft: "auto" }}>
          <PrintButton />
        </span>
        <a className="btn btn-ghost btn-sm" href="/admin">← Retour à l’admin</a>
      </div>
      <div className="print-zone">
        {sheets.map((sheet, i) => (
          <section className="idb-sheet" key={i} style={i > 0 ? { pageBreakBefore: "always" } : undefined}>
            {sheet.map((e) => (
              <div className="idb-cell" key={e.id}>
                <BadgeFront e={e} settings={settings} />
              </div>
            ))}
            {sheet.length === 0 && <p className="muted">Aucune carte à imprimer.</p>}
          </section>
        ))}
      </div>
      {/* Aperçu verso */}
      {list.length > 0 && (
        <section className="no-print" style={{ maxWidth: 900, margin: "2rem auto", display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <strong>Verso (aperçu) :</strong>
          <BadgeBack e={list[0]} settings={settings} />
        </section>
      )}
    </main>
  );
}
