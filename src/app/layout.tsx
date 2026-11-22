import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { getSiteBundle } from "@/lib/content";
import { computeStatus } from "@/lib/status";
import { SiteHeader } from "@/components/site-header";
import { Ticker } from "@/components/ticker";
import { SiteFooter } from "@/components/footer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { settings } = await getSiteBundle();
    return {
      title: settings.seo.title,
      description: settings.seo.description,
      robots: { index: true, follow: true },
      themeColor: [
        { media: "(prefers-color-scheme: light)", color: settings.colors.brand },
        { media: "(prefers-color-scheme: dark)", color: settings.colors.brandDeep },
      ],
    };
  } catch {
    return {
      title: "Recycl'Aide — Aides techniques reconditionnées à prix solidaire",
      description: "Chantier d'insertion Recycl'Aide (Oise) : collecte, livraison et remise en état d'aides techniques revendues à prix solidaire.",
    };
  }
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const bundle = await getSiteBundle();
  const { settings, missions } = bundle;
  const status = computeStatus(settings);
  const c = settings.colors;

  return (
    <html
      lang="fr"
      suppressHydrationWarning
      style={
        {
          "--brand": c.brand,
          "--brand-deep": c.brandDeep,
          "--accent": c.accent,
          "--page": c.page,
        } as React.CSSProperties
      }
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <a className="skip-link" href="#contenu">
          Aller au contenu principal
        </a>
        <SiteHeader settings={settings} missions={missions} />
        <Ticker settings={settings} status={status.line} statusOpen={status.open} />
        <main id="contenu">{children}</main>
        <SiteFooter settings={settings} missions={missions} />
      </body>
    </html>
  );
}
