"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Plus, X, ListChecks, HandHeart, Info } from "lucide-react";
import type { Pledge, Report, Species, Urgency } from "@/lib/types";
import { loadReports, saveReports } from "@/lib/storage";
import { loadPledges, savePledges, pledgedTodayFor } from "@/lib/pledges";
import { dailyNeedKg } from "@/lib/food";
import { PLACES } from "@/lib/places";
import ReportForm from "@/components/ReportForm";
import ReportDetail from "@/components/ReportDetail";
import NearbyPlaces from "@/components/NearbyPlaces";
import FilterBar from "@/components/FilterBar";
import LocateMeButton from "@/components/LocateMeButton";
import DarkModeToggle from "@/components/DarkModeToggle";
import FoodNeedsPanel from "@/components/FoodNeedsPanel";
import PledgeForm from "@/components/PledgeForm";
import Brand from "@/components/Brand";
import AboutModal from "@/components/AboutModal";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
      Harita yükleniyor…
    </div>
  ),
});

const GOKCEADA_CENTER = { lat: 40.193, lng: 25.873 };

type PanelTab = "reports" | "food" | "places";

export default function Home() {
  const [reports, setReports] = useState<Report[]>([]);
  const [pledges, setPledges] = useState<Pledge[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [formInitial, setFormInitial] = useState<Partial<Report> | undefined>();
  const [pickingLocation, setPickingLocation] = useState(false);

  const [pledgeFor, setPledgeFor] = useState<Report | null>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [focus, setFocus] = useState<{ lat: number; lng: number; zoom?: number } | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const [speciesFilter, setSpeciesFilter] = useState<Set<Species>>(new Set());
  const [urgencyFilter, setUrgencyFilter] = useState<Set<Urgency>>(new Set());

  const [panelTab, setPanelTab] = useState<PanelTab>("reports");
  const [panelOpen, setPanelOpen] = useState(false);

  const [dark, setDark] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);

  // Hydration + load + responsive default
  useEffect(() => {
    setReports(loadReports());
    setPledges(loadPledges());
    setDark(document.documentElement.classList.contains("dark"));
    // Desktop'ta panel default açık, mobilde kapalı
    if (typeof window !== "undefined" && window.innerWidth >= 640) {
      setPanelOpen(true);
    }
    setHydrated(true);

    const handler = (e: Event) => setDark((e as CustomEvent).detail as boolean);
    window.addEventListener("theme-change", handler);
    return () => window.removeEventListener("theme-change", handler);
  }, []);

  // Persist
  useEffect(() => {
    if (hydrated) saveReports(reports);
  }, [reports, hydrated]);
  useEffect(() => {
    if (hydrated) savePledges(pledges);
  }, [pledges, hydrated]);

  // Toast auto-dismiss
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      if (speciesFilter.size > 0 && !speciesFilter.has(r.species)) return false;
      if (urgencyFilter.size > 0 && !urgencyFilter.has(r.urgency)) return false;
      return true;
    });
  }, [reports, speciesFilter, urgencyFilter]);

  const selectedReport = selectedId
    ? reports.find((r) => r.id === selectedId) ?? null
    : null;

  const isMobile = () => typeof window !== "undefined" && window.innerWidth < 640;

  // --- Handlers ---
  const startNewReport = () => {
    setFormInitial(undefined);
    setFormOpen(true);
    setPickingLocation(false);
  };

  const handleEdit = (r: Report) => {
    setFormInitial(r);
    setSelectedId(null);
    setFormOpen(true);
    setPickingLocation(false);
  };

  const handlePickFromMap = () => {
    setFormOpen(false);
    setPickingLocation(true);
    if (isMobile()) setPanelOpen(false);
  };

  const handleMapClick = (lat: number, lng: number) => {
    if (!pickingLocation) return;
    setPickingLocation(false);
    setFormInitial((prev) => ({ ...prev, lat, lng }));
    setFormOpen(true);
  };

  const handleSave = (r: Report) => {
    setReports((curr) => {
      const idx = curr.findIndex((x) => x.id === r.id);
      if (idx === -1) return [...curr, r];
      const copy = curr.slice();
      copy[idx] = r;
      return copy;
    });
    setFormOpen(false);
    setSelectedId(r.id);
    setFocus({ lat: r.lat, lng: r.lng, zoom: 15 });
    setToast(formInitial?.id ? "Bildirim güncellendi ✓" : "Bildirim eklendi ✓");
  };

  const handleDelete = (id: string) => {
    setReports((curr) => curr.filter((r) => r.id !== id));
    setPledges((curr) => curr.filter((p) => p.reportId !== id));
    setSelectedId(null);
    setToast("Bildirim silindi");
  };

  const handleReportClick = (id: string) => {
    setSelectedId(id);
    const r = reports.find((x) => x.id === id);
    if (r) setFocus({ lat: r.lat, lng: r.lng, zoom: 16 });
    if (isMobile()) setPanelOpen(false);
  };

  const handleLocated = (lat: number, lng: number) => {
    setUserLocation({ lat, lng });
    setFocus({ lat, lng, zoom: 15 });
  };

  const handleFocusPlace = (lat: number, lng: number) => {
    setFocus({ lat, lng, zoom: 16 });
    if (isMobile()) setPanelOpen(false);
  };

  const handlePledgeSave = (p: Pledge) => {
    setPledges((curr) => [...curr, p]);
    setPledgeFor(null);
    setToast("Söz verdiğin için teşekkürler 💚");
  };

  /** Askıda Mama Bırak: en yüksek "kalan ihtiyaç" olan bildirim için PledgeForm aç */
  const handleAskidaMamaClick = () => {
    const pool = filteredReports.length > 0 ? filteredReports : reports;
    if (pool.length === 0) {
      setToast("Henüz bildirim yok. Önce bir bildirim ekle.");
      return;
    }
    let best: Report | null = null;
    let bestRemaining = -Infinity;
    for (const r of pool) {
      const remaining = dailyNeedKg(r) - pledgedTodayFor(r.id, pledges);
      if (remaining > bestRemaining) {
        bestRemaining = remaining;
        best = r;
      }
    }
    if (best) {
      setPledgeFor(best);
      setFocus({ lat: best.lat, lng: best.lng, zoom: 15 });
    }
  };

  const toggleSpecies = (s: Species) => {
    setSpeciesFilter((prev) => {
      const next = new Set(prev);
      next.has(s) ? next.delete(s) : next.add(s);
      return next;
    });
  };
  const toggleUrgency = (u: Urgency) => {
    setUrgencyFilter((prev) => {
      const next = new Set(prev);
      next.has(u) ? next.delete(u) : next.add(u);
      return next;
    });
  };
  const clearFilters = () => {
    setSpeciesFilter(new Set());
    setUrgencyFilter(new Set());
  };

  return (
    <main className="relative h-[100dvh] w-screen overflow-hidden">
      {/* Top bar */}
      <header className="absolute left-0 right-0 top-0 z-[800] flex items-center gap-2 bg-gradient-to-b from-white/95 to-white/75 px-3 py-2.5 backdrop-blur sm:px-4 sm:py-3 dark:from-emerald-950/95 dark:to-emerald-950/75">
        <Brand />

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setAboutOpen(true)}
            aria-label="Hakkında"
            title="Hakkında"
            className="rounded-xl bg-white p-2.5 text-emerald-700 shadow-sm transition hover:bg-emerald-50 dark:bg-emerald-900/60 dark:text-emerald-100 dark:hover:bg-emerald-900"
          >
            <Info size={18} />
          </button>
          <DarkModeToggle />
          <LocateMeButton onLocated={handleLocated} compact />
          <button
            onClick={startNewReport}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-emerald-700"
            aria-label="Bildirim ekle"
          >
            <Plus size={18} />
            <span className="hidden xs:inline sm:inline">Bildirim</span>
          </button>
        </div>
      </header>

      {/* Picking-location banner */}
      {pickingLocation && (
        <div className="absolute left-1/2 top-[68px] z-[850] flex -translate-x-1/2 items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-soft sm:top-20 sm:text-base">
          📍 Haritaya tıklayarak konumu seç
          <button
            onClick={() => setPickingLocation(false)}
            className="ml-1 rounded-full p-0.5 text-white/80 hover:bg-white/20 hover:text-white"
            aria-label="İptal"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* Panel — bottom sheet on mobile, left sidebar on desktop */}
      <aside
        className={`fixed bottom-0 left-0 right-0 z-[700] flex flex-col overflow-hidden bg-white/95 shadow-2xl backdrop-blur transition-transform duration-300 max-h-[80dvh] min-h-[40dvh] rounded-t-3xl
          sm:left-0 sm:right-auto sm:top-[80px] sm:bottom-3 sm:m-3 sm:mr-0 sm:w-[22rem] sm:max-w-sm sm:max-h-none sm:min-h-0 sm:rounded-3xl
          dark:bg-emerald-950/95
          ${panelOpen
            ? "translate-y-0 sm:translate-y-0 sm:translate-x-0"
            : "translate-y-full sm:translate-y-0 sm:-translate-x-[110%]"}
        `}
      >
        {/* Mobile drag handle + close */}
        <div className="relative flex items-center justify-center pt-2 sm:hidden">
          <div className="h-1.5 w-12 rounded-full bg-emerald-200 dark:bg-emerald-800" />
          <button
            onClick={() => setPanelOpen(false)}
            className="absolute right-2 top-1.5 rounded-full p-1.5 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-900"
            aria-label="Paneli kapat"
          >
            <X size={18} />
          </button>
        </div>

        <div className="border-b border-emerald-100 p-3 dark:border-emerald-800">
          <FilterBar
            speciesFilter={speciesFilter}
            urgencyFilter={urgencyFilter}
            onToggleSpecies={toggleSpecies}
            onToggleUrgency={toggleUrgency}
            onClear={clearFilters}
          />
        </div>

        <div className="flex border-b border-emerald-100 dark:border-emerald-800">
          <PanelTabBtn
            label={`🐾 Bildirim`}
            count={filteredReports.length}
            active={panelTab === "reports"}
            onClick={() => setPanelTab("reports")}
          />
          <PanelTabBtn
            label="🥣 Mama"
            active={panelTab === "food"}
            onClick={() => setPanelTab("food")}
          />
          <PanelTabBtn
            label="🩺 Yakın"
            active={panelTab === "places"}
            onClick={() => setPanelTab("places")}
          />
        </div>

        <div className="thin-scroll flex-1 overflow-y-auto p-3">
          {panelTab === "reports" && (
            <ReportList
              reports={filteredReports}
              onClick={(id) => handleReportClick(id)}
            />
          )}
          {panelTab === "food" && (
            <FoodNeedsPanel
              reports={filteredReports}
              pledges={pledges}
              onPledge={(r) => setPledgeFor(r)}
              onFocus={(lat, lng) => handleFocusPlace(lat, lng)}
            />
          )}
          {panelTab === "places" && (
            <NearbyPlaces
              places={PLACES}
              userLocation={userLocation}
              fallback={GOKCEADA_CENTER}
              onFocus={(lat, lng) => handleFocusPlace(lat, lng)}
            />
          )}
        </div>

        <div className="border-t border-emerald-100 bg-emerald-50/60 p-2 text-center text-xs text-emerald-700/70 dark:border-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300/70">
          Demo · veriler yalnızca bu tarayıcıda saklanır ·{" "}
          <button
            onClick={() => setAboutOpen(true)}
            className="font-semibold underline-offset-2 hover:underline"
          >
            Fikir: Meryem Bakirci
          </button>
        </div>
      </aside>

      {/* Map */}
      <div className="absolute inset-0">
        <MapView
          reports={filteredReports}
          places={PLACES}
          pickingLocation={pickingLocation}
          userLocation={userLocation}
          focus={focus}
          dark={dark}
          onMapClick={handleMapClick}
          onReportClick={handleReportClick}
        />
      </div>

      {/* Floating actions (bottom-left) — panel toggle when closed (mobile) */}
      {!panelOpen && (
        <button
          onClick={() => setPanelOpen(true)}
          className="absolute bottom-4 left-4 z-[750] flex h-12 w-12 items-center justify-center rounded-full bg-white text-emerald-700 shadow-lg sm:hidden dark:bg-emerald-900 dark:text-emerald-100"
          aria-label="Panel aç"
        >
          <ListChecks size={22} />
        </button>
      )}

      {/* Floating "Askıda Mama Bırak" CTA — visible on all sizes */}
      <button
        onClick={handleAskidaMamaClick}
        className="absolute bottom-4 left-1/2 z-[750] inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-amber-600 sm:px-5 sm:text-base"
      >
        <HandHeart size={18} /> Askıda Mama Bırak
      </button>

      {/* Toast */}
      {toast && (
        <div className="absolute bottom-20 left-1/2 z-[1200] -translate-x-1/2 rounded-full bg-emerald-900/95 px-4 py-2 text-sm font-medium text-emerald-50 shadow-lg backdrop-blur dark:bg-emerald-100/95 dark:text-emerald-900">
          {toast}
        </div>
      )}

      {/* Report detail */}
      <ReportDetail
        report={selectedReport}
        places={PLACES}
        pledges={pledges}
        onClose={() => setSelectedId(null)}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onFocusPlace={handleFocusPlace}
        onPledge={(r) => setPledgeFor(r)}
      />

      {/* Report form */}
      <ReportForm
        open={formOpen}
        initial={formInitial}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        onPickFromMap={handlePickFromMap}
      />

      {/* Pledge form */}
      <PledgeForm
        open={pledgeFor !== null}
        report={pledgeFor}
        pledges={pledges}
        onClose={() => setPledgeFor(null)}
        onSave={handlePledgeSave}
      />

      {/* Hakkında modalı */}
      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </main>
  );
}

function PanelTabBtn({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 px-2 py-3 text-sm font-semibold transition ${
        active
          ? "border-b-2 border-emerald-500 text-emerald-900 dark:border-emerald-300 dark:text-emerald-100"
          : "text-emerald-700/70 hover:bg-emerald-50/40 dark:text-emerald-300/70 dark:hover:bg-emerald-900/40"
      }`}
    >
      {label}
      {typeof count === "number" && (
        <span className="ml-1 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100">
          {count}
        </span>
      )}
    </button>
  );
}

function ReportList({
  reports,
  onClick,
}: {
  reports: Report[];
  onClick: (id: string) => void;
}) {
  if (reports.length === 0) {
    return (
      <div className="rounded-xl bg-stone-50 p-4 text-center text-base text-stone-500 dark:bg-emerald-900/30 dark:text-emerald-300/70">
        Henüz görünür bildirim yok. Haritaya bir bildirim ekleyerek başlayabilirsin.
      </div>
    );
  }
  return (
    <ul className="space-y-2">
      {reports
        .slice()
        .sort((a, b) => b.createdAt - a.createdAt)
        .map((r) => (
          <li key={r.id}>
            <button
              onClick={() => onClick(r.id)}
              className="flex w-full items-center gap-3 rounded-xl border border-emerald-100 bg-white p-3 text-left transition hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-900/40 dark:hover:border-emerald-600 dark:hover:bg-emerald-900/60"
            >
              <UrgencyDot urgency={r.urgency} />
              <div className="text-2xl">{speciesEmoji(r.species)}</div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-base font-semibold text-emerald-900 dark:text-emerald-100">
                  {r.count} × {speciesLabel(r.species)} · açlık {r.hungerLevel}/5
                </div>
                <div className="truncate text-sm text-emerald-700/70 dark:text-emerald-300/70">
                  {r.notes || `${r.lat.toFixed(4)}, ${r.lng.toFixed(4)}`}
                </div>
              </div>
            </button>
          </li>
        ))}
    </ul>
  );
}

function UrgencyDot({ urgency }: { urgency: Urgency }) {
  const color =
    urgency === "acil"
      ? "bg-rose-500 animate-pulse"
      : urgency === "yuksek"
        ? "bg-orange-400"
        : urgency === "orta"
          ? "bg-amber-300"
          : "bg-emerald-400";
  return <span className={`h-3 w-3 shrink-0 rounded-full ${color}`} />;
}

function speciesEmoji(s: Species) {
  return (
    {
      kedi: "🐈",
      kopek: "🐕",
      keci: "🐐",
      esek: "🫏",
      koyun: "🐑",
      kus: "🐦",
      diger: "🐾",
    } as const
  )[s];
}
function speciesLabel(s: Species) {
  return (
    {
      kedi: "Kedi",
      kopek: "Köpek",
      keci: "Keçi",
      esek: "Eşek",
      koyun: "Koyun",
      kus: "Kuş",
      diger: "Diğer",
    } as const
  )[s];
}
