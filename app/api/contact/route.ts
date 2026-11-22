import { addMessage } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim();
    const phone = String(body?.phone ?? "").trim();
    const subject = String(body?.subject ?? "").trim();
    const message = String(body?.message ?? "").trim();
    if (!name || !email || !message) {
      return Response.json({ ok: false, error: "Nom, email et message requis." }, { status: 400 });
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return Response.json({ ok: false, error: "Adresse email invalide." }, { status: 400 });
    }
    if (name.length > 200 || email.length > 200 || message.length > 5000) {
      return Response.json({ ok: false, error: "Champ trop long." }, { status: 400 });
    }
    await addMessage({ name, email, phone, subject, message });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "Erreur serveur." }, { status: 500 });
  }
}
