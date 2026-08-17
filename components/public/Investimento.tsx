"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { brl } from "@/lib/format";
import type { ItemOrcamento, PrecosEspacoPorDia } from "@/types/orcamento";
import { temFaixasAtivas } from "@/lib/orcamento-helpers";
import { contarInclusos, temInclusos } from "@/lib/kits";
import { EspacoFaixas } from "./EspacoFaixas";

type Categoria = {
  titulo: string;
  itens: ItemOrcamento[];
};

function subtotal(itens: ItemOrcamento[]) {
  return itens.reduce((acc, i) => acc + (i.qtd || 0) * (i.valor_unitario || 0), 0);
}

function CategoryRow({ categoria }: { categoria: Categoria }) {
  /**
   * Categoria com kit já nasce aberta.
   *
   * O kit tem a própria lista para expandir, e com a categoria fechada por
   * cima seriam dois cliques até o cardápio. O que interessa esconder é a
   * lista de comida, não a linha do pacote.
   */
  const temKit = categoria.itens.some(temInclusos);
  const [open, setOpen] = useState(temKit);

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
                {categoria.itens.map((item) =>
                  temInclusos(item) ? (
                    <LinhaKit key={item.id} item={item} />
                  ) : (
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
                  )
                )}
              </div>
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </Reveal>
  );
}

/**
 * Linha de um item que veio de kit.
 *
 * Fica fechada, mostrando só nome e valor, e abre a lista de comida no toque.
 * A setinha sozinha não bastava: sem a frase embaixo, ninguém percebe que há
 * o cardápio inteiro escondido ali.
 */
function LinhaKit({ item }: { item: ItemOrcamento }) {
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    function forceOpen() {
      setAberto(true);
    }
    window.addEventListener("beforeprint", forceOpen);
    window.addEventListener("prepare-print", forceOpen);
    return () => {
      window.removeEventListener("beforeprint", forceOpen);
      window.removeEventListener("prepare-print", forceOpen);
    };
  }, []);

  const grupos = (item.inclui ?? []).filter((g) => g.itens.length > 0);
  const observacoes = item.observacoes ?? [];
  const quantos = contarInclusos(item);

  return (
    <li className="border-b border-areia/30 last:border-b-0">
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        className="w-full py-2.5 flex justify-between items-baseline gap-4 text-left hover:bg-areia/10 rounded-md transition"
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm text-carvao/85 flex items-center gap-2">
            <span className={`text-oliva text-xs transition-transform ${aberto ? "rotate-90" : ""}`} aria-hidden>
              ▸
            </span>
            {item.descricao}
          </p>
          {item.qtd > 1 && (
            <p className="text-[11px] text-carvao/50 mt-0.5 pl-5">
              {item.qtd} × {brl(item.valor_unitario)}
            </p>
          )}
          <p className="text-[11px] text-oliva/90 mt-1 pl-5">
            {aberto ? "Toque para fechar" : `Toque para ver os ${quantos} itens inclusos`}
          </p>
        </div>
        <span className="text-sm font-medium text-carvao tabular-nums whitespace-nowrap">
          {brl(item.qtd * item.valor_unitario)}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {aberto && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden kit-inclusos"
          >
            <div className="pb-4 pl-5 pr-1 space-y-3">
              {grupos.map((g) => (
                <div key={g.id}>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="eyebrow text-bronze">{g.titulo}</span>
                    {g.nota && (
                      <span className="text-[11px] text-carvao/50 normal-case tracking-normal">
                        {g.nota}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-carvao/75 leading-relaxed">
                    {g.itens.map((nome, i) => (
                      <span key={`${nome}-${i}`}>
                        {nome}
                        {i < g.itens.length - 1 && (
                          <span className="mx-1.5 text-oliva/50">·</span>
                        )}
                      </span>
                    ))}
                  </p>
                </div>
              ))}

              {observacoes.length > 0 && (
                <div className="pt-1">
                  <span className="eyebrow text-bronze">Também incluso</span>
                  <p className="mt-1 text-sm text-carvao/75 leading-relaxed">
                    {observacoes.map((o, i) => (
                      <span key={`${o}-${i}`}>
                        {o}
                        {i < observacoes.length - 1 && (
                          <span className="mx-1.5 text-oliva/50">·</span>
                        )}
                      </span>
                    ))}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
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
  precosEspaco = null,
  clienteData = null,
}: {
  espaco: ItemOrcamento[];
  decoracao: ItemOrcamento[];
  buffet: ItemOrcamento[];
  precosEspaco?: PrecosEspacoPorDia | null;
  clienteData?: string | null;
}) {
  const usarFaixas = temFaixasAtivas(precosEspaco);

  // Com faixas ativas, aluguel NUNCA entra no total — é sempre informativo.
  // O cliente vê os 3 valores e mentalmente soma o do dia que escolher.
  const subtotalEspaco = subtotal(espaco);
  const totalSemAluguel = subtotalEspaco + subtotal(decoracao) + subtotal(buffet);

  if (totalSemAluguel === 0 && !espaco.length && !decoracao.length && !buffet.length && !usarFaixas) {
    return null;
  }

  // Esconde a caixa "Valor total" quando faixas ativas E não há nada além de espaço pra somar
  const escondeTotal = usarFaixas && totalSemAluguel === 0;

  return (
    <section id="investimento" className="py-20 md:py-28 px-6">
      <div className="max-w-3xl mx-auto">
        <SectionTitle eyebrow="Investimento" title="Resumo da proposta" />

        <p className="mt-6 text-center text-sm text-carvao/55 max-w-md mx-auto">
          {usarFaixas
            ? "O aluguel do espaço varia conforme o dia da semana — você soma o valor do dia escolhido às demais categorias."
            : "Toque em cada categoria para ver os itens inclusos."}
        </p>

        <div className="mt-10 border-t border-areia/60">
          {usarFaixas && precosEspaco ? (
            <>
              <EspacoFaixas precos={precosEspaco} clienteData={clienteData} />
              {/* Itens extras de Espaço (caução, taxas) — colapsáveis */}
              {espaco.length > 0 && (
                <CategoryRow categoria={{ titulo: "Outros itens do espaço", itens: espaco }} />
              )}
            </>
          ) : (
            <CategoryRow categoria={{ titulo: "Espaço", itens: espaco }} />
          )}
          <CategoryRow categoria={{ titulo: "Decoração", itens: decoracao }} />
          <CategoryRow categoria={{ titulo: "Buffet", itens: buffet }} />
        </div>

        {!escondeTotal && (
          <Reveal>
            <div className="mt-12 relative overflow-hidden rounded-2xl bg-oliva p-8 md:p-12 shadow-premium">
              <div className="absolute inset-0 pattern-claro opacity-10" aria-hidden />
              <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                  <div className="eyebrow text-white/80">
                    {usarFaixas ? "Demais categorias" : "Valor total"}
                  </div>
                  <p className="mt-2 text-white/90 text-sm max-w-xs">
                    {usarFaixas
                      ? "Soma de decoração e buffet. O aluguel do espaço é informado acima e varia conforme o dia."
                      : "Investimento completo para sua celebração no espaço Dondoka."}
                  </p>
                </div>
                <motion.div
                  className="text-4xl md:text-5xl font-serif text-white"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <TotalCounter total={totalSemAluguel} />
                </motion.div>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
