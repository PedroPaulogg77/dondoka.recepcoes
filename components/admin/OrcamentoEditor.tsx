"use client";
import { useCallback, useDeferredValue, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { OrcamentoView, type EditorMode, type SectionEditableKey } from "@/components/public/OrcamentoView";
import { OrcamentoForm } from "./OrcamentoForm";
import { Drawer } from "./Drawer";
import { DrawerCliente } from "./drawers/DrawerCliente";
import { DrawerTexto } from "./drawers/DrawerTexto";
import { DrawerFotos } from "./drawers/DrawerFotos";
import { DrawerDecoracao } from "./drawers/DrawerDecoracao";
import { DrawerBuffet } from "./drawers/DrawerBuffet";
import { DrawerServicos } from "./drawers/DrawerServicos";
import { DrawerItens } from "./drawers/DrawerItens";
import { DrawerObservacoes } from "./drawers/DrawerObservacoes";
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

export function OrcamentoEditor({ mode, orcamento, config }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [modoClassico, setModoClassico] = useState(false);

  const defaults = useMemo(() => resolveDefaults(config), [config]);

  const initial = useMemo(() => buildInitialForm(config, orcamento), [config, orcamento]);
  const [form, setForm] = useState<FormState>(initial);
  const [initialSnapshot, setInitialSnapshot] = useState(() => JSON.stringify(initial));

  const update = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  }, []);

  // Defer pra preview: digitar fica suave mesmo com re-render pesado da apresentação
  const deferredForm = useDeferredValue(form);

  const virtualOrcamento = useMemo(
    () => buildVirtualOrcamento(deferredForm, config, orcamento),
    [deferredForm, config, orcamento]
  );

  const dirty = JSON.stringify(form) !== initialSnapshot;

  // beforeunload pra avisar ao fechar com mudanças não salvas
  useEffect(() => {
    if (!dirty) return;
    function onBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  // ===== Drawers (state) =====
  const [openDrawer, setOpenDrawer] = useState<SectionEditableKey | null>(null);
  const [openObservacoes, setOpenObservacoes] = useState(false);

  function onEditSection(key: SectionEditableKey) {
    setOpenDrawer(key);
  }

  function onToggleSecao(key: keyof SecoesVisiveis) {
    update("secoes_visiveis", { ...form.secoes_visiveis, [key]: !form.secoes_visiveis[key] });
  }

  const editorMode: EditorMode = {
    secoesVisiveis: form.secoes_visiveis,
    onToggleSecao,
    onEditSection,
  };

  // ===== Save =====
  async function handleSave() {
    setErro(null);
    if (!form.cliente_nome.trim()) {
      setErro("Informe o nome do cliente (toque na capa pra editar).");
      setOpenDrawer("cliente");
      return;
    }
    setSalvando(true);
    const payload = normalizeForSave(form, defaults);
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
    setInitialSnapshot(JSON.stringify(form));
    setToast("Salvo!");
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

  function copiarLink() {
    if (!publicUrl) return;
    const msg = `Olá, ${form.cliente_nome.split(" ")[0]}! Preparei sua proposta personalizada da Dondoka Recepções. ✨\n\nAcesse aqui: ${publicUrl}\n\nQualquer dúvida, é só chamar!`;
    navigator.clipboard.writeText(msg);
    setToast("Mensagem copiada — cole no WhatsApp do cliente.");
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <div className="-mx-4 md:-mx-6 -my-8 md:-my-12 min-h-screen bg-creme">
      {/* Header sticky do editor */}
      <header className="sticky top-16 z-40 bg-oliva text-white border-b border-oliva/40">
        <div className="max-w-6xl mx-auto px-3 md:px-5 h-14 md:h-14 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Link
              href="/admin"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/15 transition shrink-0"
              aria-label="Voltar"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </Link>
            <div className="min-w-0 leading-tight">
              <div className="font-serif text-base md:text-lg text-white truncate">
                {mode === "criar" ? "Novo orçamento" : form.cliente_nome || "Sem nome"}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-white/70 flex items-center gap-1.5">
                {dirty && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-300 animate-pulse" aria-hidden />
                )}
                {dirty ? "Mudanças não salvas" : mode === "criar" ? "Pronto pra criar" : "Tudo salvo"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {publicUrl && (
              <button
                type="button"
                onClick={copiarLink}
                className="hidden sm:inline-flex items-center justify-center h-9 px-3 rounded-full text-xs text-white/90 hover:bg-white/15 transition"
              >
                Copiar p/ WhatsApp
              </button>
            )}
            <button
              type="button"
              onClick={() => setModoClassico((v) => !v)}
              className="hidden md:inline-flex items-center justify-center h-9 px-3 rounded-full text-xs text-white/90 hover:bg-white/15 transition"
            >
              {modoClassico ? "Modo visual" : "Modo formulário"}
            </button>
            <button
              type="button"
              onClick={() => setOpenObservacoes(true)}
              title="Observações internas"
              aria-label="Observações internas"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/15 transition"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={salvando || isPending || !dirty}
              className="inline-flex items-center justify-center h-9 px-4 md:px-5 rounded-full bg-white text-oliva text-sm font-medium hover:bg-creme disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {salvando ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </header>

      {/* Body — preview editável OU form clássico */}
      {modoClassico ? (
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
          <OrcamentoForm mode={mode} orcamento={orcamento} config={config} />
        </div>
      ) : (
        <OrcamentoView orcamento={virtualOrcamento} config={config} editorMode={editorMode} />
      )}

      {/* Mensagem de erro / actions de orçamento existente */}
      {(erro || (mode === "editar" && !modoClassico)) && (
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-3">
          {erro && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 text-sm">
              {erro}
            </div>
          )}
          {mode === "editar" && !modoClassico && (
            <div className="flex flex-wrap gap-2 justify-center text-xs">
              <button
                type="button"
                onClick={handleDuplicate}
                className="px-4 h-9 rounded-full border border-oliva/40 text-oliva hover:bg-oliva hover:text-white transition"
              >
                Duplicar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 h-9 rounded-full text-carvao/50 hover:text-rose-600 transition"
              >
                Excluir
              </button>
              {publicUrl && (
                <a
                  href={publicUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 h-9 inline-flex items-center rounded-full text-oliva hover:text-bronze transition"
                >
                  Abrir link público ↗
                </a>
              )}
            </div>
          )}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] px-5 py-3 rounded-full bg-carvao text-white text-sm shadow-premium">
          {toast}
        </div>
      )}

      {/* ===== Drawers ===== */}
      <DrawerCliente
        open={openDrawer === "cliente" || openDrawer === "dados"}
        onClose={() => setOpenDrawer(null)}
        form={form}
        update={update}
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
      />
      <DrawerFotos
        open={openDrawer === "galeria"}
        onClose={() => setOpenDrawer(null)}
        selecionadas={form.fotos_selecionadas}
        onChange={(v) => update("fotos_selecionadas", v)}
      />
      <DrawerDecoracao
        open={openDrawer === "decoracao"}
        onClose={() => setOpenDrawer(null)}
        texto={form.decoracao_texto}
        defaultTexto={defaults.decoracao}
        itens={form.itens_decoracao}
        onChangeTexto={(v) => update("decoracao_texto", v)}
        onChangeItens={(v) => update("itens_decoracao", v)}
      />
      <DrawerBuffet
        open={openDrawer === "buffet"}
        onClose={() => setOpenDrawer(null)}
        value={form.buffet_dados}
        defaultValue={defaults.buffet}
        onChange={(v) => update("buffet_dados", v)}
      />
      <DrawerServicos
        open={openDrawer === "servicos"}
        onClose={() => setOpenDrawer(null)}
        value={form.servicos_opcionais_dados}
        defaultValue={defaults.servicos}
        onChange={(v) => update("servicos_opcionais_dados", v)}
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
      />
      <Drawer
        open={openDrawer === "contato"}
        onClose={() => setOpenDrawer(null)}
        title="Contato"
        subtitle="Os contatos são globais — edite em Configurações"
      >
        <div className="space-y-3 text-sm text-carvao/75">
          <p>
            Os contatos exibidos na seção Contato (WhatsApp, Instagram, e-mail, endereço) são <b>globais</b>:
            valem pra todos os orçamentos.
          </p>
          <p>
            Pra alterar, vá em <Link href="/admin/configuracoes" className="text-oliva hover:underline font-medium">Configurações → Contato</Link>.
          </p>
          <div className="mt-4 px-4 py-3 rounded-xl bg-oliva/5 border border-oliva/20 text-xs">
            <b className="text-oliva">Dica:</b> use esta seção pra deixar a proposta com um fechamento
            visual coerente — o cliente vê seu logo, os meios de contato e o botão grande de WhatsApp.
          </div>
        </div>
      </Drawer>

      <DrawerObservacoes
        open={openObservacoes}
        onClose={() => setOpenObservacoes(false)}
        value={form.observacoes}
        onChange={(v) => update("observacoes", v)}
      />
    </div>
  );
}
