import type { SettingsData, TopicData } from "@/lib/types";

function MailIcon() {
  return <span aria-hidden>✉</span>;
}

export function TopicsAccordion({ topics, questionLabel }: { topics: TopicData[]; questionLabel: string }) {
  return (
    <div className="contact-topics">
      {topics.map((t) => (
        <details className="topic" key={t.id}>
          <summary>
            <span className="topic-icon" aria-hidden>
              {t.icon}
            </span>
            <span>{t.title}</span>
            <span className="topic-chevron" aria-hidden>
              ⌄
            </span>
          </summary>
          <div className="topic-body">
            {t.kicker && <p className="kicker">{t.kicker}</p>}
            {t.heading && <h3 className="h3 mb-2">{t.heading}</h3>}
            {t.intro && <p className="lead mb-2">{t.intro}</p>}
            <div className="mt-2">
              {t.steps.map((s, i) => (
                <div className="step" key={i}>
                  <span className="step-num">{String(i + 1).padStart(2, "0")}</span>
                  <p>{s}</p>
                </div>
              ))}
            </div>
            {(t.warningTitle || t.warningText) && (
              <div className="notice">
                {t.warningTitle && <strong>! {t.warningTitle}</strong>}
                {t.warningText}
              </div>
            )}
            {(t.ctaLabel || t.ctaHref) && (
              <div className="topic-ctas">
                {t.ctaHref && (
                  <a className="btn btn-brand btn-sm" href={t.ctaHref}>
                    {t.ctaLabel || "En savoir plus"}
                  </a>
                )}
                {t.mailtoSubject && (
                  <a className="btn btn-ghost btn-sm" href={`mailto:${t.ctaHref.startsWith("mailto:") ? t.ctaHref.slice(7) : ""}`}>
                    <MailIcon /> Une question sur ce sujet ?
                  </a>
                )}
                {t.ctaNote && <span className="topic-cta-note">{t.ctaNote}</span>}
              </div>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}

export function ContactIntro({ settings, topics }: { settings: SettingsData; topics: TopicData[] }) {
  return (
    <div className="mb-4">
      <p className="lead mb-1">
        À votre écoute,
        <br />
        pour répondre
        <br />à vos besoins.
      </p>
      <p className="mt-3">
        Vous avez une question concernant <strong>{settings.siteName}</strong> ?
      </p>
      <p className="muted text-sm">Vos informations pratiques, en un clic</p>
    </div>
  );
}
