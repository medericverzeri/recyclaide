import { deleteMessage, getMessages, setMessageRead } from "@/lib/content";
import { isAdminAuthed } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthed())) return Response.json({ ok: false, error: "Non authentifié." }, { status: 401 });
  return Response.json({ ok: true, messages: await getMessages() });
}

export async function PATCH(req: Request) {
  if (!(await isAdminAuthed())) return Response.json({ ok: false, error: "Non authentifié." }, { status: 401 });
  const body = await req.json();
  const id = Number(body?.id);
  if (!id) return Response.json({ ok: false }, { status: 400 });
  await setMessageRead(id, !!body?.read);
  return Response.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!(await isAdminAuthed())) return Response.json({ ok: false, error: "Non authentifié." }, { status: 401 });
  const id = Number(new URL(req.url).searchParams.get("id"));
  if (!id) return Response.json({ ok: false }, { status: 400 });
  await deleteMessage(id);
  return Response.json({ ok: true });
}
