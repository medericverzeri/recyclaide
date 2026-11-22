"use client";

import { useState } from "react";
import Link from "next/link";
import type { AdminContent } from "@/lib/types";
import { IdentityTab, HoursTab } from "./tabs-a";
import { ContactTab, ReviewsTab, GalleryTab, EnterprisesTab } from "./tabs-b";
import { PagesTab, MessagesTab, AppearanceTab } from "./tabs-c";

const TABS = [
  "Identité & héro",
  "Horaires & bandeau",
  "Contacts & sujets",
  "Avis Google",
  "Galerie",
  "Entreprises",
  "Pages & missions",
  "Messages",
  "Apparence & SEO",
] as const;

export function AdminApp({ initial, email }: { initial: AdminContent; email: string }) {
  const [content, setContent] = useState<AdminContent>(initial);
  const [tab, setTab] = useState<(typeof TABS)[number]>(TABS[0]);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const update = (patch: Partial<AdminContent>) => {
    setContent((c) => ({ ...c, ...patch }));
    setDirty(true);
  };

  async function save() {
    setSaving(true);
    setToast("");
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const json = await res.json();
      if (!res.ok || !json?.ok) throw new Error(json?.error || "Sauvegarde impossible");
      setContent(json.content);
      setDirty(false);
      setToast("✔ Enregistré — le site public est mis à jour automatiquement.");
      setTimeout(() => setToast(""), 4000);
    } catch (e) {
      setToast(e instanceof Error ? `✖ ${e.message}` : "✖ Erreur de sauvegarde");
      setTimeout(() => setToast(""), 5000);
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  async function resetAll() {
    if (!window.confirm("Réinitialiser TOUT le contenu avec les valeurs par défaut de Recycl'Aide ? Cette action est irréversible.")) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/reset", { method: "POST" });
      const json = await res.json();
      if (!res.ok || !json?.ok) throw new Error("Reset impossible");
      setContent(json.content);
      setDirty(false);
      setToast("✔ Contenu réinitialisé aux valeurs par défaut.");
      setTimeout(() => setToast(""), 4000);
    } catch (e) {
      setToast(e instanceof Error ? `✖ ${e.message}` : "✖ Erreur");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-shell">
      <div className="admin-topbar">
        <div className="wrap flex items-center gap-3 flex-wrap">
          <strong style={{ fontFamily: "var(--font-display)" }}>Espace admin</strong>
          <span className="text-sm muted">{email}</span>
          <div className="admin-tabs" style={{ marginLeft: "auto" }}>
            {TABS.map((t) => (
              <button key={t} type="button" className={`admin-tab ${tab === t ? "admin-tab--active" : ""}`} onClick={() => setTab(t)}>
                {t}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Link href="/" className="btn btn-ghost btn-sm" target="_blank">
              Voir le site ↗
            </Link>
            <button type="button" className="btn btn-ghost btn-sm" onClick={logout}>
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      <div className="wrap">
        <div className="admin-panel">
          {tab === "Identité & héro" && <IdentityTab settings={content.settings} onChange={(s) => update({ settings: s })} />}
          {tab === "Horaires & bandeau" && <HoursTab settings={content.settings} onChange={(s) => update({ settings: s })} />}
          {tab === "Contacts & sujets" && (
            <ContactTab
              contacts={content.contacts}
              topics={content.topics}
              onContacts={(contacts) => update({ contacts })}
              onTopics={(topics) => update({ topics })}
            />
          )}
          {tab === "Avis Google" && <ReviewsTab reviews={content.reviews} settings={content.settings} onChange={(reviews) => update({ reviews })} onSettings={(settings) => update({ settings })} />}
          {tab === "Galerie" && <GalleryTab albums={content.albums} onChange={(albums) => update({ albums })} />}
          {tab === "Entreprises" && <EnterprisesTab enterprises={content.enterprises} onChange={(enterprises) => update({ enterprises })} />}
          {tab === "Pages & missions" && <PagesTab pages={content.pages} missions={content.missions} onPages={(pages) => update({ pages })} onMissions={(missions) => update({ missions })} />}
          {tab === "Messages" && <MessagesTab messages={content.messages} onChanged={(messages) => update({ messages })} />}
          {tab === "Apparence & SEO" && <AppearanceTab settings={content.settings} onChange={(s) => update({ settings: s })} onReset={resetAll} />}
        </div>
      </div>

      <div className="save-bar">
        <div className="wrap flex items-center gap-3">
          <button type="button" className="btn btn-primary" onClick={save} disabled={saving || !dirty}>
            {saving ? "Enregistrement…" : "Enregistrer les modifications"}
          </button>
          <span className="text-sm muted">{dirty ? "Des modifications non enregistrées sont en attente." : "Le site est à jour avec la base de données."}</span>
          <span className="text-sm muted" style={{ marginLeft: "auto" }}>
            Les modifications sont publiées instantanément sur le site public.
          </span>
        </div>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
