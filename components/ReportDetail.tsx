"use client";

import {
  X,
  Trash2,
  Navigation,
  Droplet,
  Soup,
  Home,
  ExternalLink,
  HandHeart,
  User,
  Pencil,
} from "lucide-react";
import type { Place, Pledge, Report } from "@/lib/types";
import {
  HEALTH_LABEL,
  HUNGER_LABEL,
  SHELTER_LABEL,
  SPECIES_LABEL,
  URGENCY_LABEL,
} from "@/lib/types";
import { SPECIES_EMOJI } from "@/lib/species";
import { haversineKm, formatDistance, relativeTime } from "@/lib/distance";
import { dailyNeedKg, formatKg } from "@/lib/food";
import { pledgedTodayFor, totalPledgedFor } from "@/lib/pledges";
import { mapsLink } from "@/lib/maps";

interface Props {
  report: Report | null;
  places: Place[];
  pledges: Pledge[];
  onClose: () => void;
  onDelete: (id: string) => void;
  onEdit: (r: Report) => void;
  onFocusPlace: (lat: number, lng: number) => void;
  onPledge: (r: Report) => void;
}

const URGENCY_COLOR: Record<Report["urgency"], string> = {
  acil: "bg-rose-100 text-rose-700 ring-rose-300 dark:bg-rose-900/40 dark:text-rose-200 dark:ring-rose-700",
  yuksek: "bg-orange-100 text-orange-700 ring-orange-300 dark:bg-orange-900/40 dark:text-orange-200 dark:ring-orange-700",
  orta: "bg-amber-100 text-amber-800 ring-amber-300 dark:bg-amber-900/40 dark:text-amber-200 dark:ring-amber-700",
  dusuk: "bg-emerald-100 text-emerald-800 ring-emerald-300 dark:bg-emerald-900/60 dark:text-emerald-200 dark:ring-emerald-700",
};

export default function ReportDetail({
  report,
  places,
  pledges,
  onClose,
  onDelete,
  onEdit,
  onFocusPlace,
  onPledge,
}: Props) {
  if (!report) return null;

  const vets = places.filter((p) => p.type === "veteriner");
  const nearestVet = vets
    .map((p) => ({ place: p, km: haversineKm(report, p) }))
    .sort((a, b) => a.km - b.km)[0];

  const need = dailyNeedKg(report);
  const todayDone = pledgedTodayFor(report.id, pledges);
  const remaining = Math.max(0, need - todayDone);
  const pct = need > 0 ? Math.min(100, Math.round((todayDone / need) * 100)) : 0;
  const totalAllTime = totalPledgedFor(report.id, pledges);

  const reportPledges = pledges
    .filter((p) => p.reportId === report.id)
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);

  const links = mapsLink(report.lat, report.lng, `${SPECIES_LABEL[report.species]} bildirimi`);

  return (
    <aside className="fixed bottom-0 right-0 top-0 z-[900] w-full max-w-md overflow-y-auto bg-white shadow-2xl sm:right-3 sm:top-3 sm:max-h-[calc(100vh-1.5rem)] sm:rounded-3xl thin-scroll dark:bg-emerald-950 dark:text-emerald-50">
      <div className="sticky top-0 z-10 flex items-start justify-between border-b border-emerald-100 bg-white/95 p-4 backdrop-blur dark:border-emerald-800 dark:bg-emerald-950/95">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-3xl dark:bg-emerald-900/60">
            {SPECIES_EMOJI[report.species]}
          </div>
          <div>
            <h2 className="text-xl font-bold text-emerald-900 dark:text-emerald-100">
              {report.count} × {SPECIES_LABEL[report.species]}
            </h2>
            <p className="text-sm text-emerald-700/70 dark:text-emerald-300/70">
              {relativeTime(report.createdAt)}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-1.5 text-emerald-700 transition hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-900"
          aria-label="Kapat"
        >
          <X size={22} />
        </button>
      </div>

      <div className="space-y-4 p-4">
        <div>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ${URGENCY_COLOR[report.urgency]}`}
          >
            🚨 Aciliyet: {URGENCY_LABEL[report.urgency]}
          </span>
        </div>

        {/* Askıda Mama özeti */}
        <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-emerald-50 p-3 dark:border-amber-800/50 dark:from-amber-950/30 dark:to-emerald-900/30">
          <div className="mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-amber-800 dark:text-amber-200">
              <HandHeart size={14} /> Askıda Mama
            </span>
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              %{pct} karşılandı
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-emerald-800 dark:text-emerald-100">
              {formatKg(remaining)}
            </span>
            <span className="text-sm text-emerald-700/70 dark:text-emerald-300/70">
              bugün için kalan / {formatKg(need)} ihtiyaç
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/70 dark:bg-emerald-950/60">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-emerald-500 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <button
            onClick={() => onPledge(report)}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-2.5 text-base font-semibold text-white shadow-sm transition hover:bg-amber-600"
          >
            <HandHeart size={16} /> Mama gönüllüsü ol
          </button>
          {totalAllTime > 0 && (
            <div className="mt-1.5 text-center text-xs text-emerald-700/70 dark:text-emerald-300/70">
              Şimdiye kadar toplam {formatKg(totalAllTime)} söz verildi
            </div>
          )}
        </div>

        <Row icon="🍽️" label="Açlık durumu" value={HUNGER_LABEL[report.hungerLevel]} />
        <Row icon="❤️" label="Sağlık" value={HEALTH_LABEL[report.health]} />
        <Row
          icon={<Droplet size={18} className="text-sky-500" />}
          label="Su"
          value={report.hasWater ? "Mevcut" : "Yok"}
        />
        <Row
          icon={<Soup size={18} className="text-amber-600" />}
          label="Mama kabı"
          value={
            report.foodBowlCount > 0
              ? `${report.foodBowlCount} adet`
              : "Yok"
          }
        />
        <Row
          icon={<Home size={18} className="text-emerald-600" />}
          label="Barınak"
          value={SHELTER_LABEL[report.shelter]}
        />
        <Row
          icon="📍"
          label="Konum"
          value={`${report.lat.toFixed(5)}, ${report.lng.toFixed(5)}`}
        />

        {report.notes && (
          <div className="rounded-xl bg-emerald-50/60 p-3 text-sm text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100">
            <div className="mb-1 text-xs font-semibold uppercase text-emerald-700/70 dark:text-emerald-300/70">
              Notlar
            </div>
            {report.notes}
          </div>
        )}

        {/* Maps linkleri */}
        <div className="flex flex-wrap gap-2">
          <a
            href={links.google}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 dark:bg-emerald-900/60 dark:text-emerald-100 dark:hover:bg-emerald-800"
          >
            🗺️ Google Maps ile aç <ExternalLink size={13} />
          </a>
          <a
            href={links.apple}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-stone-100 px-3 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:hover:bg-emerald-900"
          >
            🍎 Apple Maps <ExternalLink size={13} />
          </a>
        </div>

        {nearestVet && (
          <button
            onClick={() => onFocusPlace(nearestVet.place.lat, nearestVet.place.lng)}
            className="flex w-full items-center justify-between rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 p-3 text-left transition hover:bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-900/40 dark:hover:bg-emerald-900/60"
          >
            <div>
              <div className="text-xs font-semibold uppercase text-emerald-700/70 dark:text-emerald-300/70">
                En yakın veteriner
              </div>
              <div className="text-base font-semibold text-emerald-900 dark:text-emerald-100">
                🩺 {nearestVet.place.name}
              </div>
              <div className="text-sm text-emerald-700/70 dark:text-emerald-300/70">
                {formatDistance(nearestVet.km)} uzaklıkta
              </div>
            </div>
            <Navigation size={20} className="text-emerald-600 dark:text-emerald-300" />
          </button>
        )}

        {/* Son gönüllüler */}
        {reportPledges.length > 0 && (
          <div>
            <div className="mb-1.5 text-sm font-semibold uppercase tracking-wide text-emerald-700/80 dark:text-emerald-300/80">
              Son gönüllüler
            </div>
            <ul className="space-y-1.5">
              {reportPledges.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between rounded-xl bg-stone-50/60 px-3 py-2 text-sm dark:bg-emerald-900/40"
                >
                  <span className="flex items-center gap-2 text-emerald-900 dark:text-emerald-100">
                    <User size={14} className="text-emerald-600 dark:text-emerald-300" />
                    {p.volunteerName || "Anonim gönüllü"}
                  </span>
                  <span className="font-semibold text-amber-700 dark:text-amber-300">
                    {formatKg(p.amountKg)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(report)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-100 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-200 dark:bg-emerald-900/60 dark:text-emerald-100 dark:hover:bg-emerald-800"
          >
            <Pencil size={16} /> Düzenle
          </button>
          <button
            onClick={() => {
              if (confirm("Bu bildirimi silmek istediğine emin misin?")) {
                onDelete(report.id);
              }
            }}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-50 py-2.5 text-sm font-medium text-rose-700 transition hover:bg-rose-100 dark:bg-rose-900/30 dark:text-rose-200 dark:hover:bg-rose-900/60"
          >
            <Trash2 size={16} /> Sil
          </button>
        </div>
      </div>
    </aside>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-stone-50/60 px-3 py-2.5 dark:bg-emerald-900/40">
      <div className="flex items-center gap-2 text-sm text-emerald-700/80 dark:text-emerald-300/80">
        <span className="text-lg">{icon}</span>
        {label}
      </div>
      <span className="text-base font-medium text-emerald-900 dark:text-emerald-100">
        {value}
      </span>
    </div>
  );
}
