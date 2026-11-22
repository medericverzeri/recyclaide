import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ ok: false }, { status: 401 });
  return Response.json({ ok: true, email: session.email });
}
