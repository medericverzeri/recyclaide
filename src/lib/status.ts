import type { DayHours, SettingsData } from "./types";

// ---------------------------------------------------------------------------
// Calcul du statut d'ouverture (ouvert / fermé + prochaine réouverture)
// basé sur les horaires stockés en base, à l'heure de Paris.
// ---------------------------------------------------------------------------

const WEEKDAYS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"] as const;

export interface StatusInfo {
  open: boolean;
  label: string; // "Ouvert" | "Fermé"
  detail: string; // "ferme à 17h00" | "réouverture demain à 9h00"
  line: string; // "Ouvert · ferme à 17h00"
}

function parseHM(v: string): number | null {
  const m = /^(\d{1,2})h(\d{2})?$/.exec(v.trim().toLowerCase());
  if (!m) return null;
  const h = parseInt(m[1], 10);
  const min = m[2] ? parseInt(m[2], 10) : 0;
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
}

export function parisNow(): { weekday: number; minutes: number; date: Date } {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Paris",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const weekday = Math.max(0, WEEKDAYS.findIndex((d) => d.startsWith(get("weekday").slice(0, 3)) || get("weekday").startsWith(d.slice(0, 3))));
  const hour = parseInt(get("hour"), 10) % 24;
  const minute = parseInt(get("minute"), 10);
  return { weekday: weekday === -1 ? now.getDay() : weekday, minutes: hour * 60 + minute, date: now };
}

function fmt(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h${String(m).padStart(2, "0")}`;
}

export function computeStatus(settings: Pick<SettingsData, "hours" | "statusMode" | "statusOverride">): StatusInfo {
  const { weekday, minutes } = parisNow();
  const days = settings.hours.length === 7 ? settings.hours : [];
  const ordered: DayHours[] = days.length === 7 ? [...days.slice(weekday), ...days.slice(0, weekday)] : [];

  const active = (d: DayHours) => !d.closed && !d.rdvOnly && d.slots.length > 0;

  if (settings.statusMode === "open") {
    return { open: true, label: "Ouvert", detail: settings.statusOverride || "jusqu'à nouvel ordre", line: `Ouvert · ${settings.statusOverride || "jusqu'à nouvel ordre"}` };
  }
  if (settings.statusMode === "closed") {
    return { open: false, label: "Fermé", detail: settings.statusOverride || "jusqu'à nouvel ordre", line: `Fermé · ${settings.statusOverride || "jusqu'à nouvel ordre"}` };
  }

  // Ouvert maintenant ?
  const today = ordered[0];
  if (today && active(today)) {
    for (const s of today.slots) {
      const f = parseHM(s.from);
      const t = parseHM(s.to);
      if (f !== null && t !== null && minutes >= f && minutes < t) {
        return { open: true, label: "Ouvert", detail: `ferme à ${s.to}`, line: `Ouvert · ferme à ${s.to}` };
      }
    }
  }
  // Prochaine ouverture
  for (let i = 0; i < ordered.length; i++) {
    const d = ordered[i];
    if (!active(d)) continue;
    for (const s of d.slots) {
      const f = parseHM(s.from);
      if (f === null) continue;
      if (i === 0 && f <= minutes) continue;
      const when = i === 0 ? "aujourd'hui" : i === 1 ? "demain" : d.day.toLowerCase();
      return {
        open: false,
        label: "Fermé",
        detail: `réouverture ${when} à ${s.from}`,
        line: `Fermé · réouverture ${when} à ${s.from}`,
      };
    }
  }
  return { open: false, label: "Fermé", detail: "horaires non définis", line: "Fermé · horaires non définis" };
}

export function hoursSummaryLine(settings: Pick<SettingsData, "hours">): string {
  const parts = settings.hours
    .filter((d) => !d.closed)
    .map((d) => `${d.day} : ${d.slots.map((s) => `${s.from}–${s.to}`).join(" et ")}`);
  return parts.length ? parts.join(". ") : "Horaires non définis";
}

export function todayIndex(): number {
  return parisNow().weekday;
}
