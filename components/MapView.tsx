"use client";

import { useEffect, useMemo } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import type { Place, Report } from "@/lib/types";
import { makePlaceIcon, makeReportIcon, makeUserIcon } from "@/lib/icons";
import { PLACE_TYPE_EMOJI, PLACE_TYPE_LABEL } from "@/lib/places";
import { mapsLink } from "@/lib/maps";
import { haversineKm, formatDistance } from "@/lib/distance";

const GOKCEADA_CENTER: [number, number] = [40.193, 25.873];
const DEFAULT_ZOOM = 12;

interface MapViewProps {
  reports: Report[];
  places: Place[];
  pickingLocation: boolean;
  userLocation: { lat: number; lng: number } | null;
  focus: { lat: number; lng: number; zoom?: number } | null;
  dark: boolean;
  onMapClick: (lat: number, lng: number) => void;
  onReportClick: (id: string) => void;
}

function ClickHandler({
  onMapClick,
  pickingLocation,
}: {
  onMapClick: (lat: number, lng: number) => void;
  pickingLocation: boolean;
}) {
  useMapEvents({
    click: (e) => {
      if (pickingLocation) onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function FlyTo({ focus }: { focus: MapViewProps["focus"] }) {
  const map = useMap();
  useEffect(() => {
    if (focus) {
      map.flyTo([focus.lat, focus.lng], focus.zoom ?? 15, {
        duration: 0.9,
      });
    }
  }, [focus, map]);
  return null;
}

function CursorMode({ picking }: { picking: boolean }) {
  const map = useMap();
  useEffect(() => {
    const el = map.getContainer();
    if (picking) el.classList.add("picking-location");
    else el.classList.remove("picking-location");
    return () => el.classList.remove("picking-location");
  }, [picking, map]);
  return null;
}

export default function MapView({
  reports,
  places,
  pickingLocation,
  userLocation,
  focus,
  dark,
  onMapClick,
  onReportClick,
}: MapViewProps) {
  useEffect(() => {
    // @ts-expect-error - leaflet internal default-icon URL hack
    delete L.Icon.Default.prototype._getIconUrl;
  }, []);

  const reportIcons = useMemo(
    () =>
      reports.map((r) => ({
        report: r,
        icon: makeReportIcon(r.species, r.urgency),
      })),
    [reports]
  );

  const tileUrl = dark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

  const tileAttribution = dark
    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · &copy; <a href="https://carto.com/attributions">CARTO</a>'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> katkıda bulunanları';

  return (
    <MapContainer
      center={GOKCEADA_CENTER}
      zoom={DEFAULT_ZOOM}
      scrollWheelZoom
      zoomControl={false}
      className="h-full w-full"
    >
      <TileLayer
        key={dark ? "dark" : "light"}
        attribution={tileAttribution}
        url={tileUrl}
        subdomains={dark ? ["a", "b", "c", "d"] : ["a", "b", "c"]}
      />
      <ZoomControl position="bottomright" />
      <ClickHandler onMapClick={onMapClick} pickingLocation={pickingLocation} />
      <CursorMode picking={pickingLocation} />
      <FlyTo focus={focus} />

      {places.map((place) => {
        const icon = makePlaceIcon(place.type);
        const links = mapsLink(place.lat, place.lng, place.name);
        const km = userLocation ? haversineKm(userLocation, place) : null;
        return (
          <Marker
            key={place.id}
            position={[place.lat, place.lng]}
            icon={icon}
            title={place.name}
          >
            <Popup
              maxWidth={320}
              minWidth={260}
              className="pati-popup"
              autoPan
            >
              <div className="pati-popup-body w-[260px]">
                <div className="flex items-center gap-2">
                  <span className="text-2xl leading-none">
                    {PLACE_TYPE_EMOJI[place.type]}
                  </span>
                  <div className="min-w-0">
                    <div className="text-base font-bold text-emerald-900 dark:text-emerald-50">
                      {place.name}
                    </div>
                    <div className="text-xs font-medium text-emerald-700/70 dark:text-emerald-300/70">
                      {PLACE_TYPE_LABEL[place.type]}
                    </div>
                  </div>
                </div>

                {place.address && (
                  <div className="mt-2 text-sm text-stone-700 dark:text-emerald-200/90">
                    📍 {place.address}
                  </div>
                )}

                {place.phone && (
                  <a
                    href={`tel:${place.phone}`}
                    className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-200"
                  >
                    📞 {place.phone}
                  </a>
                )}

                {place.note && (
                  <div className="mt-1 text-xs italic text-stone-600 dark:text-emerald-300/80">
                    {place.note}
                  </div>
                )}

                {km !== null && (
                  <div className="mt-2 inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100">
                    {formatDistance(km)} uzaklıkta
                  </div>
                )}

                <div className="mt-3 flex gap-2">
                  <a
                    href={links.google}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex-1 whitespace-nowrap rounded-lg bg-emerald-600 px-2 py-2 text-center text-xs font-semibold text-white hover:bg-emerald-700"
                  >
                    🗺️ Google
                  </a>
                  <a
                    href={links.apple}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex-1 whitespace-nowrap rounded-lg bg-stone-200 px-2 py-2 text-center text-xs font-semibold text-stone-800 hover:bg-stone-300 dark:bg-emerald-900 dark:text-emerald-100 dark:hover:bg-emerald-800"
                  >
                    🍎 Apple
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}

      {reportIcons.map(({ report, icon }) => (
        <Marker
          key={report.id}
          position={[report.lat, report.lng]}
          icon={icon}
          eventHandlers={{
            click: () => onReportClick(report.id),
          }}
        />
      ))}

      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={makeUserIcon()}
          title="Konumunuz"
        />
      )}
    </MapContainer>
  );
}
