import type { Metadata } from "next";
import { getSiteBundle } from "@/lib/content";
import { BlockRenderer } from "@/components/blocks";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const { settings, pages } = await getSiteBundle();
  const p = pages["mentions-legales"];
  return {
    title: p ? `${p.title} — ${settings.siteName}` : `Mentions légales — ${settings.siteName}`,
    description: "Mentions légales du site Recycl'Aide.",
  };
}

export default async function MentionsLegalesPage() {
  const bundle = await getSiteBundle();
  const page = bundle.pages["mentions-legales"];
  if (!page) return null;
  return (
    <>
      <header className="page-hero">
        <div className="wrap">
          <p className="eyebrow">{page.eyebrow}</p>
          <h1 className="h1">{page.title}</h1>
        </div>
      </header>
      <div className="wrap pb-4">
        {page.blocks.map((b, i) => (
          <BlockRenderer key={i} block={b} bundle={bundle} />
        ))}
      </div>
    </>
  );
}
