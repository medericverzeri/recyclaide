import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// En runtime (Vercel/Neon), DATABASE_URL est obligatoire : c'est la connection
// string Neon définie dans les variables d'environnement du projet.
// On ne jette PAS d'erreur à l'import : le build Vercel (`next build`) peut
// s'exécuter sans base accessible — les pages utilisent alors le contenu par
// défaut de secours (voir safe() dans src/lib/content.ts) et la base est
// créée/seedée automatiquement au premier démarrage réel (instrumentation).
const databaseUrl = process.env.DATABASE_URL;

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString: databaseUrl ?? "postgresql://127.0.0.1:5432/placeholder",
    // évite de bloquer le build si la base est injoignable
    connectionTimeoutMillis: 3000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);
