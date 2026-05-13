"use client";

type Props = {
  label: string;
  visivel: boolean;
  onToggle?: () => void;
  onEdit?: () => void;
};

export function SectionChip({ label, visivel, onToggle, onEdit }: Props) {
  return (
    <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between gap-2 pointer-events-none">
      {/* Toggle de visibilidade OU label estático (sem toggle quando seção é fixa, ex: Hero) */}
      {onToggle ? (
        <button
          type="button"
          onClick={onToggle}
          title={visivel ? "Ocultar do cliente" : "Mostrar pro cliente"}
          className={`pointer-events-auto inline-flex items-center gap-1.5 px-3 h-8 rounded-full backdrop-blur border text-xs transition ${
            visivel
              ? "bg-white/90 border-oliva/40 text-oliva"
              : "bg-carvao/70 border-carvao/40 text-white"
          }`}
        >
          {visivel ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
              <path d="M1 1l22 22" />
            </svg>
          )}
          <span className="font-medium tracking-wide">{visivel ? label : `${label} · oculta`}</span>
        </button>
      ) : (
        <span className="pointer-events-none inline-flex items-center gap-1.5 px-3 h-8 rounded-full backdrop-blur border bg-white/90 border-areia/60 text-bronze text-xs">
          <span className="font-medium tracking-wide">{label}</span>
        </span>
      )}

      {/* Editar */}
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          aria-label={`Editar ${label}`}
          className="pointer-events-auto w-10 h-10 inline-flex items-center justify-center rounded-full bg-white text-oliva shadow-soft hover:bg-creme hover:scale-105 active:scale-95 transition"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
          </svg>
        </button>
      )}
    </div>
  );
}
