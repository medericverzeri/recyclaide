// Au démarrage du serveur (local ou Vercel), on s'assure que le contenu par
// défaut de Recycl'Aide est présent en base (seed idempotent, verrou pg).
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    try {
      const { ensureSeeded } = await import("@/lib/content");
      await ensureSeeded();
    } catch (err) {
      console.warn("[instrumentation] seed ignoré :", err);
    }
  }
}
