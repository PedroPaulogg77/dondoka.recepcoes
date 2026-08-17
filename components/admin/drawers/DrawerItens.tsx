"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { ItensEditor } from "../ItensEditor";
import { EspacoPrecosEditor } from "../EspacoPrecosEditor";
import { AdicionarKit } from "../AdicionarKit";
import { brl } from "@/lib/format";
import { espacoQueSoma, temFaixasAtivas, valorUnicoEspaco } from "@/lib/orcamento-helpers";
import type { BibliotecaGrupo, ItemOrcamento, Kit, PrecosEspacoPorDia } from "@/types/orcamento";

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
  /** Catálogo de kits, para os botões "Adicionar kit". */
  kits: Kit[];
  /** Biblioteca de itens, para acrescentar item a um kit já inserido. */
  biblioteca: BibliotecaGrupo[];
  convidados: number;
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
  kits,
  biblioteca,
  convidados,
  onUndo,
}: Props) {
  const [tab, setTab] = useState<Categoria>("espaco");

  const usarFaixas = temFaixasAtivas(precosEspaco);
  // Valor igual em todos os dias soma. Variando por dia não, porque o cliente
  // é quem escolhe o dia e somar um dos três decidiria por ele.
  const variaPorDia = usarFaixas && valorUnicoEspaco(precosEspaco) == null;
  const subEspaco = subtotal(espaco) + espacoQueSoma(precosEspaco);
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
            biblioteca={biblioteca}
            itens={espaco}
            onChange={onChangeEspaco}
            convidados={convidados}
          />
        </div>
      )}

      {tab === "decoracao" && (
        <div className="space-y-4">
          <AdicionarKit
            categoria="decoracao"
            kits={kits}
            convidados={convidados}
            onAdicionar={(item) => onChangeDecoracao([...decoracao, item])}
          />
          <ItensEditor
            titulo="Decoração"
            itens={decoracao}
            onChange={onChangeDecoracao}
            convidados={convidados}
            biblioteca={biblioteca}
          />
        </div>
      )}

      {tab === "buffet" && (
        <div className="space-y-4">
          <AdicionarKit
            categoria="buffet"
            kits={kits}
            convidados={convidados}
            onAdicionar={(item) => onChangeBuffet([...buffet, item])}
          />
          <ItensEditor
            titulo="Buffet"
            itens={buffet}
            onChange={onChangeBuffet}
            convidados={convidados}
            biblioteca={biblioteca}
          />
        </div>
      )}

      {/* Total */}
      <div className="mt-6 px-5 py-4 rounded-2xl bg-oliva text-white">
        <div className="flex justify-between items-center">
          <span className="eyebrow text-white/80">
            {variaPorDia ? "Demais categorias" : "Total geral"}
          </span>
          <span className="text-xl md:text-2xl font-serif tabular-nums">{brl(total)}</span>
        </div>
        {variaPorDia && (
          <p className="mt-2 text-xs text-white/75 leading-relaxed">
            Com valor diferente por dia, o aluguel aparece como informação e não soma no total.
            O cliente vê as 3 faixas e escolhe o dia.
          </p>
        )}
      </div>
    </Drawer>
  );
}
