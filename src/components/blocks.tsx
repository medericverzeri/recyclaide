import type { PageBlock, SiteBundle } from "@/lib/types";
import { HoursSection } from "./hours";
import { ReviewsSection } from "./reviews";
import { TopicsAccordion, ContactIntro } from "./topics";
import { ContactCards, ExternalSiteCard } from "./contacts";
import { Gallery } from "./gallery";
import { ContactForm } from "./contact-form";
import { CompanyCarousel } from "./company-carousel";
import { entUrl } from "@/lib/content";

// Rendu des blocs d'une page (contenu éditable depuis l'admin).
export function BlockRenderer({ block, bundle }: { block: PageBlock; bundle: SiteBundle }) {
  const { settings, reviews, topics, contacts, albums, enterprises } = bundle;
  switch (block.kind) {
    case "text":
      return (
        <div className="prose-block mb-4">
          {block.title && <h2 className="h2 mb-3">{block.title}</h2>}
          {block.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      );
    case "list":
      return (
        <div className="mb-4">
          {block.title && <h2 className="h2 mb-3">{block.title}</h2>}
          <div className="card">
            {block.items.map((item, i) => (
              <div className="step" key={i}>
                <span className="step-num">{String(i + 1).padStart(2, "0")}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      );
    case "cards":
      return (
        <div className="mb-4">
          {block.title && <h2 className="h2 mb-2">{block.title}</h2>}
          {block.intro && <p className="lead mb-3">{block.intro}</p>}
          <div className="grid-3">
            {block.cards.map((c, i) => (
              <article className="card" key={i}>
                <h3 className="card-title">{c.title}</h3>
                <p className="muted text-sm" style={{ lineHeight: 1.6 }}>
                  {c.text}
                </p>
                <ul className="mt-2 mb-3" style={{ paddingLeft: "1.1rem", display: "grid", gap: "0.3rem" }}>
                  {c.bullets.map((b, j) => (
                    <li key={j} className="text-sm muted">
                      {b}
                    </li>
                  ))}
                </ul>
                {c.ctaHref && (
                  <a className="btn btn-ghost btn-sm" href={c.ctaHref}>
                    {c.ctaLabel || "Découvrir"} →
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      );
    case "notice":
      return (
        <div className="notice mb-4">
          {block.title && <strong>! {block.title}</strong>}
          {block.text}
        </div>
      );
    case "stats":
      return (
        <div className="stats-band stats-band--brand mb-4">
          {block.items.map((s, i) => (
            <div className="stat" key={i}>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      );
    case "cta":
      return (
        <div className="cta-band mb-4">
          <div>
            <h2 className="h2">{block.title}</h2>
            <p>{block.text}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {block.primaryHref && (
              <a className="btn btn-primary" href={block.primaryHref}>
                {block.primaryLabel || "Commencer"} →
              </a>
            )}
            {block.ghostHref && (
              <a className="btn btn-ghost" href={block.ghostHref} style={{ background: "rgba(255,255,255,.1)", borderColor: "rgba(255,255,255,.3)", color: "#fff" }}>
                {block.ghostLabel || "En savoir plus"}
              </a>
            )}
          </div>
        </div>
      );
    case "hours":
      return <HoursSection settings={settings} />;
    case "reviews":
      return <ReviewsSection reviews={reviews} settings={settings} />;
    case "topics":
      return (
        <div className="mb-4">
          {block.title && <h2 className="h2 mb-2">{block.title}</h2>}
          {block.intro && <p className="lead mb-3">{block.intro}</p>}
          <ContactIntro settings={settings} topics={topics} />
          <TopicsAccordion topics={topics} questionLabel={settings.siteName} />
        </div>
      );
    case "contact-cards":
      return (
        <div className="mb-4">
          {block.title && <h2 className="h2 mb-3">{block.title}</h2>}
          <ContactCards contacts={contacts} />
          <ExternalSiteCard settings={settings} />
        </div>
      );
    case "gallery":
      return (
        <div className="mb-4">
          {block.title && <h2 className="h2 mb-2">{block.title}</h2>}
          {block.intro && <p className="lead mb-3">{block.intro}</p>}
          <Gallery albums={albums} />
        </div>
      );
    case "enterprises":
      return (
        <CompanyCarousel
          enterprises={enterprises}
          groupLogo={entUrl("/images/ent/groupe-mes-logo.webp")}
          kicker={block.title}
          intro={block.intro}
        />
      );
    case "form":
      return (
        <div className="mb-4">
          {block.title && <h2 className="h2 mb-2">{block.title}</h2>}
          {block.intro && <p className="lead mb-3">{block.intro}</p>}
          <ContactForm />
        </div>
      );
    case "raw":
      return <div className="raw-block mb-4" dangerouslySetInnerHTML={{ __html: block.html }} />;
    default:
      return null;
  }
}
