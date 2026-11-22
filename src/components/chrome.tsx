"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Mission, NavItem } from "@/lib/types";

// Boutons d'accessibilité (taille du texte A+, contraste) + menu de navigation.
export function ChromeControls({
  nav,
  missions,
  contactHref,
  contactLabel,
}: {
  nav: NavItem[];
  missions: Pick<Mission, "slug" | "title">[];
  contactHref: string;
  contactLabel: string;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [textLg, setTextLg] = useState(false);
  const [contrast, setContrast] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    setTextLg(root.dataset.text === "lg");
    setContrast(root.dataset.contrast === "high");
  }, []);

  const toggleText = () => {
    const next = !textLg;
    setTextLg(next);
    document.documentElement.dataset.text = next ? "lg" : "";
    if (!next) delete document.documentElement.dataset.text;
    try {
      localStorage.setItem("ra-text", next ? "lg" : "");
    } catch {}
  };

  const toggleContrast = () => {
    const next = !contrast;
    setContrast(next);
    document.documentElement.dataset.contrast = next ? "high" : "";
    if (!next) delete document.documentElement.dataset.contrast;
    try {
      localStorage.setItem("ra-contrast", next ? "high" : "");
    } catch {}
  };

  useEffect(() => {
    try {
      const t = localStorage.getItem("ra-text");
      const cst = localStorage.getItem("ra-contrast");
      if (t === "lg") {
        document.documentElement.dataset.text = "lg";
        setTextLg(true);
      }
      if (cst === "high") {
        document.documentElement.dataset.contrast = "high";
        setContrast(true);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isCurrent = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <div className="header-actions">
      <button type="button" className="round-button" onClick={toggleText} aria-pressed={textLg} aria-label="Augmenter la taille du texte" title="Taille du texte">
        A+
      </button>
      <button type="button" className="round-button" onClick={toggleContrast} aria-pressed={contrast} aria-label="Contraste élevé" title="Contraste élevé">
        ◐
      </button>
      <Link href={contactHref} className="btn btn-primary btn-sm hidden sm:inline-flex">
        {contactLabel}
      </Link>
      <div className="relative">
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setMenuOpen((v) => !v)} aria-expanded={menuOpen} aria-haspopup="true">
          Menu
        </button>
        {menuOpen && (
          <nav className="menu-panel" aria-label="Menu principal">
            <p className="menu-panel__title">Explorer</p>
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link" aria-current={isCurrent(item.href) ? "page" : undefined} onClick={() => setMenuOpen(false)}>
                {item.label}
                <span aria-hidden>→</span>
              </Link>
            ))}
            <p className="menu-panel__title">Mes missions</p>
            {missions.map((m) => (
              <Link key={m.slug} href={`/${m.slug}`} className="nav-link" aria-current={isCurrent(`/${m.slug}`) ? "page" : undefined} onClick={() => setMenuOpen(false)}>
                {m.title.length > 42 ? m.title.slice(0, 42) + "…" : m.title}
                <span aria-hidden>→</span>
              </Link>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}
