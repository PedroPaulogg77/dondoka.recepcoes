"use client";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";

const ICONS = {
  capacidade: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  climatizado: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M2 12h20M12 2v20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" />
    </svg>
  ),
  banheiros: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M9 6V3M15 6V3M3 11h18M5 11v9a1 1 0 001 1h12a1 1 0 001-1v-9" />
    </svg>
  ),
  cozinha: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M3 11h18l-1.5 9h-15zM5 11V7a3 3 0 016 0M13 11V7a3 3 0 016 0" />
    </svg>
  ),
  kids: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <circle cx="12" cy="6" r="3" />
      <path d="M12 9v6M9 13l-3 5M15 13l3 5M9 21h6" />
    </svg>
  ),
};

const FEATURES = [
  { icon: ICONS.capacidade, titulo: "Até 70 pessoas", descricao: "Capacidade confortável para eventos sociais e corporativos." },
  { icon: ICONS.climatizado, titulo: "Climatizado", descricao: "Ambiente totalmente climatizado, em qualquer estação." },
  { icon: ICONS.banheiros, titulo: "3 banheiros", descricao: "Sendo um com acessibilidade e fraldário." },
  { icon: ICONS.cozinha, titulo: "Cozinha equipada", descricao: "Estrutura completa para buffet e produção do evento." },
  { icon: ICONS.kids, titulo: "Espaço kids", descricao: "Área dedicada para as crianças aproveitarem com segurança." },
];

export function SobreEspaco({ texto }: { texto: string | null }) {
  return (
    <section id="sobre" className="py-20 md:py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionTitle eyebrow="O espaço" title="Sobre o ambiente" />

        {texto && (
          <Reveal delay={0.1}>
            <p className="mt-10 max-w-2xl mx-auto text-center text-carvao/75 whitespace-pre-line">
              {texto.split("\n").slice(0, 1).join("")}
            </p>
          </Reveal>
        )}

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <Reveal key={f.titulo} delay={i * 0.08}>
              <div className="group h-full bg-white border border-areia/60 rounded-2xl p-7 shadow-soft hover:shadow-premium transition-all hover:-translate-y-1">
                <div className="w-12 h-12 rounded-full bg-areia/40 text-oliva flex items-center justify-center group-hover:bg-oliva group-hover:text-white transition">
                  {f.icon}
                </div>
                <h3 className="mt-5 text-xl">{f.titulo}</h3>
                <p className="mt-2 text-sm text-carvao/65">{f.descricao}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
