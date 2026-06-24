import type { HungerLevel, Report, Species } from "./types";

// Hayvan başı günlük tahmini yiyecek/yem ihtiyacı (kg).
// Demo amaçlı yaklaşık değerlerdir — gerçek beslenme protokolüne uyarlanmalıdır.
const DAILY_KG_PER_HEAD: Record<Species, number> = {
  kedi: 0.08,
  kopek: 0.4,
  keci: 1.5,
  esek: 4.0,
  koyun: 1.2,
  kus: 0.03,
  diger: 0.3,
};

const HUNGER_MULTIPLIER: Record<HungerLevel, number> = {
  1: 0.3,
  2: 0.6,
  3: 1.0,
  4: 1.3,
  5: 1.6,
};

/** Bir bildirimin tek bir gün için tahmini yiyecek ihtiyacı (kg) */
export function dailyNeedKg(report: Report): number {
  const base = DAILY_KG_PER_HEAD[report.species];
  const mult = HUNGER_MULTIPLIER[report.hungerLevel];
  return +(base * report.count * mult).toFixed(2);
}

/** 7 günlük tahmini ihtiyaç */
export function weeklyNeedKg(report: Report): number {
  return +(dailyNeedKg(report) * 7).toFixed(2);
}

export function formatKg(kg: number): string {
  if (kg < 1) return `${Math.round(kg * 1000)} g`;
  if (kg < 10) return `${kg.toFixed(1)} kg`;
  return `${Math.round(kg)} kg`;
}

/** Bir gönüllü kaydının ait olduğu tarih (yerel saat, YYYY-MM-DD) */
export function dateKey(ts: number): string {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayKey(): string {
  return dateKey(Date.now());
}

export function lastSevenDayKeys(): string[] {
  const out: string[] = [];
  const now = Date.now();
  for (let i = 0; i < 7; i++) {
    out.push(dateKey(now - i * 86400 * 1000));
  }
  return out;
}
