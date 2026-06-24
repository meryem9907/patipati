/** Cihaz/platforma uygun harita uygulamasını açan derin link */
export function mapsLink(
  lat: number,
  lng: number,
  label?: string
): { google: string; apple: string } {
  const q = `${lat},${lng}`;
  const google = `https://www.google.com/maps/dir/?api=1&destination=${q}${
    label ? `&destination_place_id=${encodeURIComponent(label)}` : ""
  }`;
  const apple = `https://maps.apple.com/?daddr=${q}&dirflg=d`;
  return { google, apple };
}

export function isAppleDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent);
}
