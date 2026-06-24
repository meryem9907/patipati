import type { Place } from "./types";

// NOT: Demo amaçlı yaklaşık koordinatlar. Üretim sürümünde doğrulanmış
// adresler ve telefon numaralarıyla güncellenmelidir.
export const PLACES: Place[] = [
  {
    id: "vet-belediye",
    name: "Gökçeada Belediyesi Veteriner Hizmetleri",
    type: "veteriner",
    lat: 40.1925,
    lng: 25.9075,
    address: "Merkez Mahallesi, Gökçeada",
    note: "Belediyeye bağlı veteriner birimi (demo verisi)",
  },
  {
    id: "vet-tarim",
    name: "İlçe Tarım ve Orman Müdürlüğü Veteriner",
    type: "veteriner",
    lat: 40.1948,
    lng: 25.9112,
    address: "Merkez, Gökçeada",
    note: "Resmi veteriner hekim (demo verisi)",
  },
  {
    id: "vet-cinarli",
    name: "Çınarlı Veteriner Noktası",
    type: "veteriner",
    lat: 40.1612,
    lng: 25.7891,
    address: "Çınarlı Köyü, Gökçeada",
    note: "Hafta içi mesai (demo verisi)",
  },
  {
    id: "barinak-belediye",
    name: "Gökçeada Belediyesi Hayvan Bakım Merkezi",
    type: "barinak",
    lat: 40.2031,
    lng: 25.9214,
    address: "Bademli Mah., Gökçeada",
    note: "Geçici bakım ve rehabilitasyon (demo verisi)",
  },
  {
    id: "mama-merkez",
    name: "Merkez Market — Mama Reyonu",
    type: "mama",
    lat: 40.1937,
    lng: 25.9081,
    address: "Atatürk Cad., Merkez",
  },
  {
    id: "mama-bayraktar",
    name: "Bayraktar Köyü Bakkalı",
    type: "mama",
    lat: 40.2148,
    lng: 25.8567,
    address: "Bayraktar Köyü, Gökçeada",
  },
  {
    id: "mama-kalekoy",
    name: "Kaleköy Marketi",
    type: "mama",
    lat: 40.2387,
    lng: 25.9402,
    address: "Kaleköy, Gökçeada",
  },
  {
    id: "mama-sirinkoy",
    name: "Şirinköy Bakkalı",
    type: "mama",
    lat: 40.1856,
    lng: 25.8412,
    address: "Şirinköy, Gökçeada",
  },
];

export const PLACE_TYPE_LABEL: Record<Place["type"], string> = {
  veteriner: "Veteriner",
  mama: "Mama satış noktası",
  barinak: "Barınak",
};

export const PLACE_TYPE_EMOJI: Record<Place["type"], string> = {
  veteriner: "🩺",
  mama: "🥣",
  barinak: "🏠",
};
