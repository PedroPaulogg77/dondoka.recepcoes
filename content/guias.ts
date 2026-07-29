import { FOTOS } from "./espaco";

/**
 * Guias.
 *
 * REGRA DO MATERIAL REAL, aplicada com rigor extra aqui — é onde mais tenta a
 * vontade de encher linguiça. Cada guia nasce de uma pergunta que chega de
 * verdade no WhatsApp da Dondoka, e é respondido com o que a casa sabe por
 * operar todo fim de semana. Nenhum número de mercado inventado, nenhuma
 * estatística sem fonte, nenhum "5 dicas" genérico.
 *
 * Cadência sugerida: 1 guia por mês. Conteúdo atualizado nos últimos 30 dias
 * recebe muito mais citação em IA — mas um guia bom por mês vale mais que
 * quatro rasos.
 *
 * Para publicar um guia novo: adicione um objeto neste array. A rota, o
 * sitemap e o índice se atualizam sozinhos.
 */

export type Bloco =
  | { tipo: "p"; texto: string }
  | { tipo: "h2"; texto: string }
  | { tipo: "lista"; itens: string[] }
  | { tipo: "destaque"; texto: string };

export type Guia = {
  slug: string;
  titulo: string;
  /** <title> — pode diferir do H1 quando couber mais palavra-chave */
  title: string;
  description: string;
  /** Resposta em 2 linhas, antes de qualquer rodeio. É o trecho extraído. */
  resumo: string;
  publicadoEm: string;
  atualizadoEm: string;
  foto: string;
  fotoAlt: string;
  blocos: Bloco[];
};

export const GUIAS: Guia[] = [
  {
    slug: "quanto-custa-alugar-espaco-para-festa-bh",
    titulo: "Quanto custa alugar um espaço para festa em BH",
    title: "Quanto custa alugar um espaço para festa em BH: o que muda no valor",
    description:
      "O que realmente define o preço de um salão de festas em Belo Horizonte: dia da semana, período, número de convidados e o que está incluso. Guia da Dondoka Recepções, onde a locação tem valor fixo.",
    resumo:
      "Não existe preço único para alugar um espaço de festa em BH. E desconfie de quem responde com um número antes de perguntar a data. Quatro variáveis definem quase todo o valor: o dia da semana, o período contratado, o número de convidados e o que já vem incluso no pacote.",
    publicadoEm: "2026-07-23",
    atualizadoEm: "2026-07-23",
    foto: FOTOS.mezanino,
    fotoAlt: "Salão da Dondoka Recepções com mesas redondas montadas para um evento",
    blocos: [
      {
        tipo: "p",
        texto:
          "Essa é a primeira pergunta que chega no nosso WhatsApp, quase sempre assim: “quanto custa?”. A resposta honesta é que depende. Só que “depende” sozinho não ajuda ninguém, então vamos abrir do que depende. Assim você compara propostas de espaços diferentes sabendo o que está olhando.",
      },
      { tipo: "h2", texto: "1. O dia da semana muda tudo" },
      {
        tipo: "p",
        texto:
          "É a variável de maior peso, e a que mais gente ignora. Sábado é o dia mais concorrido do ano inteiro em qualquer casa de eventos de Belo Horizonte, e preço acompanha demanda. Sexta costuma ficar num meio-termo. De segunda a quinta, o mesmo espaço sai bem mais em conta.",
      },
      {
        tipo: "p",
        texto:
          "Se a sua data tem flexibilidade, essa costuma ser a decisão que mais mexe no orçamento final. Aniversário de criança numa sexta à tarde, confraternização de empresa numa quinta. Em boa parte das casas, são movimentos que economizam de verdade.",
      },
      {
        tipo: "destaque",
        texto:
          "Na Dondoka funciona diferente: a locação do espaço tem valor fixo, igual para qualquer dia. Sábado ou terça, você paga o mesmo. Preferimos assim porque evita a conversa de remarcar a festa para caber no orçamento.",
      },
      { tipo: "h2", texto: "2. O período contratado" },
      {
        tipo: "p",
        texto:
          "Espaço de eventos não se aluga “por festa”, se aluga por período. E o período precisa contar três coisas que quase todo mundo esquece na hora de calcular: a montagem da decoração antes, a festa em si, e a desmontagem depois.",
      },
      {
        tipo: "p",
        texto:
          "Na hora de comparar duas propostas, confirme se as duas estão falando da mesma janela de horas. Um valor mais baixo com duas horas a menos não sai mais barato. Sai menos festa.",
      },
      { tipo: "h2", texto: "3. Quantos convidados" },
      {
        tipo: "p",
        texto:
          "O número de pessoas afeta o buffet diretamente (é comida por cabeça), e afeta a estrutura de forma indireta: mais gente pede mais louça, mais equipe de copa, mais mesas.",
      },
      {
        tipo: "destaque",
        texto:
          "Um conselho que damos mesmo perdendo venda: não contrate espaço para 100 pessoas se a sua lista real tem 60. Sobra espaço vazio, a festa parece murcha e você pagou por metro quadrado que ninguém usou. Melhor um espaço cheio e animado que um grande e vazio.",
      },
      { tipo: "h2", texto: "4. O que já vem incluso, a variável que mais engana" },
      {
        tipo: "p",
        texto:
          "Aqui mora a diferença entre um orçamento que parece barato e um que é barato. Dois espaços podem cobrar valores parecidos pelo aluguel e terminar com contas totalmente diferentes, porque um inclui coisas que o outro cobra à parte.",
      },
      {
        tipo: "p",
        texto: "Ao comparar, verifique item por item se o valor cobre:",
      },
      {
        tipo: "lista",
        itens: [
          "Mesas, cadeiras e toalhas",
          "Louças, talheres, copos e guardanapos",
          "Equipe de cozinha e de copa durante o evento",
          "Decoração, e qual decoração exatamente",
          "Limpeza antes e depois",
          "Bebidas, e quais bebidas",
          "Energia, gás e água",
        ],
      },
      {
        tipo: "p",
        texto:
          "É comum um espaço apresentar um aluguel enxuto e, quando você soma louça alugada, equipe contratada e limpeza, o total passar o do concorrente que já entregava tudo junto. Peça sempre o valor fechado, com tudo dentro.",
      },
      { tipo: "h2", texto: "E os extras que aparecem depois" },
      {
        tipo: "p",
        texto:
          "Alguns itens quase nunca entram no aluguel e é bom já contar com eles desde o começo: DJ ou som, fotógrafo, bolo e doces, segurança, recepcionista e manobrista. Nada disso é pegadinha, são serviços de terceiros. Mas entram na conta final da festa, e é melhor descobrir isso antes de fechar o espaço.",
      },
      { tipo: "h2", texto: "Por que não publicamos uma tabela de preços" },
      {
        tipo: "p",
        texto:
          "Seria mais cômodo para nós colocar um número na página e deixar você decidir sozinho. Não fazemos isso porque tabela de preço em site de espaço de eventos quase sempre engana: ou o número é tão baixo que não inclui nada, ou é tão alto que assusta quem faria uma festa simples de quinta-feira.",
      },
      {
        tipo: "p",
        texto:
          "O que fazemos é responder rápido e com o valor fechado. Você manda a data, o tipo de evento e quantas pessoas espera; a gente devolve quanto custa, com o que está incluso escrito. Se não couber no seu orçamento, você descobre em minutos e sem constrangimento.",
      },
      {
        tipo: "p",
        texto:
          "Uma coisa a gente já adianta: a locação do espaço tem valor fixo, sem variação por dia da semana. O que muda de um orçamento para outro é o que você contrata além do espaço.",
      },
    ],
  },

  {
    slug: "perguntas-antes-de-fechar-salao-de-festas",
    titulo: "7 perguntas para fazer antes de fechar um salão de festas",
    title: "7 perguntas para fazer antes de fechar um salão de festas | Dondoka",
    description:
      "Checklist do que perguntar na visita a um espaço de eventos: capacidade real, o que está incluso, horários, cozinha, acessibilidade e cancelamento. Guia da Dondoka Recepções.",
    resumo:
      "A visita a um espaço de eventos dura vinte minutos e decide uma festa que você planeja há meses. Estas sete perguntas evitam quase todos os problemas que aparecem depois. Valem para qualquer casa, inclusive a nossa.",
    publicadoEm: "2026-07-23",
    atualizadoEm: "2026-07-23",
    foto: FOTOS.mezaninoEscada,
    fotoAlt: "Vista do mezanino e da escada do espaço da Dondoka Recepções",
    blocos: [
      {
        tipo: "p",
        texto:
          "Escrevemos este guia sabendo que ele pode ser usado contra nós. É essa a intenção. Cliente que pergunta certo fecha melhor, cobra o que combinou e não tem surpresa no dia. Leve esta lista na visita, aqui ou em qualquer outro espaço.",
      },
      { tipo: "h2", texto: "1. Qual a capacidade real, com as mesas montadas?" },
      {
        tipo: "p",
        texto:
          "Capacidade de folheto costuma ser calculada com o salão vazio, ou com todo mundo em pé. Com mesas redondas, cadeiras, pista e mesa de bolo ocupando o chão, o número cai bastante.",
      },
      {
        tipo: "p",
        texto:
          "Pergunte assim: “quantas pessoas sentadas, com as mesas montadas e a pista livre?”. E peça para ver uma foto do espaço montado com esse número, não do espaço vazio.",
      },
      { tipo: "h2", texto: "2. O que exatamente está incluso no valor?" },
      {
        tipo: "p",
        texto:
          "Peça a lista escrita, item por item. Mesa, cadeira, toalha, louça, talher, copo, taça, equipe de copa, limpeza antes, limpeza depois. O que não estiver escrito, considere que não está incluso.",
      },
      { tipo: "h2", texto: "3. Qual o horário de entrada e de saída?" },
      {
        tipo: "p",
        texto:
          "Não é a mesma coisa que o horário da festa. Você precisa saber a que horas o decorador pode entrar para montar e a que horas tudo tem que estar desmontado. Se a montagem só puder começar duas horas antes, decoração elaborada não cabe.",
      },
      {
        tipo: "p",
        texto:
          "Pergunte também se existe hora extra, quanto custa e como funciona. Melhor saber antes do que descobrir com a festa animada às onze da noite.",
      },
      { tipo: "h2", texto: "4. Como funciona a cozinha?" },
      {
        tipo: "p",
        texto:
          "Se você pretende levar buffet de fora, ou fazer a comida em casa, essa pergunta é decisiva. Existe cozinha? Tem fogão industrial, geladeira, freezer, bancada? A equipe de fora pode usar?",
      },
      {
        tipo: "p",
        texto:
          "Alguns espaços exigem que você contrate o buffet da casa. Isso não é necessariamente ruim. Só precisa estar claro antes, porque muda a conta inteira.",
      },
      { tipo: "h2", texto: "5. Estacionamento e acesso" },
      {
        tipo: "p",
        texto:
          "Onde os convidados vão parar o carro? É na rua, é vaga própria, é estacionamento pago por perto? E se boa parte da sua lista tem gente idosa ou com dificuldade de locomoção: tem degrau na entrada? Tem banheiro adaptado?",
      },
      { tipo: "h2", texto: "6. Como é a política de cancelamento e remarcação?" },
      {
        tipo: "p",
        texto:
          "É a pergunta que ninguém quer fazer e todo mundo devia. O que acontece se você precisar remarcar? Quanto do sinal volta se cancelar? Existe prazo em que a remarcação é livre?",
      },
      {
        tipo: "p",
        texto:
          "Peça essas condições por escrito, no contrato. Combinado verbal em festa de família tem um jeito de virar mal-entendido.",
      },
      { tipo: "h2", texto: "7. Posso falar com alguém que fez uma festa aí?" },
      {
        tipo: "p",
        texto:
          "É a pergunta mais poderosa da lista, e a que mais revela. Um espaço com clientes satisfeitos vai te dar contato ou te mostrar avaliações sem hesitar. Hesitação já é resposta.",
      },
      {
        tipo: "destaque",
        texto:
          "Um último conselho: visite o espaço no mesmo horário em que a sua festa vai acontecer. Um salão às duas da tarde e o mesmo salão às nove da noite são lugares diferentes. Luz, temperatura e barulho da rua mudam tudo.",
      },
    ],
  },

  {
    slug: "espaco-para-festa-barreiro-regiao",
    titulo: "Espaço para festa no Barreiro e região: o que considerar",
    title: "Espaço para festa no Barreiro, BH: o que considerar antes de escolher",
    description:
      "Como escolher um espaço de eventos na região do Barreiro, em Belo Horizonte, considerando acesso, deslocamento de convidados de Contagem e Ibirité, e estrutura.",
    resumo:
      "Escolher um espaço no Barreiro tem uma vantagem que pouca gente calcula: a região faz divisa com Contagem e Ibirité, então boa parte dos convidados dirige menos do que dirigiria para um espaço na região central de BH.",
    publicadoEm: "2026-07-23",
    atualizadoEm: "2026-07-23",
    foto: FOTOS.fachadaNoite,
    fotoAlt: "Fachada iluminada da Dondoka Recepções, no bairro Lindéia, Barreiro",
    blocos: [
      {
        tipo: "p",
        texto:
          "A gente fica no Lindéia, no Barreiro, então tem interesse nesse assunto, vale dizer isso logo. Mas o raciocínio abaixo serve para qualquer espaço da região, e é uma conta que raramente entra na decisão de quem está escolhendo onde fazer a festa.",
      },
      { tipo: "h2", texto: "A conta do deslocamento dos convidados" },
      {
        tipo: "p",
        texto:
          "Quando você escolhe um espaço, está escolhendo também quanto cada convidado vai dirigir. E isso tem efeito real na festa: quem mora longe chega atrasado, sai mais cedo, ou nem aparece.",
      },
      {
        tipo: "p",
        texto:
          "O Barreiro é a maior regional de Belo Horizonte em população, e o Lindéia especificamente faz divisa com Contagem e com Ibirité. Se boa parte da sua família e dos seus amigos mora nessa faixa (Barreiro, Contagem, Ibirité, Durval de Barros, Regina, Tirol), um espaço aqui é mais perto para eles do que qualquer coisa na Savassi ou na Pampulha.",
      },
      {
        tipo: "destaque",
        texto:
          "Faça o teste antes de fechar: pegue os dez convidados mais importantes da sua lista e simule o trajeto da casa de cada um até o espaço. Se a maioria estiver a menos de 20 minutos, você escolheu certo.",
      },
      { tipo: "h2", texto: "O que olhar num espaço da região" },
      {
        tipo: "p",
        texto:
          "A região tem espaços de perfis muito diferentes, de salão de condomínio a casa de festa estruturada. Alguns pontos merecem atenção especial por aqui:",
      },
      {
        tipo: "lista",
        itens: [
          "Climatização, porque o verão em BH não perdoa, e salão sem ar-condicionado esvazia cedo",
          "Cozinha equipada, se você pretende levar buffet de fora ou fazer a comida",
          "Espaço coberto suficiente, porque a chuva de fim de tarde é frequente na cidade",
          "Banheiro adaptado, se você tem convidados idosos, o que é comum em festa de família",
          "Área separada para crianças, se a sua lista tem muitas",
        ],
      },
      { tipo: "h2", texto: "Visite à noite, se a festa for à noite" },
      {
        tipo: "p",
        texto:
          "Vale para qualquer região, mas especialmente aqui: veja como é a rua no horário da sua festa. Iluminação, movimento, facilidade de estacionar. Uma rua tranquila às três da tarde pode ser outra coisa às dez da noite. Para melhor ou para pior.",
      },
      {
        tipo: "p",
        texto:
          "E confira se a fachada é fácil de identificar de longe. Parece detalhe bobo até o dia em que quinze convidados ligam perguntando onde é.",
      },
    ],
  },
];

export function guiaPorSlug(slug: string) {
  return GUIAS.find((g) => g.slug === slug);
}
