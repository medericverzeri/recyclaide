import { resetToDefaults } from "@/lib/content";
import { isAdminAuthed } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  if (!(await isAdminAuthed())) return Response.json({ ok: false, error: "Non authentifié." }, { status: 401 });
  const content = await resetToDefaults();
  return Response.json({ ok: true, content });
}
