import type { ReviewData, SettingsData } from "@/lib/types";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="stars" aria-label={`${rating} sur 5 étoiles`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < rating ? "" : "off"}>
          ★
        </span>
      ))}
    </span>
  );
}

function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.09 3.57-5.17 3.57-8.81z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.87-3c-1.07.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28V6.63H1.29a12 12 0 0 0 0 10.74l3.98-3.09z" />
      <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.61 4.58 1.8l3.44-3.44A11.98 11.98 0 0 0 12 0 12 12 0 0 0 1.29 6.63l3.98 3.09C6.22 6.88 8.87 4.77 12 4.77z" />
    </svg>
  );
}

export function ReviewsSection({ reviews, settings }: { reviews: ReviewData[]; settings: SettingsData }) {
  if (!reviews.length) return null;
  return (
    <section className="section section--soft" id="avis" aria-labelledby="avis-title">
      <div className="wrap">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <p className="eyebrow">Ils nous font confiance</p>
            <h2 className="h2" id="avis-title">
              Avis laissés sur Google
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="google-badge">
              <GoogleG /> Google
            </span>
            <span className="google-badge">
              <span className="stars">★</span> {settings.googleRating} · {settings.googleReviewsCount}
            </span>
            {settings.googleUrl && (
              <a className="btn btn-ghost btn-sm" href={settings.googleUrl} target="_blank" rel="noopener noreferrer">
                Voir tous les avis →
              </a>
            )}
          </div>
        </div>
        <div className="reviews-scroller">
          {reviews.map((r) => (
            <article className="review-card" key={r.id}>
              <div className="review-head">
                <span className="review-avatar" style={{ background: r.color }}>
                  {r.author.trim().charAt(0)}
                </span>
                <div>
                  <div className="review-name">{r.author}</div>
                  <div className="review-meta">{r.meta}</div>
                </div>
                <span className="review-menu" aria-hidden>
                  ⋮
                </span>
              </div>
              <div className="review-stars-row">
                <Stars rating={r.rating} />
                <span className="review-date">{r.dateText}</span>
                {r.isNew && <span className="review-badge-new">Nouveau</span>}
              </div>
              <p className="review-text">{r.text}</p>
              {r.visited && <p className="review-visited">{r.visited}</p>}
              <div className="review-foot">
                <button type="button" aria-label="Pointez pour réagir">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                    <path d="M12 21s-7.5-4.7-10-9.3C.4 8.6 2.4 5 5.8 5c2 0 3.4 1.1 4.2 2.4h4C14.8 6.1 16.2 5 18.2 5c3.4 0 5.4 3.6 3.8 6.7C19.5 16.3 12 21 12 21z" transform="scale(0.92) translate(1,1)" />
                  </svg>
                  Pointez pour réagir
                </button>
                <button type="button" aria-label="Partager cet avis">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                    <circle cx="6" cy="12" r="2.4" />
                    <circle cx="18" cy="5.5" r="2.4" />
                    <circle cx="18" cy="18.5" r="2.4" />
                    <path d="M8.2 10.8 15.8 6.7M8.2 13.2l7.6 4.1" />
                  </svg>
                </button>
                {r.photosCount > 0 && <span>{r.photosCount} photo{r.photosCount > 1 ? "s" : ""}</span>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
