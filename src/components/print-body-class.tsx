"use client";

import { useEffect } from "react";

// Ajoute une classe sur <body> pour limiter l'impression à la zone d'impression
export function PrintBodyClass() {
  useEffect(() => {
    document.body.classList.add("print-page");
    return () => document.body.classList.remove("print-page");
  }, []);
  return null;
}

export function PrintButton() {
  return (
    <button type="button" className="btn btn-primary btn-sm" onClick={() => window.print()}>
      🖨 Imprimer (Ctrl+P)
    </button>
  );
}
