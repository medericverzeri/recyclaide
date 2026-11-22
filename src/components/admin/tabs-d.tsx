"use client";

import type { Employee, SettingsData } from "@/lib/types";
import { F, In, ItemCard, MediaField } from "./fields";
import { BadgeFront } from "@/components/badge-card";

// Onglet admin : génération des cartes identifiantes salariés (portrait 54x85mm)
export function BadgesTab({
  employees,
  settings,
  onChange,
}: {
  employees: Employee[];
  settings: SettingsData;
  onChange: (e: Employee[]) => void;
}) {
  const set = (i: number, patch: Partial<Employee>) => onChange(employees.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= employees.length) return;
    const next = [...employees];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const year = new Date().getFullYear();

  return (
    <>
      <h2>Cartes salariés</h2>
      <p className="panel-lead">
        Générez les cartes identifiantes des salariés du chantier (format <strong>portrait 54 × 85 mm</strong>, logo + QR de vérification).
        Renseignez <strong>nom et prénom</strong>, prévisualisez la carte, puis imprimez (planche A4 de 9 cartes).
      </p>
      <div className="mb-3 flex gap-2 flex-wrap">
        <a className="btn btn-primary btn-sm" href="/impression-cartes" target="_blank" rel="noopener">
          🖨 Imprimer toutes les cartes (A4)
        </a>
        <span className="muted text-sm" style={{ alignSelf: "center" }}>{employees.length} salarié(s) enregistré(s)</span>
      </div>

      {employees.map((e, i) => (
        <ItemCard
          key={e.id}
          title={`${e.prenom} ${e.nom || "…"} — ${e.ref}`}
          onRemove={() => onChange(employees.filter((_, j) => j !== i))}
          onUp={() => move(i, -1)}
          onDown={() => move(i, 1)}
        >
          <div className="admin-grid-2">
            <F label="Nom *">
              <In value={e.nom} onChange={(ev) => set(i, { nom: ev.target.value.toUpperCase() })} placeholder="DUPONT" />
            </F>
            <F label="Prénom *">
              <In value={e.prenom} onChange={(ev) => set(i, { prenom: ev.target.value })} placeholder="Marie" />
            </F>
            <F label="Poste (affiché sur la carte)">
              <In value={e.poste} onChange={(ev) => set(i, { poste: ev.target.value })} placeholder="Salarié(e) en insertion — Chantier Recycl'Aide" />
            </F>
            <F label="Valable jusqu’au (JJ/MM/AAAA)">
              <In value={e.validUntil} onChange={(ev) => set(i, { validUntil: ev.target.value })} placeholder="31/12/2026" />
            </F>
            <F label="Référence carte (QR)">
              <In value={e.ref} onChange={(ev) => set(i, { ref: ev.target.value.toUpperCase() })} placeholder={`RA-${year}-0001`} />
            </F>
          </div>
          <MediaField label="Photo (facultative — sinon avatar à initiales)" value={e.photo} onChange={(v) => set(i, { photo: v })} />
          <div className="flex gap-3 items-start flex-wrap mt-2">
            <div>
              <span className="field-label">Aperçu recto (54 × 85 mm)</span>
              <div style={{ transform: "scale(0.62)", transformOrigin: "top left", width: 200, height: 320, marginTop: 8, marginBottom: -60 }}>
                <BadgeFront e={e} settings={settings} />
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <a className="btn btn-ghost btn-sm" href={`/impression-cartes?ref=${encodeURIComponent(e.ref)}`} target="_blank" rel="noopener">
                🖨 Imprimer cette carte
              </a>
              <a className="btn btn-ghost btn-sm" href={`/verif/${encodeURIComponent(e.ref)}`} target="_blank" rel="noopener">
                🔎 Page de vérification (QR)
              </a>
            </div>
          </div>
        </ItemCard>
      ))}

      <button
        type="button"
        className="btn-add"
        onClick={() =>
          onChange([
            ...employees,
            {
              id: -Date.now(),
              ref: `RA-${year}-${String(employees.length + 1).padStart(4, "0")}`,
              nom: "",
              prenom: "",
              poste: "Salarié(e) en insertion — Chantier Recycl'Aide",
              validUntil: `31/12/${year}`,
              photo: "",
              order: employees.length,
            },
          ])
        }
      >
        + Ajouter un salarié (nouvelle carte)
      </button>
    </>
  );
}
