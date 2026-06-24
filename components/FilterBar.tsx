"use client";

import { Filter } from "lucide-react";
import type { Species, Urgency } from "@/lib/types";
import { SPECIES_LABEL, URGENCY_LABEL } from "@/lib/types";
import { SPECIES_EMOJI } from "@/lib/species";

interface Props {
  speciesFilter: Set<Species>;
  urgencyFilter: Set<Urgency>;
  onToggleSpecies: (s: Species) => void;
  onToggleUrgency: (u: Urgency) => void;
  onClear: () => void;
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
const URGENCY_LIST: Urgency[] = ["acil", "yuksek", "orta", "dusuk"];

const URGENCY_DOT: Record<Urgency, string> = {
  acil: "bg-rose-500",
  yuksek: "bg-orange-400",
  orta: "bg-amber-300",
  dusuk: "bg-emerald-400",
};

export default function FilterBar({
  speciesFilter,
  urgencyFilter,
  onToggleSpecies,
  onToggleUrgency,
  onClear,
}: Props) {
  const hasFilter = speciesFilter.size > 0 || urgencyFilter.size > 0;

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-emerald-700/80 dark:text-emerald-300/80">
        <Filter size={14} /> Filtre
        {hasFilter && (
          <button
            onClick={onClear}
            className="ml-auto rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium normal-case text-stone-700 hover:bg-stone-200 dark:bg-emerald-900/60 dark:text-emerald-200 dark:hover:bg-emerald-900"
          >
            Temizle
          </button>
        )}
      </div>

      <div className="thin-scroll -mx-3 flex gap-1.5 overflow-x-auto px-3 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        {SPECIES_LIST.map((s) => {
          const active = speciesFilter.has(s);
          return (
            <button
              key={s}
              onClick={() => onToggleSpecies(s)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition ${
                active
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-200 dark:hover:bg-emerald-900/70"
              }`}
              title={SPECIES_LABEL[s]}
            >
              <span className="text-lg leading-none">{SPECIES_EMOJI[s]}</span>
              <span>{SPECIES_LABEL[s]}</span>
            </button>
          );
        })}
      </div>

      <div className="thin-scroll -mx-3 flex gap-1.5 overflow-x-auto px-3 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        {URGENCY_LIST.map((u) => {
          const active = urgencyFilter.has(u);
          return (
            <button
              key={u}
              onClick={() => onToggleUrgency(u)}
              className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition ${
                active
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-200 dark:hover:bg-emerald-900/70"
              }`}
            >
              <span className={`h-2.5 w-2.5 rounded-full ${URGENCY_DOT[u]}`} />
              {URGENCY_LABEL[u]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
