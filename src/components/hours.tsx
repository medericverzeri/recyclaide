import type { SettingsData } from "@/lib/types";
import { todayIndex } from "@/lib/status";
import { StatusLine } from "./status";

const WEEK = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

export function HoursSection({ settings, showStatus = true }: { settings: SettingsData; showStatus?: boolean }) {
  const today = todayIndex();
  const ordered = settings.hours.length === 7 ? [...settings.hours.slice(today), ...settings.hours.slice(0, today)] : settings.hours;
  const display = settings.hours.length === 7 ? ordered : settings.hours;
  return (
    <section className="section" id="horaires" aria-labelledby="horaires-title">
      <div className="wrap">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <p className="eyebrow">Informations pratiques</p>
            <h2 className="h2" id="horaires-title">
              Horaires d&apos;ouverture
            </h2>
          </div>
          {showStatus && <StatusLine settings={settings} />}
        </div>
        <div className="grid-4">
          {display.map((d) => {
            const idx = WEEK.indexOf(d.day);
            const isToday = idx === today;
            return (
              <article key={d.day} className={`day-card ${isToday ? "day-card--today" : ""} ${d.closed ? "day-card--closed" : ""}`}>
                <h3>
                  {d.day}
                  {isToday && <span className="day-badge">Aujourd&apos;hui</span>}
                </h3>
                {d.closed ? (
                  <span className="day-closed-label">Fermé</span>
                ) : d.rdvOnly ? (
                  <span className="day-closed-label">Sur rendez-vous uniquement</span>
                ) : (
                  d.slots.map((s, i) => (
                    <div className="slot" key={i}>
                      <em>{s.label}</em>
                      <strong>
                        {s.from}–{s.to}
                      </strong>
                    </div>
                  ))
                )}
                {d.note && <p className="day-note">{d.note}</p>}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
