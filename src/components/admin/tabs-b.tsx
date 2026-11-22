"use client";

import type { Album, ContactCardData, EnterpriseData, Photo, ReviewData, SettingsData, TopicData } from "@/lib/types";
import { F, In, Ta, Sel, StrList, MediaField, ItemCard, Switch, ColorField } from "./fields";

// --------------------------- Contacts & sujets ------------------------------

export function ContactTab({
  contacts,
  topics,
  onContacts,
  onTopics,
}: {
  contacts: ContactCardData[];
  topics: TopicData[];
  onContacts: (c: ContactCardData[]) => void;
  onTopics: (t: TopicData[]) => void;
}) {
  const move = <T,>(arr: T[], i: number, d: number): T[] => {
    const j = i + d;
    if (j < 0 || j >= arr.length) return arr;
    const next = [...arr];
    [next[i], next[j]] = [next[j], next[i]];
    return next;
  };
  return (
    <>
      <h2>Contacts & sujets</h2>
      <p className="panel-lead">Les cartes « Le bon contact pour votre demande » et l&apos;accordéon de questions fréquentes.</p>

      <h3 className="h3 mb-2">Cartes contact</h3>
      {contacts.map((c, i) => (
        <ItemCard
          key={c.id}
          title={c.label || `Contact ${i + 1}`}
          onRemove={() => onContacts(contacts.filter((_, j) => j !== i))}
          onUp={() => onContacts(move(contacts, i, -1))}
          onDown={() => onContacts(move(contacts, i, 1))}
        >
          <div className="admin-grid-2">
            <F label="Libellé"><In value={c.label} onChange={(e) => onContacts(contacts.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} /></F>
            <F label="Personne"><In value={c.person} onChange={(e) => onContacts(contacts.map((x, j) => (j === i ? { ...x, person: e.target.value } : x)))} /></F>
            <F label="Email"><In value={c.email} onChange={(e) => onContacts(contacts.map((x, j) => (j === i ? { ...x, email: e.target.value } : x)))} /></F>
            <F label="Téléphone"><In value={c.phone} onChange={(e) => onContacts(contacts.map((x, j) => (j === i ? { ...x, phone: e.target.value } : x)))} /></F>
          </div>
          <F label="Description"><Ta value={c.description} onChange={(e) => onContacts(contacts.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)))} /></F>
        </ItemCard>
      ))}
      <button type="button" className="btn-add" onClick={() => onContacts([...contacts, { id: -Date.now(), label: "Nouveau contact", person: "", description: "", email: "", phone: "", order: contacts.length }])}>
        + Ajouter une carte contact
      </button>

      <h3 className="h3 mt-4 mb-2">Sujets (accordéon)</h3>
      {topics.map((t, i) => (
        <ItemCard
          key={t.id}
          title={t.title || `Sujet ${i + 1}`}
          onRemove={() => onTopics(topics.filter((_, j) => j !== i))}
          onUp={() => onTopics(move(topics, i, -1))}
          onDown={() => onTopics(move(topics, i, 1))}
        >
          <div className="admin-grid-2">
            <F label="Icône (emoji/symbole)"><In value={t.icon} onChange={(e) => onTopics(topics.map((x, j) => (j === i ? { ...x, icon: e.target.value } : x)))} /></F>
            <F label="Titre (accordéon)"><In value={t.title} onChange={(e) => onTopics(topics.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))} /></F>
            <F label="Kicker (petit texte)"><In value={t.kicker} onChange={(e) => onTopics(topics.map((x, j) => (j === i ? { ...x, kicker: e.target.value } : x)))} /></F>
            <F label="Sous-titre du panneau"><In value={t.heading} onChange={(e) => onTopics(topics.map((x, j) => (j === i ? { ...x, heading: e.target.value } : x)))} /></F>
          </div>
          <F label="Introduction"><Ta value={t.intro} onChange={(e) => onTopics(topics.map((x, j) => (j === i ? { ...x, intro: e.target.value } : x)))} /></F>
          <F label="Étapes (liste numérotée)">
            <StrList
              items={t.steps}
              onChange={(steps) => onTopics(topics.map((x, j) => (j === i ? { ...x, steps } : x)))}
              placeholder="Étape…"
              addLabel="Ajouter une étape"
            />
          </F>
          <div className="admin-grid-2">
            <F label="Titre de l'alerte"><In value={t.warningTitle} onChange={(e) => onTopics(topics.map((x, j) => (j === i ? { ...x, warningTitle: e.target.value } : x)))} /></F>
            <F label="Texte de l'alerte"><In value={t.warningText} onChange={(e) => onTopics(topics.map((x, j) => (j === i ? { ...x, warningText: e.target.value } : x)))} /></F>
            <F label="Libellé du bouton CTA"><In value={t.ctaLabel} onChange={(e) => onTopics(topics.map((x, j) => (j === i ? { ...x, ctaLabel: e.target.value } : x)))} /></F>
            <F label="Lien du bouton CTA"><In value={t.ctaHref} onChange={(e) => onTopics(topics.map((x, j) => (j === i ? { ...x, ctaHref: e.target.value } : x)))} placeholder="/collecte ou mailto:…" /></F>
            <F label="Sujet du mailto « Une question sur ce sujet ? »"><In value={t.mailtoSubject} onChange={(e) => onTopics(topics.map((x, j) => (j === i ? { ...x, mailtoSubject: e.target.value } : x)))} /></F>
            <F label="Note à côté du CTA"><In value={t.ctaNote} onChange={(e) => onTopics(topics.map((x, j) => (j === i ? { ...x, ctaNote: e.target.value } : x)))} /></F>
          </div>
        </ItemCard>
      ))}
      <button
        type="button"
        className="btn-add"
        onClick={() =>
          onTopics([
            ...topics,
            {
              id: -Date.now(), icon: "✦", title: "Nouveau sujet", kicker: "", heading: "", intro: "", steps: [],
              warningTitle: "", warningText: "", ctaLabel: "", ctaHref: "", ctaNote: "", mailtoSubject: "", order: topics.length,
            },
          ])
        }
      >
        + Ajouter un sujet
      </button>
    </>
  );
}

// --------------------------- Avis Google ------------------------------------

export function ReviewsTab({
  reviews,
  settings,
  onChange,
  onSettings,
}: {
  reviews: ReviewData[];
  settings: SettingsData;
  onChange: (r: ReviewData[]) => void;
  onSettings: (s: SettingsData) => void;
}) {
  const set = (i: number, patch: Partial<ReviewData>) => onChange(reviews.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= reviews.length) return;
    const next = [...reviews];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <>
      <h2>Avis Google</h2>
      <p className="panel-lead">
        Les commentaires laissés sur Google sont mis en avant sur le site. Note globale affichée :
      </p>
      <div className="admin-grid-2">
        <F label="Note affichée (ex : 5,0)"><In value={settings.googleRating} onChange={(e) => onSettings({ ...settings, googleRating: e.target.value })} /></F>
        <F label="Nombre d'avis (ex : 12 avis)"><In value={settings.googleReviewsCount} onChange={(e) => onSettings({ ...settings, googleReviewsCount: e.target.value })} /></F>
        <F label="Lien « Voir tous les avis »"><In value={settings.googleUrl} onChange={(e) => onSettings({ ...settings, googleUrl: e.target.value })} /></F>
      </div>
      {reviews.map((r, i) => (
        <ItemCard key={r.id} title={r.author || `Avis ${i + 1}`} onRemove={() => onChange(reviews.filter((_, j) => j !== i))} onUp={() => move(i, -1)} onDown={() => move(i, 1)}>
          <div className="admin-grid-2">
            <F label="Auteur"><In value={r.author} onChange={(e) => set(i, { author: e.target.value })} /></F>
            <F label="Métadonnée (ex : 6 avis · 2 photos)"><In value={r.meta} onChange={(e) => set(i, { meta: e.target.value })} /></F>
            <F label="Note (1–5)">
              <Sel value={r.rating} onChange={(e) => set(i, { rating: Number(e.target.value) })}>
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{n} ★</option>
                ))}
              </Sel>
            </F>
            <F label="Date affichée (ex : il y a 2 mois)"><In value={r.dateText} onChange={(e) => set(i, { dateText: e.target.value })} /></F>
            <F label="Visite (ex : Visité en août)"><In value={r.visited} onChange={(e) => set(i, { visited: e.target.value })} /></F>
            <F label="Nb de photos jointes"><In type="number" min={0} value={r.photosCount} onChange={(e) => set(i, { photosCount: Number(e.target.value) })} /></F>
            <ColorField label="Couleur de l'avatar" value={r.color} onChange={(v) => set(i, { color: v })} />
            <div className="field">
              <span className="field-label">Badge « Nouveau »</span>
              <Switch label="Afficher le badge Nouveau" checked={r.isNew} onChange={(v) => set(i, { isNew: v })} />
            </div>
          </div>
          <F label="Texte de l'avis"><Ta value={r.text} onChange={(e) => set(i, { text: e.target.value })} /></F>
        </ItemCard>
      ))}
      <button
        type="button"
        className="btn-add"
        onClick={() =>
          onChange([...reviews, { id: -Date.now(), author: "", meta: "", rating: 5, dateText: "", text: "", visited: "", photosCount: 0, isNew: false, color: "#1a73e8", order: reviews.length }])
        }
      >
        + Ajouter un avis
      </button>
    </>
  );
}

// --------------------------- Galerie ----------------------------------------

function PhotoEditor({ albumIndex, album, onChange }: { albumIndex: number; album: Album; onChange: (a: Album) => void }) {
  const setPhoto = (i: number, patch: Partial<Photo>) => onChange({ ...album, photos: album.photos.map((p, j) => (j === i ? { ...p, ...patch } : p)) });
  const movePhoto = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= album.photos.length) return;
    const photos = [...album.photos];
    [photos[i], photos[j]] = [photos[j], photos[i]];
    onChange({ ...album, photos });
  };
  return (
    <div>
      {album.photos.map((p, i) => (
        <ItemCard key={p.id} title={p.alt || p.caption || `Photo ${i + 1}`} onRemove={() => onChange({ ...album, photos: album.photos.filter((_, j) => j !== i) })} onUp={() => movePhoto(i, -1)} onDown={() => movePhoto(i, 1)}>
          <MediaField label="Image" value={p.src} onChange={(v) => setPhoto(i, { src: v })} />
          <div className="admin-grid-2">
            <F label="Texte alternatif"><In value={p.alt} onChange={(e) => setPhoto(i, { alt: e.target.value })} /></F>
            <F label="Légende"><In value={p.caption} onChange={(e) => setPhoto(i, { caption: e.target.value })} /></F>
          </div>
        </ItemCard>
      ))}
      <button
        type="button"
        className="btn-add"
        onClick={() => onChange({ ...album, photos: [...album.photos, { id: -Date.now(), src: "", alt: "", caption: "", order: album.photos.length }] })}
      >
        + Ajouter une photo à « {album.title} »
      </button>
    </div>
  );
}

export function GalleryTab({ albums, onChange }: { albums: Album[]; onChange: (a: Album[]) => void }) {
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= albums.length) return;
    const next = [...albums];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <>
      <h2>Galerie</h2>
      <p className="panel-lead">Albums photos de la page Galerie. Les images uploadées vont dans la médiathèque (base de données) et restent disponibles sur Vercel.</p>
      {albums.map((a, i) => (
        <ItemCard
          key={a.id}
          title={a.title || `Album ${i + 1}`}
          onRemove={() => onChange(albums.filter((_, j) => j !== i))}
          onUp={() => move(i, -1)}
          onDown={() => move(i, 1)}
        >
          <div className="admin-grid-2">
            <F label="Titre de l'album"><In value={a.title} onChange={(e) => onChange(albums.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))} /></F>
            <F label="Slug (URL interne, unique)"><In value={a.slug} onChange={(e) => onChange(albums.map((x, j) => (j === i ? { ...x, slug: e.target.value } : x)))} /></F>
          </div>
          <F label="Description"><In value={a.description} onChange={(e) => onChange(albums.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)))} /></F>
          <PhotoEditor albumIndex={i} album={a} onChange={(album) => onChange(albums.map((x, j) => (j === i ? album : x)))} />
        </ItemCard>
      ))}
      <button
        type="button"
        className="btn-add"
        onClick={() => onChange([...albums, { id: -Date.now(), title: "Nouvel album", slug: `album-${Date.now()}`, description: "", order: albums.length, photos: [] }])}
      >
        + Ajouter un album
      </button>
    </>
  );
}

// --------------------------- Entreprises ------------------------------------

export function EnterprisesTab({ enterprises, onChange }: { enterprises: EnterpriseData[]; onChange: (e: EnterpriseData[]) => void }) {
  const set = (i: number, patch: Partial<EnterpriseData>) => onChange(enterprises.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= enterprises.length) return;
    const next = [...enterprises];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <>
      <h2>Entreprises du groupe</h2>
      <p className="panel-lead">Les structures du groupe MES affichées sur la page « Entreprises du groupe » (Recycl'Aide est mise en avant).</p>
      {enterprises.map((e, i) => (
        <ItemCard key={e.id} title={e.name || `Entreprise ${i + 1}`} onRemove={() => onChange(enterprises.filter((_, j) => j !== i))} onUp={() => move(i, -1)} onDown={() => move(i, 1)}>
          <div className="admin-grid-2">
            <F label="Nom"><In value={e.name} onChange={(ev) => set(i, { name: ev.target.value })} /></F>
            <F label="Rôle / accroche"><In value={e.tagline} onChange={(ev) => set(i, { tagline: ev.target.value })} /></F>
            <F label="Lieu"><In value={e.location} onChange={(ev) => set(i, { location: ev.target.value })} /></F>
            <div className="field">
              <span className="field-label">Mise en avant</span>
              <Switch label="Mettre en avant (bordure accentuée)" checked={e.highlight} onChange={(v) => set(i, { highlight: v })} />
            </div>
          </div>
        </ItemCard>
      ))}
      <button
        type="button"
        className="btn-add"
        onClick={() => onChange([...enterprises, { id: -Date.now(), name: "Nouvelle structure", tagline: "", location: "", highlight: false, order: enterprises.length }])}
      >
        + Ajouter une entreprise
      </button>
    </>
  );
}
