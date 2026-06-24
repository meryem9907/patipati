"use client";

import { X, Lightbulb, Heart, MapPin, Sparkles, Github } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AboutModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1100] flex items-end justify-center bg-emerald-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4 dark:bg-black/70"
      onClick={onClose}
    >
      <div
        className="thin-scroll relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl dark:bg-emerald-950 dark:text-emerald-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-amber-100 shadow-soft">
              <Heart size={22} fill="currentColor" />
            </div>
            <div>
              <h2 className="text-2xl font-bold lowercase tracking-tight text-emerald-900 dark:text-emerald-100">
                patipati hakkında
              </h2>
              <p className="text-sm text-emerald-700/70 dark:text-emerald-300/70">
                Gökçeada sokak hayvanları topluluk haritası
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Kapat"
            className="rounded-full p-1.5 text-emerald-700 transition hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-900"
          >
            <X size={22} />
          </button>
        </div>

        {/* Fikir sahibi vurgusu */}
        <div className="mb-4 rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-emerald-50 p-4 dark:border-amber-700/50 dark:from-amber-950/40 dark:to-emerald-900/40">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-800 dark:bg-amber-800/60 dark:text-amber-100">
            <Lightbulb size={13} /> Fikir Sahibi
          </div>
          <div className="text-2xl font-extrabold text-emerald-900 dark:text-emerald-50">
            Meryem Bakirci
          </div>
          <p className="mt-1 text-sm leading-snug text-emerald-800/80 dark:text-emerald-200/80">
            patipati'nin tasarımı, sokak hayvanlarına yönelik gözlem ihtiyacı ve
            askıda mama bağışı modelinin haritaya taşınması fikri Meryem
            Bakirci'ye aittir. Uygulamanın varlığı bu fikrin somutlaştırılmasıdır.
          </p>
        </div>

        {/* Ürün ne yapar? */}
        <section className="mb-4">
          <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-emerald-700/80 dark:text-emerald-300/80">
            <Sparkles size={14} /> patipati ne işe yarar?
          </h3>
          <ul className="space-y-1.5 text-sm leading-relaxed text-emerald-900/90 dark:text-emerald-100/90">
            <li className="flex gap-2">
              <span>🗺️</span>
              <span>
                Gökçeada'da gördüğün sokak hayvanlarını tek tıkla haritaya
                bildir: tür, adet, açlık, sağlık, su, barınak.
              </span>
            </li>
            <li className="flex gap-2">
              <span>🥣</span>
              <span>
                <strong>Askıda Mama</strong>: tıpkı askıda ekmek gibi. Günlük
                ihtiyaca göre gönüllü ol, ne kadar mama bırakacağını söyle.
              </span>
            </li>
            <li className="flex gap-2">
              <span>🩺</span>
              <span>
                En yakın veteriner, mama satış noktası ve barınakları konumuna
                göre listele, Google/Apple Maps ile yol tarifi al.
              </span>
            </li>
            <li className="flex gap-2">
              <span>🐾</span>
              <span>
                Kayıt, şifre, kişisel bilgi yok — herkes anonim olarak
                kullanabilir.
              </span>
            </li>
          </ul>
        </section>

        {/* Yayın notu */}
        <section className="mb-4 rounded-xl bg-emerald-50/60 p-3 dark:bg-emerald-900/40">
          <h3 className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-emerald-800 dark:text-emerald-200">
            <MapPin size={14} /> Yayın
          </h3>
          <p className="text-sm leading-snug text-emerald-800/80 dark:text-emerald-200/80">
            patipati, Gökçeada Belediyesi'nin alt etki alanı (subdomain) altında
            yayımlanmak üzere geliştirilmektedir. Bu sürüm demo amaçlıdır;
            veriler şu anda yalnızca senin tarayıcında tutulur.
          </p>
        </section>

        {/* Teşekkür */}
        <section className="mb-1 text-center text-xs text-emerald-700/70 dark:text-emerald-300/60">
          🐾 Gökçeada'nın sokak hayvanları için topluluk projesi · 2026
        </section>

        <button
          onClick={onClose}
          className="mt-3 w-full rounded-xl bg-emerald-600 py-3 text-base font-semibold text-white shadow-soft transition hover:bg-emerald-700"
        >
          Kapat
        </button>
      </div>
    </div>
  );
}
