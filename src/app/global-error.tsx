"use client";

import { ErrorScreen } from "@/components/error-screen";

// Filet de sécurité ultime : si même le layout racine échoue, on affiche
// l'écran « option A » (Réessayer) avec le logo Recycl'Aide.
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0 }}>
        <ErrorScreen
          onRetry={() => window.location.reload()}
          detail={process.env.NODE_ENV === "development" ? error.message : undefined}
        />
      </body>
    </html>
  );
}
