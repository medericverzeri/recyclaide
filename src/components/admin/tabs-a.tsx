"use client";

import type { DayHours, SettingsData, Slot } from "@/lib/types";
import { F, In, Ta, Sel, StrList, MediaField, ItemCard, Switch } from "./fields";

// --------------------------- Identité & héro -------------------------------

export function IdentityTab({ settings, onChange }: { settings: SettingsData; onChange: (s: SettingsData) => void }) {
  const set = (patch: Partial<SettingsData>) => onChange({ ...settings, ...patch });
  return (
    <>
      <h2>Identité & héro</h2>
      <p className="panel-lead">Nom, logo, photo de profil, statut d&apos;ouverture et coordonnées — tout ce qui s&apos;affiche dans l&apos;en-tête et le héro.</p>
      <div className="admin-grid-2">
        <F label="Nom de la structure">
          <In value={settings.siteName} onChange={(e) => set({ siteName: e.target.value })} />
        </F>
        <F label="Prénom affiché (héro)">
          <In value={settings.personName} onChange={(e) => set({ personName: e.target.value })} />
        </F>
        <F label="Nom complet (en-tête / pied de page)">
          <In value={settings.personFullName} onChange={(e) => set({ personFullName: e.target.value })} />
        </F>
        <F label="Initiales (badge)">
          <In value={settings.initials} onChange={(e) => set({ initials: e.target.value })} maxLength={4} />
        </F>
        <F label="Rôle (sous le nom)">
          <In value={settings.role} onChange={(e) => set({ role: e.target.value })} />
        </F>
        <F label="Baseline (sous la photo)">
          <In value={settings.tagline} onChange={(e) => set({ tagline: e.target.value })} />
        </F>
        <F label="Localisation">
          <In value={settings.location} onChange={(e) => set({ location: e.target.value })} />
        </F>
        <F label="Ville (pied de page)">
          <In value={settings.city} onChange={(e) => set({ city: e.target.value })} />
        </F>
      </div>
      <F label="Texte du héro">
        <Ta value={settings.heroLead} onChange={(e) => set({ heroLead: e.target.value })} />
      </F>
      <div className="admin-grid-2">
        <MediaField label="Logo" value={settings.logo} onChange={(v) => set({ logo: v })} />
        <MediaField label="Photo du héro" value={settings.heroImage} onChange={(v) => set({ heroImage: v })} />
      </div>
      <F label="Texte alternatif de la photo">
        <In value={settings.heroAlt} onChange={(e) => set({ heroAlt: e.target.value })} />
      </F>
      <div className="admin-grid-2">
        <F label="Statut d'ouverture">
          <Sel value={settings.statusMode} onChange={(e) => set({ statusMode: e.target.value as SettingsData["statusMode"] })}>
            <option value="auto">Automatique (selon les horaires)</option>
            <option value="open">Forcer « Ouvert »</option>
            <option value="closed">Forcer « Fermé »</option>
          </Sel>
        </F>
        <F label="Précision manuelle du statut" hint="Ex : « réouverture lundi 9h00 » — affiché quand le statut est forcé.">
          <In value={settings.statusOverride} onChange={(e) => set({ statusOverride: e.target.value })} />
        </F>
        <F label="Email">
          <In value={settings.email} onChange={(e) => set({ email: e.target.value })} type="email" />
        </F>
        <F label="Téléphone fixe (affiché)">
          <In value={settings.phone} onChange={(e) => set({ phone: e.target.value })} />
        </F>
        <F label="Lien tel: du fixe">
          <In value={settings.phoneHref} onChange={(e) => set({ phoneHref: e.target.value })} placeholder="tel:+33344802525" />
        </F>
        <F label="Mobile (affiché)">
          <In value={settings.mobile} onChange={(e) => set({ mobile: e.target.value })} />
        </F>
        <F label="Lien tel: du mobile">
          <In value={settings.mobileHref} onChange={(e) => set({ mobileHref: e.target.value })} placeholder="tel:+336…" />
        </F>
      </div>
      <F label="Adresse (lignes)">
        <StrList items={settings.addressLines} onChange={(addressLines) => set({ addressLines })} placeholder="4 rue de la Prairie" addLabel="Ajouter une ligne" />
      </F>
      <div className="admin-grid-2">
        <F label="Site externe (bouton « Visiter le site »)">
          <In value={settings.externalUrl} onChange={(e) => set({ externalUrl: e.target.value })} placeholder="https://recyclaide.fr" />
        </F>
        <F label="Libellé du site externe">
          <In value={settings.externalLabel} onChange={(e) => set({ externalLabel: e.target.value })} />
        </F>
        <F label="Lien vers les avis Google">
          <In value={settings.googleUrl} onChange={(e) => set({ googleUrl: e.target.value })} />
        </F>
        <F label="Note Google affichée (ex : 5,0)">
          <In value={settings.googleRating} onChange={(e) => set({ googleRating: e.target.value })} />
        </F>
        <F label="Nombre d'avis affiché (ex : 12 avis)">
          <In value={settings.googleReviewsCount} onChange={(e) => set({ googleReviewsCount: e.target.value })} />
        </F>
      </div>
      <F label="Navigation principale">
        <StrList
          items={settings.nav.map((n) => `${n.label}|${n.href}`)}
          onChange={(arr) => set({ nav: arr.filter(Boolean).map((l) => { const [label, href] = l.split("|"); return { label: label ?? "", href: href ?? "/" }; }) })}
          placeholder="Label|/chemin"
          addLabel="Ajouter un lien"
        />
        <span className="hint">Format : Libellé|/chemin — ex : Accueil|/</span>
      </F>
    </>
  );
}

// --------------------------- Horaires & bandeau -----------------------------

function SlotEditor({ slots, onChange }: { slots: Slot[]; onChange: (s: Slot[]) => void }) {
  const set = (i: number, patch: Partial<Slot>) => onChange(slots.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  const remove = (i: number) => onChange(slots.filter((_, j) => j !== i));
  return (
    <div>
      {slots.map((s, i) => (
        <div key={i} className="flex items-center gap-2 mb-2 flex-wrap">
          <In value={s.label} onChange={(e) => set(i, { label: e.target.value })} placeholder="Label (ex : Boutique)" style={{ maxWidth: 200 }} />
          <In value={s.from} onChange={(e) => set(i, { from: e.target.value })} placeholder="9h00" style={{ maxWidth: 80 }} />
          <span>–</span>
          <In value={s.to} onChange={(e) => set(i, { to: e.target.value })} placeholder="12h00" style={{ maxWidth: 80 }} />
          <button type="button" className="icon-btn icon-btn--danger" onClick={() => remove(i)} aria-label="Supprimer le créneau">
            ✕
          </button>
        </div>
      ))}
      <button type="button" className="btn-add" onClick={() => onChange([...slots, { label: "", from: "9h00", to: "12h00" }])}>
        + Ajouter un créneau
      </button>
    </div>
  );
}

export function HoursTab({ settings, onChange }: { settings: SettingsData; onChange: (s: SettingsData) => void }) {
  const set = (patch: Partial<SettingsData>) => onChange({ ...settings, ...patch });
  const setDay = (i: number, patch: Partial<DayHours>) => set({ hours: settings.hours.map((d, j) => (j === i ? { ...d, ...patch } : d)) });
  return (
    <>
      <h2>Horaires & bandeau défilant</h2>
      <p className="panel-lead">
        Les horaires pilotent le statut « Ouvert / Fermé » calculé automatiquement (heure de Paris) affiché sur tout le site.
      </p>
      {settings.hours.map((d, i) => (
        <ItemCard key={d.day} title={d.day}>
          <div className="flex gap-4 flex-wrap mb-2">
            <Switch label="Fermé" checked={d.closed} onChange={(v) => setDay(i, { closed: v })} />
            <Switch label="Sur rendez-vous uniquement" checked={d.rdvOnly} onChange={(v) => setDay(i, { rdvOnly: v })} />
          </div>
          {!d.closed && <SlotEditor slots={d.slots} onChange={(slots) => setDay(i, { slots })} />}
          <div className="mt-2">
            <F label="Note du jour">
              <In value={d.note} onChange={(e) => setDay(i, { note: e.target.value })} placeholder="Information affichée sous les horaires" />
            </F>
          </div>
        </ItemCard>
      ))}
      <h2 className="mt-4">Bandeau défilant (ticker)</h2>
      <p className="panel-lead">Annonces affichées en haut du site, entre l&apos;en-tête et le contenu.</p>
      <StrList items={settings.ticker} onChange={(ticker) => set({ ticker })} placeholder="Annonce…" addLabel="Ajouter une annonce" />
    </>
  );
}
