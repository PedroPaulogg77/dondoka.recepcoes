/**
 * Catálogo do fornecedor, versionado.
 *
 * Fonte: os PDFs que o Buffet Nauh mandou em ago/2026 (`Cardapio.pdf`, os 7
 * pacotes e o `Buffet 2026 almoço`). Este arquivo é só a SEMENTE: assim que o
 * João salvar qualquer coisa na tela de Kits, o que vale é o que está no
 * `config_global`. Serve para o sistema não nascer vazio e para existir um
 * "restaurar catálogo do fornecedor" quando alguém apagar demais.
 *
 * ── TRÊS REGRAS QUE VALERAM NA TRANSCRIÇÃO ──────────────────────────────
 *
 * 1. SEM PREÇO. Nem o valor por pessoa, nem as faixas por quantidade do
 *    fornecedor. O que o cliente paga é o que o João digitar no orçamento.
 *
 * 2. SEM LOGÍSTICA. Saiu tudo que é combinação entre a Dondoka e o buffet e
 *    não diz respeito a quem vai à festa: deslocamento, frete até 25km, gás,
 *    botijão de 13kg, material de preparo, material para servir, material de
 *    montagem, vasilhames. O cliente quer saber o que vai comer.
 *
 * 3. NOME DO FORNECEDOR NÃO APARECE. Nada de "Nauh" em texto que chega ao
 *    cliente, por decisão do João.
 *
 * Os nomes foram normalizados onde o PDF tinha erro de digitação evidente:
 * "Quine apimentado" virou Quibe, "pastel de feita pizza" virou de feira,
 * "cream cheasse" virou cream cheese, "condesado" virou condensado.
 */

import type { BibliotecaGrupo, Kit } from "@/types/orcamento";

/**
 * Junta listas sem repetir.
 *
 * Pétit gourmet e Prato quente têm "Macarrão na chapa" nos dois, e o grupo da
 * Festa Completa é a soma dos dois. Sem isso o cliente lê o mesmo prato duas
 * vezes na mesma lista.
 */
const unir = (...listas: string[][]) => Array.from(new Set(listas.flat()));

/* ══════════════════════════════════════════════════════════════════
   BIBLIOTECA — o cardápio bruto, a fonte dos checkboxes
   ══════════════════════════════════════════════════════════════════ */

const SALGADOS_TRADICIONAIS = [
  "Coxinha",
  "Bolinha napolitana",
  "Bolinha de queijo",
  "Empada de queijo",
  "Empada de frango",
  "Croquete de milho",
  "Surpresa de alho poró",
  "Quibe apimentado",
  "Quibe com mussarela",
  "Peão de azeitona",
  "Pastel de milho",
  "Pastel de feira de carne",
  "Pastel de feira de queijo",
  "Pastel de feira de pizza",
  "Pão de queijo",
  "Enrolado de salsicha assado",
  "Enrolado de salsicha frito",
];

const SALGADOS_ESPECIAIS = [
  "Espeto de frango",
  "Espeto de lombo",
  "Espeto de frios",
  "Espeto mineiro",
  "Espeto caprese",
  "Pastel de frango com requeijão",
  "Quiche de alho poró",
  "Quiche Romeu e Julieta",
  "Bolinho de mandioca",
  "Mini kafta",
  "Canudinho de bacon e ricota",
  "Canapé de abacaxi e provolone",
  "Coxinha de catupiry",
  "Mini pizza de presunto",
  "Mini pizza marguerita",
  "Mini pizza de calabresa",
  "Bruschetta marguerita",
  "Ouriço de calabresa e cheddar",
  "Barquete de maionese",
  "Canapé de salpicão",
  "Canudinho de carne",
  "Batata baby recheada",
  "Bolinha de queijo e bacon",
  "Dadinho de tapioca",
  "Palmito imperial",
  "Mini x-salada",
  "Mini x-búrguer",
  "Mini x-bacon",
];

const FOLHADOS = [
  "Folhado de abacaxi com bacon",
  "Folhado de ameixa com bacon",
  "Folhado de peito de peru com cream cheese",
  "Folhado Romeu e Julieta",
  "Folhado de ricota com ervas",
];

const DOCES_TRADICIONAIS = [
  "Brigadeiro",
  "Brigadeiro branco",
  "Coco",
  "Cajuzinho",
  "Moranguinho",
  "Ninho",
  "Palha italiana",
  "Brigadeiro de paçoca",
];

const DOCES_ESPECIAIS = [
  "Ninho com Nutella",
  "Churrinhos",
  "Palha de ninho com Oreo",
  "Brigadeiro com confete",
];

const BOLO_TRADICIONAL = [
  "Chocolate ao leite",
  "Ninho",
  "Coco",
  "Doce de leite",
  "Chocolate amargo",
];

const BOLO_ESPECIAL = [
  "Ninho com Nutella",
  "Ninho com morango",
  "Ameixa com doce de leite",
  "Abacaxi com doce de leite",
];

const PETIT_GOURMET = [
  "Escondidinho de carne com batata",
  "Escondidinho de mandioca com carne",
  "Tabule",
  "Macarrão na chapa",
  "Penne com molho bolonhesa",
  "Penne com molho branco",
  "Arroz de costela",
  "Macarrãozinho na chapa",
  "Strogonoff",
  "Arroz carreteiro",
  "Caldinho de abóbora",
  "Caldinho de feijão",
  "Caldinho de mandioca",
  "Salada de frutas",
  "Linguiça com farofa e vinagrete",
  "Ceviche de manga",
  "Polenta com carne",
  "Tropeirinho",
  "Almôndegas ao molho",
  "Tilápia com molho tártaro",
];

const PRATO_QUENTE = ["Massa com 2 molhos", "Strogonoff com arroz", "Macarrão na chapa"];

const PETISCOS_BOTECO = [
  "Batata bolinha",
  "Isca de porco",
  "Isca de boi",
  "Frango a passarinho",
  "Isca de frango",
  "Quibe",
  "Pastel de carne",
  "Pastel de queijo",
  "Bolinho de mandioca",
  "Coxinha",
  "Sacanagem",
  "Linguiça acebolada",
  "Almôndegas",
  "Moela",
  "Mandioca na manteiga",
  "Mandioca frita",
  "Costelinha com barbecue",
  "Ovo de codorna",
  "Carne cozida",
];

const PRATO_QUENTE_BOTECO = ["Arroz carreteiro", "Macarrão na chapa", "Mexidão"];

const PETISCOS_VOLANTE = [
  "Pastel de feira",
  "Coxinha",
  "Quibe",
  "Bolinho de mandioca",
  "Batata frita",
  "Batata baby recheada",
  "Bruschetta",
  "Canapé de abacaxi",
  "Canudinho de carne",
  "Mini porção de moela",
  "Linguiça com mostarda e mel",
  "Isca de boi",
  "Isca de porco",
  "Espetinho de calabresa com queijo",
  "Espetinho de frango",
  "Kafta",
  "Medalhão de frango",
  "Mini hambúrguer",
  "Mini tropeirinho",
  "Pão de queijo com pernil",
  "Escondidinho de carne",
  "Mini caldo de feijão ou mandioca",
  "Quiche de alho poró",
];

const PRATO_QUENTE_VOLANTE = [
  "Arroz carreteiro",
  "Macarrão na chapa",
  "Mexidão",
  "Massa com milho",
  "Galinhada",
];

const MESA_CAFE = [
  "Pão de queijo",
  "Dois tipos de pão",
  "Mini pizza",
  "Frios",
  "Iogurte com frutas",
  "Torta de frango",
  "Biscoito caseiro",
  "Ovos mexidos",
  "Mini sanduíche",
  "Bolo caseiro",
  "Quiches",
  "Coxinha",
  "Pastel de carne e queijo",
  "Manteiga, requeijão e granola",
];

const BEBIDAS_CAFE = ["Café", "Leite", "Chocolate em pó", "Suco", "Refrigerante", "Água"];

const COMIDAS_JUNINAS = [
  "Caldo de mandioca",
  "Caldo de feijão",
  "Canjiquinha",
  "Canjica doce",
  "Milho cozido",
  "Cachorro quente",
  "Pastel de carne e queijo",
  "Espetinho de frango",
  "Pipoca",
];

const ENTRADAS_ALMOCO = [
  "Canapé de abacaxi",
  "Canapé de salpicão",
  "Bruschetta",
  "Espeto caprese",
  "Pastel de carne ou queijo",
  "Coxinha",
  "Quiche",
  "Espetinho mineiro",
  "Ceviche de manga",
  "Folhados",
  "Canudinho recheado",
  "Dadinho de tapioca",
  "Queijo coalho",
];

const GUARNICOES = [
  "Salada tropical",
  "Legumes salteados",
  "Batata ao forno",
  "Farofa rica",
  "Purê de batata",
  "Angu",
  "Salpicão",
  "Maionese",
  "Couve",
  "Penne ou gravatinha ao molho branco",
  "Penne ou gravatinha ao molho bolonhesa",
  "Salada Caesar",
  "Salada caprese",
  "Farofa de banana",
];

const CARNES = [
  "Coxa e sobrecoxa",
  "Frango na cerveja",
  "Feijoada",
  "Tropeiro",
  "Lombo ao alecrim",
  "Almôndegas ao sugo",
  "Fraldinha ao molho de mostarda",
  "Frango xadrez",
  "Isca de boi com pimentões",
  "Lagarto recheado",
  "Tilápia à portuguesa",
];

const SOBREMESAS = [
  "Torta de limão",
  "Pavê de biscoito",
  "Brigadeiro gourmet",
  "Pudim de leite condensado",
  "Mousse de maracujá",
  "Mini churros",
  "Palha italiana",
  "Brownie com sorvete",
  "Açaí",
];

/**
 * Decoração não tem PDF de fornecedor. A lista sai do que a própria Dondoka já
 * descreve no texto padrão de decoração e do que aparece nos orçamentos que já
 * foram feitos. É um ponto de partida para o João marcar e completar.
 */
const DECORACAO_ESTRUTURA = [
  "Arco de balão na cor escolhida",
  "Arco desconstruído",
  "Coluna de balões",
  "Balões na entrada",
  "Painel personalizado",
  "Tapete",
  "Número de LED",
];

const DECORACAO_MESA = [
  "Peças para mesa de bolo",
  "Peças para mesa de doces",
  "Bolo cenográfico",
  "Arranjo central da mesa principal",
  "Arranjos para as mesas dos convidados",
  "Toalhas e capas de mesa",
];

const DECORACAO_AMBIENTACAO = [
  "Iluminação cênica",
  "Velas",
  "Arranjos de flores",
  "Plantas e folhagens",
];

export const BIBLIOTECA_SEED: BibliotecaGrupo[] = [
  { id: "bib-salg-trad", categoria: "buffet", titulo: "Salgados tradicionais", itens: SALGADOS_TRADICIONAIS },
  { id: "bib-salg-esp", categoria: "buffet", titulo: "Salgados especiais", itens: SALGADOS_ESPECIAIS },
  { id: "bib-folhados", categoria: "buffet", titulo: "Folhados", itens: FOLHADOS },
  { id: "bib-doces-trad", categoria: "buffet", titulo: "Doces tradicionais", itens: DOCES_TRADICIONAIS },
  { id: "bib-doces-esp", categoria: "buffet", titulo: "Doces especiais", itens: DOCES_ESPECIAIS },
  { id: "bib-bolo-trad", categoria: "buffet", titulo: "Bolo tradicional", itens: BOLO_TRADICIONAL },
  { id: "bib-bolo-esp", categoria: "buffet", titulo: "Bolo especial", itens: BOLO_ESPECIAL },
  { id: "bib-petit", categoria: "buffet", titulo: "Pétit gourmet", itens: PETIT_GOURMET },
  { id: "bib-prato-quente", categoria: "buffet", titulo: "Prato quente", itens: PRATO_QUENTE },
  { id: "bib-petiscos-boteco", categoria: "buffet", titulo: "Petiscos de boteco", itens: PETISCOS_BOTECO },
  { id: "bib-petiscos-volante", categoria: "buffet", titulo: "Petiscos à volante", itens: PETISCOS_VOLANTE },
  { id: "bib-prato-volante", categoria: "buffet", titulo: "Prato quente à volante", itens: PRATO_QUENTE_VOLANTE },
  { id: "bib-mesa-cafe", categoria: "buffet", titulo: "Mesa de café da manhã", itens: MESA_CAFE },
  { id: "bib-bebidas-cafe", categoria: "buffet", titulo: "Bebidas quentes e frias", itens: BEBIDAS_CAFE },
  { id: "bib-junino", categoria: "buffet", titulo: "Comidas juninas", itens: COMIDAS_JUNINAS },
  { id: "bib-entradas", categoria: "buffet", titulo: "Entradas do almoço", itens: ENTRADAS_ALMOCO },
  { id: "bib-arroz", categoria: "buffet", titulo: "Arroz", itens: ["Arroz branco", "Arroz com alho"] },
  { id: "bib-guarnicoes", categoria: "buffet", titulo: "Guarnições", itens: GUARNICOES },
  { id: "bib-carnes", categoria: "buffet", titulo: "Carnes", itens: CARNES },
  { id: "bib-sobremesas", categoria: "buffet", titulo: "Sobremesas", itens: SOBREMESAS },
  { id: "bib-bebidas", categoria: "buffet", titulo: "Bebidas", itens: ["Refrigerante", "Suco", "Água", "Quentão"] },

  { id: "bib-deco-estrutura", categoria: "decoracao", titulo: "Estrutura", itens: DECORACAO_ESTRUTURA },
  { id: "bib-deco-mesa", categoria: "decoracao", titulo: "Mesas", itens: DECORACAO_MESA },
  { id: "bib-deco-ambientacao", categoria: "decoracao", titulo: "Ambientação", itens: DECORACAO_AMBIENTACAO },
];

/* ══════════════════════════════════════════════════════════════════
   KITS — os pacotes prontos
   ══════════════════════════════════════════════════════════════════ */

export const KITS_SEED: Kit[] = [
  {
    id: "kit-festa-basica",
    categoria: "buffet",
    nome: "Festa Básica",
    minimo_pessoas: 30,
    grupos: [
      { id: "g-fb-salgados", titulo: "Salgados", nota: "à vontade", itens: SALGADOS_TRADICIONAIS },
      { id: "g-fb-doces", titulo: "Doces", nota: "4 por convidado, à escolha", itens: DOCES_TRADICIONAIS },
      { id: "g-fb-bolo", titulo: "Bolo de corte", nota: "1 sabor à escolha", itens: BOLO_TRADICIONAL },
    ],
    observacoes: [
      "Equipe de garçons",
      "Equipe de cozinha",
      "Lanche kids para até 20 crianças",
      "4 horas de evento",
    ],
  },

  {
    id: "kit-festa-completa",
    categoria: "buffet",
    nome: "Festa Completa",
    minimo_pessoas: 30,
    grupos: [
      { id: "g-fc-salg-trad", titulo: "Salgados tradicionais", nota: "à vontade", itens: SALGADOS_TRADICIONAIS },
      { id: "g-fc-salg-esp", titulo: "Salgados especiais", nota: "à vontade", itens: SALGADOS_ESPECIAIS },
      { id: "g-fc-folhados", titulo: "Folhados", nota: "à vontade", itens: FOLHADOS },
      {
        id: "g-fc-doces",
        titulo: "Doces",
        nota: "4 por pessoa, entre tradicionais e especiais",
        itens: unir(DOCES_TRADICIONAIS, DOCES_ESPECIAIS),
      },
      {
        id: "g-fc-bolo",
        titulo: "Bolo de corte",
        nota: "1 sabor à escolha",
        itens: unir(BOLO_TRADICIONAL, BOLO_ESPECIAL),
      },
      {
        id: "g-fc-quente",
        titulo: "Pétit gourmet ou prato quente",
        nota: "2 opções de pétit gourmet ou 1 prato quente",
        itens: unir(PETIT_GOURMET, PRATO_QUENTE),
      },
    ],
    observacoes: [
      "Rodada de espetinho de frango",
      "Rodada de batata frita",
      "Lanche kids para até 20 crianças",
      "Equipe de garçons",
      "Equipe de cozinha",
      "4 horas de evento",
    ],
  },

  {
    id: "kit-almoco-jantar",
    categoria: "buffet",
    nome: "Almoço ou Jantar",
    minimo_pessoas: null,
    grupos: [
      { id: "g-aj-entradas", titulo: "Entradas", nota: "8 opções à escolha", itens: ENTRADAS_ALMOCO },
      { id: "g-aj-arroz", titulo: "Arroz", nota: "branco ou com alho", itens: ["Arroz branco", "Arroz com alho"] },
      { id: "g-aj-guarnicoes", titulo: "Guarnições", nota: "4 opções à escolha", itens: GUARNICOES },
      { id: "g-aj-carnes", titulo: "Carnes", nota: "2 opções à escolha", itens: CARNES },
      { id: "g-aj-sobremesa", titulo: "Sobremesa", nota: "1 opção à escolha", itens: SOBREMESAS },
    ],
    observacoes: ["Equipe de garçons", "Equipe de cozinha", "4 horas de evento"],
  },

  {
    id: "kit-comida-boteco",
    categoria: "buffet",
    nome: "Comida de Boteco",
    minimo_pessoas: 40,
    grupos: [
      { id: "g-cb-petiscos", titulo: "Petiscos", nota: "10 opções à escolha", itens: PETISCOS_BOTECO },
      { id: "g-cb-fixos", titulo: "Sempre inclusos", itens: ["Batata frita", "Torresmo"] },
      { id: "g-cb-quente", titulo: "Prato quente para finalizar", nota: "1 à escolha", itens: PRATO_QUENTE_BOTECO },
    ],
    observacoes: ["Equipe de cozinha", "Repositor", "4 horas de evento"],
  },

  {
    id: "kit-boteco-volante",
    categoria: "buffet",
    nome: "Comida de Boteco à Volante",
    minimo_pessoas: 30,
    grupos: [
      { id: "g-bv-petiscos", titulo: "Petiscos servidos à volante", nota: "10 opções à escolha", itens: PETISCOS_VOLANTE },
      { id: "g-bv-quente", titulo: "Prato quente", nota: "1 à escolha", itens: PRATO_QUENTE_VOLANTE },
      { id: "g-bv-bebidas", titulo: "Bebidas", itens: ["Refrigerante", "Suco", "Água"] },
    ],
    observacoes: ["Equipe de garçons", "Equipe de cozinha", "Repositor", "4 horas de evento"],
  },

  {
    id: "kit-coffee-break",
    categoria: "buffet",
    nome: "Coffee Break Completo",
    minimo_pessoas: 30,
    grupos: [
      { id: "g-cf-mesa", titulo: "Mesa de café", itens: MESA_CAFE },
      { id: "g-cf-bebidas", titulo: "Bebidas", itens: BEBIDAS_CAFE },
    ],
    observacoes: ["Equipe de cozinha", "2 horas de duração"],
  },

  {
    id: "kit-buffet-junino",
    categoria: "buffet",
    nome: "Buffet Junino",
    minimo_pessoas: 30,
    grupos: [
      { id: "g-bj-comidas", titulo: "Comidas", itens: COMIDAS_JUNINAS },
      { id: "g-bj-bebidas", titulo: "Bebidas", itens: ["Quentão"] },
    ],
    observacoes: ["Equipe de cozinha", "Repositor", "4 horas de evento"],
  },

  /**
   * Único kit de decoração semeado, montado a partir do texto padrão que a
   * Dondoka já usa. Serve de molde: o João duplica para fazer a intermediária
   * e a premium.
   */
  {
    id: "kit-decoracao-basica",
    categoria: "decoracao",
    nome: "Decoração Básica",
    minimo_pessoas: null,
    grupos: [
      {
        id: "g-db-estrutura",
        titulo: "Estrutura",
        itens: ["Arco de balão na cor escolhida", "Tapete", "Número de LED"],
      },
      {
        id: "g-db-mesa",
        titulo: "Mesas",
        itens: ["Peças para mesa de bolo", "Peças para mesa de doces"],
      },
    ],
    observacoes: ["Demais elementos definidos em briefing"],
  },
];
