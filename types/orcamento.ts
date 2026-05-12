export type StatusOrcamento = "rascunho" | "enviado" | "aceito" | "recusado";

export type SecoesVisiveis = {
  sobre: boolean;
  galeria: boolean;
  decoracao: boolean;
  dados: boolean;
  investimento: boolean;
  pagamento: boolean;
  contato: boolean;
};

export type ItemOrcamento = {
  id: string;
  descricao: string;
  qtd: number;
  valor_unitario: number;
};

export type Orcamento = {
  id: string;
  slug: string;
  status: StatusOrcamento;

  cliente_nome: string;
  cliente_evento: string | null;
  cliente_data: string | null;
  cliente_horario: string | null;
  cliente_convidados: number | null;

  secoes_visiveis: SecoesVisiveis;
  fotos_selecionadas: string[];

  sobre_texto: string | null;
  decoracao_texto: string | null;

  itens_espaco: ItemOrcamento[];
  itens_decoracao: ItemOrcamento[];
  itens_buffet: ItemOrcamento[];

  condicoes_pagamento: string | null;
  observacoes: string | null;

  created_at: string;
  updated_at: string;
  sent_at: string | null;
};

export type ConfigGlobal = {
  id: 1;
  sobre_texto: string | null;
  decoracao_texto: string | null;
  condicoes_pagamento: string | null;
  contato_telefone: string | null;
  contato_whatsapp: string | null;
  contato_instagram: string | null;
  contato_email: string | null;
  contato_endereco: string | null;
  fotos_default: string[];
  updated_at: string;
};

export const SECOES_DEFAULT: SecoesVisiveis = {
  sobre: true,
  galeria: true,
  decoracao: true,
  dados: true,
  investimento: true,
  pagamento: true,
  contato: true,
};
