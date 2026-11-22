import crypto from "node:crypto";
import { addMedia, deleteMedia } from "@/lib/content";
import { isAdminAuthed } from "@/lib/auth";

export const dynamic = "force-dynamic";

const MAX_BYTES = 3 * 1024 * 1024; // 3 Mo après compression côté client

export async function POST(req: Request) {
  if (!(await isAdminAuthed())) return Response.json({ ok: false, error: "Non authentifié." }, { status: 401 });
  try {
    const body = await req.json();
    const name = String(body?.name ?? "image").slice(0, 200);
    const dataUrl = String(body?.dataUrl ?? "");
    const m = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(dataUrl);
    if (!m) return Response.json({ ok: false, error: "Image invalide (data URL image/* attendu)." }, { status: 400 });
    const mime = m[1];
    const buf = Buffer.from(m[2], "base64");
    if (buf.length === 0 || buf.length > MAX_BYTES) {
      return Response.json({ ok: false, error: "Image trop lourde (3 Mo max)." }, { status: 400 });
    }
    const id = crypto.randomUUID();
    const item = await addMedia({ id, name, mime, size: buf.length, data: buf });
    return Response.json({ ok: true, media: item });
  } catch (err) {
    console.error("[admin] upload média :", err);
    return Response.json({ ok: false, error: "Upload impossible." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await isAdminAuthed())) return Response.json({ ok: false, error: "Non authentifié." }, { status: 401 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return Response.json({ ok: false, error: "id manquant." }, { status: 400 });
  await deleteMedia(id);
  return Response.json({ ok: true });
}
