"use client";
import { useState } from "react";
import { novoId } from "@/lib/kits";
import type { BibliotecaGrupo, Kit, KitGrupo } from "@/types/orcamento";

type Props = {
  kit: Kit;
  biblioteca: BibliotecaGrupo[];
  onChange: (kit: Kit) => void;
  onAddNaBiblioteca: (grupoId: string, item: string) => void;
  onVoltar: () => void;
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

export function KitEditor({ kit, biblioteca, onChange, onAddNaBiblioteca, onVoltar }: Props) {
  function patch(p: Partial<Kit>) {
    onChange({ ...kit, ...p });
  }
  function patchGrupo(idx: number, p: Partial<KitGrupo>) {
    onChange({ ...kit, grupos: kit.grupos.map((g, i) => (i === idx ? { ...g, ...p } : g)) });
  }
  function removerGrupo(idx: number) {
    onChange({ ...kit, grupos: kit.grupos.filter((_, i) => i !== idx) });
  }
  function adicionarGrupo() {
    onChange({ ...kit, grupos: [...kit.grupos, { id: novoId("g"), titulo: "", itens: [] }] });
  }
  function moverGrupo(idx: number, dir: -1 | 1) {
    const j = idx + dir;
    if (j < 0 || j >= kit.grupos.length) return;
    const next = [...kit.grupos];
    [next[idx], next[j]] = [next[j], next[idx]];
    onChange({ ...kit, grupos: next });
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={onVoltar}
          className="mt-1 inline-flex items-center justify-center w-9 h-9 rounded-full text-carvao/60 hover:bg-areia/40 hover:text-carvao transition shrink-0"
          aria-label="Voltar para a lista de kits"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <label className="block">
            <span className="eyebrow text-bronze">Nome do kit</span>
            <input
              type="text"
              value={kit.nome}
              onChange={(e) => patch({ nome: e.target.value })}
              placeholder="Ex: Festa Básica"
              className="form-input mt-1.5 font-serif text-lg"
              autoFocus={!kit.nome}
            />
          </label>
        </div>
      </div>

      <label className="block max-w-xs">
        <span className="eyebrow text-bronze">Mínimo de pessoas</span>
        <input
          type="number"
          min={0}
          value={kit.minimo_pessoas ?? ""}
          onChange={(e) =>
            patch({ minimo_pessoas: e.target.value === "" ? null : Number(e.target.value) || null })
          }
          placeholder="sem mínimo"
          className="form-input mt-1.5 tabular-nums"
        />
        <span className="mt-1 block text-[11px] text-carvao/50">
          Só um aviso pra você no orçamento. O cliente nunca vê.
        </span>
      </label>

      {/* Grupos */}
      <div className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h3 className="font-serif text-lg text-carvao">O que vai dentro</h3>
          <span className="text-xs text-carvao/50">
            {kit.grupos.reduce((a, g) => a + g.itens.length, 0)} itens
          </span>
        </div>

        {kit.grupos.map((grupo, idx) => (
          <GrupoEditor
            key={grupo.id}
            grupo={grupo}
            biblioteca={biblioteca}
            primeiro={idx === 0}
            ultimo={idx === kit.grupos.length - 1}
            onChange={(p) => patchGrupo(idx, p)}
            onRemover={() => removerGrupo(idx)}
            onMover={(dir) => moverGrupo(idx, dir)}
            onAddNaBiblioteca={onAddNaBiblioteca}
          />
        ))}

        <button type="button" onClick={adicionarGrupo} className={PillBtn}>
          <PlusIcon /> Novo grupo
        </button>
      </div>

      {/* Observações */}
      <ObservacoesEditor
        valores={kit.observacoes}
        onChange={(observacoes) => patch({ observacoes })}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */

function GrupoEditor({
  grupo,
  biblioteca,
  primeiro,
  ultimo,
  onChange,
  onRemover,
  onMover,
  onAddNaBiblioteca,
}: {
  grupo: KitGrupo;
  biblioteca: BibliotecaGrupo[];
  primeiro: boolean;
  ultimo: boolean;
  onChange: (p: Partial<KitGrupo>) => void;
  onRemover: () => void;
  onMover: (dir: -1 | 1) => void;
  onAddNaBiblioteca: (grupoId: string, item: string) => void;
}) {
  const [seletorAberto, setSeletorAberto] = useState(false);
  const [avulso, setAvulso] = useState("");

  function alternarItem(item: string) {
    onChange({
      itens: grupo.itens.includes(item)
        ? grupo.itens.filter((i) => i !== item)
        : [...grupo.itens, item],
    });
  }

  function adicionarAvulso() {
    const nome = avulso.trim();
    if (!nome || grupo.itens.includes(nome)) {
      setAvulso("");
      return;
    }
    onChange({ itens: [...grupo.itens, nome] });
    setAvulso("");
  }

  return (
    <section className="rounded-2xl border border-areia/60 bg-white p-4 md:p-5 space-y-4">
      <div className="flex items-start gap-2">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
          <label className="block">
            <span className="eyebrow text-bronze">Título do grupo</span>
            <input
              type="text"
              value={grupo.titulo}
              onChange={(e) => onChange({ titulo: e.target.value })}
              placeholder="Ex: Salgados"
              className="form-input mt-1.5"
            />
          </label>
          <label className="block">
            <span className="eyebrow text-bronze">Nota</span>
            <input
              type="text"
              value={grupo.nota ?? ""}
              onChange={(e) => onChange({ nota: e.target.value || undefined })}
              placeholder="Ex: 4 por convidado, à escolha"
              className="form-input mt-1.5"
            />
          </label>
        </div>
        <div className="flex flex-col gap-0.5 pt-6 shrink-0">
          <button
            type="button"
            onClick={() => onMover(-1)}
            disabled={primeiro}
            className="w-8 h-7 inline-flex items-center justify-center rounded-full text-carvao/50 hover:bg-areia/40 disabled:opacity-30"
            aria-label="Subir grupo"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><polyline points="18 15 12 9 6 15" /></svg>
          </button>
          <button
            type="button"
            onClick={() => onMover(1)}
            disabled={ultimo}
            className="w-8 h-7 inline-flex items-center justify-center rounded-full text-carvao/50 hover:bg-areia/40 disabled:opacity-30"
            aria-label="Descer grupo"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><polyline points="6 9 12 15 18 9" /></svg>
          </button>
          <button type="button" onClick={onRemover} className={IconBtn} aria-label="Remover grupo">
            <TrashIcon />
          </button>
        </div>
      </div>

      {/* Itens já escolhidos */}
      {grupo.itens.length > 0 ? (
        <ul className="flex flex-wrap gap-1.5">
          {/* Chave com índice: o nome sozinho não serve porque um grupo montado
              à mão pode acabar com dois itens iguais, e aí o React some com um
              deles em vez de mostrar o problema. */}
          {grupo.itens.map((item, i) => (
            <li key={`${item}-${i}`}>
              <button
                type="button"
                onClick={() => alternarItem(item)}
                title="Remover deste grupo"
                className="inline-flex items-center gap-1.5 pl-3 pr-2 h-8 rounded-full bg-oliva/10 text-oliva text-xs hover:bg-rose-50 hover:text-rose-600 transition"
              >
                {item}
                <span aria-hidden className="text-sm leading-none">×</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-carvao/45">
          Nenhum item ainda. Use <b>Escolher da lista</b> abaixo.
        </p>
      )}

      {/* Adicionar */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => setSeletorAberto((v) => !v)}
          className={PillBtn}
          aria-expanded={seletorAberto}
        >
          {seletorAberto ? "Fechar lista" : "Escolher da lista"}
        </button>

        <div className="flex items-center gap-1.5 flex-1 min-w-[220px]">
          <input
            type="text"
            value={avulso}
            onChange={(e) => setAvulso(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                adicionarAvulso();
              }
            }}
            placeholder="ou digite um item fora da lista"
            className="form-input h-8 text-xs flex-1"
          />
          <button
            type="button"
            onClick={adicionarAvulso}
            disabled={!avulso.trim()}
            className="w-8 h-8 inline-flex items-center justify-center rounded-full text-oliva hover:bg-oliva/10 disabled:opacity-30 transition shrink-0"
            aria-label="Adicionar item digitado"
          >
            <PlusIcon />
          </button>
        </div>
      </div>

      {seletorAberto && (
        <SeletorBiblioteca
          biblioteca={biblioteca}
          selecionados={grupo.itens}
          onAlternar={alternarItem}
          onAddNaBiblioteca={onAddNaBiblioteca}
        />
      )}
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────── */

/**
 * Painel de marcação da biblioteca.
 *
 * Exportado porque o mesmo seletor serve em dois lugares: montando o kit no
 * catálogo e acrescentando item a um kit já inserido num orçamento. Quando
 * `onAddNaBiblioteca` não vem, o campo de "novo item neste grupo" some, porque
 * dentro do orçamento mexer na biblioteca global seria efeito colateral.
 */
export function SeletorBiblioteca({
  biblioteca,
  selecionados,
  onAlternar,
  onAddNaBiblioteca,
}: {
  biblioteca: BibliotecaGrupo[];
  selecionados: string[];
  onAlternar: (item: string) => void;
  onAddNaBiblioteca?: (grupoId: string, item: string) => void;
}) {
  const [busca, setBusca] = useState("");
  const [abertos, setAbertos] = useState<string[]>(() => biblioteca.slice(0, 1).map((g) => g.id));

  const termo = busca.trim().toLowerCase();
  const filtrada = termo
    ? biblioteca
        .map((g) => ({ ...g, itens: g.itens.filter((i) => i.toLowerCase().includes(termo)) }))
        .filter((g) => g.itens.length > 0)
    : biblioteca;

  function alternarAberto(id: string) {
    setAbertos((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  }

  if (biblioteca.length === 0) {
    return (
      <p className="rounded-xl bg-creme border border-areia/60 px-4 py-3 text-xs text-carvao/60">
        A biblioteca desta categoria está vazia. Monte as listas na aba{" "}
        <b>Biblioteca</b> para poder marcar aqui.
      </p>
    );
  }

  return (
    <div className="rounded-xl bg-creme border border-areia/60 p-3 md:p-4 space-y-3">
      <input
        type="text"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Buscar item..."
        className="form-input h-9 text-sm"
      />

      <div className="max-h-[340px] overflow-y-auto space-y-2 pr-1">
        {filtrada.map((g) => {
          const aberto = termo ? true : abertos.includes(g.id);
          const marcados = g.itens.filter((i) => selecionados.includes(i)).length;
          return (
            <div key={g.id} className="rounded-lg border border-areia/50 bg-white">
              <button
                type="button"
                onClick={() => alternarAberto(g.id)}
                className="w-full flex items-center justify-between gap-3 px-3 py-2.5 text-left"
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span className={`text-oliva text-xs transition-transform ${aberto ? "rotate-90" : ""}`} aria-hidden>
                    ▸
                  </span>
                  <span className="text-sm text-carvao truncate">{g.titulo}</span>
                </span>
                <span className="text-[11px] text-carvao/45 shrink-0 tabular-nums">
                  {marcados > 0 ? `${marcados}/${g.itens.length}` : g.itens.length}
                </span>
              </button>

              {aberto && (
                <div className="px-3 pb-3 space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {g.itens.map((item) => {
                      const on = selecionados.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => onAlternar(item)}
                          aria-pressed={on}
                          className={`inline-flex items-center gap-1.5 px-3 h-8 rounded-full text-xs border transition ${
                            on
                              ? "bg-oliva text-white border-oliva"
                              : "bg-white text-carvao/70 border-areia/70 hover:border-oliva/50 hover:text-carvao"
                          }`}
                        >
                          {on && <span aria-hidden>✓</span>}
                          {item}
                        </button>
                      );
                    })}
                  </div>
                  {!termo && onAddNaBiblioteca && (
                    <AddNaBiblioteca grupoId={g.id} onAdd={onAddNaBiblioteca} />
                  )}
                </div>
              )}
            </div>
          );
        })}
        {filtrada.length === 0 && (
          <p className="px-1 py-4 text-center text-xs text-carvao/50">
            Nada encontrado. Você pode digitar o item no campo acima do seletor.
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <button
          type="button"
          onClick={() => {
            const visiveis = filtrada.flatMap((g) => g.itens);
            visiveis.filter((i) => !selecionados.includes(i)).forEach(onAlternar);
          }}
          className="text-[11px] text-oliva hover:underline underline-offset-4"
        >
          Marcar tudo que está à vista
        </button>
        <button
          type="button"
          onClick={() => {
            const visiveis = filtrada.flatMap((g) => g.itens);
            visiveis.filter((i) => selecionados.includes(i)).forEach(onAlternar);
          }}
          className="text-[11px] text-carvao/50 hover:text-carvao hover:underline underline-offset-4"
        >
          Desmarcar
        </button>
      </div>
    </div>
  );
}

/** Campo que acrescenta um item ao grupo da BIBLIOTECA, não ao kit. */
function AddNaBiblioteca({
  grupoId,
  onAdd,
}: {
  grupoId: string;
  onAdd: (grupoId: string, item: string) => void;
}) {
  const [valor, setValor] = useState("");
  function enviar() {
    const nome = valor.trim();
    if (!nome) return;
    onAdd(grupoId, nome);
    setValor("");
  }
  return (
    <div className="flex items-center gap-1.5 pt-1 border-t border-areia/40">
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
        placeholder="novo item neste grupo da biblioteca"
        className="form-input h-8 text-xs flex-1 mt-2"
      />
      <button
        type="button"
        onClick={enviar}
        disabled={!valor.trim()}
        className="mt-2 w-8 h-8 inline-flex items-center justify-center rounded-full text-oliva hover:bg-oliva/10 disabled:opacity-30 transition shrink-0"
        aria-label="Adicionar à biblioteca"
      >
        <PlusIcon />
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */

function ObservacoesEditor({
  valores,
  onChange,
}: {
  valores: string[];
  onChange: (v: string[]) => void;
}) {
  const [novo, setNovo] = useState("");

  function adicionar() {
    const t = novo.trim();
    if (!t) return;
    onChange([...valores, t]);
    setNovo("");
  }

  return (
    <section className="rounded-2xl border border-areia/60 bg-white p-4 md:p-5 space-y-3">
      <div>
        <h3 className="font-serif text-lg text-carvao">Também incluso</h3>
        <p className="mt-0.5 text-xs text-carvao/55">
          O que faz parte do kit mas não é comida: equipe, duração, lanche kids. Aparece
          numa linha só embaixo dos itens.
        </p>
      </div>

      {valores.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {valores.map((v, i) => (
            <li key={`${v}-${i}`}>
              <button
                type="button"
                onClick={() => onChange(valores.filter((_, j) => j !== i))}
                title="Remover"
                className="inline-flex items-center gap-1.5 pl-3 pr-2 h-8 rounded-full bg-areia/40 text-carvao/75 text-xs hover:bg-rose-50 hover:text-rose-600 transition"
              >
                {v}
                <span aria-hidden className="text-sm leading-none">×</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center gap-1.5">
        <input
          type="text"
          value={novo}
          onChange={(e) => setNovo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              adicionar();
            }
          }}
          placeholder="Ex: 4 horas de evento"
          className="form-input h-9 text-sm flex-1"
        />
        <button
          type="button"
          onClick={adicionar}
          disabled={!novo.trim()}
          className="w-9 h-9 inline-flex items-center justify-center rounded-full text-oliva hover:bg-oliva/10 disabled:opacity-30 transition shrink-0"
          aria-label="Adicionar observação"
        >
          <PlusIcon />
        </button>
      </div>
    </section>
  );
}
