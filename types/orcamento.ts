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

export type CategoriaKit = "buffet" | "decoracao";

/**
 * Grupo da biblioteca de itens: a fonte dos checkboxes na hora de montar um
 * kit. É o cardápio bruto do fornecedor, sem preço e sem estar comprometido
 * com nenhum pacote.
 */
export type BibliotecaGrupo = {
  id: string;
  categoria: CategoriaKit;
  titulo: string;
  itens: string[];
};

/**
 * Grupo dentro de um kit.
 *
 * `nota` é o que separa "a lista inteira" de "escolha 4 destes". Sem ela o kit
 * mente sobre o que o fornecedor entrega: "Salgados" é à vontade, mas "Doces"
 * são 4 por convidado entre as 8 opções.
 */
export type KitGrupo = {
  id: string;
  titulo: string;
  nota?: string;
  itens: string[];
};

/**
 * Pacote que a Dondoka vende. Não guarda preço: o valor é digitado no
 * orçamento, caso a caso, porque muda por cliente e por negociação.
 *
 * Os itens são CÓPIA da biblioteca, não referência. Mexer na biblioteca depois
 * não altera kit já montado. Mesma regra de "Padrão / Customizado" dos textos.
 */
export type Kit = {
  id: string;
  categoria: CategoriaKit;
  nome: string;
  grupos: KitGrupo[];
  /** Linhas soltas do tipo "4 horas de evento", "Equipe de garçons". */
  observacoes: string[];
  /** Aviso interno quando o orçamento tem menos convidados. Nunca vai ao cliente. */
  minimo_pessoas: number | null;
};

export type ItemOrcamento = {
  id: string;
  descricao: string;
  qtd: number;
  valor_unitario: number;

  /**
   * Sub-itens vindos de um kit. Aparecem para o cliente e nunca somam:
   * o preço do kit é o `valor_unitario` da própria linha.
   */
  inclui?: KitGrupo[];
  observacoes?: string[];
  /** Origem no catálogo, só para saber se o kit foi editado depois. */
  kit_id?: string;
  /** Quando true, `qtd` acompanha o número de convidados do orçamento. */
  por_pessoa?: boolean;
};

/**
 * Faixas de preço do aluguel do espaço por dia da semana.
 * Quando este campo está `null` (em Orcamento e ConfigGlobal), o sistema
 * opera em modo legado: Espaço usa `itens_espaco` normal com setinha colapsável.
 * Quando preenchido, o aluguel vira um item especial sem setinha, e a faixa
 * exibida/cobrada depende de `cliente_data` (sem data → usa sáb-dom).
 */
export type PrecosEspacoPorDia = {
  seg_qui: number | null;
  sex: number | null;
  sab_dom: number | null;
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
  publicado: boolean;

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

  precos_espaco_por_dia: PrecosEspacoPorDia | null;

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
  precos_espaco_por_dia: PrecosEspacoPorDia | null;
  /** Null enquanto a 0005 não rodou ou enquanto o João não salvou nada ainda. */
  biblioteca_itens: BibliotecaGrupo[] | null;
  kits_catalogo: Kit[] | null;
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
