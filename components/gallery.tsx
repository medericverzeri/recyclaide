"use client";

import { useCallback, useEffect, useState } from "react";
import type { Album } from "@/lib/types";

export function Gallery({ albums }: { albums: Album[] }) {
  const [openAlbum, setOpenAlbum] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<{ album: Album; index: number } | null>(null);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightbox(null);
      }
      if (lightbox) {
        if (e.key === "ArrowRight") setLightbox((l) => (l ? { ...l, index: (l.index + 1) % l.album.photos.length } : l));
        if (e.key === "ArrowLeft") setLightbox((l) => (l ? { ...l, index: (l.index - 1 + l.album.photos.length) % l.album.photos.length } : l));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  return (
    <div className="grid-2">
      {albums.map((album) => {
        const cover = album.photos[0];
        const isOpen = openAlbum === album.id;
        return (
          <article className="album-card" key={album.id}>
            <button
              type="button"
              className="gallery-cover"
              onClick={() => setOpenAlbum(isOpen ? null : album.id)}
              aria-expanded={isOpen}
              aria-label={`Ouvrir l'album ${album.title}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {cover && <img src={cover.src} alt={cover.alt || album.title} loading="lazy" />}
              <span className="gallery-count">{album.photos.length} photo{album.photos.length > 1 ? "s" : ""}</span>
            </button>
            <div className="album-body">
              <h3 className="h3">{album.title}</h3>
              {album.description && <p className="muted text-sm mt-1">{album.description}</p>}
              <button type="button" className="btn btn-ghost btn-sm mt-3" onClick={() => setOpenAlbum(isOpen ? null : album.id)}>
                {isOpen ? "Masquer les photos ⌃" : "Voir les photos ⌄"}
              </button>
              {isOpen && (
                <div className="gallery-grid">
                  {album.photos.map((p, i) => (
                    <button
                      type="button"
                      className="gallery-item"
                      key={p.id}
                      onClick={() => setLightbox({ album, index: i })}
                      aria-label={`Agrandir la photo ${p.alt || p.caption || i + 1}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.src} alt={p.alt || p.caption || album.title} loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </article>
        );
      })}

      {lightbox && lightbox.album.photos[lightbox.index] && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Visionneuse photo" onClick={closeLightbox}>
          <button type="button" className="lightbox-close" onClick={closeLightbox} aria-label="Fermer">
            ✕
          </button>
          <button
            type="button"
            className="lightbox-nav lightbox-nav--prev"
            aria-label="Photo précédente"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((l) => (l ? { ...l, index: (l.index - 1 + l.album.photos.length) % l.album.photos.length } : l));
            }}
          >
            ‹
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox.album.photos[lightbox.index].src}
            alt={lightbox.album.photos[lightbox.index].alt || lightbox.album.title}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            className="lightbox-nav lightbox-nav--next"
            aria-label="Photo suivante"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((l) => (l ? { ...l, index: (l.index + 1) % l.album.photos.length } : l));
            }}
          >
            ›
          </button>
          <p className="lightbox-caption">
            {lightbox.album.title} — {lightbox.album.photos[lightbox.index].caption || lightbox.album.photos[lightbox.index].alt} ({lightbox.index + 1}/{lightbox.album.photos.length})
          </p>
        </div>
      )}
    </div>
  );
}
