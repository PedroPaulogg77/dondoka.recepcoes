import {
  BUFFET_FALLBACK,
  SERVICOS_FALLBACK,
  SECOES_DEFAULT,
  type BuffetDados,
  type ConfigGlobal,
  type Orcamento,
  type SecoesVisiveis,
  type ServicosOpcionaisDados,
} from "@/types/orcamento";

/**
 * Defaults resolvidos a partir do config (aplicando fallbacks hardcoded
 * quando o config_global não tem ainda os campos buffet/serviços).
 */
export type ResolvedDefaults = {
  sobre: string;
  decoracao: string;
  pagamento: string;
  buffet: BuffetDados;
  servicos: ServicosOpcionaisDados;
};

export function resolveDefaults(config: ConfigGlobal): ResolvedDefaults {
  return {
    sobre: config.sobre_texto || "",
    decoracao: config.decoracao_texto || "",
    pagamento: config.condicoes_pagamento || "",
    buffet: config.buffet_dados ?? BUFFET_FALLBACK,
    servicos: config.servicos_opcionais_dados ?? SERVICOS_FALLBACK,
  };
}

/**
 * Mescla o flag default com os toggles do orçamento, garantindo que toda chave
 * de SecoesVisiveis exista (mesmo em orçamentos antigos sem buffet/servicos).
 */
export function resolveSecoesVisiveis(value: Partial<SecoesVisiveis> | null | undefined): SecoesVisiveis {
  return { ...SECOES_DEFAULT, ...(value || {}) };
}

/**
 * Constrói um "orçamento virtual" pronto pra entregar ao OrcamentoView
 * a partir do form state. Aplica os defaults do config quando o campo está
 * vazio/null, EXATAMENTE como a página pública faria após um save → reload.
 *
 * Isso garante que o preview no editor reflita 1:1 o que o cliente verá.
 */
export type FormState = {
  status: Orcamento["status"];
  cliente_nome: string;
  cliente_evento: string;
  cliente_data: string;
  cliente_horario: string;
  cliente_convidados: number;
  secoes_visiveis: SecoesVisiveis;
  fotos_selecionadas: string[];
  sobre_texto: string;
  decoracao_texto: string;
  itens_espaco: Orcamento["itens_espaco"];
  itens_decoracao: Orcamento["itens_decoracao"];
  itens_buffet: Orcamento["itens_buffet"];
  condicoes_pagamento: string;
  observacoes: string;
  buffet_dados: BuffetDados;
  servicos_opcionais_dados: ServicosOpcionaisDados;
};

export function buildVirtualOrcamento(
  form: FormState,
  config: ConfigGlobal,
  existing?: Orcamento | null
): Orcamento {
  const now = new Date().toISOString();
  return {
    id: existing?.id || "preview",
    slug: existing?.slug || "preview",
    status: form.status || "rascunho",
    cliente_nome: form.cliente_nome || "Cliente",
    cliente_evento: form.cliente_evento || null,
    cliente_data: form.cliente_data || null,
    cliente_horario: form.cliente_horario || null,
    cliente_convidados: form.cliente_convidados || null,
    secoes_visiveis: form.secoes_visiveis,
    fotos_selecionadas: form.fotos_selecionadas?.length
      ? form.fotos_selecionadas
      : config.fotos_default || [],
    sobre_texto: form.sobre_texto || null,
    decoracao_texto: form.decoracao_texto || null,
    itens_espaco: form.itens_espaco,
    itens_decoracao: form.itens_decoracao,
    itens_buffet: form.itens_buffet,
    condicoes_pagamento: form.condicoes_pagamento || null,
    observacoes: form.observacoes || null,
    buffet_dados: form.buffet_dados,
    servicos_opcionais_dados: form.servicos_opcionais_dados,
    created_at: existing?.created_at || now,
    updated_at: now,
    sent_at: existing?.sent_at || null,
  };
}

function deepEqual<T>(a: T, b: T): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Prepara payload pro POST/PATCH: grava `null` em campos textuais cujo valor
 * é idêntico ao default do config, pra manter sincronia futura. Igual o
 * comportamento já existente em OrcamentoForm.handleSubmit.
 */
export function normalizeForSave(form: FormState, defaults: ResolvedDefaults) {
  return {
    ...form,
    cliente_convidados: form.cliente_convidados || null,
    cliente_data: form.cliente_data || null,
    cliente_horario: form.cliente_horario || null,
    cliente_evento: form.cliente_evento || null,
    sobre_texto:
      form.sobre_texto.trim() === defaults.sobre.trim() ? null : form.sobre_texto || null,
    decoracao_texto:
      form.decoracao_texto.trim() === defaults.decoracao.trim()
        ? null
        : form.decoracao_texto || null,
    condicoes_pagamento:
      form.condicoes_pagamento.trim() === defaults.pagamento.trim()
        ? null
        : form.condicoes_pagamento || null,
    observacoes: form.observacoes || null,
    buffet_dados: deepEqual(form.buffet_dados, defaults.buffet) ? null : form.buffet_dados,
    servicos_opcionais_dados: deepEqual(form.servicos_opcionais_dados, defaults.servicos)
      ? null
      : form.servicos_opcionais_dados,
  };
}

/**
 * Constrói o state inicial do form a partir de um orçamento existente
 * (ou vazio para criação), aplicando defaults pra pré-popular campos textuais
 * que ainda não foram customizados.
 */
export function buildInitialForm(
  config: ConfigGlobal,
  orcamento?: Orcamento | null
): FormState {
  const defaults = resolveDefaults(config);
  return {
    status: orcamento?.status || "rascunho",
    cliente_nome: orcamento?.cliente_nome || "",
    cliente_evento: orcamento?.cliente_evento || "",
    cliente_data: orcamento?.cliente_data || "",
    cliente_horario: orcamento?.cliente_horario || "",
    cliente_convidados: orcamento?.cliente_convidados ?? 0,
    secoes_visiveis: resolveSecoesVisiveis(orcamento?.secoes_visiveis),
    fotos_selecionadas: orcamento?.fotos_selecionadas || config.fotos_default || [],
    sobre_texto: orcamento?.sobre_texto ?? defaults.sobre,
    decoracao_texto: orcamento?.decoracao_texto ?? defaults.decoracao,
    itens_espaco: orcamento?.itens_espaco || [],
    itens_decoracao: orcamento?.itens_decoracao || [],
    itens_buffet: orcamento?.itens_buffet || [],
    condicoes_pagamento: orcamento?.condicoes_pagamento ?? defaults.pagamento,
    observacoes: orcamento?.observacoes ?? "",
    buffet_dados: orcamento?.buffet_dados ?? defaults.buffet,
    servicos_opcionais_dados: orcamento?.servicos_opcionais_dados ?? defaults.servicos,
  };
}
