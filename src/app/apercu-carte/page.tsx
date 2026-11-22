import type { Metadata } from "next";
import QRCode from "qrcode";
import { getSiteBundle } from "@/lib/content";
import { mediaUrl } from "@/lib/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Aperçu — Carte salarié Recycl'Aide (démonstration)",
  robots: { index: false, follow: false },
};

// Page de DÉMONSTRATION : aperçu réel de la carte salarié avant intégration.
// URL directe : /apercu-carte
const SAMPLE = {
  nom: "DUPONT",
  prenom: "Marie",
  poste: "Salariée en insertion — Chantier de reconditionnement",
  validite: "31/12/2026",
  id: "EXEMPLE-0001",
};

export default async function ApercuCartePage() {
  const { settings } = await getSiteBundle();
  const logo = mediaUrl(settings.logo || "/logo-recyclaide.png");
  const qrDataUri = await QRCode.toDataURL(`https://recyclaide.fr/verif/${SAMPLE.id}`, {
    margin: 0,
    width: 160,
    color: { dark: "#24313a", light: "#ffffff" },
  });
  const year = new Date().getFullYear();
  const addr = settings.addressLines.join(" · ");

  const BadgeFront = () => (
    <div className="badge badge-front">
      <div className="badge-head">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="badge-logo" src={logo} alt="Recycl'Aide" />
        <span className="badge-type">CARTE SALARIÉ · {year}</span>
      </div>
      <div className="badge-rule" />
      <div className="badge-body">
        <span className="badge-photo">
          <span className="badge-initials">
            {SAMPLE.prenom.charAt(0)}
            {SAMPLE.nom.charAt(0)}
          </span>
        </span>
        <span className="badge-id">
          <strong className="badge-name">
            {SAMPLE.nom} {SAMPLE.prenom}
          </strong>
          <span className="badge-poste">{SAMPLE.poste}</span>
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="badge-qr" src={qrDataUri} alt={`QR ${SAMPLE.id}`} />
      </div>
      <div className="badge-foot">
        Association {settings.siteName} · {addr} · {settings.email} · {settings.phone} · valable jusqu’au {SAMPLE.validite}
      </div>
    </div>
  );

  const BadgeBack = () => (
    <div className="badge badge-back">
      <div className="badge-back-stripe" />
      <div className="badge-back-text">
        <strong>Carte de salarié — chantier d’insertion</strong>
        <p>
          Cette carte atteste de l’appartenance de son titulaire au chantier d’insertion {settings.siteName} (ACI). Elle ne constitue pas un
          document officiel. En cas de perte, contacter {settings.email}.
        </p>
        <p className="badge-back-valid">Valable jusqu’au {SAMPLE.validite} · Réf. {SAMPLE.id}</p>
      </div>
      <div className="badge-foot">{settings.siteName} · {addr} · {settings.phone}</div>
    </div>
  );

  return (
    <main className="wrap" style={{ paddingBlock: "2.5rem" }}>
      <div className="card" style={{ borderColor: "var(--accent)", marginBottom: "2rem" }}>
        <p className="eyebrow">Démonstration — avant validation</p>
        <h1 className="h2">Aperçu de la carte salarié {settings.siteName}</h1>
        <p className="lead mt-2">
          Ceci est le rendu réel (HTML/CSS) de la carte qui sera générée dans l’espace admin. Ouvrez cette page, vérifiez le design, puis dites-moi
          « oui » pour l’intégrer (onglet « Cartes salariés » : nom + prénom → aperçu → impression A4).
        </p>
      </div>

      <h2 className="h3 mb-2">Recto</h2>
      <div style={{ marginBottom: "2rem" }}>
        <BadgeFront />
      </div>

      <h2 className="h3 mb-2">Verso</h2>
      <div style={{ marginBottom: "2rem" }}>
        <BadgeBack />
      </div>

      <h2 className="h3 mb-2">Planche d’impression A4 (8 cartes, 2 × 4)</h2>
      <div className="badge-sheet" id="planche">
        {Array.from({ length: 8 }).map((_, i) => (
          <div className="badge-cell" key={i}>
            <BadgeFront />
          </div>
        ))}
      </div>
      <p className="muted text-sm mt-3">Astuce : Ctrl+P / Cmd+P imprime la planche (les autres éléments de la page sont masqués à l’impression).</p>
    </main>
  );
}
