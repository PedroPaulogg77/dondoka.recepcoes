"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { brl } from "@/lib/format";
import type { ItemOrcamento } from "@/types/orcamento";

type Categoria = {
  titulo: string;
  itens: ItemOrcamento[];
};

function subtotal(itens: ItemOrcamento[]) {
  return itens.reduce((acc, i) => acc + (i.qtd || 0) * (i.valor_unitario || 0), 0);
}

function CategoryBlock({ categoria }: { categoria: Categoria }) {
  if (!categoria.itens.length) return null;
  const total = subtotal(categoria.itens);
  return (
    <Reveal>
      <div>
        <div className="flex justify-between items-baseline px-1 pb-3 border-b border-areia/60">
          <h3 className="font-serif text-lg md:text-xl text-carvao">{categoria.titulo}</h3>
          <span className="font-serif text-bronze tabular-nums">{brl(total)}</span>
        </div>
        <ul>
          {categoria.itens.map((item) => (
            <li
              key={item.id}
              className="px-1 py-4 flex justify-between items-baseline gap-4 border-b border-areia/40 last:border-b-0"
            >
              <div className="flex-1 min-w-0">
                <p className="text-carvao/85">{item.descricao}</p>
                {item.qtd > 1 && (
                  <p className="text-xs text-carvao/50 mt-0.5">
                    {item.qtd} × {brl(item.valor_unitario)}
                  </p>
                )}
              </div>
              <span className="font-medium text-carvao tabular-nums whitespace-nowrap">
                {brl(item.qtd * item.valor_unitario)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

function TotalCounter({ total }: { total: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const start = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(total * eased);
      if (p < 1) frame = requestAnimationFrame(tick);
      else setDisplay(total);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, total]);

  return (
    <span ref={ref} className="tabular-nums">
      {brl(display)}
    </span>
  );
}

export function Investimento({
  espaco,
  decoracao,
  buffet,
}: {
  espaco: ItemOrcamento[];
  decoracao: ItemOrcamento[];
  buffet: ItemOrcamento[];
}) {
  const total = subtotal(espaco) + subtotal(decoracao) + subtotal(buffet);
  if (total === 0 && !espaco.length && !decoracao.length && !buffet.length) return null;

  return (
    <section id="investimento" className="py-20 md:py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <SectionTitle eyebrow="Investimento" title="Resumo da proposta" />

        <div className="mt-12 space-y-12">
          <CategoryBlock categoria={{ titulo: "Espaço", itens: espaco }} />
          <CategoryBlock categoria={{ titulo: "Decoração", itens: decoracao }} />
          <CategoryBlock categoria={{ titulo: "Buffet", itens: buffet }} />
        </div>

        <Reveal>
          <div className="mt-12 relative overflow-hidden rounded-2xl bg-oliva text-white p-8 md:p-12 shadow-premium">
            <div className="absolute inset-0 pattern-claro opacity-10" aria-hidden />
            <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <div className="eyebrow text-white/70">Valor total</div>
                <p className="mt-2 text-white/75 text-sm max-w-xs">
                  Investimento completo para sua celebração no espaço Dondoka.
                </p>
              </div>
              <motion.div
                className="text-4xl md:text-5xl font-serif text-white"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <TotalCounter total={total} />
              </motion.div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
