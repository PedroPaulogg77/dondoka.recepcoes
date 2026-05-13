"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
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

function CategoryRow({ categoria }: { categoria: Categoria }) {
  const [open, setOpen] = useState(false);

  // Auto-abre quando o navegador inicia print → garante PDF com tudo visível
  useEffect(() => {
    function forceOpen() {
      setOpen(true);
    }
    window.addEventListener("beforeprint", forceOpen);
    window.addEventListener("prepare-print", forceOpen);
    return () => {
      window.removeEventListener("beforeprint", forceOpen);
      window.removeEventListener("prepare-print", forceOpen);
    };
  }, []);

  if (!categoria.itens.length) return null;
  const total = subtotal(categoria.itens);

  return (
    <Reveal>
      <div className="border-b border-areia/60">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full py-5 px-1 flex justify-between items-baseline gap-4 hover:bg-areia/10 transition rounded-md group"
        >
          <span className="flex items-center gap-3">
            <span
              className={`text-oliva transition-transform ${open ? "rotate-90" : ""}`}
              aria-hidden
            >
              ▸
            </span>
            <span className="font-serif text-lg md:text-xl text-carvao text-left">
              {categoria.titulo}
            </span>
            <span className="text-xs text-carvao/45 hidden md:inline">
              {categoria.itens.length} {categoria.itens.length === 1 ? "item" : "itens"}
            </span>
          </span>
          <span className="font-serif text-bronze tabular-nums whitespace-nowrap">
            {brl(total)}
          </span>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden cat-items"
            >
              <div className="pb-4 pl-7 md:pl-9 pr-1 space-y-2">
                {categoria.itens.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-baseline gap-4 py-1.5 border-b border-areia/30 last:border-b-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-carvao/85">{item.descricao}</p>
                      {item.qtd > 1 && (
                        <p className="text-[11px] text-carvao/50 mt-0.5">
                          {item.qtd} × {brl(item.valor_unitario)}
                        </p>
                      )}
                    </div>
                    <span className="text-sm font-medium text-carvao tabular-nums whitespace-nowrap">
                      {brl(item.qtd * item.valor_unitario)}
                    </span>
                  </li>
                ))}
              </div>
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </Reveal>
  );
}

function TotalCounter({ total }: { total: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState(0);

  // Print: snap pro valor final
  useEffect(() => {
    function snap() {
      setDisplay(total);
    }
    window.addEventListener("beforeprint", snap);
    window.addEventListener("prepare-print", snap);
    return () => {
      window.removeEventListener("beforeprint", snap);
      window.removeEventListener("prepare-print", snap);
    };
  }, [total]);

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
      <div className="max-w-3xl mx-auto">
        <SectionTitle eyebrow="Investimento" title="Resumo da proposta" />

        <p className="mt-6 text-center text-sm text-carvao/55 max-w-md mx-auto">
          Toque em cada categoria para ver os itens inclusos.
        </p>

        <div className="mt-10 border-t border-areia/60">
          <CategoryRow categoria={{ titulo: "Espaço", itens: espaco }} />
          <CategoryRow categoria={{ titulo: "Decoração", itens: decoracao }} />
          <CategoryRow categoria={{ titulo: "Buffet", itens: buffet }} />
        </div>

        <Reveal>
          <div className="mt-12 relative overflow-hidden rounded-2xl bg-oliva p-8 md:p-12 shadow-premium">
            <div className="absolute inset-0 pattern-claro opacity-10" aria-hidden />
            <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <div className="eyebrow text-white/80">Valor total</div>
                <p className="mt-2 text-white/90 text-sm max-w-xs">
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
