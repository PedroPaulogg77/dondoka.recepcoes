"use client";
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { OrcamentoView, type EditorMode, type SectionEditableKey } from "@/components/public/OrcamentoView";
import { OrcamentoForm } from "./OrcamentoForm";
import { DrawerCliente } from "./drawers/DrawerCliente";
import { DrawerTexto } from "./drawers/DrawerTexto";
import { DrawerFotos } from "./drawers/DrawerFotos";
import { DrawerDecoracao } from "./drawers/DrawerDecoracao";
import { DrawerBuffet } from "./drawers/DrawerBuffet";
import { DrawerServicos } from "./drawers/DrawerServicos";
import { DrawerItens } from "./drawers/DrawerItens";
import { DrawerObservacoes } from "./drawers/DrawerObservacoes";
import { DrawerContato } from "./drawers/DrawerContato";
import { SectionNav } from "./SectionNav";
import {
  buildInitialForm,
  buildVirtualOrcamento,
  normalizeForSave,
  resolveDefaults,
  type FormState,
} from "@/lib/orcamento-helpers";
import type { ConfigGlobal, Orcamento, SecoesVisiveis } from "@/types/orcamento";

type Mode = "criar" | "editar";

type Props = {
  mode: Mode;
  orcamento?: Orcamento;
  config: ConfigGlobal;
};

const MAX_HISTORY = 20;

export function OrcamentoEditor({ mode, orcamento, config }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [modoClassico, setModoClassico] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  const defaults = useMemo(() => resolveDefaults(config), [config]);

  const initial = useMemo(() => buildInitialForm(config, orcamento), [config, orcamento]);
  const [form, setForm] = useState<FormState>(initial);
  const [initialSnapshot, setInitialSnapshot] = useState(() => JSON.stringify(initial));

  // ===== Histórico para desfazer =====
  const history = useRef<string[]>([JSON.stringify(initial)]);
  const historyIndex = useRef(0);
  const [canUndo, setCanUndo] = useState(false);

  function pushHistory(formState: FormState) {
    const json = JSON.stringify(formState);
    // Não duplicar se igual ao último
    if (history.current[historyIndex.current] === json) return;
    // Corta qualquer estado à frente (se já deu undo)
    history.current = history.current.slice(0, historyIndex.current + 1);
    history.current.push(json);
    if (history.current.length > MAX_HISTORY) {
      history.current.shift();
    }
    historyIndex.current = history.current.length - 1;
    setCanUndo(historyIndex.current > 0);
  }

  function undo() {
    if (historyIndex.current <= 0) return;
    historyIndex.current--;
    const prev = JSON.parse(history.current[historyIndex.current]) as FormState;
    setForm(prev);
    setCanUndo(historyIndex.current > 0);
    setToast("Alteração desfeita");
    setTimeout(() => setToast(null), 2000);
  }

  // Auto-save state
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<null | "saving" | "saved">(null);

  const update = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  }, []);

  // Defer pra preview
  const deferredForm = useDeferredValue(form);

  const virtualOrcamento = useMemo(
    () => buildVirtualOrcamento(deferredForm, config, orcamento),
    [deferredForm, config, orcamento]
  );

  const dirty = JSON.stringify(form) !== initialSnapshot;

  // beforeunload
  useEffect(() => {
    if (!dirty) return;
    function onBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  // Fechar menu ao clicar fora
  useEffect(() => {
    if (!menuAberto) return;
    function close() { setMenuAberto(false); }
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [menuAberto]);

  // ===== Drawers =====
  const [openDrawer, setOpenDrawer] = useState<SectionEditableKey | null>(null);
  const [openObservacoes, setOpenObservacoes] = useState(false);

  // Snapshot for drawer undo
  const drawerSnapshot = useRef<string>("");

  useEffect(() => {
    if (openDrawer) {
      drawerSnapshot.current = JSON.stringify(form);
    }
  }, [openDrawer]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (openObservacoes) {
      drawerSnapshot.current = JSON.stringify(form);
    }
  }, [openObservacoes]); // eslint-disable-line react-hooks/exhaustive-deps

  // Ao fechar drawer, salva snapshot no histórico
  const prevOpenDrawer = useRef<SectionEditableKey | null>(null);
  useEffect(() => {
    if (prevOpenDrawer.current && !openDrawer) {
      // Drawer fechou — empurra estado atual pro histórico
      pushHistory(form);
    }
    prevOpenDrawer.current = openDrawer;
  }, [openDrawer]); // eslint-disable-line react-hooks/exhaustive-deps

  const prevOpenObs = useRef(false);
  useEffect(() => {
    if (prevOpenObs.current && !openObservacoes) {
      pushHistory(form);
    }
    prevOpenObs.current = openObservacoes;
  }, [openObservacoes]); // eslint-disable-line react-hooks/exhaustive-deps

  function undoDrawer() {
    if (!drawerSnapshot.current) return;
    try {
      const restored = JSON.parse(drawerSnapshot.current) as FormState;
      setForm(restored);
    } catch { /* noop */ }
  }

  function onEditSection(key: SectionEditableKey) {
    setOpenDrawer(key);
  }

  function onToggleSecao(key: keyof SecoesVisiveis) {
    pushHistory(form);
    update("secoes_visiveis", { ...form.secoes_visiveis, [key]: !form.secoes_visiveis[key] });
  }

  const editorMode: EditorMode = {
    secoesVisiveis: form.secoes_visiveis,
    onToggleSecao,
    onEditSection,
  };

  // ===== Save =====
  async function handleSave(opts?: { publish?: boolean; draftOnly?: boolean }) {
    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = null;
    }

    setErro(null);
    if (!form.cliente_nome.trim()) {
      setErro("Informe o nome do cliente (toque na capa pra editar).");
      setOpenDrawer("cliente");
      return;
    }
    setSalvando(true);

    let formToSave = form;
    if (opts?.publish) {
      formToSave = { ...form, publicado: true };
      setForm(formToSave);
    }

    const payload = normalizeForSave(formToSave, defaults);
    const url = mode === "criar" ? "/api/admin/orcamentos" : `/api/admin/orcamentos/${orcamento!.id}`;
    const res = await fetch(url, {
      method: mode === "criar" ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSalvando(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setErro(body.error || "Erro ao salvar.");
      return;
    }
    const data = await res.json();
    setInitialSnapshot(JSON.stringify(formToSave));
    pushHistory(formToSave);
    setToast(opts?.publish ? "Publicado!" : "Salvo!");
    setTimeout(() => setToast(null), 2500);
    if (mode === "criar") {
      startTransition(() => {
        router.push(`/admin/${data.id}`);
        router.refresh();
      });
    } else {
      startTransition(() => router.refresh());
    }
  }

  // ===== Auto-save =====
  async function autoSave() {
    if (!orcamento) return;
    setAutoSaveStatus("saving");
    const payload = normalizeForSave(form, defaults);
    const res = await fetch(`/api/admin/orcamentos/${orcamento.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setInitialSnapshot(JSON.stringify(form));
      pushHistory(form);
      setAutoSaveStatus("saved");
      setTimeout(() => setAutoSaveStatus(null), 2000);
      startTransition(() => router.refresh());
    } else {
      setAutoSaveStatus(null);
    }
  }

  useEffect(() => {
    if (mode !== "editar" || !dirty || !orcamento) return;
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      autoSave();
    }, 4000);
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };
  }, [form]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleDelete() {
    if (!orcamento) return;
    if (!confirm("Tem certeza que deseja excluir este orçamento?")) return;
    await fetch(`/api/admin/orcamentos/${orcamento.id}`, { method: "DELETE" });
    router.push("/admin");
    router.refresh();
  }

  async function handleDuplicate() {
    if (!orcamento) return;
    const res = await fetch(`/api/admin/orcamentos/${orcamento.id}/duplicate`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      router.push(`/admin/${data.id}`);
    }
  }

  const publicUrl = orcamento
    ? `${process.env.NEXT_PUBLIC_APP_URL || ""}/orcamento/${orcamento.slug}`
    : null;

  async function marcarComoEnviado() {
    if (form.status !== "rascunho" || !form.publicado || !orcamento) return false;
    update("status", "enviado");
    await fetch(`/api/admin/orcamentos/${orcamento.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "enviado" }),
    });
    return true;
  }

  async function copiarUrl() {
    if (!publicUrl) return;
    navigator.clipboard.writeText(publicUrl);
    const marcou = await marcarComoEnviado();
    setToast(marcou ? "Link copiado! Status → Enviado" : "Link copiado!");
    setTimeout(() => setToast(null), 2500);
  }

  async function copiarMensagemWpp() {
    if (!publicUrl) return;
    const msg = `Olá, ${form.cliente_nome.split(" ")[0]}! Preparei sua proposta personalizada da Dondoka Recepções. ✨\n\nAcesse aqui: ${publicUrl}\n\nQualquer dúvida, é só chamar!`;
    navigator.clipboard.writeText(msg);
    const marcou = await marcarComoEnviado();
    setToast(marcou ? "Mensagem copiada! Status → Enviado" : "Mensagem copiada!");
    setTimeout(() => setToast(null), 3000);
  }

  // Status label curto
  const statusLabel = salvando
    ? "Salvando..."
    : autoSaveStatus === "saving"
      ? "Salvando..."
      : autoSaveStatus === "saved"
        ? "Salvo ✓"
        : dirty
          ? "Não salvo"
          : form.publicado
            ? "Publicado"
            : "Rascunho";

  return (
    <div className="-mx-4 md:-mx-6 -my-8 md:-my-12 min-h-screen bg-creme">
      {/* Header sticky — SIMPLIFICADO */}
      <header className="sticky top-16 z-40 bg-oliva text-white">
        <div className="max-w-6xl mx-auto px-3 md:px-5 h-12 flex items-center justify-between gap-2">
          {/* Esquerda: Voltar + Nome */}
          <div className="flex items-center gap-1 min-w-0">
            <Link
              href="/admin"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/15 transition shrink-0"
              aria-label="Voltar"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </Link>
            <span className="font-serif text-sm md:text-base text-white truncate">
              {mode === "criar" ? "Nova proposta" : form.cliente_nome || "Sem nome"}
            </span>
            <span className="ml-1.5 text-[10px] text-white/60 hidden sm:inline whitespace-nowrap">
              {statusLabel}
            </span>
            {dirty && !salvando && autoSaveStatus !== "saving" && (
              <span className="ml-1 w-1.5 h-1.5 rounded-full bg-rose-300 animate-pulse shrink-0" aria-hidden />
            )}
          </div>

          {/* Direita: Desfazer + Ações + Salvar */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Desfazer */}
            {canUndo && (
              <button
                type="button"
                onClick={undo}
                title="Desfazer última alteração"
                className="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/15 transition"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M3 10h10a5 5 0 0 1 0 10H9" />
                  <path d="M3 10l4-4" />
                  <path d="M3 10l4 4" />
                </svg>
              </button>
            )}

            {/* Menu de ações (⋯) */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setMenuAberto(!menuAberto); }}
                className="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/15 transition"
                aria-label="Mais ações"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <circle cx="12" cy="5" r="1.5" />
                  <circle cx="12" cy="12" r="1.5" />
                  <circle cx="12" cy="19" r="1.5" />
                </svg>
              </button>

              {menuAberto && (
                <div
                  className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-premium border border-areia/40 py-1.5 z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  {publicUrl && (
                    <>
                      <button
                        type="button"
                        onClick={() => { copiarUrl(); setMenuAberto(false); }}
                        className="w-full px-4 py-2.5 text-left text-sm text-carvao hover:bg-areia/30 flex items-center gap-2.5"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-carvao/50">
                          <path d="M10 13a5 5 0 007.07 0l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                          <path d="M14 11a5 5 0 00-7.07 0l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                        </svg>
                        Copiar link
                      </button>
                      <button
                        type="button"
                        onClick={() => { copiarMensagemWpp(); setMenuAberto(false); }}
                        className="w-full px-4 py-2.5 text-left text-sm text-carvao hover:bg-areia/30 flex items-center gap-2.5"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-carvao/50">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                        </svg>
                        Copiar mensagem WhatsApp
                      </button>
                      <a
                        href={publicUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setMenuAberto(false)}
                        className="w-full px-4 py-2.5 text-left text-sm text-carvao hover:bg-areia/30 flex items-center gap-2.5"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-carvao/50">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        Ver como cliente
                      </a>
                      <div className="border-t border-areia/40 my-1" />
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => { setOpenObservacoes(true); setMenuAberto(false); }}
                    className="w-full px-4 py-2.5 text-left text-sm text-carvao hover:bg-areia/30 flex items-center gap-2.5"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-carvao/50">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    Observações internas
                  </button>
                  <button
                    type="button"
                    onClick={() => { setModoClassico((v) => !v); setMenuAberto(false); }}
                    className="w-full px-4 py-2.5 text-left text-sm text-carvao hover:bg-areia/30 flex items-center gap-2.5"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-carvao/50">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M3 9h18M9 21V9" />
                    </svg>
                    {modoClassico ? "Modo visual" : "Modo formulário"}
                  </button>
                  {mode === "editar" && (
                    <>
                      <button
                        type="button"
                        onClick={() => { handleDuplicate(); setMenuAberto(false); }}
                        className="w-full px-4 py-2.5 text-left text-sm text-carvao hover:bg-areia/30 flex items-center gap-2.5"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-carvao/50">
                          <rect x="9" y="9" width="13" height="13" rx="2" />
                          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                        </svg>
                        Duplicar
                      </button>
                      <div className="border-t border-areia/40 my-1" />
                      <button
                        type="button"
                        onClick={() => { handleDelete(); setMenuAberto(false); }}
                        className="w-full px-4 py-2.5 text-left text-sm text-rose-500 hover:bg-rose-50 flex items-center gap-2.5"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                        Excluir
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Botão principal de ação */}
            <button
              type="button"
              onClick={() => {
                if (form.publicado) {
                  handleSave();
                } else {
                  handleSave({ publish: true });
                }
              }}
              disabled={salvando || isPending || (form.publicado && !dirty && mode === "editar")}
              className="inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-full bg-white text-oliva text-sm font-semibold hover:bg-creme disabled:opacity-50 disabled:cursor-not-allowed transition shadow-soft"
            >
              {salvando ? (
                "Salvando..."
              ) : mode === "criar" ? (
                "Publicar"
              ) : !form.publicado ? (
                "Publicar"
              ) : dirty ? (
                "Salvar"
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                  Salvo
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      {modoClassico ? (
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
          <OrcamentoForm mode={mode} orcamento={orcamento} config={config} />
        </div>
      ) : (
        <>
          <OrcamentoView orcamento={virtualOrcamento} config={config} editorMode={editorMode} />
          <SectionNav />
        </>
      )}

      {/* Erro */}
      {erro && (
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 text-sm">
            {erro}
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] px-5 py-3 rounded-full bg-carvao text-white text-sm shadow-premium floating-entrance" style={{ animationDelay: "0s" }}>
          {toast}
        </div>
      )}

      {/* ===== Drawers ===== */}
      <DrawerCliente
        open={openDrawer === "cliente" || openDrawer === "dados"}
        onClose={() => setOpenDrawer(null)}
        form={form}
        update={update}
        onUndo={undoDrawer}
      />
      <DrawerTexto
        open={openDrawer === "sobre"}
        onClose={() => setOpenDrawer(null)}
        title="Sobre o espaço"
        subtitle="Texto descritivo institucional"
        label="Texto sobre o espaço"
        value={form.sobre_texto}
        defaultValue={defaults.sobre}
        onChange={(v) => update("sobre_texto", v)}
        rows={8}
        onUndo={undoDrawer}
      />
      <DrawerFotos
        open={openDrawer === "galeria"}
        onClose={() => setOpenDrawer(null)}
        selecionadas={form.fotos_selecionadas}
        onChange={(v) => update("fotos_selecionadas", v)}
        onUndo={undoDrawer}
      />
      <DrawerDecoracao
        open={openDrawer === "decoracao"}
        onClose={() => setOpenDrawer(null)}
        texto={form.decoracao_texto}
        defaultTexto={defaults.decoracao}
        itens={form.itens_decoracao}
        onChangeTexto={(v) => update("decoracao_texto", v)}
        onChangeItens={(v) => update("itens_decoracao", v)}
        onUndo={undoDrawer}
      />
      <DrawerBuffet
        open={openDrawer === "buffet"}
        onClose={() => setOpenDrawer(null)}
        value={form.buffet_dados}
        defaultValue={defaults.buffet}
        onChange={(v) => update("buffet_dados", v)}
        onUndo={undoDrawer}
      />
      <DrawerServicos
        open={openDrawer === "servicos"}
        onClose={() => setOpenDrawer(null)}
        value={form.servicos_opcionais_dados}
        defaultValue={defaults.servicos}
        onChange={(v) => update("servicos_opcionais_dados", v)}
        onUndo={undoDrawer}
      />
      <DrawerItens
        open={openDrawer === "investimento"}
        onClose={() => setOpenDrawer(null)}
        espaco={form.itens_espaco}
        decoracao={form.itens_decoracao}
        buffet={form.itens_buffet}
        onChangeEspaco={(v) => update("itens_espaco", v)}
        onChangeDecoracao={(v) => update("itens_decoracao", v)}
        onChangeBuffet={(v) => update("itens_buffet", v)}
        onUndo={undoDrawer}
      />
      <DrawerTexto
        open={openDrawer === "pagamento"}
        onClose={() => setOpenDrawer(null)}
        title="Forma de pagamento"
        subtitle="Separe em 2 parágrafos por linha em branco — viram 2 cards na proposta"
        label="Condições de pagamento"
        value={form.condicoes_pagamento}
        defaultValue={defaults.pagamento}
        onChange={(v) => update("condicoes_pagamento", v)}
        rows={6}
        onUndo={undoDrawer}
      />
      <DrawerContato
        open={openDrawer === "contato"}
        onClose={() => setOpenDrawer(null)}
        config={config}
        onUndo={undoDrawer}
      />

      <DrawerObservacoes
        open={openObservacoes}
        onClose={() => setOpenObservacoes(false)}
        value={form.observacoes}
        onChange={(v) => update("observacoes", v)}
        onUndo={undoDrawer}
      />
    </div>
  );
}
