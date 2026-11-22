"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/lib/types";

// Menu de navigation fixe en haut du site (visible sur écran large).
export function SiteNav({ nav }: { nav: NavItem[] }) {
  const pathname = usePathname();
  const isCurrent = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  return (
    <nav className="site-nav" aria-label="Navigation principale">
      {nav.map((item) => (
        <Link key={item.href} href={item.href} className={`nav-link nav-link--top ${isCurrent(item.href) ? "nav-link--active" : ""}`} aria-current={isCurrent(item.href) ? "page" : undefined}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
