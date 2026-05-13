"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { ItensEditor } from "../ItensEditor";
import { brl } from "@/lib/format";
import type { ItemOrcamento } from "@/types/orcamento";

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
  onUndo,
}: Props) {
  const [tab, setTab] = useState<Categoria>("espaco");

  const total = subtotal(espaco) + subtotal(decoracao) + subtotal(buffet);

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
            { key: "espaco" as const, label: "Espaço", itens: espaco },
            { key: "decoracao" as const, label: "Decoração", itens: decoracao },
            { key: "buffet" as const, label: "Buffet", itens: buffet },
          ]
        ).map((t) => {
          const active = tab === t.key;
          const sub = subtotal(t.itens);
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
                {brl(sub)}
              </span>
            </button>
          );
        })}
      </div>

      {tab === "espaco" && (
        <ItensEditor titulo="Espaço" itens={espaco} onChange={onChangeEspaco} />
      )}
      {tab === "decoracao" && (
        <ItensEditor titulo="Decoração" itens={decoracao} onChange={onChangeDecoracao} />
      )}
      {tab === "buffet" && (
        <ItensEditor titulo="Buffet" itens={buffet} onChange={onChangeBuffet} />
      )}

      {/* Total */}
      <div className="mt-6 px-5 py-4 rounded-2xl bg-oliva text-white flex justify-between items-center">
        <span className="eyebrow text-white/80">Total geral</span>
        <span className="text-xl md:text-2xl font-serif tabular-nums">{brl(total)}</span>
      </div>
    </Drawer>
  );
}
