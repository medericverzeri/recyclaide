import { db } from "@/db";
import * as schema from "@/db/schema";
import { sql, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

// Health check détaillé : permet de diagnostiquer le déploiement en ligne
// (base OK ? seed appliqué ? combien d'images en base ?).
export async function GET() {
  const out: Record<string, unknown> = { ok: false };
  try {
    await db.execute(sql`select 1`);
    out.ok = true;
    out.db = true;
  } catch {
    out.db = false;
    return Response.json(out, { status: 500 });
  }
  try {
    const kvRows = await db.select({ value: schema.kv.value }).from(schema.kv).where(eq(schema.kv.key, "seeded")).limit(1);
    out.seed = (kvRows[0]?.value as { version?: string } | undefined)?.version ?? null;
    const mediaRows = await db.execute(sql`select count(*)::int as n from media`);
    out.mediaCount = (mediaRows.rows?.[0] as { n: number } | undefined)?.n ?? 0;
    const settingsRows = await db.execute(sql`select count(*)::int as n from settings`);
    out.settingsCount = (settingsRows.rows?.[0] as { n: number } | undefined)?.n ?? 0;
  } catch (err) {
    out.detailError = String(err);
  }
  return Response.json(out);
}
