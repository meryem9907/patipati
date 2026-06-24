"use client";

import { useMemo } from "react";
import { HandHeart, Sparkles } from "lucide-react";
import type { Pledge, Report } from "@/lib/types";
import { SPECIES_LABEL } from "@/lib/types";
import { SPECIES_EMOJI } from "@/lib/species";
import {
  dailyNeedKg,
  formatKg,
  weeklyNeedKg,
} from "@/lib/food";
import {
  pledgedThisWeekFor,
  pledgedTodayFor,
} from "@/lib/pledges";

interface Props {
  reports: Report[];
  pledges: Pledge[];
  onPledge: (report: Report) => void;
  onFocus: (lat: number, lng: number) => void;
}

export default function FoodNeedsPanel({
  reports,
  pledges,
  onPledge,
  onFocus,
}: Props) {
  const summary = useMemo(() => {
    let dayNeed = 0;
    let dayPledged = 0;
    let weekNeed = 0;
    let weekPledged = 0;
    for (const r of reports) {
      const d = dailyNeedKg(r);
      const w = weeklyNeedKg(r);
      dayNeed += d;
      weekNeed += w;
      dayPledged += pledgedTodayFor(r.id, pledges);
      weekPledged += pledgedThisWeekFor(r.id, pledges);
    }
    return {
      dayNeed: +dayNeed.toFixed(2),
      dayPledged: +dayPledged.toFixed(2),
      dayRemaining: Math.max(0, +(dayNeed - dayPledged).toFixed(2)),
      weekNeed: +weekNeed.toFixed(2),
      weekPledged: +weekPledged.toFixed(2),
      weekRemaining: Math.max(0, +(weekNeed - weekPledged).toFixed(2)),
    };
  }, [reports, pledges]);

  const sortedReports = useMemo(() => {
    return reports
      .map((r) => {
        const need = dailyNeedKg(r);
        const today = pledgedTodayFor(r.id, pledges);
        const remaining = Math.max(0, need - today);
        return { r, need, today, remaining };
      })
      .sort((a, b) => b.remaining - a.remaining);
  }, [reports, pledges]);

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-emerald-50 p-3 dark:from-amber-950/30 dark:to-emerald-900/30">
        <div className="mb-1 flex items-center gap-2">
          <HandHeart className="text-amber-600 dark:text-amber-300" size={18} />
          <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-100">
            Askıda Mama
          </h3>
        </div>
        <p className="text-sm leading-snug text-emerald-800/80 dark:text-emerald-200/80">
          Tıpkı askıda ekmek gibi. Bir noktaya gönüllü ol, ne kadar mama
          bırakacağını söyle. Toplam ihtiyaç gerçek zamanlı güncellenir.
        </p>
      </div>

      <SummaryCard
        title="Bugün"
        need={summary.dayNeed}
        pledged={summary.dayPledged}
        remaining={summary.dayRemaining}
      />
      <SummaryCard
        title="Bu hafta"
        need={summary.weekNeed}
        pledged={summary.weekPledged}
        remaining={summary.weekRemaining}
      />

      <div className="mb-1 mt-1 flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-emerald-700/80 dark:text-emerald-300/80">
        <Sparkles size={14} /> Bildirimler — kalan mama
      </div>

      <ul className="thin-scroll flex-1 space-y-2 overflow-y-auto pr-1">
        {sortedReports.length === 0 && (
          <li className="rounded-xl bg-stone-50 p-3 text-center text-sm text-stone-500 dark:bg-emerald-900/30 dark:text-emerald-300/70">
            Filtrelenmiş bildirim yok.
          </li>
        )}
        {sortedReports.map(({ r, need, today, remaining }) => {
          const pct = need > 0 ? Math.min(100, Math.round((today / need) * 100)) : 0;
          return (
            <li key={r.id}>
              <div className="rounded-2xl border border-emerald-100 bg-white p-3 dark:border-emerald-800 dark:bg-emerald-900/40">
                <button
                  onClick={() => onFocus(r.lat, r.lng)}
                  className="flex w-full items-start gap-3 text-left"
                >
                  <span className="text-2xl">{SPECIES_EMOJI[r.species]}</span>
                  <div className="flex-1">
                    <div className="text-base font-semibold text-emerald-900 dark:text-emerald-100">
                      {r.count} × {SPECIES_LABEL[r.species]}
                    </div>
                    <div className="text-sm text-emerald-700/70 dark:text-emerald-300/70">
                      Günlük {formatKg(need)} ihtiyaç
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      remaining > 0
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200"
                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200"
                    }`}
                  >
                    {remaining > 0 ? `${formatKg(remaining)} kalan` : "Tamam ✓"}
                  </span>
                </button>

                {/* Progress */}
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-100 dark:bg-emerald-950/60">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-emerald-500 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="mt-1 text-xs text-emerald-700/70 dark:text-emerald-300/60">
                  {formatKg(today)} / {formatKg(need)} bugün
                </div>

                <button
                  onClick={() => onPledge(r)}
                  className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl bg-amber-500 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600"
                >
                  <HandHeart size={14} /> Gönüllü ol
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SummaryCard({
  title,
  need,
  pledged,
  remaining,
}: {
  title: string;
  need: number;
  pledged: number;
  remaining: number;
}) {
  const pct = need > 0 ? Math.min(100, Math.round((pledged / need) * 100)) : 0;
  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-3 dark:border-emerald-800 dark:bg-emerald-900/40">
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-sm font-bold uppercase tracking-wide text-emerald-900 dark:text-emerald-100">
          {title}
        </span>
        <span className="text-xs font-semibold text-emerald-700/80 dark:text-emerald-300/80">
          %{pct}
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-200">
          {formatKg(remaining)}
        </span>
        <span className="text-sm text-emerald-700/70 dark:text-emerald-300/70">
          kalan / {formatKg(need)} ihtiyaç
        </span>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-stone-100 dark:bg-emerald-950/60">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-emerald-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-1 text-xs text-emerald-700/70 dark:text-emerald-300/60">
        {formatKg(pledged)} gönüllü tarafından söz verildi
      </div>
    </div>
  );
}
