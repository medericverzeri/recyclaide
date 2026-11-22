import { computeStatus } from "@/lib/status";
import type { SettingsData } from "@/lib/types";

export function useStatus(settings: SettingsData) {
  return computeStatus(settings);
}

export function StatusChip({ settings }: { settings: SettingsData }) {
  const status = computeStatus(settings);
  return (
    <span className="status-chip">
      <span className={`status-dot ${status.open ? "status-dot--open" : ""}`} aria-hidden />
      {status.label}
    </span>
  );
}

export function StatusLine({ settings, className = "" }: { settings: SettingsData; className?: string }) {
  const status = computeStatus(settings);
  return (
    <p className={`status-line ${className}`} role="status">
      <span className={`status-dot ${status.open ? "status-dot--open" : ""}`} aria-hidden />
      <strong>{status.label}</strong>
      <span className="sub">— {status.detail}</span>
    </p>
  );
}
