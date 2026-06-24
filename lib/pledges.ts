import type { Pledge } from "./types";
import { dateKey, todayKey, lastSevenDayKeys } from "./food";

const KEY = "gokceada-pledges-v1";

export function loadPledges(): Pledge[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Pledge[]) : [];
  } catch {
    return [];
  }
}

export function savePledges(p: Pledge[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(p));
}

export function newPledgeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `p_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/** Bir bildirim için verilen toplam mama (kg) — tüm zaman */
export function totalPledgedFor(reportId: string, pledges: Pledge[]): number {
  return +pledges
    .filter((p) => p.reportId === reportId)
    .reduce((s, p) => s + p.amountKg, 0)
    .toFixed(2);
}

/** Bir bildirim için bugün verilen toplam mama (kg) */
export function pledgedTodayFor(reportId: string, pledges: Pledge[]): number {
  const t = todayKey();
  return +pledges
    .filter((p) => p.reportId === reportId && dateKey(p.createdAt) === t)
    .reduce((s, p) => s + p.amountKg, 0)
    .toFixed(2);
}

/** Bir bildirim için son 7 günde verilen toplam mama (kg) */
export function pledgedThisWeekFor(reportId: string, pledges: Pledge[]): number {
  const set = new Set(lastSevenDayKeys());
  return +pledges
    .filter((p) => p.reportId === reportId && set.has(dateKey(p.createdAt)))
    .reduce((s, p) => s + p.amountKg, 0)
    .toFixed(2);
}
