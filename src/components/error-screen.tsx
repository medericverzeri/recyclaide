"use client";

// Écran d'erreur « option A » : logo Recycl'Aide + bouton Réessayer.
// Utilisé par app/error.tsx (toutes les pages) et app/global-error.tsx (niveau racine),
// donc présent partout sur le site en cas de problème de chargement.
export function ErrorScreen({ onRetry, detail }: { onRetry: () => void; detail?: string }) {
  return (
    <main
      role="alert"
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#fbf9f6",
        padding: "2rem",
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        color: "#0d1b2a",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 540 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-recyclaide.png"
          alt="Recycl'Aide"
          style={{ height: 62, width: "auto", margin: "0 auto 2.2rem", display: "block" }}
        />
        <p
          style={{
            letterSpacing: "0.18em",
            fontSize: 12,
            fontWeight: 700,
            color: "#8a94a6",
            textTransform: "uppercase",
            margin: "0 0 1rem",
          }}
        >
          Un instant, s&apos;il vous plaît
        </p>
        <h1
          style={{
            fontFamily: '"Plus Jakarta Sans", Inter, ui-sans-serif, system-ui, sans-serif',
            fontSize: "clamp(1.9rem, 4.5vw, 2.7rem)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "#3d4e58",
            margin: "0 0 0.9rem",
          }}
        >
          Nous avons perdu le fil.
        </h1>
        <p style={{ color: "#6b7686", margin: "0 0 1.9rem", lineHeight: 1.65, fontSize: 15 }}>
          Le contenu n&apos;est pas disponible pour le moment.
          <br />
          Réessayez dans quelques instants.
        </p>
        <button
          type="button"
          onClick={onRetry}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.55rem",
            background: "#3d4e58",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "0.8rem 1.6rem",
            fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
            fontWeight: 700,
            fontSize: 15,
            cursor: "pointer",
            boxShadow: "0 14px 30px -12px rgba(36,49,58,.55)",
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
            <path d="M21 12a9 9 0 1 1-2.64-6.36" />
            <path d="M21 3v6h-6" />
          </svg>
          Réessayer
        </button>
        {detail && (
          <p style={{ fontSize: 12, color: "#9aa3b2", marginTop: "1.2rem" }}>{detail}</p>
        )}
      </div>
    </main>
  );
}
