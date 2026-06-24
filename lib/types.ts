export type Species =
  | "kedi"
  | "kopek"
  | "keci"
  | "esek"
  | "koyun"
  | "kus"
  | "diger";

export type HealthStatus =
  | "saglikli"
  | "hafif-yarali"
  | "agir-yarali"
  | "hasta"
  | "bilinmiyor";

export type ShelterStatus = "yok" | "yikik" | "yetersiz" | "saglam";

export type Urgency = "dusuk" | "orta" | "yuksek" | "acil";

export type HungerLevel = 1 | 2 | 3 | 4 | 5;

export interface Report {
  id: string;
  lat: number;
  lng: number;
  species: Species;
  count: number;
  hungerLevel: HungerLevel;
  health: HealthStatus;
  hasWater: boolean;
  foodBowlCount: number;
  shelter: ShelterStatus;
  notes?: string;
  urgency: Urgency;
  createdAt: number;
}

export interface Pledge {
  id: string;
  reportId: string;
  volunteerName?: string;
  amountKg: number;
  note?: string;
  createdAt: number;
}

export interface Place {
  id: string;
  name: string;
  type: "veteriner" | "mama" | "barinak";
  lat: number;
  lng: number;
  phone?: string;
  address?: string;
  note?: string;
}

export const SPECIES_LABEL: Record<Species, string> = {
  kedi: "Kedi",
  kopek: "Köpek",
  keci: "Keçi",
  esek: "Eşek",
  koyun: "Koyun",
  kus: "Kuş",
  diger: "Diğer",
};

export const HEALTH_LABEL: Record<HealthStatus, string> = {
  saglikli: "Sağlıklı",
  "hafif-yarali": "Hafif yaralı",
  "agir-yarali": "Ağır yaralı",
  hasta: "Hasta",
  bilinmiyor: "Bilinmiyor",
};

export const SHELTER_LABEL: Record<ShelterStatus, string> = {
  yok: "Barınak yok",
  yikik: "Yıkık / hasarlı",
  yetersiz: "Yetersiz",
  saglam: "Sağlam",
};

export const URGENCY_LABEL: Record<Urgency, string> = {
  dusuk: "Düşük",
  orta: "Orta",
  yuksek: "Yüksek",
  acil: "Acil",
};

export const HUNGER_LABEL: Record<HungerLevel, string> = {
  1: "Tok",
  2: "Az aç",
  3: "Aç",
  4: "Çok aç",
  5: "Aşırı aç",
};
