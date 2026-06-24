import type { HealthStatus, HungerLevel, Report, ShelterStatus, Urgency } from "./types";

const KEY = "gokceada-reports-v1";

export function loadReports(): Report[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Report[]) : [];
  } catch {
    return [];
  }
}

export function saveReports(reports: Report[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(reports));
}

export function computeUrgency(input: {
  health: HealthStatus;
  shelter: ShelterStatus;
  hungerLevel: HungerLevel;
  hasWater: boolean;
}): Urgency {
  const { health, shelter, hungerLevel, hasWater } = input;
  const severeHealth = health === "agir-yarali" || health === "hasta";
  const noShelter = shelter === "yok" || shelter === "yikik";

  if (severeHealth && (noShelter || hungerLevel >= 4)) return "acil";
  if (severeHealth) return "yuksek";
  if (hungerLevel >= 5) return "yuksek";
  if (!hasWater && hungerLevel >= 4) return "yuksek";
  if (noShelter && hungerLevel >= 3) return "orta";
  if (hungerLevel >= 3 || !hasWater) return "orta";
  return "dusuk";
}

export function newReportId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `r_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
