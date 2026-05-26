"use client";
import { Reveal } from "@/components/ui/Reveal";
import { brl, TIER_LABELS, tierFromDate, type TierDia } from "@/lib/format";
import type { PrecosEspacoPorDia } from "@/types/orcamento";

type Props = {
  precos: PrecosEspacoPorDia;
  clienteData: string | null;
};

const TIERS: TierDia[] = ["seg_qui", "sex", "sab_dom"];

/**
 * Renderiza a "categoria Espaço" no Resumo da Proposta quando há faixas
 * por dia da semana ativas.
 *
 * Mostra SEMPRE as 3 faixas (informativo) — o cliente vê os valores
 * de cada dia e escolhe. Se o orçamento já tem data definida, a faixa
 * correspondente ganha um destaque visual, mas as outras continuam visíveis.
 */
export function EspacoFaixas({ precos, clienteData }: Props) {
  const tierAtivo = tierFromDate(clienteData);

  const faixasPreenchidas = TIERS
    .map((t) => ({ tier: t, valor: precos[t] }))
    .filter((f): f is { tier: TierDia; valor: number } => typeof f.valor === "number" && f.valor > 0);

  if (faixasPreenchidas.length === 0) return null;

  return (
    <Reveal>
      <div className="py-5 px-1 border-b border-areia/60">
        <div className="flex justify-between items-baseline gap-4 mb-3">
          <span className="font-serif text-lg md:text-xl text-carvao">Espaço</span>
        </div>

        <p className="text-xs text-carvao/55 mb-4 pl-1 max-w-md">
          O aluguel varia conforme o dia da semana. Escolha o dia da sua celebração — o valor abaixo se soma às demais categorias.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {faixasPreenchidas.map((f) => {
            const destaque = tierAtivo === f.tier;
            return (
              <div
                key={f.tier}
                className={`rounded-xl px-4 py-3.5 shadow-soft border transition ${
                  destaque
                    ? "bg-oliva/10 border-oliva/40 ring-1 ring-oliva/30"
                    : "bg-white border-areia/60"
                }`}
              >
                <div className={`eyebrow text-[10px] ${destaque ? "text-oliva" : "text-bronze"}`}>
                  {TIER_LABELS[f.tier]}
                </div>
                <div className="mt-1.5 font-serif text-xl text-carvao tabular-nums">
                  {brl(f.valor)}
                </div>
                {destaque && (
                  <div className="mt-1 text-[10px] text-oliva/80 tracking-wider uppercase">
                    Seu dia
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Reveal>
  );
}
