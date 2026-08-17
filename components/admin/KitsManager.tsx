"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { SectionHelp } from "./SectionHelp";
import { KitEditor } from "./KitEditor";
import { BIBLIOTECA_SEED, KITS_SEED } from "@/content/kits";
import {
  bibliotecaDaCategoria,
  contarItens,
  duplicarKit,
  kitVazio,
  kitsDaCategoria,
  novoId,
  resolveBiblioteca,
  resolveKits,
} from "@/lib/kits";
import type { BibliotecaGrupo, CategoriaKit, ConfigGlobal, Kit } from "@/types/orcamento";

const CATEGORIAS: { value: CategoriaKit; label: string }[] = [
  { value: "buffet", label: "Buffet" },
  { value: "decoracao", label: "Decoração" },
];

type Aba = "kits" | "biblioteca";

export function KitsManager({ config }: { config: ConfigGlobal }) {
  const router = useRouter();

  const inicial = useMemo(
    () => ({
      kits: resolveKits(config),
      biblioteca: resolveBiblioteca(config),
    }),
    [config]
  );

  const [kits, setKits] = useState<Kit[]>(inicial.kits);
  const [biblioteca, setBiblioteca] = useState<BibliotecaGrupo[]>(inicial.biblioteca);
  const [categoria, setCategoria] = useState<CategoriaKit>("buffet");
  const [aba, setAba] = useState<Aba>("kits");
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const snapshotInicial = useMemo(
    () => JSON.stringify({ kits: inicial.kits, biblioteca: inicial.biblioteca }),
    [inicial]
  );
  const [snapshotSalvo, setSnapshotSalvo] = useState(snapshotInicial);
  const sujo = JSON.stringify({ kits, biblioteca }) !== snapshotSalvo;

  const kitsVisiveis = kitsDaCategoria(kits, categoria);
  const bibliotecaVisivel = bibliotecaDaCategoria(biblioteca, categoria);
  const emEdicao = kits.find((k) => k.id === editandoId) ?? null;

  /* ── kits ── */

  function atualizarKit(atualizado: Kit) {
    setKits((prev) => prev.map((k) => (k.id === atualizado.id ? atualizado : k)));
  }

  function criarKit() {
    const novo = kitVazio(categoria);
    setKits((prev) => [...prev, novo]);
    setEditandoId(novo.id);
  }

  function duplicar(kit: Kit) {
    const copia = duplicarKit(kit);
    setKits((prev) => [...prev, copia]);
    setEditandoId(copia.id);
  }

  function excluir(kit: Kit) {
    if (!confirm(`Excluir o kit "${kit.nome || "sem nome"}"? Propostas que já usam ele não mudam.`)) return;
    setKits((prev) => prev.filter((k) => k.id !== kit.id));
    if (editandoId === kit.id) setEditandoId(null);
  }

  /* ── biblioteca ── */

  function addNaBiblioteca(grupoId: string, item: string) {
    setBiblioteca((prev) =>
      prev.map((g) =>
        g.id === grupoId && !g.itens.includes(item) ? { ...g, itens: [...g.itens, item] } : g
      )
    );
  }

  function patchGrupoBiblioteca(id: string, p: Partial<BibliotecaGrupo>) {
    setBiblioteca((prev) => prev.map((g) => (g.id === id ? { ...g, ...p } : g)));
  }

  function criarGrupoBiblioteca() {
    setBiblioteca((prev) => [
      ...prev,
      { id: novoId("bib"), categoria, titulo: "", itens: [] },
    ]);
  }

  function excluirGrupoBiblioteca(g: BibliotecaGrupo) {
    if (!confirm(`Excluir o grupo "${g.titulo || "sem nome"}" da biblioteca? Kits já montados não mudam.`)) return;
    setBiblioteca((prev) => prev.filter((x) => x.id !== g.id));
  }

  function restaurarCatalogo() {
    if (!confirm("Recarregar o catálogo do fornecedor? Isso substitui os kits e a biblioteca por como vieram nos PDFs. Vale para as duas categorias.")) return;
    setKits(KITS_SEED);
    setBiblioteca(BIBLIOTECA_SEED);
    setEditandoId(null);
  }

  /* ── salvar ── */

  async function salvar() {
    setSalvando(true);
    setErro(null);
    setOk(false);
    const res = await fetch("/api/admin/config", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kits_catalogo: kits, biblioteca_itens: biblioteca }),
    });
    setSalvando(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setErro(body.error || "Não foi possível salvar.");
      return;
    }
    setSnapshotSalvo(JSON.stringify({ kits, biblioteca }));
    setOk(true);
    setTimeout(() => setOk(false), 2500);
    router.refresh();
  }

  return (
    <div className="space-y-8 pb-4">
      <div>
        <p className="eyebrow">Catálogo</p>
        <h1 className="mt-2 text-3xl md:text-4xl font-serif text-carvao">Kits</h1>
        <p className="mt-1 text-sm text-carvao/60">
          Os pacotes que você seleciona na hora de montar um orçamento. Sem preço aqui: o
          valor é digitado em cada proposta.
        </p>
        <SectionHelp title="Como funcionam os kits">
          <p>
            A <b>Biblioteca</b> é a lista crua de tudo que o fornecedor faz. Serve só para você
            marcar rápido, sem digitar item por item.
          </p>
          <p>
            O <b>Kit</b> é o pacote de venda. Ele guarda uma <b>cópia</b> dos itens marcados, então
            mexer na biblioteca depois não altera kit já montado, nem proposta já enviada.
          </p>
          <p>
            A <b>nota</b> de cada grupo é o que separa &quot;a lista inteira&quot; de &quot;escolha 4
            destes&quot;. Sem ela o kit promete mais do que o fornecedor entrega.
          </p>
        </SectionHelp>
      </div>

      {/* Categoria */}
      <div className="flex flex-wrap items-center gap-2">
        {CATEGORIAS.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => {
              setCategoria(c.value);
              setEditandoId(null);
            }}
            className={`px-4 h-9 rounded-full text-sm transition ${
              categoria === c.value
                ? "bg-oliva text-white"
                : "bg-areia/40 text-carvao/65 hover:bg-areia/70"
            }`}
          >
            {c.label}
            <span className="ml-1.5 opacity-70 tabular-nums">
              {kitsDaCategoria(kits, c.value).length}
            </span>
          </button>
        ))}
      </div>

      {emEdicao ? (
        <KitEditor
          kit={emEdicao}
          biblioteca={bibliotecaVisivel}
          onChange={atualizarKit}
          onAddNaBiblioteca={addNaBiblioteca}
          onVoltar={() => setEditandoId(null)}
        />
      ) : (
        <>
          {/* Sub-abas */}
          <div className="flex gap-1 p-1 rounded-full bg-areia/40 w-fit">
            {(["kits", "biblioteca"] as Aba[]).map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAba(a)}
                className={`px-4 h-8 rounded-full text-xs md:text-sm transition ${
                  aba === a ? "bg-white text-oliva shadow-soft font-medium" : "text-carvao/60 hover:text-carvao"
                }`}
              >
                {a === "kits" ? "Kits" : "Biblioteca"}
              </button>
            ))}
          </div>

          {aba === "kits" ? (
            <ListaKits
              kits={kitsVisiveis}
              onEditar={(k) => setEditandoId(k.id)}
              onDuplicar={duplicar}
              onExcluir={excluir}
              onCriar={criarKit}
            />
          ) : (
            <ListaBiblioteca
              grupos={bibliotecaVisivel}
              onPatch={patchGrupoBiblioteca}
              onExcluir={excluirGrupoBiblioteca}
              onCriar={criarGrupoBiblioteca}
            />
          )}
        </>
      )}

      {erro && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 text-sm">
          {erro}
        </div>
      )}

      {/* Barra de salvar */}
      <div className="sticky bottom-0 -mx-4 md:-mx-6 px-4 md:px-6 py-4 bg-white/90 backdrop-blur border-t border-areia/60 flex flex-wrap gap-3 justify-between items-center">
        <button
          type="button"
          onClick={restaurarCatalogo}
          className="text-xs text-carvao/50 hover:text-carvao underline-offset-4 hover:underline"
        >
          ↺ Recarregar catálogo do fornecedor
        </button>
        <div className="flex items-center gap-3">
          {ok && <span className="text-sm text-emerald-600">Salvo!</span>}
          {!ok && sujo && <span className="text-xs text-carvao/50">Não salvo</span>}
          <Button type="button" onClick={salvar} disabled={salvando || !sujo}>
            {salvando ? "Salvando..." : "Salvar catálogo"}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */

function ListaKits({
  kits,
  onEditar,
  onDuplicar,
  onExcluir,
  onCriar,
}: {
  kits: Kit[];
  onEditar: (k: Kit) => void;
  onDuplicar: (k: Kit) => void;
  onExcluir: (k: Kit) => void;
  onCriar: () => void;
}) {
  return (
    <div className="space-y-3">
      {kits.length === 0 && (
        <div className="rounded-2xl border border-areia/60 bg-white p-10 text-center">
          <p className="font-serif text-lg text-carvao">Nenhum kit nesta categoria</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-carvao/60">
            Crie o primeiro. Depois é só selecionar ele dentro do orçamento e digitar o valor.
          </p>
        </div>
      )}

      {kits.map((kit) => (
        <article
          key={kit.id}
          className="rounded-2xl border border-areia/60 bg-white shadow-soft transition hover:shadow-premium"
        >
          <div className="flex items-center gap-3 p-4 md:p-5">
            <button
              type="button"
              onClick={() => onEditar(kit)}
              className="flex-1 min-w-0 text-left"
            >
              <h3 className="font-serif text-lg text-carvao truncate">
                {kit.nome || "Kit sem nome"}
              </h3>
              <p className="mt-0.5 text-xs text-carvao/55">
                {kit.grupos.length} {kit.grupos.length === 1 ? "grupo" : "grupos"}
                <span className="mx-1.5 text-carvao/30">·</span>
                {contarItens(kit)} itens
                {kit.observacoes.length > 0 && (
                  <>
                    <span className="mx-1.5 text-carvao/30">·</span>
                    {kit.observacoes.length} inclusos
                  </>
                )}
                {kit.minimo_pessoas ? (
                  <>
                    <span className="mx-1.5 text-carvao/30">·</span>
                    mín. {kit.minimo_pessoas} pessoas
                  </>
                ) : null}
              </p>
            </button>

            <div className="flex items-center gap-0.5 shrink-0">
              <button
                type="button"
                onClick={() => onEditar(kit)}
                className="w-9 h-9 inline-flex items-center justify-center rounded-full text-oliva hover:bg-oliva/10 transition"
                aria-label={`Editar ${kit.nome}`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => onDuplicar(kit)}
                className="w-9 h-9 inline-flex items-center justify-center rounded-full text-carvao/50 hover:bg-areia/40 hover:text-carvao transition"
                aria-label={`Duplicar ${kit.nome}`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => onExcluir(kit)}
                className="w-9 h-9 inline-flex items-center justify-center rounded-full text-carvao/40 hover:bg-rose-50 hover:text-rose-500 transition"
                aria-label={`Excluir ${kit.nome}`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                  <path d="M10 11v6M14 11v6" />
                </svg>
              </button>
            </div>
          </div>
        </article>
      ))}

      <button
        type="button"
        onClick={onCriar}
        className="w-full h-11 rounded-xl border border-dashed border-oliva/40 text-oliva hover:bg-oliva/5 text-sm font-medium inline-flex items-center justify-center gap-1.5 transition"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Novo kit
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */

function ListaBiblioteca({
  grupos,
  onPatch,
  onExcluir,
  onCriar,
}: {
  grupos: BibliotecaGrupo[];
  onPatch: (id: string, p: Partial<BibliotecaGrupo>) => void;
  onExcluir: (g: BibliotecaGrupo) => void;
  onCriar: () => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-carvao/60">
        As listas de onde você marca os itens ao montar um kit. Mexer aqui não altera kit
        já montado.
      </p>

      {grupos.map((g) => (
        <GrupoBiblioteca key={g.id} grupo={g} onPatch={onPatch} onExcluir={onExcluir} />
      ))}

      <button
        type="button"
        onClick={onCriar}
        className="w-full h-11 rounded-xl border border-dashed border-oliva/40 text-oliva hover:bg-oliva/5 text-sm font-medium inline-flex items-center justify-center gap-1.5 transition"
      >
        + Novo grupo na biblioteca
      </button>
    </div>
  );
}

function GrupoBiblioteca({
  grupo,
  onPatch,
  onExcluir,
}: {
  grupo: BibliotecaGrupo;
  onPatch: (id: string, p: Partial<BibliotecaGrupo>) => void;
  onExcluir: (g: BibliotecaGrupo) => void;
}) {
  const [aberto, setAberto] = useState(false);
  const [novo, setNovo] = useState("");

  function adicionar() {
    const t = novo.trim();
    if (!t || grupo.itens.includes(t)) {
      setNovo("");
      return;
    }
    onPatch(grupo.id, { itens: [...grupo.itens, t] });
    setNovo("");
  }

  return (
    <section className="rounded-2xl border border-areia/60 bg-white">
      <div className="flex items-center gap-2 p-3 md:p-4">
        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          className="w-8 h-8 inline-flex items-center justify-center rounded-full text-oliva hover:bg-oliva/10 shrink-0"
          aria-label={aberto ? "Fechar grupo" : "Abrir grupo"}
          aria-expanded={aberto}
        >
          <span className={`transition-transform ${aberto ? "rotate-90" : ""}`} aria-hidden>▸</span>
        </button>
        <input
          type="text"
          value={grupo.titulo}
          onChange={(e) => onPatch(grupo.id, { titulo: e.target.value })}
          placeholder="Nome do grupo"
          className="form-input h-9 flex-1 min-w-0"
        />
        <span className="text-xs text-carvao/45 tabular-nums shrink-0 w-10 text-right">
          {grupo.itens.length}
        </span>
        <button
          type="button"
          onClick={() => onExcluir(grupo)}
          className="w-8 h-8 inline-flex items-center justify-center rounded-full text-carvao/40 hover:bg-rose-50 hover:text-rose-500 transition shrink-0"
          aria-label="Excluir grupo"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
          </svg>
        </button>
      </div>

      {aberto && (
        <div className="px-3 md:px-4 pb-4 space-y-3">
          <ul className="flex flex-wrap gap-1.5">
            {grupo.itens.map((item) => (
              <li key={item}>
                <button
                  type="button"
                  onClick={() =>
                    onPatch(grupo.id, { itens: grupo.itens.filter((i) => i !== item) })
                  }
                  title="Remover da biblioteca"
                  className="inline-flex items-center gap-1.5 pl-3 pr-2 h-8 rounded-full bg-areia/40 text-carvao/75 text-xs hover:bg-rose-50 hover:text-rose-600 transition"
                >
                  {item}
                  <span aria-hidden className="text-sm leading-none">×</span>
                </button>
              </li>
            ))}
            {grupo.itens.length === 0 && (
              <li className="text-xs text-carvao/45">Grupo vazio.</li>
            )}
          </ul>

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
              placeholder="Adicionar item"
              className="form-input h-8 text-xs flex-1"
            />
            <button
              type="button"
              onClick={adicionar}
              disabled={!novo.trim()}
              className="w-8 h-8 inline-flex items-center justify-center rounded-full text-oliva hover:bg-oliva/10 disabled:opacity-30 transition shrink-0"
              aria-label="Adicionar item"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
