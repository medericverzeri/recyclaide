import type { ContactCardData, SettingsData } from "@/lib/types";

export function ContactCards({ contacts }: { contacts: ContactCardData[] }) {
  return (
    <div className="grid-2">
      {contacts.map((c) => (
        <article className="card contact-card" key={c.id}>
          <span className="label">{c.label}</span>
          <h3 className="person">{c.person}</h3>
          <p>{c.description}</p>
          {c.email && (
            <a className="contact-line" href={`mailto:${c.email}`}>
              <span aria-hidden>✉</span> {c.email}
            </a>
          )}
          {c.phone && (
            <a className="contact-line" href={`tel:${c.phone.replace(/[^+\d]/g, "")}`}>
              <span aria-hidden>☎</span> {c.phone}
            </a>
          )}
        </article>
      ))}
    </div>
  );
}

export function ExternalSiteCard({ settings }: { settings: SettingsData }) {
  if (!settings.externalUrl) return null;
  return (
    <div className="mt-4">
      <h3 className="h3 mb-1">N&apos;hésitez pas à nous contacter</h3>
      <p className="muted mb-3">Choisissez le moyen qui vous convient.</p>
      <div className="grid-2">
        <article className="card flex items-center gap-4">
          <span className="feature-icon mb-0" aria-hidden>
            🌐
          </span>
          <div>
            <span className="label">Site web</span>
            <p className="m-0 font-semibold">{settings.externalLabel || settings.externalUrl}</p>
          </div>
          <a className="btn btn-primary btn-sm" style={{ marginLeft: "auto" }} href={settings.externalUrl} target="_blank" rel="noopener noreferrer">
            Visiter le site ↗
          </a>
        </article>
        <article className="card flex items-center gap-4">
          <span className="feature-icon mb-0" aria-hidden>
            ✉
          </span>
          <div>
            <span className="label">Email</span>
            <p className="m-0 font-semibold">{settings.email}</p>
          </div>
          <a className="btn btn-ghost btn-sm" style={{ marginLeft: "auto" }} href={`mailto:${settings.email}`}>
            Écrire
          </a>
        </article>
      </div>
    </div>
  );
}
