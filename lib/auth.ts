import { cookies } from "next/headers";
import crypto from "node:crypto";

// ---------------------------------------------------------------------------
// Authentification de l'espace admin.
// Identifiants lus dans les variables d'environnement (Vercel -> Settings) :
//   ADMIN_EMAIL, ADMIN_PASSWORD, SESSION_SECRET
// En développement local, des valeurs par défaut sont utilisées si absentes.
// La session est un cookie signé (HMAC) — aucune donnée en clair côté client.
// ---------------------------------------------------------------------------

const COOKIE = "ra_admin";
const TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 jours

// En production (Vercel), définir impérativement ADMIN_EMAIL / ADMIN_PASSWORD
// dans les variables d'environnement du projet. Si elles sont absentes (ex :
// démo locale), des identifiants par défaut documentés sont utilisés.
const DEFAULT_ADMIN_EMAIL = "admin@recyclaide.fr";
const DEFAULT_ADMIN_PASSWORD = "admin123";

export function adminEmail(): string {
  return process.env.ADMIN_EMAIL ?? DEFAULT_ADMIN_EMAIL;
}

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? DEFAULT_ADMIN_PASSWORD;
}

function secret(): string {
  return (
    process.env.SESSION_SECRET ??
    crypto.createHash("sha256").update(`recyclaide:${adminPassword()}`).digest("hex")
  );
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
}

function sha256(v: string): Buffer {
  return crypto.createHash("sha256").update(v).digest();
}

export function makeSessionToken(email: string): string {
  const payload = Buffer.from(JSON.stringify({ email, exp: Date.now() + TTL_MS })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined): { email: string } | null {
  if (!token) return null;
  try {
    const [payload, sig] = token.split(".");
    if (!payload || !sig) return null;
    const expected = sign(payload);
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { email: string; exp: number };
    if (!data.email || typeof data.exp !== "number" || data.exp < Date.now()) return null;
    return { email: data.email };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<{ email: string } | null> {
  const store = await cookies();
  return verifySessionToken(store.get(COOKIE)?.value);
}

export async function isAdminAuthed(): Promise<boolean> {
  return (await getSession()) !== null;
}

export function checkCredentials(email: string, password: string): boolean {
  const expectedEmail = adminEmail();
  const expectedPassword = adminPassword();
  if (!expectedEmail || !expectedPassword) return false;
  const emailOk = sha256(email.trim().toLowerCase()).equals(sha256(expectedEmail.toLowerCase()));
  const passOk = sha256(password).equals(sha256(expectedPassword));
  return emailOk && passOk;
}

export async function setSessionCookie(token: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TTL_MS / 1000,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}
