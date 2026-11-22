import type { SettingsData } from "@/lib/types";
import { hoursSummaryLine } from "@/lib/status";

export function Ticker({
  settings,
  status,
  statusOpen,
}: {
  settings: SettingsData;
  status: string;
  statusOpen: boolean;
}) {
  const items = [status, ...settings.ticker, hoursSummaryLine(settings)];
  const group = (
    <div className="ticker-group" aria-hidden={false}>
      {items.map((item, i) => (
        <span key={i} className={`ticker-item ${i === 0 ? (statusOpen ? "ticker-status--open" : "ticker-status") : ""}`}>
          <span className="star" aria-hidden>
            ✦
          </span>
          {item}
        </span>
      ))}
    </div>
  );
  return (
    <div className="ticker" role="marquee" aria-label="Annonces">
      <div className="ticker-track">
        {group}
        {group}
      </div>
    </div>
  );
}
