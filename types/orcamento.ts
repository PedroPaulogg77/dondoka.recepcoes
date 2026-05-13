export type StatusOrcamento = "rascunho" | "enviado" | "aceito" | "recusado";

export type SecoesVisiveis = {
  sobre: boolean;
  galeria: boolean;
  decoracao: boolean;
  buffet: boolean;
  servicos: boolean;
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

export type BuffetDados = {
  entrada: { titulo: string; itens: string[] };
  principal: { opcoes: Array<{ titulo: string; itens: string[] }> };
  bebidas: string[];
  servico: string;
};

export type ServicosOpcionaisDados = {
  intro: string;
  lista: string[];
  disclaimer: string;
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

  buffet_dados: BuffetDados | null;
  servicos_opcionais_dados: ServicosOpcionaisDados | null;

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
  buffet_dados: BuffetDados | null;
  servicos_opcionais_dados: ServicosOpcionaisDados | null;
  updated_at: string;
};

export const SECOES_DEFAULT: SecoesVisiveis = {
  sobre: true,
  galeria: true,
  decoracao: true,
  buffet: false,
  servicos: true,
  dados: true,
  investimento: true,
  pagamento: true,
  contato: true,
};

// Fallback hardcoded para quando o config_global ainda não foi migrado
export const BUFFET_FALLBACK: BuffetDados = {
  entrada: {
    titulo: "Cantinho mineiro",
    itens: ["Linguiça", "Almôndega", "Mandioca", "Batata", "Torresmo", "Mussarela", "Ovo de codorna", "Azeitona", "Torradas"],
  },
  principal: {
    opcoes: [
      { titulo: "Feijoada completa", itens: ["Arroz", "Couve", "Laranja", "Farofa"] },
      { titulo: "Feijão tropeiro e lombo assado", itens: ["Arroz", "Couve"] },
    ],
  },
  bebidas: ["Refrigerante", "Suco de caixinha", "Água"],
  servico: "Equipe completa de cozinha e copa durante todo o evento, com louças, talheres, copos e guardanapos inclusos.",
};

export const SERVICOS_FALLBACK: ServicosOpcionaisDados = {
  intro: "Pensando em proporcionar uma experiência ainda mais completa, a Dondoka Recepções oferece serviços adicionais para auxiliar na organização e execução do seu evento:",
  lista: ["Segurança", "Recepcionista", "Cerimonialista", "Apoio de limpeza", "Garçons", "Música ao vivo"],
  disclaimer: "Serviços contratados à parte, conforme disponibilidade e necessidade do evento.",
};
