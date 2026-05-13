"use client";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { dataExtenso } from "@/lib/format";
import { IconUser, IconGift, IconCalendar, IconClock, IconUsers } from "@/components/ui/Icons";
import type { Orcamento } from "@/types/orcamento";
import type { ReactNode } from "react";

export function DadosEvento({ orcamento }: { orcamento: Orcamento }) {
  const rows: { label: string; value: string | null; icon: (p?: { className?: string }) => ReactNode }[] = [
    { label: "Cliente", value: orcamento.cliente_nome, icon: IconUser },
    { label: "Tipo de evento", value: orcamento.cliente_evento, icon: IconGift },
    {
      label: "Data",
      value: orcamento.cliente_data ? dataExtenso(orcamento.cliente_data) : null,
      icon: IconCalendar,
    },
    { label: "Horário", value: orcamento.cliente_horario, icon: IconClock },
    {
      label: "Convidados",
      value: orcamento.cliente_convidados ? `${orcamento.cliente_convidados} pessoas` : null,
      icon: IconUsers,
    },
  ].filter((r) => r.value) as typeof rows;

  if (!rows.length) return null;

  return (
    <section id="dados" className="py-20 md:py-28 px-6 bg-areia/25">
      <div className="max-w-4xl mx-auto">
        <SectionTitle eyebrow="Detalhes" title="Dados do evento" />

        <Reveal delay={0.1}>
          <div className="mt-12 max-w-2xl mx-auto">
            {rows.map((row, i) => {
              const Icon = row.icon;
              return (
                <div
                  key={row.label}
                  className={`flex items-center gap-5 px-2 py-5 ${
                    i < rows.length - 1 ? "border-b border-areia/50" : ""
                  }`}
                >
                  <span className="w-10 h-10 rounded-full bg-oliva/10 text-oliva flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </span>
                  <div className="flex-1 flex flex-col md:flex-row md:items-baseline md:justify-between gap-0.5 md:gap-4">
                    <span className="eyebrow text-bronze">{row.label}</span>
                    <span className="font-serif text-lg md:text-xl text-carvao">{row.value}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
