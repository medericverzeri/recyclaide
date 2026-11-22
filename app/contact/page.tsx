import type { Metadata } from "next";
import { getSiteBundle } from "@/lib/content";
import { BlockRenderer } from "@/components/blocks";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const { settings, pages } = await getSiteBundle();
  const p = pages["contact"];
  return {
    title: p ? `${p.title} — ${settings.siteName}` : `Contact — ${settings.siteName}`,
    description: p?.lead || settings.seo.description,
  };
}

export default async function ContactPage() {
  const bundle = await getSiteBundle();
  const page = bundle.pages["contact"];
  if (!page) return null;
  return (
    <>
      <header className="page-hero">
        <div className="wrap">
          <p className="eyebrow">{page.eyebrow}</p>
          <h1 className="h1">{page.title}</h1>
          {page.lead && <p className="lead mt-3" style={{ maxWidth: "70ch" }}>{page.lead}</p>}
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
