"use client";

import { useEffect, useState } from "react";
import { X, HandHeart, Save } from "lucide-react";
import type { Pledge, Report } from "@/lib/types";
import { SPECIES_LABEL } from "@/lib/types";
import { SPECIES_EMOJI } from "@/lib/species";
import { dailyNeedKg, formatKg } from "@/lib/food";
import { newPledgeId, pledgedTodayFor } from "@/lib/pledges";

interface Props {
  open: boolean;
  report: Report | null;
  pledges: Pledge[];
  onClose: () => void;
  onSave: (p: Pledge) => void;
}

export default function PledgeForm({
  open,
  report,
  pledges,
  onClose,
  onSave,
}: Props) {
  const [amount, setAmount] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const [note, setNote] = useState<string>("");

  useEffect(() => {
    if (open && report) {
      const todayDone = pledgedTodayFor(report.id, pledges);
      const remaining = Math.max(0, dailyNeedKg(report) - todayDone);
      setAmount(remaining > 0 ? +remaining.toFixed(2) : 0.5);
      setName("");
      setNote("");
    }
  }, [open, report, pledges]);

  if (!open || !report) return null;

  const need = dailyNeedKg(report);
  const todayDone = pledgedTodayFor(report.id, pledges);
  const remaining = Math.max(0, need - todayDone);

  const handleSave = () => {
    if (amount <= 0) return;
    const p: Pledge = {
      id: newPledgeId(),
      reportId: report.id,
      volunteerName: name.trim() || undefined,
      amountKg: +amount.toFixed(2),
      note: note.trim() || undefined,
      createdAt: Date.now(),
    };
    onSave(p);
  };

  const presets = [0.25, 0.5, 1, 2, 5];

  return (
    <div
      className="fixed inset-0 z-[1100] flex items-end justify-center bg-emerald-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4 dark:bg-black/70"
      onClick={onClose}
    >
      <div
        className="thin-scroll relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl dark:bg-emerald-950 dark:text-emerald-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-3xl dark:bg-amber-900/40">
              <HandHeart className="text-amber-600 dark:text-amber-300" size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-emerald-900 dark:text-emerald-100">
                Askıda Mama Bırak
              </h2>
              <p className="text-sm text-emerald-700/70 dark:text-emerald-300/70">
                {report.count} × {SPECIES_LABEL[report.species]} {SPECIES_EMOJI[report.species]} için bugün ne kadar katkı sunabilirsin?
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Kapat"
            className="rounded-full p-1.5 text-emerald-700 transition hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-900"
          >
            <X size={20} />
          </button>
        </div>

        {/* İhtiyaç özeti */}
        <div className="mb-4 grid grid-cols-3 gap-2">
          <NeedCell label="Günlük ihtiyaç" value={formatKg(need)} tone="emerald" />
          <NeedCell label="Bugün gelen" value={formatKg(todayDone)} tone="sky" />
          <NeedCell
            label="Kalan"
            value={remaining > 0 ? formatKg(remaining) : "✓ Tamam"}
            tone={remaining > 0 ? "amber" : "emerald"}
          />
        </div>

        {/* Miktar */}
        <label className="mb-1.5 block text-sm font-semibold uppercase tracking-wide text-emerald-700/80 dark:text-emerald-300/80">
          Bırakacağın miktar
        </label>
        <div className="mb-3 flex items-center gap-2">
          <input
            type="number"
            step="0.1"
            min="0.1"
            max="50"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            className="w-28 rounded-xl border border-emerald-200 bg-white px-3 py-2.5 text-lg font-semibold text-emerald-900 focus:border-emerald-400 focus:outline-none dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-50"
          />
          <span className="text-base text-emerald-700 dark:text-emerald-300">kg</span>
        </div>
        <div className="mb-4 flex flex-wrap gap-1.5">
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setAmount(p)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                Math.abs(amount - p) < 0.001
                  ? "bg-amber-500 text-white"
                  : "bg-amber-50 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-200 dark:hover:bg-amber-900/60"
              }`}
            >
              {formatKg(p)}
            </button>
          ))}
          {remaining > 0 && (
            <button
              type="button"
              onClick={() => setAmount(+remaining.toFixed(2))}
              className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-200 dark:hover:bg-emerald-900/60"
            >
              Kalan kadar ({formatKg(remaining)})
            </button>
          )}
        </div>

        {/* İsim */}
        <label className="mb-1.5 block text-sm font-semibold uppercase tracking-wide text-emerald-700/80 dark:text-emerald-300/80">
          İsim (opsiyonel)
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={40}
          placeholder="Adın görünmesini istiyorsan yaz"
          className="mb-4 w-full rounded-xl border border-emerald-200 bg-white px-3 py-2.5 text-base text-emerald-900 placeholder:text-emerald-700/40 focus:border-emerald-400 focus:outline-none dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-50 dark:placeholder:text-emerald-400/40"
        />

        {/* Not */}
        <label className="mb-1.5 block text-sm font-semibold uppercase tracking-wide text-emerald-700/80 dark:text-emerald-300/80">
          Not (opsiyonel)
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder="Örn: bugün öğleden sonra bırakıyorum"
          className="mb-5 w-full resize-none rounded-xl border border-emerald-200 bg-white p-3 text-base text-emerald-900 placeholder:text-emerald-700/40 focus:border-emerald-400 focus:outline-none dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-50 dark:placeholder:text-emerald-400/40"
        />

        <div className="sticky bottom-0 -mx-5 flex gap-2 border-t border-emerald-100 bg-white/95 px-5 pt-3 backdrop-blur dark:border-emerald-800 dark:bg-emerald-950/95">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl bg-stone-100 py-3 text-base font-medium text-stone-700 transition hover:bg-stone-200 dark:bg-emerald-900/60 dark:text-emerald-100 dark:hover:bg-emerald-900"
          >
            Vazgeç
          </button>
          <button
            type="button"
            disabled={amount <= 0}
            onClick={handleSave}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-base font-semibold text-white shadow-soft transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            <Save size={18} /> Söz veriyorum
          </button>
        </div>
      </div>
    </div>
  );
}

function NeedCell({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "emerald" | "amber" | "sky";
}) {
  const map = {
    emerald: "bg-emerald-50 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-100",
    amber: "bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-100",
    sky: "bg-sky-50 text-sky-800 dark:bg-sky-900/30 dark:text-sky-100",
  } as const;
  return (
    <div className={`rounded-2xl p-3 ${map[tone]}`}>
      <div className="text-[11px] font-semibold uppercase tracking-wide opacity-70">
        {label}
      </div>
      <div className="text-base font-bold">{value}</div>
    </div>
  );
}
