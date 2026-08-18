/**
 * Fatos sobre o espaço — a matéria-prima de todas as páginas.
 *
 * REGRA DO MATERIAL REAL: só entra aqui o que a Dondoka pode provar. Cada item
 * desta lista corresponde a algo visível numa foto do acervo ou confirmado pela
 * Camila. Nada de adjetivo de catálogo.
 *
 * O motivo não é só honestidade: fato específico e verificável é exatamente o
 * que motores generativos extraem e citam. "Fogão industrial de 4 bocas com forno" é
 * citável; "estrutura completa" não é.
 *
 * ── DUAS COISAS QUE A DONDOKA NÃO FAZ ─────────────────────────────────────
 * 1. BUFFET. A casa não tem buffet próprio. Trabalha com parceiros indicados
 *    conforme o perfil do evento. A cozinha equipada é estrutura física da
 *    casa e fica à disposição de quem o cliente contratar — isso é verdade e
 *    é diferencial. O que não pode é sugerir que a comida sai daqui.
 * 2. DECORAÇÃO. Mesma lógica: parceiros indicados, execução não é da Dondoka.
 *
 * ESPAÇO KIDS ainda não está pronto (Camila, jul/2026). Fora do site até
 * ficar. Existe foto do local (img_5931), guardada em FOTOS mas fora da
 * galeria.
 *
 * ── DOIS ERROS QUE JÁ ESTIVERAM AQUI (João, ago/2026) ─────────────────────
 * 1. O fogão é de 4 BOCAS COM FORNO, não de 6. Estava errado em cinco lugares
 *    do site ao mesmo tempo, porque cada página tinha a própria cópia da
 *    frase.
 * 2. NÃO EXISTE PASSA-PRATES nem janela de passagem para o salão. Isso foi
 *    inventado em algum momento e se espalhou junto. A cozinha é fechada.
 *
 * Se aparecer de novo, é sinal de que alguém copiou de uma versão velha.
 */

/**
 * Os cinco itens que a Camila pediu em destaque, nesta ordem. Sem espaço kids,
 * sem decoração (que não é serviço da casa).
 */
export const DIFERENCIAIS = [
  {
    icone: "capacidade",
    titulo: "Até 70 convidados",
    descricao:
      "Setenta sentados, com as mesas montadas e a pista livre.",
  },
  {
    icone: "ambientes",
    titulo: "Dois ambientes",
    descricao: "O salão principal embaixo e o mezanino no piso de cima.",
  },
  {
    icone: "climatizado",
    titulo: "Espaço climatizado",
    descricao: "Ar-condicionado nos dois pavimentos. Janeiro ou julho, a festa acontece igual.",
  },
  {
    icone: "cozinha",
    titulo: "Cozinha equipada",
    descricao:
      "Fogão industrial de 4 bocas com forno, freezer, cuba e bancadas em inox. Fica à disposição do buffet que você contratar.",
  },
  {
    icone: "banheiros",
    titulo: "3 banheiros",
    descricao: "Um deles adaptado, com fraldário.",
  },
] as const;

/**
 * Fotos do acervo, agrupadas por assunto.
 *
 * O nome da chave descreve o que a foto REALMENTE mostra. Isso foi conferido
 * imagem por imagem em jul/2026, depois que duas estavam trocadas entre si
 * (img_5743 e img_5744) e o alt text descrevia mesa de doces numa foto de
 * fachada. Alt errado engana leitor de tela e o Google, que lê o alt como
 * descrição do conteúdo.
 *
 * Ao adicionar foto nova: abra o arquivo antes de nomear a chave.
 */
export const FOTOS = {
  // Espaço vazio — as mais limpas, boas para hero
  mezaninoEscada: "/fotos/img_5916.webp",
  escadaVidro: "/fotos/img_5922.webp",
  mezanino: "/fotos/img_5923.webp",

  /**
   * Salão decorado. As três foram fotografadas por trás de um vaso de plantas,
   * então têm folhas verdes cobrindo o canto inferior. Servem para ilustrar
   * seção, não para hero de página inteira.
   */
  salaoDecoradoA: "/fotos/img_5774.webp",
  salaoDecoradoB: "/fotos/img_5775.webp",
  salaoDecoradoC: "/fotos/img_5776.webp",

  // Fachada
  fachadaNoite: "/fotos/img_5738.webp",
  fachadaNoiteAmpla: "/fotos/img_5743.webp",
  fachadaDia: "/fotos/img_6587.webp",
  fachadaDetalhe: "/fotos/img_6592.webp",

  // Eventos que aconteceram na casa
  eventoDoces: "/fotos/img_5744.webp",
  eventoBaloes: "/fotos/img_5753.webp",
  eventoMesaAlta: "/fotos/img_5759.webp",

  // Estrutura
  cozinha: "/fotos/img_6658.webp",
  cozinhaApoio: "/fotos/img_5933.webp",
  banheiro: "/fotos/img_5723.webp",
  banheiroDetalhe: "/fotos/img_5725.webp",
  corredor: "/fotos/img_5758.webp",

  /** Fora do site até a área ficar pronta. */
  espacoKids: "/fotos/img_5931.webp",
} as const;

/**
 * Galeria — eventos reais primeiro.
 *
 * A Camila pediu prioridade para foto de evento acontecendo, e que a galeria
 * cresça conforme as festas forem acontecendo. Por isso a curadoria começa
 * pelo espaço montado com decoração, e o detalhe técnico (banheiro, corredor,
 * área de apoio) fica no fim ou fora.
 *
 * Fora da galeria por decisão:
 *   espacoKids     — a área ainda não está pronta
 *   banheiroDetalhe, cozinhaApoio, corredor, fachadaDetalhe — pouco atrativo
 *                    numa galeria enxuta; voltam se fizer falta
 */
export const GALERIA_COMPLETA = [
  FOTOS.mezaninoEscada,
  FOTOS.eventoDoces,
  FOTOS.escadaVidro,
  FOTOS.eventoBaloes,
  FOTOS.mezanino,
  FOTOS.eventoMesaAlta,
  FOTOS.salaoDecoradoC,
  FOTOS.fachadaNoite,
  FOTOS.cozinha,
  FOTOS.salaoDecoradoB,
  FOTOS.fachadaDia,
  FOTOS.banheiro,
  FOTOS.fachadaNoiteAmpla,
  FOTOS.salaoDecoradoA,
] as const;

/**
 * Carrossel da home.
 *
 * A Camila pediu prioridade para as fotos do espaço, e a home não mostrava
 * nenhuma além do hero. Estas dez foram escolhidas por dois critérios:
 * qualidade da imagem e variedade do que mostram. A ordem alterna espaço
 * vazio e evento montado, para quem passa os olhos entender as duas coisas.
 *
 * Ficaram de fora as fotos com folhagem cobrindo o canto (salaoDecorado*),
 * o corredor e a área de apoio: numa vitrine curta, cada slide precisa
 * justificar o lugar.
 *
 * Legenda existe porque foto sem contexto não informa. Ela também vira o alt.
 */
export const CARROSSEL_HOME = [
  { foto: FOTOS.mezaninoEscada, legenda: "O salão visto da escada, com o mezanino ao fundo" },
  { foto: FOTOS.eventoDoces, legenda: "Mesa de doces montada para um evento na casa" },
  { foto: FOTOS.escadaVidro, legenda: "A escada que liga os dois ambientes" },
  { foto: FOTOS.eventoBaloes, legenda: "Decoração em branco, montada por um parceiro" },
  { foto: FOTOS.mezanino, legenda: "O mezanino, no piso de cima" },
  { foto: FOTOS.fachadaNoite, legenda: "A fachada iluminada à noite" },
  { foto: FOTOS.eventoMesaAlta, legenda: "Mesas altas para receber os convidados" },
  { foto: FOTOS.cozinha, legenda: "Cozinha industrial equipada" },
  { foto: FOTOS.fachadaDia, legenda: "A entrada, na Rua das Petúnias" },
  { foto: FOTOS.banheiro, legenda: "Um dos 3 banheiros" },
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
    legenda: "Detalhes da mesa de doces montada por um parceiro",
  },
} as const;

/**
 * Os seis tipos que a Camila listou. Cada um é uma seção com âncora dentro de
 * /eventos, não uma página separada.
 *
 * SEM FOTO, de propósito. A home mostrava estes tipos como seis cards grandes
 * com imagem, e as imagens não representavam o tipo: "workshops" aparecia com
 * uma foto do mezanino vazio, "chás" com uma mesa de doces qualquer. Foto que
 * não ilustra o que está escrito não informa nada e ainda rouba o destaque que
 * a Camila pediu para as fotos do espaço.
 *
 * Na home isso virou uma lista de texto discreta. Na página /eventos, cada
 * tipo tem a sua seção com a foto que de fato combina.
 *
 * `keywords` não é para exibir. É o termo de busca que o texto daquela seção
 * em /eventos precisa cobrir naturalmente, já que não existe mais página
 * dedicada para cada tipo.
 */
export const TIPOS_EVENTO = [
  {
    id: "aniversario",
    titulo: "Aniversários",
    descricao: "De adulto ou de criança",
    keywords: "espaço para festa de aniversário em BH",
  },
  {
    id: "casamento",
    titulo: "Casamentos e mini weddings",
    descricao: "Cerimônia e festa no mesmo lugar",
    keywords: "espaço para casamento civil e mini wedding em Belo Horizonte",
  },
  {
    id: "quinze-anos",
    titulo: "Festas de 15 anos",
    descricao: "Entrada pela escada do mezanino",
    keywords: "espaço para festa de 15 anos em BH",
  },
  {
    id: "corporativo",
    titulo: "Eventos corporativos",
    descricao: "Confraternização, reunião e apresentação",
    keywords: "espaço para confraternização de empresa em Belo Horizonte",
  },
  {
    id: "chas",
    titulo: "Chás",
    descricao: "De bebê, de panela e revelação",
    keywords: "espaço para chá de bebê, chá de panela e chá revelação em BH",
  },
  {
    id: "workshops",
    titulo: "Workshops e treinamentos",
    descricao: "Layout de mesas ou auditório",
    keywords: "espaço para workshop e treinamento em Belo Horizonte",
  },
] as const;

/**
 * FAQ geral.
 *
 * Cada resposta começa respondendo, sem rodeio, porque é a primeira frase que
 * vira trecho destacado no Google e resposta em IA.
 *
 * As quatro primeiras são as que a Camila listou no documento de ajustes. As
 * demais cobrem o que já chegava pelo WhatsApp.
 *
 * ── PENDENTE DE CONFIRMAÇÃO ─────────────────────────────────────────────
 * Quatro perguntas frequentes seguem fora porque ninguém confirmou a resposta.
 * Não foram inventadas de propósito:
 *   • Horário de funcionamento e até que horas o evento pode ir
 *   • Estacionamento (tem? quantas vagas? é na rua?)
 *   • Horário limite para som alto
 *   • Política de cancelamento e remarcação
 * Assim que confirmadas, entram aqui e no Google Business Profile.
 */
export const FAQ_GERAL = [
  {
    pergunta: "Quantas pessoas o espaço comporta?",
    resposta:
      "Até 70 convidados. São dois ambientes: o salão principal e o mezanino no piso de cima. Dá para separar a recepção da pista, ou reservar o andar de cima para quem prefere conversar longe do som.",
  },
  {
    pergunta: "Quais tipos de eventos vocês recebem?",
    resposta:
      "Aniversários, casamentos e mini weddings, festas de 15 anos, eventos corporativos, chás (de bebê, de panela e revelação), workshops e treinamentos.",
  },
  {
    pergunta: "Vocês oferecem buffet e decoração?",
    resposta:
      "A Dondoka trabalha com parceiros de confiança para buffet e decoração, indicados conforme o perfil e as necessidades do seu evento. Você também pode trazer os seus fornecedores: a cozinha equipada da casa fica à disposição de quem for servir.",
  },
  {
    pergunta: "Como faço para solicitar um orçamento?",
    resposta:
      "Envie a data do evento, o tipo de comemoração e o número aproximado de convidados pelo WhatsApp ou pelo formulário de orçamento. A gente responde com o valor fechado.",
  },
  {
    pergunta: "Onde fica a Dondoka Recepções?",
    resposta:
      "Na Rua das Petúnias, 1654, bairro Lindéia, região do Barreiro, em Belo Horizonte. O Lindéia faz divisa com Contagem e Ibirité, então quem vem dessas duas cidades chega rápido.",
  },
  {
    pergunta: "O valor muda conforme o dia da semana?",
    resposta:
      "Não. O valor da locação do espaço é o mesmo para qualquer dia, sábado ou terça-feira. O que pode variar é o que você contrata além do espaço.",
  },
  {
    pergunta: "O espaço é climatizado?",
    resposta: "Sim, os dois pavimentos.",
  },
  {
    pergunta: "Posso trazer meu próprio buffet?",
    resposta:
      "Pode, sem taxa. A cozinha é industrial e equipada: fogão de 4 bocas com forno, freezer, cuba e bancadas em inox. A equipe que você contratar encontra tudo o que precisa.",
  },
  {
    pergunta: "O espaço tem acessibilidade?",
    resposta: "São 3 banheiros. Um deles é adaptado e tem fraldário.",
  },
  {
    pergunta: "Como faço para reservar a data?",
    resposta:
      "A data fica reservada com 30% do valor. O restante você quita até 20 dias antes do evento. Aceitamos Pix, cartão de crédito, débito e transferência.",
  },
] as const;
