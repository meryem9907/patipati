import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "patipati — Gökçeada Sokak Hayvanları Haritası",
  description:
    "patipati: Gökçeada'daki sokak hayvanlarının açlık, sağlık ve barınak durumunu paylaşan, askıda mama bağışına izin veren topluluk haritası. Fikir sahibi: Meryem Bakirci.",
  authors: [{ name: "Meryem Bakirci" }],
  creator: "Meryem Bakirci",
};

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const themeScript = `
(function() {
  try {
    var t = localStorage.getItem('gokceada-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (t === 'dark' || (!t && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
