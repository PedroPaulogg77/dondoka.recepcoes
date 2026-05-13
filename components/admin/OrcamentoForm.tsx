"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ItensEditor } from "./ItensEditor";
import { FotosPicker } from "./FotosPicker";
import { EditableTextField } from "./EditableTextField";
import { BuffetEditor } from "./BuffetEditor";
import { ServicosEditor } from "./ServicosEditor";
import { SectionHelp } from "./SectionHelp";
import { brl } from "@/lib/format";
import {
  buildInitialForm,
  normalizeForSave,
  resolveDefaults,
} from "@/lib/orcamento-helpers";
import {
  type Orcamento,
  type SecoesVisiveis,
  type StatusOrcamento,
  type ConfigGlobal,
} from "@/types/orcamento";

type Mode = "criar" | "editar";

type Props = {
  mode: Mode;
  orcamento?: Orcamento;
  config: ConfigGlobal;
};

const SECOES_LABEL: Array<[keyof SecoesVisiveis, string]> = [
  ["sobre", "Sobre o espaço"],
  ["galeria", "Galeria de fotos"],
  ["decoracao", "Decoração"],
  ["buffet", "Buffet (cardápio)"],
  ["servicos", "Serviços opcionais"],
  ["dados", "Dados do evento"],
  ["investimento", "Resumo do investimento"],
  ["pagamento", "Forma de pagamento"],
  ["contato", "Contato"],
];

const STATUS_OPTIONS: StatusOrcamento[] = ["rascunho", "enviado", "aceito", "recusado"];

function deepEqual<T>(a: T, b: T): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function OrcamentoForm({ mode, orcamento, config }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const defaults = resolveDefaults(config);
  const defaultSobre = defaults.sobre;
  const defaultDecoracao = defaults.decoracao;
  const defaultPagamento = defaults.pagamento;
  const defaultBuffet = defaults.buffet;
  const defaultServicos = defaults.servicos;

  const [form, setForm] = useState(() => buildInitialForm(config, orcamento));

  function up<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const total =
    [form.itens_espaco, form.itens_decoracao, form.itens_buffet]
      .flat()
      .reduce((acc, i) => acc + (i.qtd || 0) * (i.valor_unitario || 0), 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    if (!form.cliente_nome.trim()) {
      setErro("Informe o nome do cliente.");
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
    startTransition(() => {
      router.push(`/admin/${data.id}`);
      router.refresh();
    });
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
    alert("Mensagem copiada! Cole no WhatsApp do cliente.");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <Link href="/admin" className="text-sm text-oliva hover:underline">
            ← Voltar
          </Link>
          <h1 className="mt-2 text-3xl md:text-4xl font-serif text-carvao">
            {mode === "criar" ? "Novo orçamento" : form.cliente_nome || "Editar orçamento"}
          </h1>
          {orcamento && (
            <p className="text-xs text-carvao/55 mt-1">
              slug: <code className="font-mono">{orcamento.slug}</code>
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {publicUrl && (
            <>
              <a
                href={publicUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center px-4 h-10 rounded-full border border-oliva/40 text-oliva hover:bg-oliva hover:text-white text-sm transition"
              >
                Ver link público
              </a>
              <Button type="button" variant="outline" onClick={copiarLink}>
                Copiar para WhatsApp
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Status + Dados do cliente */}
      <section className="bg-white border border-areia/60 rounded-2xl p-6 md:p-8 shadow-soft">
        <div className="flex items-baseline justify-between gap-3 mb-1">
          <h2 className="font-serif text-xl text-carvao">Dados do cliente</h2>
        </div>
        <SectionHelp title="Para que servem estes campos?">
          <p>São os dados que aparecem no topo da proposta personalizada (seção <b>Dados do evento</b>) e identificam o orçamento internamente.</p>
          <p><b>Cliente</b> é o único obrigatório — vira o título "Para [primeiro nome]" no hero da proposta.</p>
          <p><b>Status</b> é uso interno: rascunho → enviado → aceito/recusado. Não aparece pro cliente.</p>
        </SectionHelp>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
          <Field label="Cliente" required>
            <input
              type="text"
              required
              value={form.cliente_nome}
              onChange={(e) => up("cliente_nome", e.target.value)}
              className="form-input"
            />
          </Field>
          <Field label="Tipo de evento">
            <input
              type="text"
              placeholder="Aniversário, casamento, corporativo..."
              value={form.cliente_evento}
              onChange={(e) => up("cliente_evento", e.target.value)}
              className="form-input"
            />
          </Field>
          <Field label="Data">
            <input
              type="date"
              value={form.cliente_data}
              onChange={(e) => up("cliente_data", e.target.value)}
              className="form-input"
            />
          </Field>
          <Field label="Horário">
            <input
              type="text"
              placeholder="Ex: 19h às 23h"
              value={form.cliente_horario}
              onChange={(e) => up("cliente_horario", e.target.value)}
              className="form-input"
            />
          </Field>
          <Field label="Convidados">
            <input
              type="number"
              min={0}
              value={form.cliente_convidados || ""}
              onChange={(e) => up("cliente_convidados", Number(e.target.value) || 0)}
              className="form-input"
            />
          </Field>
          <Field label="Status">
            <select
              value={form.status}
              onChange={(e) => up("status", e.target.value as StatusOrcamento)}
              className="form-input capitalize"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </section>

      {/* Seções visíveis */}
      <section className="bg-white border border-areia/60 rounded-2xl p-6 md:p-8 shadow-soft">
        <h2 className="font-serif text-xl text-carvao">Seções visíveis</h2>
        <p className="text-sm text-carvao/55 mt-1">
          Marque o que deve aparecer para este cliente. Tudo que estiver desligado some do link público e do PDF.
        </p>
        <SectionHelp title="Quando desligar uma seção?">
          <p><b>Buffet</b> e <b>Serviços opcionais</b> ficam desligados por padrão — ligue apenas quando o cliente pediu cardápio ou serviços extras.</p>
          <p>Se o cliente já tem decoradora própria, desligue <b>Decoração</b>. Se já tem buffet contratado fora, desligue <b>Buffet</b>.</p>
          <p>O cliente só vê o que está ligado. Você pode ligar/desligar e salvar quantas vezes quiser — o link público atualiza imediatamente.</p>
        </SectionHelp>
        <div className="mt-5 grid grid-cols-2 md:grid-cols-3 gap-2">
          {SECOES_LABEL.map(([key, label]) => {
            const checked = form.secoes_visiveis[key];
            return (
              <label
                key={key}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition ${
                  checked
                    ? "border-oliva bg-oliva/5 text-carvao"
                    : "border-areia/60 text-carvao/50 hover:border-areia"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) =>
                    up("secoes_visiveis", { ...form.secoes_visiveis, [key]: e.target.checked })
                  }
                  className="accent-oliva"
                />
                <span className="text-sm">{label}</span>
              </label>
            );
          })}
        </div>
      </section>

      {/* Itens — Espaço, Decoração, Buffet (valores financeiros) */}
      <section>
        <h2 className="font-serif text-xl text-carvao">Itens do orçamento</h2>
        <SectionHelp title="Como funcionam os valores?">
          <p>Cada item tem <b>descrição</b>, <b>quantidade</b> e <b>valor unitário</b>. O sistema calcula o subtotal automaticamente (qtd × valor) e soma todas as 3 categorias no total geral.</p>
          <p>Itens com quantidade 1 mostram só o valor. Itens com quantidade {">"} 1 mostram "5 × R$ 120" como detalhe pro cliente.</p>
          <p>Os 3 grupos (Espaço, Decoração, Buffet) aparecem na seção <b>Resumo da proposta</b> da página pública, agora colapsáveis — o cliente clica pra ver os itens.</p>
        </SectionHelp>
        <div className="space-y-4 mt-4">
          <ItensEditor
            titulo="Espaço"
            itens={form.itens_espaco}
            onChange={(v) => up("itens_espaco", v)}
          />
          <ItensEditor
            titulo="Decoração"
            itens={form.itens_decoracao}
            onChange={(v) => up("itens_decoracao", v)}
          />
          <ItensEditor
            titulo="Buffet"
            itens={form.itens_buffet}
            onChange={(v) => up("itens_buffet", v)}
          />
        </div>
        <div className="mt-4 px-6 py-4 rounded-2xl bg-oliva text-white flex justify-between items-center">
          <span className="eyebrow text-white/70">Total geral</span>
          <span className="text-2xl font-serif tabular-nums">{brl(total)}</span>
        </div>
      </section>

      {/* Textos editáveis com pré-população + voltar ao padrão */}
      <section className="bg-white border border-areia/60 rounded-2xl p-6 md:p-8 shadow-soft space-y-6">
        <div>
          <h2 className="font-serif text-xl text-carvao">Textos da proposta</h2>
          <p className="text-sm text-carvao/55 mt-1">
            Os textos abaixo já vêm pré-preenchidos com o padrão da Dondoka. Edite à vontade — o badge mostra se você customizou ou está usando o padrão.
          </p>
          <SectionHelp title="Como funcionam o 'Padrão' e o 'Customizado'?">
            <p>Os textos padrão vêm da aba <b>Configurações</b>. Se você editar aqui, vira <b>Customizado</b> só para este orçamento — não afeta os outros.</p>
            <p>Clicando em <b>↺ Voltar ao padrão</b> o texto volta a ser sincronizado: se você atualizar o padrão em Configurações depois, este orçamento herda a nova versão.</p>
            <p>Use customização quando o cliente tem alguma condição especial (ex: parcelamento diferente).</p>
          </SectionHelp>
        </div>
        <EditableTextField
          label="Sobre o espaço"
          value={form.sobre_texto}
          defaultValue={defaultSobre}
          onChange={(v) => up("sobre_texto", v)}
          rows={8}
        />
        <EditableTextField
          label="Decoração"
          value={form.decoracao_texto}
          defaultValue={defaultDecoracao}
          onChange={(v) => up("decoracao_texto", v)}
          rows={6}
        />
        <EditableTextField
          label="Condições de pagamento"
          value={form.condicoes_pagamento}
          defaultValue={defaultPagamento}
          onChange={(v) => up("condicoes_pagamento", v)}
          rows={5}
        />
      </section>

      {/* Buffet editor (cardápio) */}
      {form.secoes_visiveis.buffet && (
        <section className="bg-white border border-areia/60 rounded-2xl p-6 md:p-8 shadow-soft">
          <BuffetEditor
            value={form.buffet_dados}
            onChange={(v) => up("buffet_dados", v)}
            isCustom={!deepEqual(form.buffet_dados, defaultBuffet)}
            onResetDefault={() => up("buffet_dados", defaultBuffet)}
          />
          <SectionHelp title="Como editar o cardápio">
            <p>O cardápio vira a seção <b>Buffet</b> na proposta pública. Aparece com Entrada, Prato Principal (com opções), Bebidas e o texto descritivo do Serviço.</p>
            <p>Edite títulos e itens diretamente — use o <b>×</b> ao lado de cada linha pra remover. Botão <b>+ Adicionar</b> cria novo item.</p>
            <p>Se mudou de ideia, <b>↺ Voltar ao padrão</b> restaura o cardápio da Dondoka definido em Configurações.</p>
          </SectionHelp>
        </section>
      )}

      {/* Serviços opcionais editor */}
      {form.secoes_visiveis.servicos && (
        <section className="bg-white border border-areia/60 rounded-2xl p-6 md:p-8 shadow-soft">
          <ServicosEditor
            value={form.servicos_opcionais_dados}
            onChange={(v) => up("servicos_opcionais_dados", v)}
            isCustom={!deepEqual(form.servicos_opcionais_dados, defaultServicos)}
            onResetDefault={() => up("servicos_opcionais_dados", defaultServicos)}
          />
          <SectionHelp title="Como funcionam os serviços opcionais?">
            <p>É um cardápio de extras (segurança, garçons, cerimonialista etc) que aparecem na proposta como sugestões, com ícones automáticos.</p>
            <p>O <b>Aviso final</b> é o disclaimer pequeno embaixo dizendo que são contratados à parte — ajuste se mudar a política comercial.</p>
            <p>Adicione/remova serviços conforme disponibilidade pra cada evento.</p>
          </SectionHelp>
        </section>
      )}

      {/* Fotos */}
      <section className="bg-white border border-areia/60 rounded-2xl p-6 md:p-8 shadow-soft">
        <h2 className="font-serif text-xl text-carvao mb-1">Fotos do orçamento</h2>
        <p className="text-sm text-carvao/55 mb-3">
          Selecione quais fotos aparecem na galeria deste orçamento.
        </p>
        <SectionHelp title="Como escolher as fotos">
          <p>As fotos marcadas aparecem na seção <b>Galeria</b> da proposta pública, em grid responsivo (2 colunas no celular, até 4 no desktop). Clique nela e abre em tela cheia.</p>
          <p>Você pode fazer upload de fotos novas (botão Upload) e elas vão pro storage do Supabase, ficando disponíveis pra todos os orçamentos.</p>
          <p>Recomendado: 6 a 12 fotos. Mais que isso fica pesado no carregamento mobile.</p>
        </SectionHelp>
        <div className="mt-4">
          <FotosPicker
            selecionadas={form.fotos_selecionadas}
            onChange={(v) => up("fotos_selecionadas", v)}
          />
        </div>
      </section>

      {/* Observações */}
      <section className="bg-white border border-areia/60 rounded-2xl p-6 md:p-8 shadow-soft">
        <Field label="Observações internas (não aparecem para o cliente)">
          <textarea
            rows={3}
            value={form.observacoes}
            onChange={(e) => up("observacoes", e.target.value)}
            className="form-input min-h-[100px]"
          />
        </Field>
        <SectionHelp title="O que escrever aqui">
          <p>Anotações suas sobre o cliente, restrições, alergias, decisões de negociação — fica salvo aqui mas <b>nunca aparece na proposta pública</b>.</p>
          <p>Útil pra lembrar detalhes quando o cliente voltar a falar com você ou quando duplicar este orçamento.</p>
        </SectionHelp>
      </section>

      {erro && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 text-sm">
          {erro}
        </div>
      )}

      {/* Actions */}
      <div className="sticky bottom-0 -mx-4 md:-mx-6 px-4 md:px-6 py-4 bg-white/90 backdrop-blur border-t border-areia/60 flex flex-wrap gap-3 justify-end">
        {mode === "editar" && (
          <>
            <Button type="button" variant="ghost" onClick={handleDelete}>
              Excluir
            </Button>
            <Button type="button" variant="outline" onClick={handleDuplicate}>
              Duplicar
            </Button>
          </>
        )}
        <Button type="submit" disabled={salvando || isPending}>
          {salvando ? "Salvando..." : "Salvar orçamento"}
        </Button>
      </div>

    </form>
  );
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block">
      <span className="eyebrow text-bronze">
        {label}
        {required && <span className="text-rose-500 normal-case tracking-normal ml-1">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
