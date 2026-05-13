"use client";
import type { BuffetDados } from "@/types/orcamento";

type Props = {
  value: BuffetDados;
  onChange: (v: BuffetDados) => void;
  isCustom?: boolean;
  onResetDefault?: () => void;
};

export function BuffetEditor({ value, onChange, isCustom, onResetDefault }: Props) {
  function updateEntradaTitulo(v: string) {
    onChange({ ...value, entrada: { ...value.entrada, titulo: v } });
  }
  function updateEntradaItens(idx: number, v: string) {
    const itens = [...value.entrada.itens];
    itens[idx] = v;
    onChange({ ...value, entrada: { ...value.entrada, itens } });
  }
  function addEntradaItem() {
    onChange({ ...value, entrada: { ...value.entrada, itens: [...value.entrada.itens, ""] } });
  }
  function removeEntradaItem(idx: number) {
    onChange({ ...value, entrada: { ...value.entrada, itens: value.entrada.itens.filter((_, i) => i !== idx) } });
  }

  function updateOpcaoTitulo(i: number, v: string) {
    const opcoes = value.principal.opcoes.map((o, idx) => (idx === i ? { ...o, titulo: v } : o));
    onChange({ ...value, principal: { opcoes } });
  }
  function updateOpcaoItem(opIdx: number, itemIdx: number, v: string) {
    const opcoes = value.principal.opcoes.map((o, idx) => {
      if (idx !== opIdx) return o;
      const itens = [...o.itens];
      itens[itemIdx] = v;
      return { ...o, itens };
    });
    onChange({ ...value, principal: { opcoes } });
  }
  function addOpcaoItem(opIdx: number) {
    const opcoes = value.principal.opcoes.map((o, idx) =>
      idx === opIdx ? { ...o, itens: [...o.itens, ""] } : o
    );
    onChange({ ...value, principal: { opcoes } });
  }
  function removeOpcaoItem(opIdx: number, itemIdx: number) {
    const opcoes = value.principal.opcoes.map((o, idx) =>
      idx === opIdx ? { ...o, itens: o.itens.filter((_, i) => i !== itemIdx) } : o
    );
    onChange({ ...value, principal: { opcoes } });
  }
  function addOpcao() {
    onChange({ ...value, principal: { opcoes: [...value.principal.opcoes, { titulo: "", itens: [] }] } });
  }
  function removeOpcao(idx: number) {
    onChange({ ...value, principal: { opcoes: value.principal.opcoes.filter((_, i) => i !== idx) } });
  }

  function updateBebida(idx: number, v: string) {
    const bebidas = [...value.bebidas];
    bebidas[idx] = v;
    onChange({ ...value, bebidas });
  }
  function addBebida() {
    onChange({ ...value, bebidas: [...value.bebidas, ""] });
  }
  function removeBebida(idx: number) {
    onChange({ ...value, bebidas: value.bebidas.filter((_, i) => i !== idx) });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-serif text-lg text-carvao">Cardápio do buffet</h3>
        {onResetDefault && (
          <div className="flex items-center gap-2">
            {isCustom ? (
              <>
                <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-bronze/15 text-bronze">
                  Customizado
                </span>
                <button
                  type="button"
                  onClick={onResetDefault}
                  className="text-[11px] text-oliva hover:text-bronze underline-offset-4 hover:underline"
                >
                  ↺ Voltar ao padrão
                </button>
              </>
            ) : (
              <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-oliva/10 text-oliva">
                Padrão
              </span>
            )}
          </div>
        )}
      </div>

      {/* Entrada */}
      <fieldset className="border border-areia/60 rounded-xl p-4 md:p-5">
        <legend className="px-2 eyebrow text-bronze">Entrada</legend>
        <label className="block">
          <span className="text-xs text-carvao/60">Título</span>
          <input
            type="text"
            value={value.entrada.titulo}
            onChange={(e) => updateEntradaTitulo(e.target.value)}
            className="form-input mt-1"
          />
        </label>
        <div className="mt-3 space-y-2">
          <span className="text-xs text-carvao/60">Itens</span>
          {value.entrada.itens.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => updateEntradaItens(i, e.target.value)}
                className="form-input flex-1"
              />
              <button
                type="button"
                onClick={() => removeEntradaItem(i)}
                className="px-3 text-rose-500 hover:text-rose-700"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addEntradaItem}
            className="text-sm text-oliva hover:text-bronze"
          >
            + Adicionar item
          </button>
        </div>
      </fieldset>

      {/* Prato principal */}
      <fieldset className="border border-areia/60 rounded-xl p-4 md:p-5">
        <legend className="px-2 eyebrow text-bronze">Prato principal</legend>
        <div className="space-y-5">
          {value.principal.opcoes.map((op, opIdx) => (
            <div key={opIdx} className="bg-creme/60 rounded-lg p-4 border border-areia/50">
              <div className="flex justify-between items-center gap-2 mb-2">
                <span className="text-[10px] uppercase tracking-widest text-oliva">
                  Opção {opIdx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeOpcao(opIdx)}
                  className="text-xs text-rose-500 hover:text-rose-700"
                >
                  Remover opção
                </button>
              </div>
              <input
                type="text"
                value={op.titulo}
                onChange={(e) => updateOpcaoTitulo(opIdx, e.target.value)}
                placeholder="Nome do prato"
                className="form-input"
              />
              <div className="mt-3 space-y-2">
                <span className="text-xs text-carvao/60">Acompanhamentos</span>
                {op.itens.map((it, itemIdx) => (
                  <div key={itemIdx} className="flex gap-2">
                    <input
                      type="text"
                      value={it}
                      onChange={(e) => updateOpcaoItem(opIdx, itemIdx, e.target.value)}
                      className="form-input flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => removeOpcaoItem(opIdx, itemIdx)}
                      className="px-3 text-rose-500 hover:text-rose-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addOpcaoItem(opIdx)}
                  className="text-sm text-oliva hover:text-bronze"
                >
                  + Acompanhamento
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addOpcao}
            className="text-sm text-oliva hover:text-bronze"
          >
            + Nova opção de prato
          </button>
        </div>
      </fieldset>

      {/* Bebidas */}
      <fieldset className="border border-areia/60 rounded-xl p-4 md:p-5">
        <legend className="px-2 eyebrow text-bronze">Bebidas</legend>
        <div className="space-y-2">
          {value.bebidas.map((b, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={b}
                onChange={(e) => updateBebida(i, e.target.value)}
                className="form-input flex-1"
              />
              <button
                type="button"
                onClick={() => removeBebida(i)}
                className="px-3 text-rose-500 hover:text-rose-700"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addBebida}
            className="text-sm text-oliva hover:text-bronze"
          >
            + Adicionar bebida
          </button>
        </div>
      </fieldset>

      {/* Serviço */}
      <label className="block">
        <span className="eyebrow text-bronze">Serviço (texto descritivo)</span>
        <textarea
          rows={3}
          value={value.servico}
          onChange={(e) => onChange({ ...value, servico: e.target.value })}
          className="form-input mt-1.5"
        />
      </label>
    </div>
  );
}
