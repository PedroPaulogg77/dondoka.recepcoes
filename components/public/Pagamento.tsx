"use client";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { TextoFormatado } from "./TextoFormatado";
import { IconCard, IconCalendar } from "@/components/ui/Icons";

type Topico = { titulo: string; corpo: string; icon: "card" | "calendar" };

function parseTopicos(texto: string): Topico[] {
  const blocos = texto
    .split(/\n\s*\n/) // separa por linha em branco
    .map((b) => b.trim())
    .filter(Boolean);

  if (blocos.length === 0) return [];

  // Heurística simples: o primeiro bloco é "Formas de pagamento", o segundo é "Reserva da data"
  return blocos.map((bloco, idx) => {
    const lower = bloco.toLowerCase();
    let titulo: string;
    let icon: "card" | "calendar";
    if (lower.includes("reserv") || lower.includes("quitad") || lower.includes("antes do evento")) {
      titulo = "Reserva e parcelamento";
      icon = "calendar";
    } else if (idx === 0) {
      titulo = "Formas de pagamento";
      icon = "card";
    } else {
      titulo = "Mais detalhes";
      icon = "card";
    }
    return { titulo, corpo: bloco, icon };
  });
}

export function Pagamento({ texto }: { texto: string | null }) {
  if (!texto) return null;
  const topicos = parseTopicos(texto);
  if (topicos.length === 0) return null;

  return (
    <section id="pagamento" className="py-20 md:py-28 px-6 bg-areia/25">
      <div className="max-w-4xl mx-auto">
        <SectionTitle eyebrow="Condições" title="Forma de pagamento" />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {topicos.map((t, i) => {
            const Icon = t.icon === "calendar" ? IconCalendar : IconCard;
            return (
              <Reveal key={i} delay={i * 0.1}>
                <div className="h-full flex gap-4 md:gap-5">
                  <span className="w-11 h-11 rounded-full bg-oliva/10 text-oliva flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </span>
                  <div className="flex-1 border-l-2 border-oliva/40 pl-5 pb-1">
                    <h3 className="font-serif text-lg text-carvao">{t.titulo}</h3>
                    <TextoFormatado
                      texto={t.corpo}
                      className="mt-2 text-carvao/75 leading-relaxed text-sm md:text-base space-y-1.5"
                    />
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
