"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { ItensEditor } from "../ItensEditor";
import { EspacoPrecosEditor } from "../EspacoPrecosEditor";
import { brl } from "@/lib/format";
import { temFaixasAtivas } from "@/lib/orcamento-helpers";
import type { ItemOrcamento, PrecosEspacoPorDia } from "@/types/orcamento";

type Categoria = "espaco" | "decoracao" | "buffet";

type Props = {
  open: boolean;
  onClose: () => void;
  espaco: ItemOrcamento[];
  decoracao: ItemOrcamento[];
  buffet: ItemOrcamento[];
  onChangeEspaco: (v: ItemOrcamento[]) => void;
  onChangeDecoracao: (v: ItemOrcamento[]) => void;
  onChangeBuffet: (v: ItemOrcamento[]) => void;
  /** Faixas por dia (override do orçamento) */
  precosEspaco: PrecosEspacoPorDia | null;
  /** Faixas padrão do config global (pra "Restaurar padrão") */
  precosEspacoDefault: PrecosEspacoPorDia | null;
  onChangePrecosEspaco: (v: PrecosEspacoPorDia | null) => void;
  onUndo?: () => void;
};

function subtotal(itens: ItemOrcamento[]) {
  return itens.reduce((acc, i) => acc + (i.qtd || 0) * (i.valor_unitario || 0), 0);
}

export function DrawerItens({
  open,
  onClose,
  espaco,
  decoracao,
  buffet,
  onChangeEspaco,
  onChangeDecoracao,
  onChangeBuffet,
  precosEspaco,
  precosEspacoDefault,
  onChangePrecosEspaco,
  onUndo,
}: Props) {
  const [tab, setTab] = useState<Categoria>("espaco");

  const usarFaixas = temFaixasAtivas(precosEspaco);
  // Aluguel das faixas NUNCA entra no total — cliente vê as 3 faixas
  // e soma a do dia escolhido. Total geral = extras espaço + decoração + buffet.
  const subEspaco = subtotal(espaco);
  const subDecoracao = subtotal(decoracao);
  const subBuffet = subtotal(buffet);
  const total = subEspaco + subDecoracao + subBuffet;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Itens e valores"
      subtitle="Os valores aparecem agrupados no 'Resumo da proposta'"
      onUndo={onUndo}
    >
      {/* Tabs */}
      <div className="-mt-1 mb-5 grid grid-cols-3 gap-1 p-1 rounded-full bg-areia/40">
        {(
          [
            { key: "espaco" as const, label: "Espaço", sub: subEspaco },
            { key: "decoracao" as const, label: "Decoração", sub: subDecoracao },
            { key: "buffet" as const, label: "Buffet", sub: subBuffet },
          ]
        ).map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`h-10 rounded-full text-xs md:text-sm transition flex flex-col items-center justify-center leading-none ${
                active ? "bg-white text-oliva shadow-soft font-medium" : "text-carvao/60 hover:text-carvao"
              }`}
            >
              <span>{t.label}</span>
              <span className={`text-[10px] mt-0.5 tabular-nums ${active ? "text-bronze" : "text-carvao/45"}`}>
                {brl(t.sub)}
              </span>
            </button>
          );
        })}
      </div>

      {tab === "espaco" && (
        <div className="space-y-5">
          <EspacoPrecosEditor
            value={precosEspaco}
            onChange={onChangePrecosEspaco}
            showResetVsDefault
            defaultValue={precosEspacoDefault}
          />
          <ItensEditor
            titulo={usarFaixas ? "Outros itens do espaço (caução, extras)" : "Espaço"}
            itens={espaco}
            onChange={onChangeEspaco}
          />
        </div>
      )}
      {tab === "decoracao" && (
        <ItensEditor titulo="Decoração" itens={decoracao} onChange={onChangeDecoracao} />
      )}
      {tab === "buffet" && (
        <ItensEditor titulo="Buffet" itens={buffet} onChange={onChangeBuffet} />
      )}

      {/* Total */}
      <div className="mt-6 px-5 py-4 rounded-2xl bg-oliva text-white">
        <div className="flex justify-between items-center">
          <span className="eyebrow text-white/80">
            {usarFaixas ? "Demais categorias" : "Total geral"}
          </span>
          <span className="text-xl md:text-2xl font-serif tabular-nums">{brl(total)}</span>
        </div>
        {usarFaixas && (
          <p className="mt-2 text-xs text-white/75 leading-relaxed">
            O aluguel do espaço aparece como informação (3 faixas) — não soma no total. O cliente vê os valores e escolhe o dia.
          </p>
        )}
      </div>
    </Drawer>
  );
}
