"use client";

import { ErrorScreen } from "@/components/error-screen";

// Error boundary de niveau racine : s'applique à TOUTES les pages du site.
// « Option A » = Réessayer, disponible partout.
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <ErrorScreen
      onRetry={() => {
        reset();
        if (typeof window !== "undefined") window.location.reload();
      }}
      detail={process.env.NODE_ENV === "development" ? error.message : undefined}
    />
  );
}
