import { FOTOS } from "./espaco";

/**
 * Conteúdo das quatro páginas de tipo de evento.
 *
 * Elas existem porque ninguém busca "espaço para eventos". Busca "espaço para
 * festa de 15 anos em BH", "salão para confraternização de empresa". Cada
 * página aqui é uma porta de entrada diferente no Google para o mesmo espaço.
 *
 * Vale a mesma regra do resto: só fato verificável. O que muda de página para
 * página não é a fantasia, é o recorte. Qual parte da estrutura importa para
 * aquele tipo de festa.
 */

export type Evento = {
  slug: string;
  nav: string;
  /** <title> da página */
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  h1Destaque: string;
  /** Responde a pergunta do H1 em até duas linhas. É o trecho que a IA extrai. */
  resposta: string;
  foto: string;
  fotoAlt: string;
  secoes: Array<{ titulo: string; paragrafos: string[] }>;
  destaques: string[];
  faq: Array<{ pergunta: string; resposta: string }>;
  mensagemWhatsapp: string;
};

export const EVENTOS: Evento[] = [
  {
    slug: "aniversario",
    nav: "Aniversário",
    title: "Espaço para festa de aniversário em BH — Lindéia, Barreiro | Dondoka",
    description:
      "Espaço para festa de aniversário adulto e infantil em Belo Horizonte: até 70 pessoas, climatizado, com espaço kids, cozinha equipada e buffet mineiro. No Lindéia, Barreiro.",
    eyebrow: "Aniversário",
    h1: "Festa de aniversário",
    h1Destaque: "em BH",
    resposta:
      "A Dondoka recebe aniversário de adulto e de criança para até 70 pessoas, no Lindéia, região do Barreiro. O salão tem dois ambientes, é climatizado e tem área kids separada. Isso resolve o problema clássico da festa de aniversário: onde colocar as crianças.",
    foto: FOTOS.decoracaoBaloes,
    fotoAlt: "Mesa de doces decorada com balões brancos em uma festa de aniversário na Dondoka Recepções",
    secoes: [
      {
        titulo: "Adulto e criança na mesma festa",
        paragrafos: [
          "A maior parte dos aniversários daqui mistura as duas coisas. Os adultos querem conversar e comer bem. As crianças querem correr. O espaço dá conta das duas ao mesmo tempo, sem que uma atrapalhe a outra.",
          "O salão principal recebe as mesas e a pista. O mezanino, no piso superior, vira o segundo ambiente: serve para a mesa de bolo e doces, para as crianças, ou para quem quer sentar longe da caixa de som.",
          "A área kids fica separada, com brinquedos, e à vista dos adultos. Ninguém precisa escolher entre aproveitar a festa e ficar de olho.",
        ],
      },
      {
        titulo: "O que já vem pronto",
        paragrafos: [
          "A decoração é montada conforme o tema. Arco de balões na cor escolhida, tapete, número de LED e as peças da mesa de bolo e de doces entram no combinado durante o briefing.",
          "O buffet é nosso e é mineiro: cantinho mineiro de entrada, feijoada completa ou feijão tropeiro com lombo no principal, bebidas e equipe de cozinha e copa durante todo o evento. Se preferir trazer buffet de fora ou fazer a comida no local, a cozinha industrial atende igual.",
        ],
      },
    ],
    destaques: [
      "Até 70 convidados",
      "Área kids separada",
      "Salão e mezanino",
      "Climatizado nos dois pavimentos",
      "Decoração montada por tema",
      "Buffet mineiro opcional",
    ],
    faq: [
      {
        pergunta: "Dá para fazer festa infantil?",
        resposta:
          "Dá. A área kids é justamente para isso: espaço separado com brinquedos, à vista dos adultos. E o mezanino ajuda a dividir a festa em dois ambientes, separando a bagunça das crianças da mesa dos adultos.",
      },
      {
        pergunta: "Vocês montam a decoração de aniversário?",
        resposta:
          "Montamos, conforme o tema da festa. O que costuma entrar: arco de balões na cor escolhida, tapete, número de LED e as peças da mesa de bolo e de doces. Tudo definido em briefing antes da data.",
      },
      {
        pergunta: "Posso levar o bolo e os doces de fora?",
        resposta:
          "Pode. Muita gente já tem confeiteira de confiança. A cozinha e as bancadas em inox dão apoio para montar a mesa no dia.",
      },
    ],
    mensagemWhatsapp: "Olá! Gostaria de um orçamento para uma festa de aniversário na Dondoka.",
  },

  {
    slug: "quinze-anos",
    nav: "15 anos",
    title: "Espaço para festa de 15 anos em Belo Horizonte | Dondoka Recepções",
    description:
      "Espaço para festa de 15 anos em BH com até 70 convidados: salão em dois níveis com mezanino, climatizado, decoração personalizada e buffet. No Lindéia, Barreiro.",
    eyebrow: "15 anos",
    h1: "Festa de",
    h1Destaque: "15 anos",
    resposta:
      "A Dondoka recebe festas de 15 anos de até 70 convidados em Belo Horizonte. O que diferencia o espaço para esse tipo de festa é o salão em dois níveis: o mezanino cria o ponto alto para a entrada e para as fotos, coisa que um salão plano não oferece.",
    foto: FOTOS.decoracaoDoces,
    fotoAlt: "Mesa de doces montada com taças e arranjos brancos para uma festa na Dondoka Recepções",
    secoes: [
      {
        titulo: "O mezanino muda a festa",
        paragrafos: [
          "Festa de 15 anos tem um momento que não se repete: a entrada da aniversariante. Num salão plano ela acontece no mesmo nível de todo mundo, e metade dos convidados não enxerga nada.",
          "Aqui a escada e o mezanino resolvem isso sozinhos. A entrada vem de cima, à vista do salão inteiro, e o mesmo lugar vira cenário de foto pelo resto da noite.",
          "O piso de cima também funciona como área de descanso durante a festa. Para as tias sentarem, para retocar a maquiagem, para o grupo de amigas se reunir longe do som.",
        ],
      },
      {
        titulo: "Estrutura para a noite inteira",
        paragrafos: [
          "Os dois pavimentos são climatizados, então vestido longo não vira problema em noite quente. São 3 banheiros, um deles adaptado e com fraldário.",
          "A decoração acompanha o tema escolhido e é definida em briefing: arco de balões na cor da festa, tapete, número de LED e as peças da mesa de bolo e de doces.",
          "O buffet mineiro pode ser contratado junto. Se você já escolheu outro, a cozinha industrial recebe a equipe dele sem problema.",
        ],
      },
    ],
    destaques: [
      "Até 70 convidados",
      "Mezanino para a entrada e as fotos",
      "Climatizado nos dois pavimentos",
      "3 banheiros, 1 adaptado",
      "Decoração montada por tema",
      "Buffet mineiro opcional",
    ],
    faq: [
      {
        pergunta: "Cabem quantos convidados numa festa de 15 anos?",
        resposta:
          "Até 70 pessoas, contando salão e mezanino. É um formato de festa mais reunida. Quem quer 150, 200 convidados vai precisar de um espaço maior, e a gente prefere dizer isso logo.",
      },
      {
        pergunta: "Tem espaço para a pista de dança?",
        resposta:
          "Tem. O salão principal comporta as mesas e a pista, e o mezanino absorve quem prefere ficar sentado. Na prática isso libera mais chão para dançar.",
      },
      {
        pergunta: "Vocês têm iluminação e som?",
        resposta:
          "A iluminação do salão é nossa. Som, DJ e efeitos são contratados à parte, e a gente indica profissionais que já trabalharam aqui e conhecem o espaço.",
      },
    ],
    mensagemWhatsapp: "Olá! Gostaria de um orçamento para uma festa de 15 anos na Dondoka.",
  },

  {
    slug: "casamento",
    nav: "Casamento e mini wedding",
    title: "Espaço para mini wedding e casamento civil em BH | Dondoka Recepções",
    description:
      "Espaço para casamento civil e mini wedding em Belo Horizonte, para até 70 convidados. Salão climatizado em dois ambientes, buffet mineiro e decoração personalizada. Lindéia, Barreiro.",
    eyebrow: "Casamento",
    h1: "Casamento civil e",
    h1Destaque: "mini wedding",
    resposta:
      "A Dondoka recebe casamentos civis e mini weddings de até 70 convidados em Belo Horizonte. É espaço para celebração intimista. Se o seu casamento tem 150 ou 200 pessoas, não somos a casa certa, e preferimos falar isso antes de você perder tempo.",
    foto: FOTOS.salaoDecorado,
    fotoAlt: "Salão da Dondoka Recepções montado para um casamento, com mesas postas e decoração em tons claros",
    secoes: [
      {
        titulo: "O formato intimista tem vantagem",
        paragrafos: [
          "Casamento de 70 pessoas não é casamento pequeno. É casamento com todo mundo que importa e ninguém que você mal conhece. A conta fecha melhor, a comida sai melhor, e dá tempo de conversar com cada convidado.",
          "O espaço acompanha esse formato. O salão principal recebe a cerimônia e as mesas. O mezanino vira recepção dos convidados, espaço do brinde ou área da mesa de doces.",
          "O vídeo na página inicial é de um casamento civil que aconteceu aqui. Vale mais que qualquer descrição nossa.",
        ],
      },
      {
        titulo: "Do civil à festa, no mesmo lugar",
        paragrafos: [
          "Muita gente faz o civil e a festa em endereços diferentes e perde convidado no caminho. Aqui a cerimônia e a recepção acontecem no mesmo espaço, sem deslocamento e sem intervalo morto.",
          "A decoração acompanha a proposta do casal e é definida em briefing. O buffet mineiro pode entrar no pacote, com equipe de cozinha e copa durante todo o evento, louças, talheres, copos e guardanapos inclusos.",
        ],
      },
    ],
    destaques: [
      "Até 70 convidados",
      "Cerimônia e festa no mesmo espaço",
      "Salão e mezanino",
      "Climatizado nos dois pavimentos",
      "Buffet com louças e equipe",
      "Decoração montada por tema",
    ],
    faq: [
      {
        pergunta: "Dá para fazer a cerimônia e a festa no mesmo lugar?",
        resposta:
          "Dá, e é o formato mais comum aqui. A cerimônia acontece no salão e a recepção segue no mesmo espaço, usando o mezanino como apoio. Ninguém precisa se deslocar entre uma coisa e outra.",
      },
      {
        pergunta: "Quantos convidados cabem num mini wedding?",
        resposta:
          "Até 70 pessoas. É o limite real do espaço, não número de folheto. Acima disso a experiência piora para todo mundo, então preferimos não aceitar.",
      },
      {
        pergunta: "O buffet inclui louça e equipe?",
        resposta:
          "Inclui. O buffet próprio vem com equipe completa de cozinha e copa durante todo o evento, além de louças, talheres, copos e guardanapos.",
      },
    ],
    mensagemWhatsapp: "Olá! Gostaria de um orçamento para um casamento na Dondoka.",
  },

  {
    slug: "corporativo",
    nav: "Corporativo",
    title: "Espaço para confraternização de empresa em BH | Dondoka Recepções",
    description:
      "Espaço para confraternização, reunião e treinamento em Belo Horizonte: até 70 pessoas, climatizado, cozinha equipada e buffet próprio. No Lindéia, Barreiro, com acesso fácil de Contagem.",
    eyebrow: "Corporativo",
    h1: "Confraternização e evento",
    h1Destaque: "corporativo",
    resposta:
      "A Dondoka recebe confraternização de empresa, reunião e treinamento para até 70 pessoas em Belo Horizonte. O espaço fica no Lindéia, Barreiro, com acesso curto para quem vem de Contagem e Ibirité. Isso costuma resolver a logística de equipes espalhadas pela região.",
    foto: FOTOS.salaoMesas,
    fotoAlt: "Salão da Dondoka Recepções com mesas redondas postas, pronto para um evento corporativo",
    secoes: [
      {
        titulo: "Confraternização de fim de ano",
        paragrafos: [
          "É o evento corporativo mais pedido, e o que mais dá dor de cabeça para quem organiza: agenda apertada, orçamento fechado e a missão de agradar gente de perfis muito diferentes.",
          "O buffet mineiro resolve boa parte disso. Feijoada completa e feijão tropeiro com lombo agradam quase todo mundo e cabem no orçamento de empresa. A equipe de cozinha e copa fica durante todo o evento, com louças e talheres inclusos.",
          "O salão comporta mesas redondas para a equipe inteira, e o mezanino serve de apoio para quem quer conversar sem competir com a música.",
        ],
      },
      {
        titulo: "Reuniões e treinamentos",
        paragrafos: [
          "Para eventos de trabalho durante o dia, o espaço funciona com layout de mesas ou de auditório. É climatizado nos dois pavimentos e tem 3 banheiros, um deles adaptado.",
          "A cozinha equipada permite servir coffee break e almoço no mesmo lugar, sem parar para deslocar a equipe.",
        ],
      },
    ],
    destaques: [
      "Até 70 pessoas",
      "Layout de mesas ou auditório",
      "Climatizado nos dois pavimentos",
      "Coffee break e almoço no local",
      "Acesso fácil de Contagem e Ibirité",
      "Buffet com equipe e louças",
    ],
    faq: [
      {
        pergunta: "Vocês atendem empresas de Contagem e Ibirité?",
        resposta:
          "Atendemos. O Lindéia faz divisa com as duas cidades, então a distância costuma ser menor que ir até o Centro de BH. É um dos motivos pelos quais empresas da região escolhem o espaço.",
      },
      {
        pergunta: "Dá para fazer treinamento durante o dia?",
        resposta:
          "Dá. O salão aceita layout de auditório ou de mesas, é climatizado, e a cozinha equipada permite servir coffee break e almoço sem tirar a equipe do local.",
      },
      {
        pergunta: "Como funciona o orçamento para empresa?",
        resposta:
          "Igual aos demais eventos: o valor depende do dia da semana, do período e do número de pessoas, além do que entra de buffet e serviços. Mande os dados pelo WhatsApp que devolvemos o orçamento fechado, com nota.",
      },
    ],
    mensagemWhatsapp: "Olá! Gostaria de um orçamento para um evento corporativo na Dondoka.",
  },
];

export function eventoPorSlug(slug: string) {
  return EVENTOS.find((e) => e.slug === slug);
}
