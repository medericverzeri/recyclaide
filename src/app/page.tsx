import Link from "next/link";
import { getSiteBundle } from "@/lib/content";
import { StatusChip, StatusLine } from "@/components/status";
import { HoursSection } from "@/components/hours";
import { ReviewsSection } from "@/components/reviews";
import { TopicsAccordion, ContactIntro } from "@/components/topics";
import { ContactCards, ExternalSiteCard } from "@/components/contacts";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const bundle = await getSiteBundle();
  const { settings, reviews, topics, contacts } = bundle;

  return (
    <>
      {/* ------------------------------- Héro ------------------------------- */}
      <section className="hero" id="accueil">
        <div className="wrap hero-grid">
          <div>
            <span className="hero-eyebrow">
              ♻ Économie circulaire · {settings.location}
            </span>
            <h1 className="h1">
              {settings.role.split("·")[0].trim()}
              <br />
              chez <span style={{ color: "var(--accent)" }}>{settings.siteName}</span>
            </h1>
            <p className="lead mt-3" style={{ maxWidth: "56ch" }}>
              {settings.heroLead}
            </p>
            <StatusLine settings={settings} />
            <div className="hero-actions">
              <Link href="/contact" className="btn btn-primary">
                Contactez-nous →
              </Link>
              <Link href="/vente-location" className="btn btn-ghost">
                Voir la boutique
              </Link>
            </div>
          </div>
          <div className="portrait-frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={settings.heroImage} alt={settings.heroAlt} />
            <StatusChip settings={settings} />
            <div className="portrait-signature">
              <strong>{settings.personFullName || settings.personName}</strong>
              <span>{settings.tagline}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------ Horaires ----------------------------- */}
      <HoursSection settings={settings} />

      {/* ---------------------------- Avis Google ---------------------------- */}
      <ReviewsSection reviews={reviews} settings={settings} />

      {/* ------------------------------ Contact ------------------------------ */}
      <section className="section" id="contact" aria-labelledby="contact-title">
        <div className="wrap">
          <p className="eyebrow">Contact</p>
          <h2 className="h2 mb-4" id="contact-title">
            Le bon contact pour votre demande
          </h2>
          <ContactCards contacts={contacts} />
          <div className="mt-4">
            <ContactIntro settings={settings} topics={topics} />
            <TopicsAccordion topics={topics} questionLabel={settings.siteName} />
          </div>
          <ExternalSiteCard settings={settings} />
        </div>
      </section>
    </>
  );
}
