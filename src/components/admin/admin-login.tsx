"use client";

import { useState } from "react";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok || !json?.ok) {
        setState("error");
        setError(json?.error || "Identifiants incorrects.");
        return;
      }
      window.location.reload();
    } catch {
      setState("error");
      setError("Erreur réseau.");
    }
  }

  return (
    <div className="wrap">
      <form onSubmit={onSubmit} className="card login-card">
        <p className="eyebrow">Espace admin</p>
        <h1 className="h2 mb-1">Connexion</h1>
        <p className="muted text-sm mb-3">
          Cet espace permet de modifier tout le contenu du site : les changements sont publiés immédiatement.
        </p>
        <div className="field">
          <label htmlFor="login-email">Email</label>
          <input id="login-email" className="input" type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@recyclaide.fr" />
        </div>
        <div className="field">
          <label htmlFor="login-pass">Mot de passe</label>
          <input id="login-pass" className="input" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        <button type="submit" className="btn btn-primary" disabled={state === "sending"} style={{ width: "100%" }}>
          {state === "sending" ? "Connexion…" : "Se connecter"}
        </button>
        {state === "error" && (
          <p className="mt-3 font-semibold text-sm" style={{ color: "var(--ko)" }}>
            {error}
          </p>
        )}
        {process.env.NODE_ENV !== "production" && (
          <p className="hint mt-3">Développement : admin@recyclaide.fr / admin123 (à définir via ADMIN_EMAIL / ADMIN_PASSWORD en production).</p>
        )}
      </form>
    </div>
  );
}
