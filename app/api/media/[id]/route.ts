import { getMediaRow } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await getMediaRow(id);
  if (!row) return new Response("Not found", { status: 404 });
  const buf = Buffer.isBuffer(row.data) ? row.data : Buffer.from(row.data as unknown as Uint8Array);
  return new Response(new Uint8Array(buf), {
    headers: {
      "Content-Type": row.mime || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
