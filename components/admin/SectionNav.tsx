"use client";
import { useState } from "react";

const SECTIONS = [
  { key: "top", label: "Capa", anchor: "" },
  { key: "sobre", label: "Sobre", anchor: "sobre" },
  { key: "galeria", label: "Galeria", anchor: "galeria" },
  { key: "decoracao", label: "Decoração", anchor: "decoracao" },
  { key: "buffet", label: "Buffet", anchor: "buffet" },
  { key: "servicos", label: "Serviços", anchor: "servicos" },
  { key: "dados", label: "Dados", anchor: "dados" },
  { key: "investimento", label: "Investimento", anchor: "investimento" },
  { key: "pagamento", label: "Pagamento", anchor: "pagamento" },
  { key: "contato", label: "Contato", anchor: "contato" },
];

export function SectionNav() {
  const [hovered, setHovered] = useState<string | null>(null);

  function scrollTo(anchor: string) {
    if (!anchor) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <nav
      className="fixed right-3 top-1/2 -translate-y-1/2 z-50 hidden md:flex bg-white/90 backdrop-blur rounded-full shadow-soft border border-areia/40 py-3 px-1.5 flex-col gap-2"
      aria-label="Navegação rápida entre seções"
    >
      {SECTIONS.map((s) => (
        <div key={s.key} className="relative flex items-center justify-center">
          {hovered === s.key && (
            <span className="absolute right-full mr-2 bg-carvao text-white text-[11px] rounded-lg px-2 py-1 whitespace-nowrap pointer-events-none">
              {s.label}
            </span>
          )}
          <button
            type="button"
            onClick={() => scrollTo(s.anchor)}
            onMouseEnter={() => setHovered(s.key)}
            onMouseLeave={() => setHovered(null)}
            className="w-2.5 h-2.5 rounded-full bg-areia/60 hover:bg-oliva hover:scale-150 transition-all cursor-pointer"
            aria-label={s.label}
          />
        </div>
      ))}
    </nav>
  );
}
