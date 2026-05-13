"use client";
import { useEffect, useState } from "react";

type Props = {
  label: string;
  visivel: boolean;
  onToggle?: () => void;
  onEdit?: () => void;
};

export function SectionChip({ label, visivel, onToggle, onEdit }: Props) {
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    if (!onEdit) return;
    const used = localStorage.getItem("dondoka-editor-used");
    if (!used) {
      setShowPulse(true);
      const timer = setTimeout(() => setShowPulse(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [onEdit]);
  return (
    <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between gap-2 pointer-events-none">
      {/* Toggle de visibilidade OU label estático (sem toggle quando seção é fixa, ex: Hero) */}
      {onToggle ? (
        <button
          type="button"
          onClick={onToggle}
          title={visivel ? "Ocultar do cliente" : "Mostrar pro cliente"}
          className={`pointer-events-auto inline-flex items-center gap-1.5 px-2.5 h-7 rounded-full backdrop-blur border text-[11px] transition shadow-soft ${
            visivel
              ? "bg-white/95 border-oliva/30 text-oliva"
              : "bg-carvao/75 border-carvao/40 text-white"
          }`}
        >
          {visivel ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
              <path d="M1 1l22 22" />
            </svg>
          )}
          <span className="font-medium tracking-wide whitespace-nowrap">
            {visivel ? label : `${label} · oculta`}
          </span>
        </button>
      ) : (
        <span className="pointer-events-none inline-flex items-center gap-1.5 px-2.5 h-7 rounded-full backdrop-blur border bg-white/95 border-areia/60 text-bronze text-[11px] shadow-soft">
          <span className="font-medium tracking-wide whitespace-nowrap">{label}</span>
        </span>
      )}

      {/* Editar */}
      {onEdit && (
        <button
          type="button"
          onClick={() => {
            localStorage.setItem("dondoka-editor-used", "1");
            setShowPulse(false);
            onEdit();
          }}
          aria-label={`Editar ${label}`}
          className="pointer-events-auto relative w-9 h-9 inline-flex items-center justify-center rounded-full bg-white text-oliva shadow-soft hover:bg-creme hover:scale-105 active:scale-95 transition border border-areia/40"
        >
          {showPulse && (
            <span className="absolute inset-0 rounded-full border-2 border-oliva animate-ping opacity-30" aria-hidden />
          )}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
          </svg>
        </button>
      )}
    </div>
  );
}
