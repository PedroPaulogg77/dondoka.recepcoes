"use client";
import { brl } from "@/lib/format";
import type { ItemOrcamento } from "@/types/orcamento";

type Props = {
  titulo: string;
  itens: ItemOrcamento[];
  onChange: (itens: ItemOrcamento[]) => void;
};

function novoId() {
  return Math.random().toString(36).slice(2, 10);
}

const inputBase =
  "w-full h-10 px-3 rounded-lg border border-areia/60 bg-white text-sm transition focus:border-oliva focus:outline-none focus:ring-2 focus:ring-oliva/15";

const iconBtnBase =
  "w-8 h-8 inline-flex items-center justify-center rounded-full transition";

export function ItensEditor({ titulo, itens, onChange }: Props) {
  function update(idx: number, patch: Partial<ItemOrcamento>) {
    const next = itens.map((it, i) => (i === idx ? { ...it, ...patch } : it));
    onChange(next);
  }
  function remove(idx: number) {
    onChange(itens.filter((_, i) => i !== idx));
  }
  function adicionar() {
    onChange([...itens, { id: novoId(), descricao: "", qtd: 1, valor_unitario: 0 }]);
  }
  function mover(idx: number, dir: -1 | 1) {
    const j = idx + dir;
    if (j < 0 || j >= itens.length) return;
    const next = [...itens];
    [next[idx], next[j]] = [next[j], next[idx]];
    onChange(next);
  }

  const total = itens.reduce((acc, i) => acc + (i.qtd || 0) * (i.valor_unitario || 0), 0);
  const empty = itens.length === 0;

  return (
    <div className="bg-white border border-areia/50 rounded-2xl overflow-hidden">
      <div className="px-5 py-3.5 bg-areia/20 flex items-baseline justify-between">
        <h3 className="font-serif text-base md:text-lg text-carvao">{titulo}</h3>
        <span className="text-sm tabular-nums text-bronze font-medium">{brl(total)}</span>
      </div>

      {empty ? (
        <div className="px-5 py-8 text-center text-sm text-carvao/45">
          Nenhum item ainda. Toque em <b>Adicionar</b> abaixo.
        </div>
      ) : (
        <div className="divide-y divide-areia/30">
          {itens.map((item, idx) => (
            <div
              key={item.id}
              className="px-3 md:px-5 py-3.5 grid grid-cols-12 gap-2 md:gap-3 items-center"
            >
              <div className="col-span-12 md:col-span-6">
                <input
                  type="text"
                  placeholder="Descrição"
                  value={item.descricao}
                  onChange={(e) => update(idx, { descricao: e.target.value })}
                  className={inputBase}
                />
              </div>
              <div className="col-span-3 md:col-span-1">
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  value={item.qtd}
                  onChange={(e) => update(idx, { qtd: Number(e.target.value) || 0 })}
                  className={`${inputBase} tabular-nums text-center`}
                />
              </div>
              <div className="col-span-5 md:col-span-3">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-carvao/40 pointer-events-none">
                    R$
                  </span>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    min={0}
                    value={item.valor_unitario}
                    onChange={(e) => update(idx, { valor_unitario: Number(e.target.value) || 0 })}
                    className={`${inputBase} pl-8 tabular-nums`}
                  />
                </div>
              </div>
              <div className="col-span-4 md:col-span-2 flex justify-end items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => mover(idx, -1)}
                  disabled={idx === 0}
                  className={`${iconBtnBase} text-carvao/50 hover:bg-areia/40 hover:text-carvao disabled:opacity-30 disabled:hover:bg-transparent`}
                  aria-label="Subir"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                    <polyline points="18 15 12 9 6 15" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => mover(idx, 1)}
                  disabled={idx === itens.length - 1}
                  className={`${iconBtnBase} text-carvao/50 hover:bg-areia/40 hover:text-carvao disabled:opacity-30 disabled:hover:bg-transparent`}
                  aria-label="Descer"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className={`${iconBtnBase} text-carvao/40 hover:bg-rose-50 hover:text-rose-500`}
                  aria-label="Remover"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="p-3 md:p-4 border-t border-areia/30 bg-creme/30">
        <button
          type="button"
          onClick={adicionar}
          className="w-full h-10 rounded-lg border border-dashed border-oliva/40 text-oliva hover:bg-oliva/5 text-sm font-medium inline-flex items-center justify-center gap-1.5"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Adicionar item
        </button>
      </div>
    </div>
  );
}
