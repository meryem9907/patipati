"use client";

import { useState } from "react";
import { LocateFixed, Loader2 } from "lucide-react";

interface Props {
  onLocated: (lat: number, lng: number) => void;
  compact?: boolean;
}

export default function LocateMeButton({ onLocated, compact }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const locate = () => {
    if (!("geolocation" in navigator)) {
      setError("Tarayıcın konum servisini desteklemiyor");
      return;
    }
    setError(null);
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoading(false);
        onLocated(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        setLoading(false);
        setError(
          err.code === err.PERMISSION_DENIED
            ? "Konum izni reddedildi"
            : "Konum alınamadı"
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  return (
    <div className="relative">
      <button
        onClick={locate}
        disabled={loading}
        aria-label="Konumumu bul"
        className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-2.5 text-sm font-medium text-emerald-700 shadow-sm transition hover:bg-emerald-50 disabled:opacity-60 dark:bg-emerald-900/60 dark:text-emerald-100 dark:hover:bg-emerald-900"
      >
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <LocateFixed size={18} />
        )}
        {!compact && <span>Konumumu bul</span>}
      </button>
      {error && (
        <div className="absolute right-0 top-full mt-1 whitespace-nowrap rounded-lg bg-rose-50 px-2 py-1 text-xs text-rose-700 dark:bg-rose-900/40 dark:text-rose-200">
          {error}
        </div>
      )}
    </div>
  );
}
