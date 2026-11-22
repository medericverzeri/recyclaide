"use client";

import { useState } from "react";
import type { MessageData, Mission, PageBlock, PageRow, SettingsData } from "@/lib/types";
import { F, In, Ta, StrList, ItemCard, Switch, ColorField } from "./fields";

// --------------------------- Pages & missions -------------------------------

function BlockEditor({ block, onChange, onRemove, onUp, onDown }: { block: PageBlock; onChange: (b: PageBlock) => void; onRemove: () => void; onUp?: () => void; onDown?: () => void }) {
  const title = "title" in block ? block.title : "";
  const setTitle = (v: string) => onChange({ ...block, title: v } as PageBlock);
  return (
    <ItemCard title={`Bloc « ${block.kind} »${title ? ` — ${title}` : ""}`} onRemove={onRemove} onUp={onUp} onDown={onDown}>
      {"title" in block && (
        <F label="Titre du bloc">
          <In value={title} onChange={(e) => setTitle(e.target.value)} />
        </F>
      )}
      {block.kind === "text" && (
        <F label="Paragraphes">
          <StrList items={block.paragraphs} onChange={(paragraphs) => onChange({ ...block, paragraphs })} placeholder="Paragraphe…" addLabel="Ajouter un paragraphe" />
        </F>
      )}
      {block.kind === "list" && (
        <F label="Éléments de la liste">
          <StrList items={block.items} onChange={(items) => onChange({ ...block, items })} placeholder="Élément…" addLabel="Ajouter un élément" />
        </F>
      )}
      {block.kind === "cards" && (
        <>
          <F label="Introduction">
            <In value={block.intro} onChange={(e) => onChange({ ...block, intro: e.target.value })} />
          </F>
          {block.cards.map((c, i) => (
            <div className="item-card" key={i} style={{ background: "var(--card)" }}>
              <div className="item-card__head">
                <strong>Carte {i + 1} — {c.title || "sans titre"}</strong>
                <span className="spacer" />
                <button
                  type="button"
                  className="icon-btn icon-btn--danger"
                  onClick={() => onChange({ ...block, cards: block.cards.filter((_, j) => j !== i) })}
                  aria-label="Supprimer la carte"
                >
                  ✕
                </button>
              </div>
              <div className="admin-grid-2">
                <F label="Titre"><In value={c.title} onChange={(e) => onChange({ ...block, cards: block.cards.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)) })} /></F>
                <F label="Lien CTA"><In value={c.ctaHref} onChange={(e) => onChange({ ...block, cards: block.cards.map((x, j) => (j === i ? { ...x, ctaHref: e.target.value } : x)) })} /></F>
                <F label="Libellé CTA"><In value={c.ctaLabel} onChange={(e) => onChange({ ...block, cards: block.cards.map((x, j) => (j === i ? { ...x, ctaLabel: e.target.value } : x)) })} /></F>
              </div>
              <F label="Texte"><Ta value={c.text} onChange={(e) => onChange({ ...block, cards: block.cards.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)) })} /></F>
              <F label="Puces">
                <StrList
                  items={c.bullets}
                  onChange={(bullets) => onChange({ ...block, cards: block.cards.map((x, j) => (j === i ? { ...x, bullets } : x)) })}
                  placeholder="Point…"
                  addLabel="Ajouter une puce"
                />
              </F>
            </div>
          ))}
          <button
            type="button"
            className="btn-add"
            onClick={() => onChange({ ...block, cards: [...block.cards, { title: "Nouvelle carte", text: "", bullets: [], ctaLabel: "", ctaHref: "" }] })}
          >
            + Ajouter une carte
          </button>
        </>
      )}
      {block.kind === "notice" && (
        <F label="Texte">
          <Ta value={block.text} onChange={(e) => onChange({ ...block, text: e.target.value })} />
        </F>
      )}
      {block.kind === "stats" && (
        <F label="Chiffres">
          {block.items.map((s, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <In value={s.value} placeholder="7" style={{ maxWidth: 110 }} onChange={(e) => onChange({ ...block, items: block.items.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)) })} />
              <In value={s.label} placeholder="libellé" onChange={(e) => onChange({ ...block, items: block.items.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)) })} />
              <button type="button" className="icon-btn icon-btn--danger" onClick={() => onChange({ ...block, items: block.items.filter((_, j) => j !== i) })} aria-label="Supprimer">
                ✕
              </button>
            </div>
          ))}
          <button type="button" className="btn-add" onClick={() => onChange({ ...block, items: [...block.items, { value: "", label: "" }] })}>
            + Ajouter un chiffre
          </button>
        </F>
      )}
      {block.kind === "cta" && (
        <>
          <F label="Texte"><Ta value={block.text} onChange={(e) => onChange({ ...block, text: e.target.value })} /></F>
          <div className="admin-grid-2">
            <F label="Bouton principal — libellé"><In value={block.primaryLabel} onChange={(e) => onChange({ ...block, primaryLabel: e.target.value })} /></F>
            <F label="Bouton principal — lien"><In value={block.primaryHref} onChange={(e) => onChange({ ...block, primaryHref: e.target.value })} /></F>
            <F label="Bouton secondaire — libellé"><In value={block.ghostLabel} onChange={(e) => onChange({ ...block, ghostLabel: e.target.value })} /></F>
            <F label="Bouton secondaire — lien"><In value={block.ghostHref} onChange={(e) => onChange({ ...block, ghostHref: e.target.value })} /></F>
          </div>
        </>
      )}
      {block.kind === "topics" && (
        <F label="Introduction">
          <In value={block.intro} onChange={(e) => onChange({ ...block, intro: e.target.value })} />
        </F>
      )}
      {block.kind === "contact-cards" && (
        <F label="Introduction">
          <In value={block.intro} onChange={(e) => onChange({ ...block, intro: e.target.value })} />
        </F>
      )}
      {block.kind === "gallery" && (
        <F label="Introduction">
          <In value={block.intro} onChange={(e) => onChange({ ...block, intro: e.target.value })} />
        </F>
      )}
      {block.kind === "enterprises" && (
        <F label="Introduction">
          <In value={block.intro} onChange={(e) => onChange({ ...block, intro: e.target.value })} />
        </F>
      )}
      {block.kind === "form" && (
        <F label="Introduction">
          <In value={block.intro} onChange={(e) => onChange({ ...block, intro: e.target.value })} />
        </F>
      )}
      {block.kind === "raw" && (
        <F label="HTML brut">
          <Ta value={block.html} onChange={(e) => onChange({ ...block, html: e.target.value })} style={{ minHeight: 260, fontFamily: "monospace" }} />
        </F>
      )}
      {(block.kind === "hours" || block.kind === "reviews") && (
        <p className="hint">Bloc automatique : il affiche respectivement les horaires et les avis Google définis dans les autres onglets.</p>
      )}
    </ItemCard>
  );
}

const BLOCK_KINDS: { kind: PageBlock["kind"]; label: string }[] = [
  { kind: "text", label: "Texte (paragraphes)" },
  { kind: "list", label: "Liste numérotée" },
  { kind: "cards", label: "Cartes" },
  { kind: "stats", label: "Chiffres clés" },
  { kind: "notice", label: "Alerte" },
  { kind: "cta", label: "Bandeau d'appel à l'action" },
  { kind: "hours", label: "Horaires (auto)" },
  { kind: "reviews", label: "Avis Google (auto)" },
  { kind: "topics", label: "Sujets / FAQ (auto)" },
  { kind: "contact-cards", label: "Cartes contact (auto)" },
  { kind: "gallery", label: "Galerie (auto)" },
  { kind: "enterprises", label: "Entreprises (auto)" },
  { kind: "form", label: "Formulaire de contact (auto)" },
  { kind: "raw", label: "HTML brut" },
];

function makeBlock(kind: PageBlock["kind"]): PageBlock {
  switch (kind) {
    case "text": return { kind, title: "", paragraphs: [] };
    case "list": return { kind, title: "", items: [] };
    case "cards": return { kind, title: "", intro: "", cards: [] };
    case "stats": return { kind, items: [] };
    case "notice": return { kind, title: "", text: "" };
    case "cta": return { kind, title: "", text: "", primaryLabel: "", primaryHref: "", ghostLabel: "", ghostHref: "" };
    case "hours": return { kind, title: "Horaires d'ouverture" };
    case "reviews": return { kind, title: "Avis Google" };
    case "topics": return { kind, title: "", intro: "" };
    case "contact-cards": return { kind, title: "", intro: "" };
    case "gallery": return { kind, title: "", intro: "" };
    case "enterprises": return { kind, title: "", intro: "" };
    case "form": return { kind, title: "", intro: "" };
    case "raw": return { kind, html: "" };
  }
}

function MissionEditor({ mission, onChange }: { mission: Mission; onChange: (m: Mission) => void }) {
  const setData = (patch: Partial<Mission["data"]>) => onChange({ ...mission, data: { ...mission.data, ...patch } });
  const d = mission.data;
  return (
    <div>
      <div className="admin-grid-2">
        <F label="Eyebrow (petit texte au-dessus)"><In value={mission.eyebrow} onChange={(e) => onChange({ ...mission, eyebrow: e.target.value })} /></F>
        <F label="Slug (URL : /slug)"><In value={mission.slug} onChange={(e) => onChange({ ...mission, slug: e.target.value })} /></F>
      </div>
      <F label="Titre de la page"><Ta value={mission.title} onChange={(e) => onChange({ ...mission, title: e.target.value })} /></F>
      <F label="Chapeau (lead)"><Ta value={mission.lead} onChange={(e) => onChange({ ...mission, lead: e.target.value })} /></F>
      <div className="field">
        <span className="field-label">Publication</span>
        <Switch label="Page publiée sur le site" checked={mission.published} onChange={(v) => onChange({ ...mission, published: v })} />
      </div>

      <h3 className="h3 mt-3 mb-2">Boutons d'action</h3>
      {d.ctas.map((c, i) => (
        <div key={i} className="flex items-center gap-2 mb-2 flex-wrap">
          <In value={c.label} placeholder="Libellé" style={{ maxWidth: 220 }} onChange={(e) => setData({ ctas: d.ctas.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)) })} />
          <In value={c.href} placeholder="Lien" style={{ maxWidth: 260 }} onChange={(e) => setData({ ctas: d.ctas.map((x, j) => (j === i ? { ...x, href: e.target.value } : x)) })} />
          <select className="select" style={{ width: "auto" }} value={c.variant} onChange={(e) => setData({ ctas: d.ctas.map((x, j) => (j === i ? { ...x, variant: e.target.value as "primary" | "ghost" } : x)) })}>
            <option value="primary">principal</option>
            <option value="ghost">secondaire</option>
          </select>
          <button type="button" className="icon-btn icon-btn--danger" onClick={() => setData({ ctas: d.ctas.filter((_, j) => j !== i) })} aria-label="Supprimer">✕</button>
        </div>
      ))}
      <button type="button" className="btn-add" onClick={() => setData({ ctas: [...d.ctas, { label: "", href: "", variant: "primary" }] })}>+ Ajouter un bouton</button>

      <h3 className="h3 mt-3 mb-2">Chiffres clés</h3>
      {d.stats.map((s, i) => (
        <div key={i} className="flex items-center gap-2 mb-2">
          <In value={s.value} placeholder="7" style={{ maxWidth: 110 }} onChange={(e) => setData({ stats: d.stats.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)) })} />
          <In value={s.label} placeholder="libellé" onChange={(e) => setData({ stats: d.stats.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)) })} />
          <button type="button" className="icon-btn icon-btn--danger" onClick={() => setData({ stats: d.stats.filter((_, j) => j !== i) })} aria-label="Supprimer">✕</button>
        </div>
      ))}
      <button type="button" className="btn-add" onClick={() => setData({ stats: [...d.stats, { value: "", label: "" }] })}>+ Ajouter un chiffre</button>

      <h3 className="h3 mt-3 mb-2">Points forts (cartes)</h3>
      {d.features.map((f, i) => (
        <ItemCard key={i} title={f.title || `Point fort ${i + 1}`} onRemove={() => setData({ features: d.features.filter((_, j) => j !== i) })}>
          <div className="admin-grid-2">
            <F label="Icône"><In value={f.icon} onChange={(e) => setData({ features: d.features.map((x, j) => (j === i ? { ...x, icon: e.target.value } : x)) })} /></F>
            <F label="Titre"><In value={f.title} onChange={(e) => setData({ features: d.features.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)) })} /></F>
          </div>
          <F label="Texte"><Ta value={f.text} onChange={(e) => setData({ features: d.features.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)) })} /></F>
        </ItemCard>
      ))}
      <button type="button" className="btn-add" onClick={() => setData({ features: [...d.features, { icon: "✦", title: "", text: "" }] })}>+ Ajouter un point fort</button>

      <h3 className="h3 mt-3 mb-2">Étapes « Comment ça marche ? »</h3>
      {d.steps.map((s, i) => (
        <ItemCard key={i} title={s.title || `Étape ${i + 1}`} onRemove={() => setData({ steps: d.steps.filter((_, j) => j !== i) })}>
          <F label="Titre de l'étape"><In value={s.title} onChange={(e) => setData({ steps: d.steps.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)) })} /></F>
          <F label="Texte de l'étape"><Ta value={s.text} onChange={(e) => setData({ steps: d.steps.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)) })} /></F>
        </ItemCard>
      ))}
      <button type="button" className="btn-add" onClick={() => setData({ steps: [...d.steps, { title: "", text: "" }] })}>+ Ajouter une étape</button>

      <h3 className="h3 mt-3 mb-2">Alerte & conclusion</h3>
      <div className="admin-grid-2">
        <F label="Titre de l'alerte"><In value={d.warning.title} onChange={(e) => setData({ warning: { ...d.warning, title: e.target.value } })} /></F>
        <F label="Texte de l'alerte"><In value={d.warning.text} onChange={(e) => setData({ warning: { ...d.warning, text: e.target.value } })} /></F>
        <F label="Titre du bandeau final"><In value={d.outro.title} onChange={(e) => setData({ outro: { ...d.outro, title: e.target.value } })} /></F>
        <F label="Texte du bandeau final"><In value={d.outro.text} onChange={(e) => setData({ outro: { ...d.outro, text: e.target.value } })} /></F>
      </div>
      <F label="Principe en bref (texte sous le héro)"><Ta value={d.lead} onChange={(e) => setData({ lead: e.target.value })} /></F>
    </div>
  );
}

export function PagesTab({
  pages,
  missions,
  onPages,
  onMissions,
}: {
  pages: PageRow[];
  missions: Mission[];
  onPages: (p: PageRow[]) => void;
  onMissions: (m: Mission[]) => void;
}) {
  const [selectedPage, setSelectedPage] = useState(pages[0]?.slug ?? "");
  const [selectedMission, setSelectedMission] = useState(missions[0]?.slug ?? "");
  const page = pages.find((p) => p.slug === selectedPage);
  const mission = missions.find((m) => m.slug === selectedMission);

  const setPage = (patch: Partial<PageRow>) => onPages(pages.map((p) => (p.slug === selectedPage ? { ...p, ...patch } : p)));
  const moveBlock = (i: number, d: number) => {
    if (!page) return;
    const j = i + d;
    if (j < 0 || j >= page.blocks.length) return;
    const blocks = [...page.blocks];
    [blocks[i], blocks[j]] = [blocks[j], blocks[i]];
    setPage({ blocks });
  };

  return (
    <>
      <h2>Pages & missions</h2>
      <p className="panel-lead">Contenus des pages du site (accueil, à propos, galerie, contact, mentions légales) et des pages « missions ».</p>

      <div className="admin-grid-2 mb-3">
        <F label="Page à éditer">
          <select className="select" value={selectedPage} onChange={(e) => setSelectedPage(e.target.value)}>
            {pages.map((p) => (
              <option key={p.slug} value={p.slug}>/{p.slug}</option>
            ))}
          </select>
        </F>
        <F label="Page mission à éditer">
          <select className="select" value={selectedMission} onChange={(e) => setSelectedMission(e.target.value)}>
            {missions.map((m) => (
              <option key={m.slug} value={m.slug}>/{m.slug}</option>
            ))}
          </select>
        </F>
      </div>

      {page && (
        <div className="mb-4" style={{ borderTop: "1px solid var(--line)", paddingTop: "1rem" }}>
          <h3 className="h3 mb-2">Page /{page.slug}</h3>
          <div className="admin-grid-2">
            <F label="Eyebrow"><In value={page.eyebrow} onChange={(e) => setPage({ eyebrow: e.target.value })} /></F>
            <F label="Titre"><In value={page.title} onChange={(e) => setPage({ title: e.target.value })} /></F>
          </div>
          <F label="Chapeau (lead)"><Ta value={page.lead} onChange={(e) => setPage({ lead: e.target.value })} /></F>
          <h4 className="mt-3 mb-2">Blocs de la page</h4>
          {page.blocks.map((b, i) => (
            <BlockEditor
              key={i}
              block={b}
              onChange={(nb) => setPage({ blocks: page.blocks.map((x, j) => (j === i ? nb : x)) })}
              onRemove={() => setPage({ blocks: page.blocks.filter((_, j) => j !== i) })}
              onUp={() => moveBlock(i, -1)}
              onDown={() => moveBlock(i, 1)}
            />
          ))}
          <div className="flex gap-2 items-center flex-wrap">
            <select className="select" style={{ width: "auto" }} id="new-block-kind" defaultValue="text">
              {BLOCK_KINDS.map((k) => (
                <option key={k.kind} value={k.kind}>{k.label}</option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                const sel = document.getElementById("new-block-kind") as HTMLSelectElement;
                setPage({ blocks: [...page.blocks, makeBlock(sel.value as PageBlock["kind"])] });
              }}
            >
              + Ajouter un bloc
            </button>
          </div>
        </div>
      )}

      {mission && (
        <div style={{ borderTop: "1px solid var(--line)", paddingTop: "1rem" }}>
          <h3 className="h3 mb-2">Mission /{mission.slug}</h3>
          <MissionEditor mission={mission} onChange={(m) => onMissions(missions.map((x) => (x.slug === m.slug ? m : x)))} />
        </div>
      )}
    </>
  );
}

// --------------------------- Messages ---------------------------------------

export function MessagesTab({ messages, onChanged }: { messages: MessageData[]; onChanged: (m: MessageData[]) => void }) {
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const res = await fetch("/api/admin/messages");
    const json = await res.json();
    if (json?.ok) onChanged(json.messages);
  }

  async function toggleRead(m: MessageData) {
    setBusy(true);
    await fetch("/api/admin/messages", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: m.id, read: !m.read }) });
    await refresh();
    setBusy(false);
  }

  async function remove(m: MessageData) {
    if (!window.confirm(`Supprimer le message de ${m.name} ?`)) return;
    setBusy(true);
    await fetch(`/api/admin/messages?id=${m.id}`, { method: "DELETE" });
    await refresh();
    setBusy(false);
  }

  return (
    <>
      <h2>Messages reçus</h2>
      <p className="panel-lead">Messages envoyés depuis le formulaire de contact du site public.</p>
      {messages.length === 0 && <p className="muted">Aucun message pour le moment.</p>}
      {messages.map((m) => (
        <div key={m.id} className={`msg-card ${m.read ? "" : "msg-card--unread"}`}>
          <div className="msg-meta">
            <strong>{m.name}</strong>
            <a href={`mailto:${m.email}`}>{m.email}</a>
            {m.phone && <span>{m.phone}</span>}
            {m.subject && <span>Sujet : {m.subject}</span>}
            <span>{new Date(m.createdAt).toLocaleString("fr-FR")}</span>
            {!m.read && <strong style={{ color: "var(--accent-ink)" }}>● non lu</strong>}
            <span style={{ marginLeft: "auto" }} className="flex gap-2">
              <button type="button" className="icon-btn" disabled={busy} onClick={() => toggleRead(m)} aria-label={m.read ? "Marquer non lu" : "Marquer lu"}>
                {m.read ? "↺" : "✓"}
              </button>
              <button type="button" className="icon-btn icon-btn--danger" disabled={busy} onClick={() => remove(m)} aria-label="Supprimer">
                ✕
              </button>
            </span>
          </div>
          <p>{m.message}</p>
        </div>
      ))}
    </>
  );
}

// --------------------------- Apparence & SEO --------------------------------

export function AppearanceTab({ settings, onChange, onReset }: { settings: SettingsData; onChange: (s: SettingsData) => void; onReset: () => void }) {
  const set = (patch: Partial<SettingsData>) => onChange({ ...settings, ...patch });
  const setColor = (k: keyof SettingsData["colors"], v: string) => set({ colors: { ...settings.colors, [k]: v } });
  return (
    <>
      <h2>Apparence & SEO</h2>
      <p className="panel-lead">Couleurs du site (identité Recycl'Aide : bleu ardoise + rouge), textes SEO et pied de page.</p>
      <div className="admin-grid-2">
        <ColorField label="Couleur principale (boutons, liens, badges)" value={settings.colors.brand} onChange={(v) => setColor("brand", v)} />
        <ColorField label="Couleur profonde (bandeaux, ticker)" value={settings.colors.brandDeep} onChange={(v) => setColor("brandDeep", v)} />
        <ColorField label="Couleur d'accent (CTA principal, badges)" value={settings.colors.accent} onChange={(v) => setColor("accent", v)} />
        <ColorField label="Couleur de fond des pages" value={settings.colors.page} onChange={(v) => setColor("page", v)} />
      </div>
      <div className="admin-grid-2">
        <F label="Titre SEO (balise title)">
          <Ta value={settings.seo.title} onChange={(e) => set({ seo: { ...settings.seo, title: e.target.value } })} />
        </F>
        <F label="Description SEO (meta description)">
          <Ta value={settings.seo.description} onChange={(e) => set({ seo: { ...settings.seo, description: e.target.value } })} />
        </F>
      </div>
      <F label="Note de pied de page">
        <In value={settings.footerNote} onChange={(e) => set({ footerNote: e.target.value })} />
      </F>
      <div className="mt-4" style={{ borderTop: "1px solid var(--line)", paddingTop: "1rem" }}>
        <h3 className="h3 mb-2">Zone dangereuse</h3>
        <p className="muted text-sm mb-2">Remet tout le contenu du site aux valeurs par défaut de Recycl'Aide (textes, horaires, avis, galerie…). Les messages reçus ne sont pas supprimés.</p>
        <button type="button" className="btn btn-ghost" onClick={onReset} style={{ borderColor: "var(--ko)", color: "var(--ko)" }}>
          Réinitialiser le contenu par défaut
        </button>
      </div>
    </>
  );
}
