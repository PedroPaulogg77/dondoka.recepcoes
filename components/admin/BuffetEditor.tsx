"use client";
import type { BuffetDados } from "@/types/orcamento";

type Props = {
  value: BuffetDados;
  onChange: (v: BuffetDados) => void;
  isCustom?: boolean;
  onResetDefault?: () => void;
};

const PillBtn =
  "inline-flex items-center gap-1.5 px-3 h-8 rounded-full border border-oliva/30 text-oliva text-xs font-medium hover:bg-oliva/5 transition";
const IconBtn =
  "w-8 h-8 inline-flex items-center justify-center rounded-full text-carvao/40 hover:bg-rose-50 hover:text-rose-500 transition shrink-0";

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

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
    <div className="space-y-7">
      {onResetDefault && (
        <div className="flex items-center justify-end gap-2">
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

      {/* Entrada */}
      <section className="bg-white border border-areia/50 rounded-xl p-4 md:p-5 space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="eyebrow text-bronze">Entrada</span>
        </div>
        <label className="block">
          <span className="text-xs text-carvao/55">Título do grupo</span>
          <input
            type="text"
            value={value.entrada.titulo}
            onChange={(e) => updateEntradaTitulo(e.target.value)}
            className="form-input mt-1"
            placeholder="Ex: Cantinho mineiro"
          />
        </label>
        <div className="space-y-2">
          <span className="text-xs text-carvao/55">Itens</span>
          {value.entrada.itens.map((item, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                type="text"
                value={item}
                onChange={(e) => updateEntradaItens(i, e.target.value)}
                className="form-input flex-1"
                placeholder="Nome do item"
              />
              <button type="button" onClick={() => removeEntradaItem(i)} className={IconBtn} aria-label="Remover">
                <TrashIcon />
              </button>
            </div>
          ))}
          <button type="button" onClick={addEntradaItem} className={PillBtn}>
            <PlusIcon /> Adicionar item
          </button>
        </div>
      </section>

      {/* Prato principal */}
      <section className="bg-white border border-areia/50 rounded-xl p-4 md:p-5 space-y-4">
        <span className="eyebrow text-bronze block">Prato principal</span>
        {value.principal.opcoes.map((op, opIdx) => (
          <div key={opIdx} className="bg-creme/50 rounded-lg p-4 border border-areia/40 space-y-3">
            <div className="flex justify-between items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-oliva font-medium">
                Opção {opIdx + 1}
              </span>
              <button
                type="button"
                onClick={() => removeOpcao(opIdx)}
                className="text-[11px] text-rose-500 hover:text-rose-700 inline-flex items-center gap-1"
              >
                <TrashIcon /> Remover opção
              </button>
            </div>
            <input
              type="text"
              value={op.titulo}
              onChange={(e) => updateOpcaoTitulo(opIdx, e.target.value)}
              placeholder="Nome do prato"
              className="form-input"
            />
            <div className="space-y-2">
              <span className="text-xs text-carvao/55">Acompanhamentos</span>
              {op.itens.map((it, itemIdx) => (
                <div key={itemIdx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={it}
                    onChange={(e) => updateOpcaoItem(opIdx, itemIdx, e.target.value)}
                    className="form-input flex-1"
                    placeholder="Acompanhamento"
                  />
                  <button
                    type="button"
                    onClick={() => removeOpcaoItem(opIdx, itemIdx)}
                    className={IconBtn}
                    aria-label="Remover"
                  >
                    <TrashIcon />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => addOpcaoItem(opIdx)} className={PillBtn}>
                <PlusIcon /> Acompanhamento
              </button>
            </div>
          </div>
        ))}
        <button type="button" onClick={addOpcao} className={PillBtn}>
          <PlusIcon /> Nova opção de prato
        </button>
      </section>

      {/* Bebidas */}
      <section className="bg-white border border-areia/50 rounded-xl p-4 md:p-5 space-y-3">
        <span className="eyebrow text-bronze block">Bebidas</span>
        {value.bebidas.map((b, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              type="text"
              value={b}
              onChange={(e) => updateBebida(i, e.target.value)}
              className="form-input flex-1"
              placeholder="Nome da bebida"
            />
            <button type="button" onClick={() => removeBebida(i)} className={IconBtn} aria-label="Remover">
              <TrashIcon />
            </button>
          </div>
        ))}
        <button type="button" onClick={addBebida} className={PillBtn}>
          <PlusIcon /> Adicionar bebida
        </button>
      </section>

      {/* Serviço */}
      <label className="block">
        <span className="eyebrow text-bronze">Serviço — texto descritivo</span>
        <textarea
          rows={3}
          value={value.servico}
          onChange={(e) => onChange({ ...value, servico: e.target.value })}
          className="form-input mt-1.5"
          placeholder="Como funciona a equipe e o atendimento durante o evento..."
        />
      </label>
    </div>
  );
}
