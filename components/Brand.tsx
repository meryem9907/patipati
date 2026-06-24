"use client";

interface Props {
  compact?: boolean;
}

export default function Brand({ compact }: Props) {
  return (
    <div className="flex items-center gap-2">
      <PawLogo />
      <div className="leading-none">
        <div className="font-extrabold lowercase tracking-tight text-emerald-900 dark:text-emerald-50 text-xl sm:text-2xl">
          patipati
        </div>
        {!compact && (
          <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-emerald-700/70 dark:text-emerald-300/70 hidden sm:block">
            Gökçeada Sokak Hayvanları
          </div>
        )}
      </div>
    </div>
  );
}

function PawLogo() {
  return (
    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-soft sm:h-11 sm:w-11">
      <svg viewBox="0 0 32 32" className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden="true">
        <g fill="#fef3c7">
          <ellipse cx="10.5" cy="11" rx="2" ry="2.5" />
          <ellipse cx="15" cy="9" rx="2" ry="2.5" />
          <ellipse cx="19.5" cy="11" rx="2" ry="2.5" />
          <ellipse cx="23" cy="14.5" rx="2" ry="2.5" />
          <ellipse cx="15" cy="20" rx="5.5" ry="4.5" />
        </g>
      </svg>
      <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[9px] text-emerald-900 shadow-sm">
        ♥
      </span>
    </div>
  );
}
