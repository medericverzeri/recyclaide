"use client";

import { useEffect, useMemo, useState } from "react";
import type { EnterpriseData } from "@/lib/types";

// Carrousel des entreprises du groupe — même présentation que la page
// de référence : bannière logo + diapositives de 3 cartes (photo, badge,
// infos, logos), points de pagination, fraction « 01 / 04 » et flèches.
export function CompanyCarousel({
  enterprises,
  groupLogo,
  kicker,
  intro,
}: {
  enterprises: EnterpriseData[];
  groupLogo: string;
  kicker: string;
  intro: string;
}) {
  const [index, setIndex] = useState(0);
  const [perPage, setPerPage] = useState(3);

  useEffect(() => {
    const calc = () => setPerPage(window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1);
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  const slides = useMemo(() => {
    const arr: EnterpriseData[][] = [];
    for (let i = 0; i < enterprises.length; i += perPage) arr.push(enterprises.slice(i, i + perPage));
    return arr;
  }, [enterprises, perPage]);

  const pageCount = Math.max(1, slides.length);
  useEffect(() => {
    if (index > pageCount - 1) setIndex(pageCount - 1);
  }, [pageCount, index]);

  const prev = () => setIndex((i) => (i - 1 + pageCount) % pageCount);
  const next = () => setIndex((i) => (i + 1) % pageCount);

  return (
    <div className="mb-4">
      {/* Bannière d'intro du groupe */}
      <div className="mes-group-intro">
        <span className="mes-group-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {groupLogo && <img src={groupLogo} alt="Logo Groupe MES" loading="lazy" />}
        </span>
        <div>
          {kicker && <span className="mes-group-kicker">{kicker}</span>}
          {intro && <p>{intro}</p>}
        </div>
      </div>

      {/* Carrousel */}
      <div className="company-carousel" role="region" aria-roledescription="carrousel" aria-label="Entreprises du groupe MES">
        <div className="company-window">
          <div className="company-track" style={{ transform: `translateX(-${index * 100}%)` }}>
            {slides.map((slide, i) => (
              <div className="company-slide" key={i} aria-hidden={i !== index}>
                {slide.map((e) => (
                  <article className={`company-card ${e.highlight ? "company-card--highlight" : ""}`} key={e.id}>
                    <div className={`company-photo ${e.photoContain ? "company-photo--contain" : ""}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {e.photo ? <img src={e.photo} alt={e.name.replace(/\n/g, " ")} loading="lazy" /> : <span className="company-photo-fallback">{e.name.charAt(0)}</span>}
                      <span className="company-open" aria-hidden>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <path d="M7 17 17 7M9 7h8v8" />
                        </svg>
                      </span>
                    </div>
                    <div className="company-info">
                      <div>
                        <h3>{e.name}</h3>
                        <p>
                          {e.tagline}
                          {e.location ? ` · ${e.location}` : ""}
                        </p>
                      </div>
                      {e.logos.length > 0 && (
                        <div className="company-logos">
                          {e.logos.map((l, j) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img key={j} src={l} alt="" loading="lazy" />
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="carousel-footer">
          <div className="pagination-dots" role="tablist" aria-label="Pages du carrousel">
            {slides.map((_, i) => (
              <button key={i} type="button" role="tab" aria-selected={i === index} aria-label={`Page ${i + 1}`} className={i === index ? "active" : ""} onClick={() => setIndex(i)}>
                <span />
              </button>
            ))}
          </div>
          <div className="carousel-actions">
            <span className="page-fraction">
              {String(index + 1).padStart(2, "0")}
              <i>/</i>
              {String(pageCount).padStart(2, "0")}
            </span>
            <button type="button" className="round-button" onClick={prev} aria-label="Page précédente" disabled={pageCount <= 1}>
              ‹
            </button>
            <button type="button" className="round-button" onClick={next} aria-label="Page suivante" disabled={pageCount <= 1}>
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
