"use client";

import { useState } from "react";

type State = "idle" | "sending" | "ok" | "error";

export function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setState(res.ok ? "ok" : "error");
      if (res.ok) setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      setState("error");
    }
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <form onSubmit={onSubmit} className="card">
      <div className="admin-grid-2">
        <div className="field">
          <label htmlFor="cf-name">Nom *</label>
          <input id="cf-name" className="input" required value={form.name} onChange={set("name")} placeholder="Votre nom" />
        </div>
        <div className="field">
          <label htmlFor="cf-email">Email *</label>
          <input id="cf-email" className="input" type="email" required value={form.email} onChange={set("email")} placeholder="vous@exemple.fr" />
        </div>
        <div className="field">
          <label htmlFor="cf-phone">Téléphone</label>
          <input id="cf-phone" className="input" type="tel" value={form.phone} onChange={set("phone")} placeholder="06 …" />
        </div>
        <div className="field">
          <label htmlFor="cf-subject">Sujet</label>
          <select id="cf-subject" className="select" value={form.subject} onChange={set("subject")}>
            <option value="">Choisir un sujet…</option>
            <option value="Matériel disponible / prix">Matériel disponible & prix</option>
            <option value="Don de matériel / collecte">Don de matériel / collecte</option>
            <option value="Enlèvement à domicile">Enlèvement à domicile</option>
            <option value="Livraison">Livraison</option>
            <option value="Location">Location</option>
            <option value="Autre">Autre</option>
          </select>
        </div>
      </div>
      <div className="field">
        <label htmlFor="cf-message">Message *</label>
        <textarea id="cf-message" className="textarea" required value={form.message} onChange={set("message")} placeholder="Décrivez votre besoin…" />
      </div>
      <button type="submit" className="btn btn-primary" disabled={state === "sending"}>
        {state === "sending" ? "Envoi…" : "Envoyer le message"}
      </button>
      {state === "ok" && <p className="mt-3 font-semibold" style={{ color: "var(--ok)" }}>Merci ! Votre message a bien été envoyé, nous vous répondons au plus vite.</p>}
      {state === "error" && <p className="mt-3 font-semibold" style={{ color: "var(--ko)" }}>Une erreur est survenue, merci de réessayer ou de nous écrire directement par email.</p>}
    </form>
  );
}
