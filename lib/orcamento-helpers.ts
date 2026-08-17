import {
  BUFFET_FALLBACK,
  SERVICOS_FALLBACK,
  SECOES_DEFAULT,
  type BuffetDados,
  type ConfigGlobal,
  type Orcamento,
  type PrecosEspacoPorDia,
  type SecoesVisiveis,
  type ServicosOpcionaisDados,
} from "@/types/orcamento";
import { tierFromDate, type TierDia } from "@/lib/format";

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
  precosEspaco: PrecosEspacoPorDia | null;
};

export function resolveDefaults(config: ConfigGlobal): ResolvedDefaults {
  return {
    sobre: config.sobre_texto || "",
    decoracao: config.decoracao_texto || "",
    pagamento: config.condicoes_pagamento || "",
    buffet: config.buffet_dados ?? BUFFET_FALLBACK,
    servicos: config.servicos_opcionais_dados ?? SERVICOS_FALLBACK,
    precosEspaco: config.precos_espaco_por_dia ?? null,
  };
}

/**
 * Decide quanto cobrar pelo aluguel do espaço com base nas faixas + data.
 * - Sem faixas → retorna 0 (modo legado usa itens_espaco)
 * - Sem nenhum valor preenchido → retorna 0
 * - Com data válida + faixa preenchida → usa essa faixa
 * - Sem data (ou faixa daquela data não preenchida) → fallback sáb-dom > sex > seg-qui
 * Retorna `tierAtivo: null` quando não há data definida.
 * Retorna `minValor` (menor faixa preenchida) pra mostrar nota "pode reduzir até R$X".
 */
export function valorAluguelEspaco(
  precos: PrecosEspacoPorDia | null,
  clienteData: string | null
): { valor: number; tierAtivo: TierDia | null; minValor: number | null; maxValor: number | null } {
  if (!precos) return { valor: 0, tierAtivo: null, minValor: null, maxValor: null };
  const valoresValidos = [precos.seg_qui, precos.sex, precos.sab_dom]
    .filter((v): v is number => typeof v === "number" && v > 0);
  if (valoresValidos.length === 0) {
    return { valor: 0, tierAtivo: null, minValor: null, maxValor: null };
  }
  const minValor = Math.min(...valoresValidos);
  const maxValor = Math.max(...valoresValidos);
  const tier = tierFromDate(clienteData);
  if (tier && typeof precos[tier] === "number" && precos[tier]! > 0) {
    return { valor: precos[tier]!, tierAtivo: tier, minValor, maxValor };
  }
  const fallback = precos.sab_dom ?? precos.sex ?? precos.seg_qui ?? 0;
  return { valor: fallback || 0, tierAtivo: null, minValor, maxValor };
}

/** Verifica se as faixas têm pelo menos um valor preenchido (ou seja, estão ativas). */
export function temFaixasAtivas(precos: PrecosEspacoPorDia | null): boolean {
  if (!precos) return false;
  return (
    (typeof precos.seg_qui === "number" && precos.seg_qui > 0) ||
    (typeof precos.sex === "number" && precos.sex > 0) ||
    (typeof precos.sab_dom === "number" && precos.sab_dom > 0)
  );
}

/**
 * Sentinela de "desligado de propósito".
 *
 * `null` neste campo já quer dizer "herdar do config", então não servia
 * também para dizer "não quero faixas neste orçamento": gravava null, e o
 * `??` do OrcamentoView trazia o padrão global de volta. Na prática o toggle
 * não desligava nada enquanto o padrão estivesse ativo.
 *
 * Um objeto com as três faixas nulas resolve sem coluna nova: `temFaixasAtivas`
 * devolve false, e por não ser null ele atravessa o `??` intacto.
 */
export const FAIXAS_DESLIGADAS: PrecosEspacoPorDia = {
  seg_qui: null,
  sex: null,
  sab_dom: null,
};

/**
 * Devolve o valor do aluguel quando ele é o MESMO em todos os dias, e `null`
 * quando varia de um dia para outro.
 *
 * É o que separa os dois jeitos de cobrar o salão. Com preços diferentes por
 * dia, o cliente escolhe, e por isso o aluguel nunca entrou no total: somar um
 * dos três seria escolher por ele. Com valor único não existe escolha, então o
 * número entra na conta como qualquer outro item, e um "Valor total" sem ele
 * faria o salão parecer de graça.
 *
 * Guardar os três campos iguais em vez de criar uma coluna nova mantém o
 * caminho de herança do config global funcionando sem mudança de schema.
 */
export function valorUnicoEspaco(precos: PrecosEspacoPorDia | null): number | null {
  if (!precos) return null;
  const preenchidos = [precos.seg_qui, precos.sex, precos.sab_dom].filter(
    (v): v is number => typeof v === "number" && v > 0
  );
  if (preenchidos.length === 0) return null;
  return preenchidos.every((v) => v === preenchidos[0]) ? preenchidos[0] : null;
}

/** Quanto o aluguel acrescenta ao total. Zero quando varia por dia. */
export function espacoQueSoma(precos: PrecosEspacoPorDia | null): number {
  return valorUnicoEspaco(precos) ?? 0;
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
  publicado: boolean;
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
  precos_espaco_por_dia: PrecosEspacoPorDia | null;
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
    publicado: form.publicado,
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
    precos_espaco_por_dia: form.precos_espaco_por_dia,
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
    publicado: form.publicado,
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
    precos_espaco_por_dia: deepEqual(form.precos_espaco_por_dia, defaults.precosEspaco)
      ? null
      : form.precos_espaco_por_dia,
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
    publicado: orcamento?.publicado ?? false,
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
    precos_espaco_por_dia: orcamento?.precos_espaco_por_dia ?? defaults.precosEspaco,
    condicoes_pagamento: orcamento?.condicoes_pagamento ?? defaults.pagamento,
    observacoes: orcamento?.observacoes ?? "",
    buffet_dados: orcamento?.buffet_dados ?? defaults.buffet,
    servicos_opcionais_dados: orcamento?.servicos_opcionais_dados ?? defaults.servicos,
  };
}
