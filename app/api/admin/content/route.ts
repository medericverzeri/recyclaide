import { getAllContent, saveAllContent } from "@/lib/content";
import { isAdminAuthed } from "@/lib/auth";
import type { AdminContent } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthed())) return Response.json({ ok: false, error: "Non authentifié." }, { status: 401 });
  const content = await getAllContent();
  return Response.json({ ok: true, content });
}

export async function PUT(req: Request) {
  if (!(await isAdminAuthed())) return Response.json({ ok: false, error: "Non authentifié." }, { status: 401 });
  try {
    const body = (await req.json()) as { content?: Partial<AdminContent> } & Partial<AdminContent>;
    const content = (body?.content ?? body) as Partial<AdminContent>;
    const saved = await saveAllContent(content ?? {});
    return Response.json({ ok: true, content: saved });
  } catch (err) {
    console.error("[admin] sauvegarde impossible :", err);
    return Response.json({ ok: false, error: "Sauvegarde impossible." }, { status: 500 });
  }
}
