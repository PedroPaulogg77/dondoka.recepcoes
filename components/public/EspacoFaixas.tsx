"use client";
import { Reveal } from "@/components/ui/Reveal";
import { brl, TIER_LABELS, type TierDia } from "@/lib/format";
import type { PrecosEspacoPorDia } from "@/types/orcamento";
import { valorAluguelEspaco } from "@/lib/orcamento-helpers";

type Props = {
  precos: PrecosEspacoPorDia;
  clienteData: string | null;
};

const TIERS: TierDia[] = ["seg_qui", "sex", "sab_dom"];

/**
 * Renderiza a "categoria Espaço" no Resumo da Proposta quando há faixas
 * por dia da semana ativas. Substitui o CategoryRow colapsável.
 *
 * - Data preenchida: 1 card destacado com a faixa do dia.
 * - Data não preenchida: 3 cards (empilhados no mobile) com cada faixa.
 */
export function EspacoFaixas({ precos, clienteData }: Props) {
  const { tierAtivo, minValor, maxValor } = valorAluguelEspaco(precos, clienteData);

  // Lista de faixas com valor preenchido (pra mostrar; ignora faixas null/0)
  const faixasPreenchidas = TIERS
    .map((t) => ({ tier: t, valor: precos[t] }))
    .filter((f): f is { tier: TierDia; valor: number } => typeof f.valor === "number" && f.valor > 0);

  if (faixasPreenchidas.length === 0) return null;

  // Caso 1: data definida → card único da faixa ativa
  if (tierAtivo) {
    const faixa = faixasPreenchidas.find((f) => f.tier === tierAtivo) || faixasPreenchidas[0];
    return (
      <Reveal>
        <div className="py-5 px-1 border-b border-areia/60">
          <div className="flex justify-between items-baseline gap-4 mb-2">
            <span className="font-serif text-lg md:text-xl text-carvao">Espaço</span>
            <span className="font-serif text-bronze tabular-nums whitespace-nowrap">
              {brl(faixa.valor)}
            </span>
          </div>
          <div className="flex items-center gap-2 pl-1">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-oliva/10 text-oliva text-[11px] tracking-widest uppercase">
              {TIER_LABELS[faixa.tier]}
            </span>
            <span className="text-xs text-carvao/55">
              Aluguel do espaço completo
            </span>
          </div>
        </div>
      </Reveal>
    );
  }

  // Caso 2: sem data → 3 cards visíveis
  return (
    <Reveal>
      <div className="py-5 px-1 border-b border-areia/60">
        <div className="flex justify-between items-baseline gap-4 mb-3">
          <span className="font-serif text-lg md:text-xl text-carvao">Espaço</span>
          {minValor != null && maxValor != null && minValor !== maxValor && (
            <span className="text-xs text-carvao/55 tabular-nums">
              {brl(minValor)} — {brl(maxValor)}
            </span>
          )}
        </div>

        <p className="text-xs text-carvao/55 mb-4 pl-1">
          Valor varia conforme o dia da semana. Confirme a data com a Dondoka.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {faixasPreenchidas.map((f) => (
            <div
              key={f.tier}
              className="rounded-xl bg-white border border-areia/60 px-4 py-3.5 shadow-soft"
            >
              <div className="eyebrow text-bronze text-[10px]">{TIER_LABELS[f.tier]}</div>
              <div className="mt-1.5 font-serif text-xl text-carvao tabular-nums">
                {brl(f.valor)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
