import { checkCredentials, makeSessionToken, setSessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email ?? "");
    const password = String(body?.password ?? "");
    if (!checkCredentials(email, password)) {
      return Response.json({ ok: false, error: "Identifiants incorrects." }, { status: 401 });
    }
    await setSessionCookie(makeSessionToken(email.trim().toLowerCase()));
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }
}
