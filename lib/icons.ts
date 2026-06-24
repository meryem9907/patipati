import L from "leaflet";
import type { Place, Species, Urgency } from "./types";
import { PLACE_TYPE_EMOJI } from "./places";
import { SPECIES_EMOJI } from "./species";

export { SPECIES_EMOJI };

const URGENCY_RING: Record<Urgency, string> = {
  acil: "border-rose-500 shadow-rose-300 animate-pulse-slow",
  yuksek: "border-orange-400 shadow-orange-200",
  orta: "border-amber-300 shadow-amber-100",
  dusuk: "border-emerald-400 shadow-emerald-100",
};

export function makeReportIcon(species: Species, urgency: Urgency): L.DivIcon {
  const ring = URGENCY_RING[urgency];
  const emoji = SPECIES_EMOJI[species];
  return L.divIcon({
    html: `<div class="pati-marker-inner ${ring}"><span>${emoji}</span></div>`,
    className: "pati-marker",
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22],
  });
}

export function makePlaceIcon(type: Place["type"]): L.DivIcon {
  const emoji = PLACE_TYPE_EMOJI[type];
  return L.divIcon({
    html: `<div class="pati-place-inner"><span>${emoji}</span></div>`,
    className: "pati-place",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

export function makeUserIcon(): L.DivIcon {
  return L.divIcon({
    html: `<div class="pati-user-inner"><span>📍</span></div>`,
    className: "pati-user",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}
