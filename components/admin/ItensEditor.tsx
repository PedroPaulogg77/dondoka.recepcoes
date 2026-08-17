"use client";
import { useState } from "react";
import { brl } from "@/lib/format";
import { contarInclusos, novoId as gerarId, temInclusos } from "@/lib/kits";
import { SeletorBiblioteca } from "./KitEditor";
import type { BibliotecaGrupo, ItemOrcamento, KitGrupo } from "@/types/orcamento";

type Props = {
  titulo: string;
  itens: ItemOrcamento[];
  onChange: (itens: ItemOrcamento[]) => void;
  /** Usado só no rótulo do item "por pessoa". */
  convidados?: number;
  /** Fonte dos checkboxes ao acrescentar item a um kit já inserido. */
  biblioteca?: BibliotecaGrupo[];
};

function novoId() {
  return Math.random().toString(36).slice(2, 10);
}

const inputBase =
  "w-full h-10 px-3 rounded-lg border border-areia/60 bg-white text-sm transition focus:border-oliva focus:outline-none focus:ring-2 focus:ring-oliva/15";

const iconBtnBase =
  "w-8 h-8 inline-flex items-center justify-center rounded-full transition";

export function ItensEditor({
  titulo,
  itens,
  onChange,
  convidados = 0,
  biblioteca = [],
}: Props) {
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
          {itens.map((item, idx) => {
            const ehKit = temInclusos(item);
            return (
              <div key={item.id} className={ehKit ? "bg-oliva/[0.03]" : ""}>
                <div className="px-3 md:px-5 py-3.5 grid grid-cols-12 gap-2 md:gap-3 items-center">
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
                      disabled={item.por_pessoa}
                      title={
                        item.por_pessoa
                          ? "A quantidade acompanha o número de convidados"
                          : undefined
                      }
                      className={`${inputBase} tabular-nums text-center disabled:bg-areia/25 disabled:text-carvao/55`}
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

                {ehKit && (
                  <PainelKit
                    item={item}
                    convidados={convidados}
                    biblioteca={biblioteca}
                    onChange={(patch) => update(idx, patch)}
                  />
                )}
              </div>
            );
          })}
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

/* ─────────────────────────────────────────────────────────────── */

/**
 * Faixa que aparece embaixo de uma linha que veio de kit.
 *
 * Aqui o João mexe nos sub-itens só deste orçamento. O kit no catálogo não é
 * tocado, porque o que a linha guarda é uma cópia.
 */
function PainelKit({
  item,
  convidados,
  biblioteca,
  onChange,
}: {
  item: ItemOrcamento;
  convidados: number;
  biblioteca: BibliotecaGrupo[];
  onChange: (patch: Partial<ItemOrcamento>) => void;
}) {
  const [aberto, setAberto] = useState(false);
  const grupos = item.inclui ?? [];
  const observacoes = item.observacoes ?? [];

  function patchGrupo(gIdx: number, itensNovos: string[]) {
    onChange({
      inclui: grupos.map((g, i) => (i === gIdx ? { ...g, itens: itensNovos } : g)),
    });
  }

  function alternarNoGrupo(gIdx: number, nome: string) {
    const atual = grupos[gIdx].itens;
    patchGrupo(gIdx, atual.includes(nome) ? atual.filter((n) => n !== nome) : [...atual, nome]);
  }

  function adicionarGrupo() {
    const novo: KitGrupo = { id: gerarId("g"), titulo: "Extras", itens: [] };
    onChange({ inclui: [...grupos, novo] });
  }

  function removerObservacao(i: number) {
    onChange({ observacoes: observacoes.filter((_, j) => j !== i) });
  }

  function adicionarObservacao(texto: string) {
    onChange({ observacoes: [...observacoes, texto] });
  }

  return (
    <div className="px-3 md:px-5 pb-3.5 -mt-1">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center h-6 px-2 rounded-full bg-oliva/15 text-oliva text-[10px] uppercase tracking-widest">
          Kit
        </span>

        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          className="inline-flex items-center gap-1 text-xs text-oliva hover:text-bronze transition"
          aria-expanded={aberto}
        >
          <span className={`transition-transform ${aberto ? "rotate-90" : ""}`} aria-hidden>▸</span>
          {contarInclusos(item)} itens inclusos
        </button>

        <label className="ml-auto inline-flex items-center gap-2 text-xs text-carvao/70 cursor-pointer">
          <input
            type="checkbox"
            checked={!!item.por_pessoa}
            onChange={(e) => onChange({ por_pessoa: e.target.checked })}
            className="accent-oliva"
          />
          por pessoa
          {item.por_pessoa && convidados > 0 && (
            <span className="text-carvao/45">({convidados} convidados)</span>
          )}
        </label>
      </div>

      {aberto && (
        <div className="mt-3 rounded-xl bg-white border border-areia/50 p-3 space-y-3">
          <p className="text-[11px] text-carvao/55">
            Tirar item aqui vale só para este orçamento. O kit do catálogo não muda.
          </p>

          {grupos.map((g, gIdx) => (
            <GrupoDoKit
              key={g.id}
              grupo={g}
              biblioteca={biblioteca}
              onAlternar={(nome) => alternarNoGrupo(gIdx, nome)}
              onRenomear={(titulo) =>
                onChange({
                  inclui: grupos.map((x, i) => (i === gIdx ? { ...x, titulo } : x)),
                })
              }
              onRemoverGrupo={() =>
                onChange({ inclui: grupos.filter((_, i) => i !== gIdx) })
              }
            />
          ))}

          <button
            type="button"
            onClick={adicionarGrupo}
            className="inline-flex items-center gap-1.5 px-3 h-8 rounded-full border border-oliva/30 text-oliva text-[11px] font-medium hover:bg-oliva/5 transition"
          >
            + Novo grupo neste orçamento
          </button>

          <div className="pt-2 border-t border-areia/40">
            <span className="eyebrow text-bronze">Também incluso</span>
            <ul className="mt-1.5 flex flex-wrap gap-1.5">
              {observacoes.map((o, i) => (
                <li key={`${o}-${i}`}>
                  <button
                    type="button"
                    onClick={() => removerObservacao(i)}
                    title="Tirar deste orçamento"
                    className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 h-7 rounded-full bg-areia/40 text-carvao/75 text-[11px] hover:bg-rose-50 hover:text-rose-600 transition"
                  >
                    {o}
                    <span aria-hidden className="text-xs leading-none">×</span>
                  </button>
                </li>
              ))}
            </ul>
            <CampoNovoItem
              placeholder="Ex: 1 hora a mais de evento"
              onAdd={adicionarObservacao}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */

/**
 * Um grupo dentro do kit já inserido no orçamento.
 *
 * Aqui dá para tirar e também para PÔR item, o que faltava: antes só era
 * possível remover, e para acrescentar um salgado num cliente específico o
 * caminho era editar o kit no catálogo, o que mudaria todos os próximos
 * orçamentos junto.
 *
 * A biblioteca aparece só como fonte de marcação. O campo que acrescenta item
 * à biblioteca global não vem, de propósito: mexer no catálogo a partir de um
 * orçamento seria efeito colateral escondido.
 */
function GrupoDoKit({
  grupo,
  biblioteca,
  onAlternar,
  onRenomear,
  onRemoverGrupo,
}: {
  grupo: KitGrupo;
  biblioteca: BibliotecaGrupo[];
  onAlternar: (nome: string) => void;
  onRenomear: (titulo: string) => void;
  onRemoverGrupo: () => void;
}) {
  const [seletorAberto, setSeletorAberto] = useState(false);

  return (
    <div className="rounded-lg border border-areia/40 p-2.5">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={grupo.titulo}
          onChange={(e) => onRenomear(e.target.value)}
          className="flex-1 min-w-0 bg-transparent text-[11px] uppercase tracking-widest text-bronze focus:outline-none focus:bg-white rounded px-1 py-0.5"
          aria-label="Título do grupo"
        />
        {grupo.nota && (
          <span className="text-[11px] text-carvao/50 shrink-0">{grupo.nota}</span>
        )}
        <button
          type="button"
          onClick={onRemoverGrupo}
          aria-label="Remover grupo deste orçamento"
          className="w-6 h-6 inline-flex items-center justify-center rounded-full text-carvao/35 hover:bg-rose-50 hover:text-rose-500 transition shrink-0"
        >
          <span aria-hidden className="text-sm leading-none">×</span>
        </button>
      </div>

      <ul className="mt-1.5 flex flex-wrap gap-1.5">
        {grupo.itens.map((nome, i) => (
          <li key={`${nome}-${i}`}>
            <button
              type="button"
              onClick={() => onAlternar(nome)}
              title="Tirar deste orçamento"
              className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 h-7 rounded-full bg-areia/40 text-carvao/75 text-[11px] hover:bg-rose-50 hover:text-rose-600 transition"
            >
              {nome}
              <span aria-hidden className="text-xs leading-none">×</span>
            </button>
          </li>
        ))}
        {grupo.itens.length === 0 && (
          <li className="text-[11px] text-carvao/40">Grupo vazio, não aparece na proposta.</li>
        )}
      </ul>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        {biblioteca.length > 0 && (
          <button
            type="button"
            onClick={() => setSeletorAberto((v) => !v)}
            aria-expanded={seletorAberto}
            className="inline-flex items-center gap-1.5 px-3 h-7 rounded-full border border-oliva/30 text-oliva text-[11px] font-medium hover:bg-oliva/5 transition"
          >
            {seletorAberto ? "Fechar lista" : "Escolher da lista"}
          </button>
        )}
        <div className="flex-1 min-w-[180px]">
          <CampoNovoItem placeholder="ou digite um item" onAdd={onAlternar} />
        </div>
      </div>

      {seletorAberto && (
        <div className="mt-2">
          <SeletorBiblioteca
            biblioteca={biblioteca}
            selecionados={grupo.itens}
            onAlternar={onAlternar}
          />
        </div>
      )}
    </div>
  );
}

/** Campo curto de "digitar e adicionar", com Enter funcionando. */
function CampoNovoItem({
  placeholder,
  onAdd,
}: {
  placeholder: string;
  onAdd: (texto: string) => void;
}) {
  const [valor, setValor] = useState("");
  function enviar() {
    const t = valor.trim();
    if (!t) return;
    onAdd(t);
    setValor("");
  }
  return (
    <div className="flex items-center gap-1.5 mt-1.5">
      <input
        type="text"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            enviar();
          }
        }}
        placeholder={placeholder}
        className="form-input h-7 text-[11px] flex-1"
      />
      <button
        type="button"
        onClick={enviar}
        disabled={!valor.trim()}
        aria-label="Adicionar"
        className="w-7 h-7 inline-flex items-center justify-center rounded-full text-oliva hover:bg-oliva/10 disabled:opacity-30 transition shrink-0"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3 h-3">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </div>
  );
}
