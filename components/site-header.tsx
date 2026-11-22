import Link from "next/link";
import type { Mission, SettingsData } from "@/lib/types";
import { ChromeControls } from "./chrome";
import { SiteNav } from "./site-nav";

export function SiteHeader({
  settings,
  missions,
}: {
  settings: SettingsData;
  missions: Pick<Mission, "slug" | "title">[];
}) {
  return (
    <header className="site-header">
      <div className="wrap site-header__inner">
        <Link href="/" className="brand" aria-label={`${settings.siteName} — accueil`}>
          <span className="brand-mark">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {settings.logo ? <img src={settings.logo} alt="" /> : settings.initials}
          </span>
          <span>
            <span className="brand-name block">{settings.personFullName || settings.personName}</span>
            <span className="brand-role block">{settings.role}</span>
          </span>
        </Link>
        <SiteNav nav={settings.nav} />
        <ChromeControls nav={settings.nav} missions={missions} contactHref="/contact" contactLabel="Contactez-nous" />
      </div>
    </header>
  );
}
