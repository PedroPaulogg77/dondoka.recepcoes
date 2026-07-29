import { FOTOS } from "./espaco";

/**
 * Conteúdo da página /eventos.
 *
 * Antes eram quatro páginas separadas (/eventos/aniversario, /quinze-anos,
 * /casamento, /corporativo). A Camila pediu para consolidar, e a decisão tem
 * lastro técnico: as quatro tinham estrutura quase idêntica e pouco material
 * próprio de cada tipo — conteúdo raso repetido entre si não ranqueia bem.
 *
 * Agora cada tipo é uma seção com âncora (`/eventos#casamento`), e o texto de
 * cada uma carrega naturalmente o termo que a página dedicada carregaria. As
 * URLs antigas redirecionam para cá (301, em next.config.mjs).
 *
 * Quando um tipo tiver foto e caso real que sustentem uma página inteira, ele
 * volta a ter a própria. Hoje, chás e workshops não têm foto nenhuma.
 *
 * REGRA: nada de buffet ou decoração como serviço da casa. São parceiros.
 */

export type SecaoEvento = {
  /** Vira a âncora da URL: /eventos#casamento */
  id: string;
  titulo: string;
  /** Frase que abre a seção respondendo o que é. É o trecho que a IA extrai. */
  abertura: string;
  paragrafos: string[];
  foto: string;
  fotoAlt: string;
};

export const SECOES_EVENTO: SecaoEvento[] = [
  {
    id: "aniversario",
    titulo: "Aniversários",
    abertura:
      "A Dondoka recebe festa de aniversário de adulto e de criança em Belo Horizonte, para até 70 convidados.",
    paragrafos: [
      "O salão principal comporta as mesas e a pista. O mezanino, no piso de cima, funciona como segundo ambiente: serve para a mesa de bolo e doces, ou para quem prefere sentar longe da caixa de som.",
      "Quem faz aniversário infantil costuma usar os dois níveis a favor, deixando a bagunça das crianças separada da mesa dos adultos sem tirar ninguém de vista.",
    ],
    foto: FOTOS.eventoBaloes,
    fotoAlt: "Mesa de doces decorada com balões brancos em uma festa na Dondoka Recepções",
  },
  {
    id: "casamento",
    titulo: "Casamentos e mini weddings",
    abertura:
      "Espaço para casamento civil e mini wedding em BH, com cerimônia e festa no mesmo lugar, para até 70 convidados.",
    paragrafos: [
      "Casamento de 70 pessoas não é casamento pequeno. É casamento com todo mundo que importa e ninguém que você mal conhece. A conta fecha melhor e dá tempo de conversar com cada convidado.",
      "A cerimônia acontece no salão e a recepção segue no mesmo espaço, usando o mezanino como apoio. Ninguém precisa se deslocar entre uma coisa e outra. O vídeo na galeria é de um casamento civil que aconteceu aqui.",
    ],
    foto: FOTOS.salaoDecoradoC,
    fotoAlt: "Salão da Dondoka Recepções montado para um casamento, com mesas postas e decoração clara",
  },
  {
    id: "quinze-anos",
    titulo: "Festas de 15 anos",
    abertura:
      "Espaço para festa de 15 anos em Belo Horizonte, com salão em dois níveis para até 70 convidados.",
    paragrafos: [
      "A entrada da aniversariante é o momento que não se repete. Num salão plano ela acontece no mesmo nível de todo mundo e metade dos convidados não enxerga. Aqui a escada e o mezanino resolvem isso: a entrada vem de cima, à vista do salão inteiro.",
      "O mesmo lugar vira cenário de foto pelo resto da noite, e o piso de cima funciona como área de descanso durante a festa.",
    ],
    foto: FOTOS.eventoDoces,
    fotoAlt: "Mesa de doces montada com taças e arranjos brancos para uma festa na Dondoka Recepções",
  },
  {
    id: "corporativo",
    titulo: "Eventos corporativos",
    abertura:
      "Espaço para confraternização de empresa, reunião e apresentação em Belo Horizonte, para até 70 pessoas.",
    paragrafos: [
      "O salão comporta mesas redondas para a equipe inteira, e o mezanino serve de apoio para quem quer conversar sem competir com a música.",
      "Ficamos no Lindéia, com acesso curto para quem vem de Contagem e de Ibirité. Para equipes espalhadas pela região do Barreiro, costuma ser mais perto que ir até o Centro de BH.",
    ],
    foto: FOTOS.salaoDecoradoB,
    fotoAlt: "Salão da Dondoka Recepções com mesas redondas postas, pronto para um evento corporativo",
  },
  {
    id: "chas",
    titulo: "Chás",
    abertura:
      "Chá de bebê, chá de panela e chá revelação, em espaço fechado e climatizado para até 70 convidados.",
    paragrafos: [
      "São festas de tarde, quase sempre com muita gente da família e faixas de idade misturadas. Os dois ambientes ajudam: a brincadeira acontece embaixo e quem quer conversar sobe para o mezanino.",
      "Por ser espaço fechado e climatizado, a data não depende do tempo lá fora.",
    ],
    foto: FOTOS.eventoMesaAlta,
    fotoAlt: "Mesa decorada com arranjos e doces em um evento na Dondoka Recepções",
  },
  {
    id: "workshops",
    titulo: "Workshops e treinamentos",
    abertura:
      "Espaço para workshop, treinamento e apresentação em Belo Horizonte, com layout de mesas ou de auditório.",
    paragrafos: [
      "Para evento de trabalho durante o dia, o salão aceita as duas montagens. É climatizado nos dois pavimentos e tem 3 banheiros, um deles adaptado.",
      "A cozinha equipada permite servir coffee break e almoço no mesmo lugar, sem parar para deslocar o grupo.",
    ],
    foto: FOTOS.mezanino,
    fotoAlt: "Mezanino da Dondoka Recepções, piso superior amplo com guarda-corpo de vidro e metal",
  },
];

/** FAQ da página de eventos. Complementa a FAQ geral, sem repetir. */
export const FAQ_EVENTOS = [
  {
    pergunta: "Cabem quantos convidados?",
    resposta:
      "Até 70 pessoas, contando o salão e o mezanino. É o limite real do espaço, não número de folheto. Quem precisa de 150 ou 200 convidados vai precisar de um espaço maior, e a gente prefere dizer isso logo.",
  },
  {
    pergunta: "Dá para fazer cerimônia e festa no mesmo lugar?",
    resposta:
      "Dá, e é o formato mais comum nos casamentos civis daqui. A cerimônia acontece no salão e a recepção segue no mesmo espaço, com o mezanino servindo de apoio.",
  },
  {
    pergunta: "Vocês têm som e iluminação?",
    resposta:
      "A iluminação do salão é da casa. Som, DJ e efeitos são contratados à parte, e a gente indica profissionais que já trabalharam aqui e conhecem o espaço.",
  },
  {
    pergunta: "E se o meu tipo de evento não estiver na lista?",
    resposta:
      "Chame no WhatsApp e conte o que você tem em mente. O espaço atende bem qualquer celebração de até 70 pessoas que caiba nos dois ambientes.",
  },
];
