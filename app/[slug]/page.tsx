import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMissions, getSiteBundle } from "@/lib/content";
import { StatusLine } from "@/components/status";
import { todayIndex, hoursSummaryLine } from "@/lib/status";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const WEEK = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { settings } = await getSiteBundle();
  const missions = await getMissions(true);
  const m = missions.find((mm) => mm.slug === slug);
  return {
    title: m ? `${m.title} — ${settings.siteName}` : settings.seo.title,
    description: m?.lead || settings.seo.description,
  };
}

export default async function MissionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const bundle = await getSiteBundle();
  const { settings } = bundle;
  const missions = await getMissions(true);
  const mission = missions.find((m) => m.slug === slug);
  if (!mission) notFound();

  const { data } = mission;
  const today = todayIndex();

  return (
    <>
      {/* ------------------------------- Héro ------------------------------- */}
      <header className="page-hero">
        <div className="wrap">
          <p className="eyebrow">{mission.eyebrow}</p>
          <h1 className="h1" style={{ maxWidth: "22ch" }}>
            {mission.title}
          </h1>
          {mission.lead && (
            <p className="lead mt-3" style={{ maxWidth: "72ch" }}>
              {mission.lead}
            </p>
          )}
          <div className="hero-actions">
            {data.ctas.map((c, i) => (
              <a key={i} href={c.href} className={`btn ${c.variant === "primary" ? "btn-primary" : "btn-ghost"}`}>
                {c.label} →
              </a>
            ))}
          </div>
          <div className="grid-2 mt-4">
            <div className="card flex items-center gap-3">
              <span className="feature-icon mb-0" aria-hidden>
                ☎
              </span>
              <div>
                <span className="label text-sm muted">Appeler le chantier</span>
                <p className="m-0 font-semibold">{settings.phone}</p>
              </div>
              <a className="btn btn-ghost btn-sm" style={{ marginLeft: "auto" }} href={settings.phoneHref}>
                Appeler
              </a>
            </div>
            <div className="card">
              <span className="label text-sm muted">Horaires & disponibilité</span>
              <StatusLine settings={settings} className="mt-1" />
              <p className="muted text-sm mt-1">{hoursSummaryLine(settings)}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="wrap">
        {/* ------------------------------ Semaine ------------------------------ */}
        <section className="mb-4" aria-label="Horaires de la semaine">
          <div className="grid-4">
            {[...settings.hours.slice(today), ...settings.hours.slice(0, today)].map((d) => {
              const idx = WEEK.indexOf(d.day);
              return (
                <article key={d.day} className={`day-card ${idx === today ? "day-card--today" : ""} ${d.closed ? "day-card--closed" : ""}`}>
                  <h3>
                    {d.day}
                    {idx === today && <span className="day-badge">Aujourd&apos;hui</span>}
                  </h3>
                  {d.closed ? (
                    <span className="day-closed-label">Fermé</span>
                  ) : (
                    d.slots.map((s, i) => (
                      <div className="slot" key={i}>
                        <em>{s.label}</em>
                        <strong>
                          {s.from}–{s.to}
                        </strong>
                      </div>
                    ))
                  )}
                  {d.note && <p className="day-note">{d.note}</p>}
                </article>
              );
            })}
          </div>
        </section>

        {/* ------------------------------- Stats ------------------------------- */}
        {data.stats.length > 0 && (
          <section className="mb-4" aria-label="Chiffres clés">
            <div className="stats-band stats-band--brand">
              {data.stats.map((s, i) => (
                <div className="stat" key={i}>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ------------------------------ En bref ------------------------------ */}
        {data.lead && (
          <section className="mb-4">
            <h2 className="h2 mb-2">Le principe en bref</h2>
            <p className="lead" style={{ maxWidth: "75ch" }}>
              {data.lead}
            </p>
          </section>
        )}

        {/* ------------------------------ Features ----------------------------- */}
        {data.features.length > 0 && (
          <section className="mb-4" aria-label="Points forts">
            <div className="grid-2">
              {data.features.map((f, i) => (
                <article className="card" key={i}>
                  <span className="feature-icon" aria-hidden>
                    {f.icon}
                  </span>
                  <h3 className="card-title">{f.title}</h3>
                  <p className="muted text-sm" style={{ lineHeight: 1.6 }}>
                    {f.text}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ------------------------------- Étapes ------------------------------ */}
        {data.steps.length > 0 && (
          <section className="mb-4" aria-label="Comment ça marche">
            <h2 className="h2 mb-3">Comment ça marche ?</h2>
            <div className="card">
              {data.steps.map((s, i) => (
                <div className="step" key={i}>
                  <span className="step-num">{String(i + 1).padStart(2, "0")}</span>
                  <p>
                    <strong>{s.title}</strong>
                    {s.text ? ` : ${s.text}` : ""}
                  </p>
                </div>
              ))}
            </div>
            {data.warning.text && (
              <div className="notice">
                {data.warning.title && <strong>! {data.warning.title}</strong>}
                {data.warning.text}
              </div>
            )}
          </section>
        )}

        {/* ------------------------------ CTA final ---------------------------- */}
        <section className="mb-4">
          <div className="cta-band">
            <div>
              <h2 className="h2">{data.outro.title}</h2>
              <p>{data.outro.text}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Link href="/contact" className="btn btn-primary">
                Nous contacter →
              </Link>
              <a href={settings.phoneHref} className="btn btn-ghost" style={{ background: "rgba(255,255,255,.1)", borderColor: "rgba(255,255,255,.3)", color: "#fff" }}>
                {settings.phone}
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
