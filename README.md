# patipati

Gökçeada'daki sokak hayvanlarının açlık, sağlık ve barınak durumunu paylaşmaya
yarayan, askıda mama bağışı modeli içeren topluluk haritası.

**Fikir sahibi:** Meryem Bakirci

## Teknoloji

- **Next.js 14** (App Router) + **TypeScript**
- **React 18** + **Tailwind CSS**
- **Leaflet** + **react-leaflet** + OpenStreetMap (light) / CARTO Dark (dark)
- **lucide-react** ikonları
- Veri kalıcılığı: tarayıcı **LocalStorage** (`gokceada-reports-v1`,
  `gokceada-pledges-v1`, `gokceada-theme`) — backend yoktur.

## Kurulum

```bash
# 1. Bağımlılıkları kur (Node 18+ gerekir; Node 20 önerilir)
npm install

# 2. Geliştirme sunucusu (otomatik yeniden yükleme)
npm run dev
# http://localhost:3000

# 3. Üretim build'i
npm run build

# 4. Üretim sunucusu
npm start
# Varsayılan port 3000. Farklı port için:
PORT=9090 npm start
```

## Üretim Yayını (öneri)

Sunucuda `node 20+` ve istersen `pm2` kurulu olsun.

```bash
# Kaynakları yerleştir, ardından:
npm ci
npm run build

# pm2 ile süreç olarak çalıştır:
pm2 start npm --name patipati -- start -- --port 9090
pm2 save
```

Reverse-proxy (nginx) ile bir subdomain'e (örn. `pati.gokceada.bel.tr`)
yönlendirmek istersen:

```nginx
server {
  server_name pati.gokceada.bel.tr;
  location / {
    proxy_pass http://127.0.0.1:9090;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

## Proje Yapısı

```
app/
  layout.tsx          # HTML kabuğu, metadata, tema pre-hydration script
  page.tsx            # Ana sayfa (harita + paneller + state orkestrasyonu)
  globals.css         # Tailwind + Leaflet + marker/popup stilleri
  icon.svg            # Tarayıcı simgesi (favicon)
components/
  MapView.tsx         # Leaflet haritası, marker'lar, popup'lar
  Brand.tsx           # patipati logosu + adı
  AboutModal.tsx      # Hakkında modalı
  FilterBar.tsx       # Tür + aciliyet filtresi
  ReportForm.tsx      # Yeni / düzenle bildirim formu
  ReportDetail.tsx    # Marker'a tıklayınca açılan detay paneli
  FoodNeedsPanel.tsx  # Askıda Mama özet + bildirim başına ihtiyaç
  PledgeForm.tsx      # Mama bağışı (söz verme) formu
  NearbyPlaces.tsx    # En yakın veteriner / mama / barınak listesi
  LocateMeButton.tsx  # Tarayıcı geolocation
  DarkModeToggle.tsx  # Tema değiştirici
lib/
  types.ts            # TypeScript tipleri + ortak etiketler
  species.ts          # Tür → emoji eşlemesi (Leaflet'siz)
  icons.ts            # Leaflet DivIcon üreticileri
  storage.ts          # Bildirim LocalStorage CRUD + aciliyet hesabı
  pledges.ts          # Bağış LocalStorage CRUD + toplam/günlük/haftalık
  food.ts             # Tür+adet+açlıktan günlük kg ihtiyaç
  distance.ts         # Haversine + format
  places.ts           # Gökçeada yer noktaları (veteriner/mama/barınak)
  maps.ts             # Google/Apple Maps yön tarifi URL'leri
```

## Notlar

- Uygulama backend gerektirmez. Tüm veriler yalnızca kullanıcının tarayıcısında
  tutulur. Topluluk veri paylaşımı için Supabase / Firebase / kendi Postgres
  bağlamak ileride entegre edilebilir (`lib/storage.ts` ve `lib/pledges.ts`
  modüllerini değiştirip senkron işlevlere çevirmek yeterli).
- `lib/places.ts` içindeki veteriner / mama / barınak noktaları gerçek
  koordinatlara yakın **demo** değerlerdir. Üretim öncesi doğrulanmış
  adreslerle güncellenmelidir.
- Açılışta veri yoktur; ilk bildirimi kullanıcı oluşturur.
