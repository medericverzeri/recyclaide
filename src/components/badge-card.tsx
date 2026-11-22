import type { Employee, SettingsData } from "@/lib/types";

// ---------------------------------------------------------------------------
// Carte identifiante salarié — format PORTRAIT 54 mm × 85 mm.
// Composant isomorphe (utilisable côté serveur et client) : le QR est servi
// par /api/qr, le logo par /api/media.
// ---------------------------------------------------------------------------

export function qrUrlFor(ref: string, settings: SettingsData): string {
  const base = (settings.externalUrl || "https://recyclaide.fr").replace(/\/$/, "");
  return `/api/qr?text=${encodeURIComponent(`${base}/verif/${encodeURIComponent(ref)}`)}`;
}

export function BadgeFront({ e, settings, className = "" }: { e: Pick<Employee, "ref" | "nom" | "prenom" | "poste" | "validUntil" | "photo">; settings: SettingsData; className?: string }) {
  const logo = settings.logo || "/logo-recyclaide.png";
  const year = new Date().getFullYear();
  const initials = `${(e.prenom || "?").charAt(0)}${(e.nom || "?").charAt(0)}`.toUpperCase();
  return (
    <div className={`idb ${className}`}>
      <div className="idb-head">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="idb-logo" src={logo} alt={settings.siteName} />
      </div>
      <div className="idb-rule" />
      <div className="idb-type">CARTE SALARIÉ · {year}</div>
      <div className="idb-photo">
        {e.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={e.photo} alt={`${e.prenom} ${e.nom}`} />
        ) : (
          <span className="idb-init">{initials}</span>
        )}
      </div>
      <div className="idb-name">
        {e.nom} {e.prenom}
      </div>
      <div className="idb-poste">{e.poste || "Salarié(e) en insertion — Chantier Recycl'Aide"}</div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="idb-qr" src={qrUrlFor(e.ref, settings)} alt={`QR ${e.ref}`} />
      <div className="idb-foot">
        Association {settings.siteName} · {settings.addressLines.join(" · ")} · {settings.phone}
        {e.validUntil ? ` · valable jusqu’au ${e.validUntil}` : ""}
      </div>
    </div>
  );
}

export function BadgeBack({ e, settings, className = "" }: { e: Pick<Employee, "ref" | "validUntil">; settings: SettingsData; className?: string }) {
  return (
    <div className={`idb idb-back ${className}`}>
      <div className="idb-stripe" />
      <div className="idb-backtext">
        <strong>Carte de salarié — chantier d’insertion {settings.siteName} (ACI)</strong>
        <p>
          Cette carte atteste de l’appartenance de son titulaire au chantier d’insertion {settings.siteName}. Carte nominative et non
          transférable. En cas de perte : {settings.email}.
        </p>
        <p className="idb-valid">
          Réf. {e.ref}
          {e.validUntil ? ` · Valable jusqu’au ${e.validUntil}` : ""}
        </p>
      </div>
      <div className="idb-foot">
        {settings.siteName} · {settings.addressLines.join(" · ")} · {settings.phone}
      </div>
    </div>
  );
}
