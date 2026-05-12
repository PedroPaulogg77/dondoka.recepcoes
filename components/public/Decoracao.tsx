"use client";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import type { ItemOrcamento } from "@/types/orcamento";

type Props = {
  texto: string | null;
  itens: ItemOrcamento[];
};

export function Decoracao({ texto, itens }: Props) {
  return (
    <section id="decoracao" className="py-20 md:py-28 px-6 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <SectionTitle eyebrow="Decoração" title="Cada detalhe pensado para você" />

        {texto && (
          <Reveal delay={0.1}>
            <p className="mt-10 max-w-2xl mx-auto text-center text-carvao/75 whitespace-pre-line">
              {texto}
            </p>
          </Reveal>
        )}

        {itens.length > 0 && (
          <Reveal delay={0.2}>
            <div className="mt-12 bg-white rounded-2xl border border-areia/60 shadow-soft p-8 md:p-10">
              <div className="eyebrow text-center mb-6">O que está incluso</div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {itens.map((item) => (
                  <li key={item.id} className="flex items-start gap-3 text-carvao/80">
                    <span className="text-oliva mt-1.5 text-xs">◆</span>
                    <span>
                      {item.descricao}
                      {item.qtd > 1 && <span className="text-carvao/50"> · {item.qtd}x</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
