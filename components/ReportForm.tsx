"use client";

import { useEffect, useState } from "react";
import { X, Minus, Plus, MapPin, Save } from "lucide-react";
import type {
  HealthStatus,
  HungerLevel,
  Report,
  ShelterStatus,
  Species,
} from "@/lib/types";
import {
  HEALTH_LABEL,
  HUNGER_LABEL,
  SHELTER_LABEL,
  SPECIES_LABEL,
} from "@/lib/types";
import { SPECIES_EMOJI } from "@/lib/species";
import { computeUrgency, newReportId } from "@/lib/storage";

interface ReportFormProps {
  open: boolean;
  initial?: Partial<Report>;
  onClose: () => void;
  onSave: (r: Report) => void;
  onPickFromMap: () => void;
}

const SPECIES_LIST: Species[] = [
  "kedi",
  "kopek",
  "keci",
  "esek",
  "koyun",
  "kus",
  "diger",
];
const HEALTH_LIST: HealthStatus[] = [
  "saglikli",
  "hafif-yarali",
  "agir-yarali",
  "hasta",
  "bilinmiyor",
];
const SHELTER_LIST: ShelterStatus[] = ["yok", "yikik", "yetersiz", "saglam"];
const HUNGER_EMOJI: Record<HungerLevel, string> = {
  1: "😋",
  2: "🙂",
  3: "😐",
  4: "😟",
  5: "😿",
};

export default function ReportForm({
  open,
  initial,
  onClose,
  onSave,
  onPickFromMap,
}: ReportFormProps) {
  const [species, setSpecies] = useState<Species>(initial?.species ?? "kedi");
  const [count, setCount] = useState<number>(initial?.count ?? 1);
  const [hungerLevel, setHungerLevel] = useState<HungerLevel>(
    initial?.hungerLevel ?? 3
  );
  const [health, setHealth] = useState<HealthStatus>(
    initial?.health ?? "saglikli"
  );
  const [hasWater, setHasWater] = useState<boolean>(initial?.hasWater ?? false);
  const [foodBowlCount, setFoodBowlCount] = useState<number>(
    initial?.foodBowlCount ?? 0
  );
  const [shelter, setShelter] = useState<ShelterStatus>(
    initial?.shelter ?? "yok"
  );
  const [notes, setNotes] = useState<string>(initial?.notes ?? "");
  const [lat, setLat] = useState<number | undefined>(initial?.lat);
  const [lng, setLng] = useState<number | undefined>(initial?.lng);

  useEffect(() => {
    if (open) {
      setSpecies(initial?.species ?? "kedi");
      setCount(initial?.count ?? 1);
      setHungerLevel(initial?.hungerLevel ?? 3);
      setHealth(initial?.health ?? "saglikli");
      setHasWater(initial?.hasWater ?? false);
      setFoodBowlCount(initial?.foodBowlCount ?? 0);
      setShelter(initial?.shelter ?? "yok");
      setNotes(initial?.notes ?? "");
      setLat(initial?.lat);
      setLng(initial?.lng);
    }
  }, [open, initial]);

  if (!open) return null;

  const canSave = typeof lat === "number" && typeof lng === "number";

  const handleSave = () => {
    if (!canSave) return;
    const urgency = computeUrgency({ health, shelter, hungerLevel, hasWater });
    const report: Report = {
      id: initial?.id ?? newReportId(),
      lat: lat!,
      lng: lng!,
      species,
      count,
      hungerLevel,
      health,
      hasWater,
      foodBowlCount,
      shelter,
      notes: notes.trim() || undefined,
      urgency,
      createdAt: initial?.createdAt ?? Date.now(),
    };
    onSave(report);
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-end justify-center bg-emerald-950/40 p-0 backdrop-blur-sm sm:items-center sm:p-4 dark:bg-black/70"
      onClick={onClose}
    >
      <div
        className="thin-scroll relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl dark:bg-emerald-950 dark:text-emerald-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
              {initial?.id ? "✏️ Bildirimi Düzenle" : "🐾 Yeni Bildirim"}
            </h2>
            <p className="text-sm text-emerald-700/70 dark:text-emerald-300/70">
              {initial?.id
                ? "Bilgileri güncelleyebilirsin. Aciliyet otomatik yeniden hesaplanır."
                : "Gördüğün hayvanın durumunu paylaş, kimse aç ve yalnız kalmasın."}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Kapat"
            className="rounded-full p-1.5 text-emerald-700 transition hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-900"
          >
            <X size={22} />
          </button>
        </div>

        {/* Konum */}
        <Field label="Konum">
          <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2.5 text-base dark:bg-emerald-900/40">
            <span className="text-emerald-900 dark:text-emerald-100">
              {canSave
                ? `${lat!.toFixed(5)}, ${lng!.toFixed(5)}`
                : "Henüz seçilmedi"}
            </span>
            <button
              type="button"
              onClick={onPickFromMap}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-100 dark:bg-emerald-800 dark:text-emerald-100 dark:hover:bg-emerald-700"
            >
              <MapPin size={15} /> Haritadan seç
            </button>
          </div>
        </Field>

        {/* Tür */}
        <Field label="Hayvan türü">
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
            {SPECIES_LIST.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSpecies(s)}
                className={`flex flex-col items-center rounded-2xl border-2 p-2.5 transition ${
                  species === s
                    ? "border-emerald-500 bg-emerald-50 shadow-soft dark:border-emerald-400 dark:bg-emerald-900/60"
                    : "border-transparent bg-emerald-50/40 hover:bg-emerald-50 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/60"
                }`}
              >
                <span className="text-2xl">{SPECIES_EMOJI[s]}</span>
                <span className="mt-1 text-xs font-medium text-emerald-900 dark:text-emerald-100">
                  {SPECIES_LABEL[s]}
                </span>
              </button>
            ))}
          </div>
        </Field>

        {/* Adet */}
        <Field label="Adet">
          <NumberStepper value={count} onChange={setCount} min={1} max={50} />
        </Field>

        {/* Açlık */}
        <Field label={`Açlık durumu — ${HUNGER_LABEL[hungerLevel]}`}>
          <div className="grid grid-cols-5 gap-2">
            {([1, 2, 3, 4, 5] as HungerLevel[]).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setHungerLevel(lvl)}
                className={`rounded-xl border-2 py-2.5 text-2xl transition ${
                  hungerLevel === lvl
                    ? "border-amber-400 bg-amber-50 dark:border-amber-300 dark:bg-amber-900/40"
                    : "border-transparent bg-amber-50/30 hover:bg-amber-50 dark:bg-emerald-900/30 dark:hover:bg-amber-900/30"
                }`}
                aria-label={HUNGER_LABEL[lvl]}
              >
                {HUNGER_EMOJI[lvl]}
              </button>
            ))}
          </div>
        </Field>

        {/* Sağlık */}
        <Field label="Sağlık durumu">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {HEALTH_LIST.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setHealth(h)}
                className={`rounded-xl border-2 px-3 py-2.5 text-sm font-medium transition ${
                  health === h
                    ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:border-emerald-400 dark:bg-emerald-900/60 dark:text-emerald-100"
                    : "border-transparent bg-emerald-50/40 text-emerald-700 hover:bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-200 dark:hover:bg-emerald-900/60"
                }`}
              >
                {HEALTH_LABEL[h]}
              </button>
            ))}
          </div>
        </Field>

        {/* Su + Mama */}
        <div className="mb-4 grid grid-cols-2 gap-3">
          <Field label="Su mevcut mu?" tight>
            <button
              type="button"
              onClick={() => setHasWater(!hasWater)}
              className={`w-full rounded-xl border-2 py-2.5 text-base font-medium transition ${
                hasWater
                  ? "border-sky-400 bg-sky-50 text-sky-900 dark:border-sky-400 dark:bg-sky-900/40 dark:text-sky-100"
                  : "border-transparent bg-stone-100 text-stone-600 hover:bg-stone-50 dark:bg-emerald-900/30 dark:text-emerald-200 dark:hover:bg-emerald-900/60"
              }`}
            >
              {hasWater ? "💧 Var" : "🚫 Yok"}
            </button>
          </Field>
          <Field label="Mama kabı sayısı" tight>
            <NumberStepper
              value={foodBowlCount}
              onChange={setFoodBowlCount}
              min={0}
              max={20}
            />
          </Field>
        </div>

        {/* Barınak */}
        <Field label="Barınak durumu">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {SHELTER_LIST.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setShelter(s)}
                className={`rounded-xl border-2 px-3 py-2.5 text-sm font-medium transition ${
                  shelter === s
                    ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:border-emerald-400 dark:bg-emerald-900/60 dark:text-emerald-100"
                    : "border-transparent bg-emerald-50/40 text-emerald-700 hover:bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-200 dark:hover:bg-emerald-900/60"
                }`}
              >
                {SHELTER_LABEL[s]}
              </button>
            ))}
          </div>
        </Field>

        {/* Notlar */}
        <Field label="Notlar (opsiyonel)">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Örn: en yakın veteriner, hayvanın davranışı, hava durumu..."
            className="w-full resize-none rounded-xl border border-emerald-200 bg-emerald-50/30 p-3 text-base text-emerald-900 placeholder:text-emerald-700/40 focus:border-emerald-400 focus:outline-none dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-50 dark:placeholder:text-emerald-400/40"
          />
        </Field>

        {/* Aksiyonlar */}
        <div className="sticky bottom-0 -mx-5 mt-2 flex gap-2 border-t border-emerald-100 bg-white/95 px-5 pt-3 backdrop-blur dark:border-emerald-800 dark:bg-emerald-950/95">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl bg-stone-100 py-3 text-base font-medium text-stone-700 transition hover:bg-stone-200 dark:bg-emerald-900/60 dark:text-emerald-100 dark:hover:bg-emerald-900"
          >
            Vazgeç
          </button>
          <button
            type="button"
            disabled={!canSave}
            onClick={handleSave}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-base font-semibold text-white shadow-soft transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            <Save size={18} /> {initial?.id ? "Güncelle" : "Kaydet"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  tight,
}: {
  label: string;
  children: React.ReactNode;
  tight?: boolean;
}) {
  return (
    <div className={tight ? "" : "mb-4"}>
      <label className="mb-1.5 block text-sm font-semibold uppercase tracking-wide text-emerald-700/80 dark:text-emerald-300/80">
        {label}
      </label>
      {children}
    </div>
  );
}

function NumberStepper({
  value,
  onChange,
  min,
  max,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 p-1 dark:bg-emerald-900/40">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="rounded-lg bg-white p-2.5 text-emerald-700 shadow-sm transition hover:bg-emerald-100 dark:bg-emerald-800 dark:text-emerald-100 dark:hover:bg-emerald-700"
      >
        <Minus size={16} />
      </button>
      <span className="min-w-10 text-center text-lg font-semibold text-emerald-900 dark:text-emerald-100">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="rounded-lg bg-white p-2.5 text-emerald-700 shadow-sm transition hover:bg-emerald-100 dark:bg-emerald-800 dark:text-emerald-100 dark:hover:bg-emerald-700"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
