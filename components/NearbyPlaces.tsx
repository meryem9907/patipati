"use client";

import { useMemo, useState } from "react";
import { Phone, ExternalLink } from "lucide-react";
import type { Place } from "@/lib/types";
import { PLACE_TYPE_EMOJI, PLACE_TYPE_LABEL } from "@/lib/places";
import { haversineKm, formatDistance } from "@/lib/distance";
import { mapsLink } from "@/lib/maps";

interface Props {
  places: Place[];
  userLocation: { lat: number; lng: number } | null;
  fallback: { lat: number; lng: number };
  onFocus: (lat: number, lng: number) => void;
}

const TABS: Place["type"][] = ["veteriner", "mama", "barinak"];

export default function NearbyPlaces({
  places,
  userLocation,
  fallback,
  onFocus,
}: Props) {
  const [tab, setTab] = useState<Place["type"]>("veteriner");
  const origin = userLocation ?? fallback;

  const sorted = useMemo(() => {
    return places
      .filter((p) => p.type === tab)
      .map((p) => ({ place: p, km: haversineKm(origin, p) }))
      .sort((a, b) => a.km - b.km);
  }, [places, tab, origin]);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex gap-1 rounded-xl bg-emerald-50 p-1 dark:bg-emerald-900/40">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-lg px-2 py-2 text-sm font-semibold transition ${
              tab === t
                ? "bg-white text-emerald-900 shadow-sm dark:bg-emerald-800 dark:text-emerald-50"
                : "text-emerald-700/70 hover:text-emerald-900 dark:text-emerald-300/70 dark:hover:text-emerald-100"
            }`}
          >
            {PLACE_TYPE_EMOJI[t]} {PLACE_TYPE_LABEL[t]}
          </button>
        ))}
      </div>

      {!userLocation && (
        <p className="mb-2 rounded-lg bg-amber-50 px-2.5 py-2 text-xs text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
          Konum izni vermediğin için liste ada merkezine göre sıralanıyor.
        </p>
      )}

      <ul className="thin-scroll flex-1 space-y-2 overflow-y-auto pr-1">
        {sorted.length === 0 && (
          <li className="rounded-xl bg-stone-50 p-3 text-center text-sm text-stone-500 dark:bg-emerald-900/30 dark:text-emerald-300/70">
            Bu kategoride kayıt yok.
          </li>
        )}
        {sorted.map(({ place, km }) => {
          const links = mapsLink(place.lat, place.lng, place.name);
          return (
            <li key={place.id}>
              <div className="rounded-2xl border border-emerald-100 bg-white p-3 transition hover:border-emerald-300 dark:border-emerald-800 dark:bg-emerald-900/40 dark:hover:border-emerald-600">
                <button
                  onClick={() => onFocus(place.lat, place.lng)}
                  className="flex w-full items-start gap-3 text-left"
                >
                  <span className="text-2xl">{PLACE_TYPE_EMOJI[place.type]}</span>
                  <div className="flex-1">
                    <div className="text-base font-semibold text-emerald-900 dark:text-emerald-100">
                      {place.name}
                    </div>
                    {place.address && (
                      <div className="text-sm text-emerald-700/70 dark:text-emerald-300/70">
                        {place.address}
                      </div>
                    )}
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100">
                    {formatDistance(km)}
                  </span>
                </button>

                {place.phone && (
                  <a
                    href={`tel:${place.phone}`}
                    className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-300"
                  >
                    <Phone size={13} /> {place.phone}
                  </a>
                )}

                <div className="mt-2 flex flex-wrap gap-1.5">
                  <a
                    href={links.google}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-800 transition hover:bg-emerald-100 dark:bg-emerald-900/60 dark:text-emerald-100 dark:hover:bg-emerald-800"
                  >
                    🗺️ Google Maps <ExternalLink size={11} />
                  </a>
                  <a
                    href={links.apple}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1 rounded-lg bg-stone-100 px-2.5 py-1.5 text-xs font-medium text-stone-700 transition hover:bg-stone-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:hover:bg-emerald-900"
                  >
                    🍎 Apple Maps <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
