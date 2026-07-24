/**
 * Fatos sobre o espaço — a matéria-prima de todas as páginas.
 *
 * REGRA DO MATERIAL REAL: só entra aqui o que a Dondoka pode provar. Cada item
 * desta lista corresponde a algo visível numa foto do acervo ou já declarado
 * pelo cliente nos textos originais. Nada de adjetivo de catálogo.
 *
 * O motivo não é só honestidade: fato específico e verificável é exatamente o
 * que motores generativos extraem e citam. "Fogão industrial de 6 bocas" é
 * citável; "estrutura completa" não é.
 */

export const DIFERENCIAIS = [
  {
    icone: "capacidade",
    titulo: "Até 70 pessoas",
    descricao:
      "Setenta sentadas, com as mesas montadas e a pista livre. São dois ambientes: o salão embaixo, o mezanino em cima.",
  },
  {
    icone: "climatizado",
    titulo: "Totalmente climatizado",
    descricao: "Ar-condicionado nos dois pavimentos. Janeiro ou julho, a festa acontece igual.",
  },
  {
    icone: "cozinha",
    titulo: "Cozinha equipada",
    descricao:
      "Fogão industrial de 6 bocas, freezer, bancadas em inox e passa-prates direto pro salão. Serve o nosso buffet e serve o que você trouxer.",
  },
  {
    icone: "kids",
    titulo: "Espaço kids",
    descricao: "Área separada, com brinquedos. As crianças brincam à vista de quem está na mesa.",
  },
  {
    icone: "banheiros",
    titulo: "3 banheiros",
    descricao: "Um deles adaptado, com fraldário.",
  },
  {
    icone: "decoracao",
    titulo: "Decoração personalizada",
    descricao: "Montada conforme o tema que você escolher. A gente fecha os detalhes num briefing antes da data.",
  },
] as const;

/** Fotos do acervo, agrupadas por assunto — evita string solta espalhada nas páginas. */
export const FOTOS = {
  salaoMezanino: "/fotos/img_5774.webp",
  salaoDecorado: "/fotos/img_5776.webp",
  salaoMesas: "/fotos/img_5775.webp",
  mezanino: "/fotos/img_5923.webp",
  mezaninoEscada: "/fotos/img_5916.webp",
  escadaVidro: "/fotos/img_5922.webp",
  fachadaNoite: "/fotos/img_5738.webp",
  fachadaNoiteAmpla: "/fotos/img_5744.webp",
  fachadaDia: "/fotos/img_6587.webp",
  fachadaDetalhe: "/fotos/img_6592.webp",
  cozinha: "/fotos/img_6658.webp",
  cozinhaApoio: "/fotos/img_5933.webp",
  espacoKids: "/fotos/img_5931.webp",
  banheiro: "/fotos/img_5723.webp",
  banheiroDetalhe: "/fotos/img_5725.webp",
  corredor: "/fotos/img_5758.webp",
  decoracaoDoces: "/fotos/img_5743.webp",
  decoracaoBaloes: "/fotos/img_5753.webp",
  decoracaoMesa: "/fotos/img_5759.webp",
} as const;

/** Ordem da galeria — começa pela fachada e termina nos detalhes. */
export const GALERIA_COMPLETA = [
  FOTOS.fachadaNoite,
  FOTOS.salaoMezanino,
  FOTOS.salaoDecorado,
  FOTOS.decoracaoDoces,
  FOTOS.mezanino,
  FOTOS.salaoMesas,
  FOTOS.decoracaoBaloes,
  FOTOS.mezaninoEscada,
  FOTOS.cozinha,
  FOTOS.espacoKids,
  FOTOS.decoracaoMesa,
  FOTOS.escadaVidro,
  FOTOS.banheiro,
  FOTOS.fachadaNoiteAmpla,
  FOTOS.banheiroDetalhe,
  FOTOS.fachadaDia,
  FOTOS.cozinhaApoio,
  FOTOS.corredor,
  FOTOS.fachadaDetalhe,
] as const;

export const VIDEOS = {
  tour: {
    src: "/video/tour.mp4",
    poster: "/video/tour-poster.webp",
    legenda: "Da fachada ao salão montado: um dia de evento na Dondoka",
  },
  evento: {
    src: "/video/evento.mp4",
    poster: "/video/evento-poster.webp",
    legenda: "Um casamento civil realizado no espaço, do começo ao fim",
  },
  decorLoop: {
    src: "/video/decor-loop.mp4",
    poster: "/video/decor-loop-poster.webp",
    legenda: "Detalhes da mesa de doces e da decoração",
  },
} as const;

export const TIPOS_EVENTO = [
  {
    href: "/eventos/aniversario",
    titulo: "Aniversário",
    descricao: "De adulto ou de criança, com a área kids à disposição.",
    foto: FOTOS.decoracaoBaloes,
  },
  {
    href: "/eventos/quinze-anos",
    titulo: "15 anos",
    descricao: "A entrada acontece pela escada do mezanino.",
    foto: FOTOS.decoracaoDoces,
  },
  {
    href: "/eventos/casamento",
    titulo: "Casamento e mini wedding",
    descricao: "Cerimônia e festa no mesmo lugar, até 70 convidados.",
    foto: FOTOS.salaoDecorado,
  },
  {
    href: "/eventos/corporativo",
    titulo: "Corporativo",
    descricao: "Confraternização, reunião e treinamento.",
    foto: FOTOS.salaoMesas,
  },
] as const;

/**
 * FAQ geral.
 *
 * Cada resposta começa respondendo — sem rodeio — porque é a primeira frase
 * que vira trecho destacado no Google e resposta em IA.
 *
 * ── PENDENTE ────────────────────────────────────────────────────────────
 * Faltam quatro perguntas que os clientes fazem sempre e que não temos como
 * responder sem confirmar com a Dondoka. Não foram inventadas de propósito:
 *   • Horário de funcionamento / até que horas pode ir o evento
 *   • Estacionamento (tem? quantas vagas? é na rua?)
 *   • Horário limite para som alto
 *   • Política de cancelamento e remarcação
 * Assim que confirmados, entram aqui e no Google Business Profile.
 */
export const FAQ_GERAL = [
  {
    pergunta: "Quantas pessoas cabem no espaço?",
    resposta:
      "Até 70. São dois ambientes: o salão principal e o mezanino no piso superior. Dá para separar a recepção da pista, deixar o mezanino com as crianças, ou reservar o andar de cima para quem quer conversar longe do som.",
  },
  {
    pergunta: "Onde fica a Dondoka Recepções?",
    resposta:
      "Na Rua das Petúnias, 1654, bairro Lindéia, região do Barreiro, em Belo Horizonte. O Lindéia faz divisa com Contagem e Ibirité, então quem vem dessas duas cidades chega rápido.",
  },
  {
    pergunta: "Que tipos de evento acontecem aí?",
    resposta:
      "Aniversário de adulto e de criança, festa de 15 anos, casamento civil, mini wedding, batizado e chá. Também recebemos empresas: confraternização, reunião e treinamento.",
  },
  {
    pergunta: "Como funciona o valor do aluguel?",
    resposta:
      "Depende de quatro coisas: o dia da semana (segunda a quinta, sexta, ou sábado e domingo), o período contratado, quantos convidados você espera e o que entra no pacote. Buffet, decoração e serviços mudam bastante o total.\n\nPor isso trabalhamos com orçamento personalizado. Você conta a data, o tipo de evento e o número de pessoas; a gente devolve o valor fechado, com o que está incluso escrito. Sem surpresa depois.",
  },
  {
    pergunta: "O buffet está incluso?",
    resposta:
      "Temos buffet próprio, de comida mineira: cantinho mineiro de entrada, feijoada completa ou feijão tropeiro com lombo no principal, bebidas e equipe de cozinha e copa durante todo o evento.\n\nContratar é opcional. A cozinha industrial recebe buffet de fora sem taxa nenhuma.",
  },
  {
    pergunta: "O espaço é climatizado?",
    resposta: "Sim, os dois pavimentos.",
  },
  {
    pergunta: "Tem espaço para as crianças?",
    resposta:
      "Tem. É uma área separada, com brinquedos, onde as crianças brincam à vista de quem está na mesa. Quem vai a festa com filho pequeno sabe o quanto isso muda a noite.",
  },
  {
    pergunta: "O espaço tem acessibilidade?",
    resposta: "São 3 banheiros. Um deles é adaptado e tem fraldário.",
  },
  {
    pergunta: "Vocês cuidam da decoração?",
    resposta:
      "Cuidamos, e ela é montada conforme o tema de cada festa. O que costuma entrar: arco de balões na cor escolhida, tapete, número de LED e as peças da mesa de bolo e de doces. Tudo definido em briefing antes da data.",
  },
  {
    pergunta: "Como faço para reservar a data?",
    resposta:
      "A data fica reservada com 30% do valor. O restante você quita até 20 dias antes do evento. Aceitamos Pix, cartão de crédito, débito e transferência.",
  },
] as const;
