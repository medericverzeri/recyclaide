"use client";

import { useRef, useState } from "react";
import type { ReactNode } from "react";

// --------------------------- Champs de formulaire ---------------------------

export function F({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      {children}
      {hint && <span className="hint">{hint}</span>}
    </div>
  );
}

export function In(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className="input" {...props} />;
}

export function Ta(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className="textarea" {...props} />;
}

export function Sel(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className="select" {...props} />;
}

// --------------------------- Liste de chaînes -------------------------------

export function StrList({
  items,
  onChange,
  placeholder,
  addLabel = "Ajouter",
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  addLabel?: string;
}) {
  const set = (i: number, v: string) => onChange(items.map((x, j) => (j === i ? v : x)));
  const remove = (i: number) => onChange(items.filter((_, j) => j !== i));
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div>
      {items.map((v, i) => (
        <div key={i} className="flex items-center gap-2 mb-2">
          <In value={v} placeholder={placeholder} onChange={(e) => set(i, e.target.value)} />
          <button type="button" className="icon-btn" onClick={() => move(i, -1)} aria-label="Monter">
            ↑
          </button>
          <button type="button" className="icon-btn" onClick={() => move(i, 1)} aria-label="Descendre">
            ↓
          </button>
          <button type="button" className="icon-btn icon-btn--danger" onClick={() => remove(i)} aria-label="Supprimer">
            ✕
          </button>
        </div>
      ))}
      <button type="button" className="btn-add" onClick={() => onChange([...items, ""])}>
        + {addLabel}
      </button>
    </div>
  );
}

// --------------------------- Carte d'élément éditable -----------------------

export function ItemCard({
  title,
  onRemove,
  onUp,
  onDown,
  children,
}: {
  title: string;
  onRemove?: () => void;
  onUp?: () => void;
  onDown?: () => void;
  children: ReactNode;
}) {
  return (
    <div className="item-card">
      <div className="item-card__head">
        <strong>{title}</strong>
        <span className="spacer" />
        {onUp && (
          <button type="button" className="icon-btn" onClick={onUp} aria-label="Monter">
            ↑
          </button>
        )}
        {onDown && (
          <button type="button" className="icon-btn" onClick={onDown} aria-label="Descendre">
            ↓
          </button>
        )}
        {onRemove && (
          <button type="button" className="icon-btn icon-btn--danger" onClick={onRemove} aria-label="Supprimer">
            ✕
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

// --------------------------- Upload d'image (médiathèque) -------------------

async function compressToDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const max = 1600;
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas indisponible");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  return canvas.toDataURL("image/webp", 0.85);
}

export function MediaField({ value, onChange, label = "Image" }: { value: string; onChange: (v: string) => void; label?: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function upload(file: File) {
    setBusy(true);
    setErr("");
    try {
      const dataUrl = await compressToDataUrl(file);
      const res = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: file.name, dataUrl }),
      });
      const json = await res.json();
      if (!res.ok || !json?.media?.url) throw new Error(json?.error || "Upload impossible");
      onChange(json.media.url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload impossible");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <F label={label} hint="Image envoyée dans la médiathèque (compressée automatiquement), ou URL directe.">
      <div className="flex items-center gap-3 flex-wrap">
        {value && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="aperçu" className="media-thumb" />
        )}
        <div className="flex-1" style={{ minWidth: 220 }}>
          <In value={value} onChange={(e) => onChange(e.target.value)} placeholder="/images/… ou /api/media/…" />
        </div>
        <button type="button" className="btn btn-ghost btn-sm" disabled={busy} onClick={() => fileRef.current?.click()}>
          {busy ? "Envoi…" : "Uploader une image"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void upload(f);
          }}
        />
      </div>
      {err && <span className="hint" style={{ color: "var(--ko)" }}>{err}</span>}
    </F>
  );
}

export function ColorField({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <F label={label}>
      <div className="color-input">
        <input type="color" value={value?.startsWith("#") && value.length === 7 ? value : "#000000"} onChange={(e) => onChange(e.target.value)} />
        <In value={value} onChange={(e) => onChange(e.target.value)} placeholder="#3d4e58" style={{ maxWidth: 120 }} />
      </div>
    </F>
  );
}

export function Switch({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}
