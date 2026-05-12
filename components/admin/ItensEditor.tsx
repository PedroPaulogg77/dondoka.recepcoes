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

  return (
    <div className="bg-white border border-areia/60 rounded-2xl overflow-hidden">
      <div className="px-5 md:px-7 py-4 bg-areia/25 flex items-baseline justify-between">
        <h3 className="font-serif text-lg text-carvao">{titulo}</h3>
        <span className="text-sm tabular-nums text-bronze font-medium">{brl(total)}</span>
      </div>

      <div className="divide-y divide-areia/40">
        {itens.map((item, idx) => (
          <div key={item.id} className="px-4 md:px-7 py-4 grid grid-cols-12 gap-2 md:gap-3 items-center">
            <div className="col-span-12 md:col-span-6">
              <input
                type="text"
                placeholder="Descrição"
                value={item.descricao}
                onChange={(e) => update(idx, { descricao: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-areia/70 bg-creme focus:border-oliva focus:outline-none text-sm"
              />
            </div>
            <div className="col-span-3 md:col-span-1">
              <input
                type="number"
                min={1}
                value={item.qtd}
                onChange={(e) => update(idx, { qtd: Number(e.target.value) || 0 })}
                className="w-full h-10 px-2 rounded-lg border border-areia/70 bg-creme focus:border-oliva focus:outline-none text-sm tabular-nums text-center"
              />
            </div>
            <div className="col-span-5 md:col-span-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-carvao/50">
                  R$
                </span>
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  value={item.valor_unitario}
                  onChange={(e) => update(idx, { valor_unitario: Number(e.target.value) || 0 })}
                  className="w-full h-10 pl-8 pr-2 rounded-lg border border-areia/70 bg-creme focus:border-oliva focus:outline-none text-sm tabular-nums"
                />
              </div>
            </div>
            <div className="col-span-4 md:col-span-2 flex justify-end items-center gap-1">
              <button
                type="button"
                onClick={() => mover(idx, -1)}
                className="w-8 h-8 rounded-full hover:bg-areia/50 text-carvao/60"
                aria-label="Subir"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => mover(idx, 1)}
                className="w-8 h-8 rounded-full hover:bg-areia/50 text-carvao/60"
                aria-label="Descer"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => remove(idx)}
                className="w-8 h-8 rounded-full hover:bg-rose-50 text-rose-500"
                aria-label="Remover"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 md:p-5 border-t border-areia/40">
        <button
          type="button"
          onClick={adicionar}
          className="w-full h-10 rounded-lg border border-dashed border-oliva/40 text-oliva hover:bg-oliva/5 text-sm font-medium"
        >
          + Adicionar item
        </button>
      </div>
    </div>
  );
}
