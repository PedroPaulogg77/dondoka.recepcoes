"use client";
import { useState } from "react";
import { Drawer } from "../Drawer";
import { ItensEditor } from "../ItensEditor";
import { EspacoPrecosEditor } from "../EspacoPrecosEditor";
import { brl } from "@/lib/format";
import { temFaixasAtivas } from "@/lib/orcamento-helpers";
import { contarItens, kitParaItem, kitsDaCategoria } from "@/lib/kits";
import type { CategoriaKit, ItemOrcamento, Kit, PrecosEspacoPorDia } from "@/types/orcamento";

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
  convidados,
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
          />
        </div>
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

/* ─────────────────────────────────────────────────────────────── */

/**
 * Lista os kits do catálogo daquela categoria.
 *
 * O kit entra com o preço em branco de propósito: o valor é a única decisão
 * que muda de cliente para cliente, então é a única coisa que o João digita.
 */
function AdicionarKit({
  categoria,
  kits,
  convidados,
  onAdicionar,
}: {
  categoria: CategoriaKit;
  kits: Kit[];
  convidados: number;
  onAdicionar: (item: ItemOrcamento) => void;
}) {
  const [aberto, setAberto] = useState(false);
  const disponiveis = kitsDaCategoria(kits, categoria);

  if (disponiveis.length === 0) {
    return (
      <p className="rounded-xl bg-creme border border-areia/60 px-4 py-3 text-xs text-carvao/60">
        Nenhum kit de {categoria === "buffet" ? "buffet" : "decoração"} no catálogo ainda.
        Monte em <b>Kits</b>, no menu do topo.
      </p>
    );
  }

  return (
    <div className="rounded-2xl border border-oliva/25 bg-oliva/[0.04] p-3 md:p-4">
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        className="w-full flex items-center justify-between gap-3 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-oliva">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Adicionar kit
        </span>
        <span className={`text-oliva transition-transform ${aberto ? "rotate-90" : ""}`} aria-hidden>▸</span>
      </button>

      {aberto && (
        <ul className="mt-3 space-y-2">
          {disponiveis.map((kit) => {
            const abaixoDoMinimo =
              kit.minimo_pessoas != null && convidados > 0 && convidados < kit.minimo_pessoas;
            return (
              <li key={kit.id}>
                <button
                  type="button"
                  onClick={() => {
                    onAdicionar(kitParaItem(kit, convidados));
                    setAberto(false);
                  }}
                  className="w-full text-left rounded-xl bg-white border border-areia/60 px-4 py-3 hover:border-oliva/50 hover:shadow-soft transition"
                >
                  <span className="block font-serif text-carvao">{kit.nome || "Kit sem nome"}</span>
                  <span className="mt-0.5 block text-[11px] text-carvao/55">
                    {contarItens(kit)} itens
                    {kit.observacoes.length > 0 && ` · ${kit.observacoes.length} inclusos`}
                    {kit.minimo_pessoas ? ` · mín. ${kit.minimo_pessoas} pessoas` : ""}
                  </span>
                  {abaixoDoMinimo && (
                    <span className="mt-1.5 block text-[11px] text-bronze">
                      Este orçamento tem {convidados} convidados, abaixo do mínimo do kit.
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
