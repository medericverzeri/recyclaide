import Link from "next/link";
import type { Mission, SettingsData } from "@/lib/types";
import { hoursSummaryLine } from "@/lib/status";

export function SiteFooter({
  settings,
  missions,
}: {
  settings: SettingsData;
  missions: Pick<Mission, "slug" | "title" | "eyebrow">[];
}) {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="site-footer__grid">
          <div className="footer-brand">
            <div className="footer-logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {settings.logo && <img src={settings.logo} alt={`Logo ${settings.siteName}`} />}
              <div>
                <strong className="brand-name">{settings.personFullName || settings.personName}</strong>
                <div className="brand-role">{settings.role}</div>
              </div>
            </div>
            <p>{settings.heroLead}</p>
          </div>
          <nav aria-label="Navigation">
            <h4>Navigation</h4>
            <ul>
              {settings.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Mes missions">
            <h4>Mes missions</h4>
            <ul>
              {missions.map((m) => (
                <li key={m.slug}>
                  <Link href={`/${m.slug}`}>{m.eyebrow || m.title}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h4>Contact</h4>
            <ul>
              <li>
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </li>
              <li>
                <a href={settings.phoneHref}>{settings.phone}</a>
              </li>
              <li>
                <a href={settings.mobileHref}>{settings.mobile}</a>
              </li>
            </ul>
            <h4 className="mt-4">Adresse</h4>
            <ul>
              <li className="text-sm">{settings.siteName}</li>
              {settings.addressLines.map((l, i) => (
                <li key={i} className="text-sm">
                  {l}
                </li>
              ))}
              <li className="text-sm muted">{hoursSummaryLine(settings)}</li>
            </ul>
            <ul className="mt-3">
              <li>
                <Link href="/contact">Formulaire de contact</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="site-footer__bottom">
          <span>
            © {year} {settings.personFullName || settings.personName}. {settings.footerNote}
          </span>
          <Link href="/mentions-legales">Mentions légales</Link>
          <Link href="/admin">Espace admin</Link>
        </div>
      </div>
    </footer>
  );
}
