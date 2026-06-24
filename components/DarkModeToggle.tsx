"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const KEY = "gokceada-theme";

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
    setReady(true);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    if (next) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    try {
      localStorage.setItem(KEY, next ? "dark" : "light");
    } catch {}
    window.dispatchEvent(new CustomEvent("theme-change", { detail: next }));
  };

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Açık moda geç" : "Karanlık moda geç"}
      title={dark ? "Açık mod" : "Karanlık mod"}
      className="inline-flex items-center justify-center rounded-xl bg-white p-2.5 text-emerald-700 shadow-sm transition hover:bg-emerald-50 dark:bg-emerald-900/60 dark:text-amber-300 dark:hover:bg-emerald-900"
    >
      {!ready ? <Sun size={18} /> : dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
