"use client";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { dataExtenso } from "@/lib/format";
import type { Orcamento } from "@/types/orcamento";

export function DadosEvento({ orcamento }: { orcamento: Orcamento }) {
  const rows = [
    { label: "Cliente", value: orcamento.cliente_nome },
    { label: "Tipo de evento", value: orcamento.cliente_evento },
    { label: "Data", value: orcamento.cliente_data ? dataExtenso(orcamento.cliente_data) : null },
    { label: "Horário", value: orcamento.cliente_horario },
    {
      label: "Convidados",
      value: orcamento.cliente_convidados ? `${orcamento.cliente_convidados} pessoas` : null,
    },
  ].filter((r) => r.value);

  if (!rows.length) return null;

  return (
    <section id="dados" className="py-20 md:py-28 px-6 bg-areia/25">
      <div className="max-w-4xl mx-auto">
        <SectionTitle eyebrow="Detalhes" title="Dados do evento" />

        <Reveal delay={0.1}>
          <div className="mt-12 bg-white rounded-2xl border border-areia/60 shadow-soft overflow-hidden">
            {rows.map((row, i) => (
              <div
                key={row.label}
                className={`flex flex-col md:flex-row md:items-center justify-between gap-1 md:gap-4 px-6 md:px-10 py-5 ${
                  i < rows.length - 1 ? "border-b border-areia/50" : ""
                }`}
              >
                <span className="eyebrow text-bronze">{row.label}</span>
                <span className="font-serif text-lg md:text-xl text-carvao">{row.value}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
