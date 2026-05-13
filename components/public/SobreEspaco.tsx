"use client";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { IconCapacidade, IconClimatizado, IconBanheiros, IconCozinha, IconKids } from "@/components/ui/Icons";

const FEATURES = [
  { icon: <IconCapacidade className="w-6 h-6" />, titulo: "Até 70 pessoas", descricao: "Capacidade confortável para eventos sociais e corporativos." },
  { icon: <IconClimatizado className="w-6 h-6" />, titulo: "Climatizado", descricao: "Ambiente totalmente climatizado, em qualquer estação." },
  { icon: <IconBanheiros className="w-6 h-6" />, titulo: "3 banheiros", descricao: "Sendo um com acessibilidade e fraldário." },
  { icon: <IconCozinha className="w-6 h-6" />, titulo: "Cozinha equipada", descricao: "Estrutura completa para buffet e produção do evento." },
  { icon: <IconKids className="w-6 h-6" />, titulo: "Espaço kids", descricao: "Área dedicada para as crianças aproveitarem com segurança." },
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
