/**
 * Fonte única de verdade do site institucional.
 *
 * Tudo que descreve a Dondoka como *entidade* mora aqui: nome, endereço,
 * telefone, redes. Header, footer, páginas e JSON-LD leem deste arquivo e de
 * nenhum outro lugar.
 *
 * Isso não é preciosismo de organização. Consistência de NAP (name, address,
 * phone) — o mesmo texto, caractere por caractere, em toda menção — é o sinal
 * mais forte de entidade tanto para o Google quanto para as IAs que montam
 * respostas sobre negócios locais. Um endereço escrito de dois jeitos
 * diferentes no próprio site já enfraquece o sinal.
 *
 * O mesmo texto daqui precisa ser replicado no Google Business Profile, no
 * Bing Places e em cada diretório (ver Fase 7 do plano).
 */

export const SITE = {
  nome: "Dondoka Recepções",
  tagline: "Celebre o essencial",
  dominio: "https://dondokarecepcoes.com.br",

  /** Frase de uma linha que responde "o que é isso?" — usada em meta description e schema. */
  descricaoCurta:
    "Espaço para eventos em Belo Horizonte, no bairro Lindéia (Barreiro), com capacidade para até 70 convidados, dois ambientes, climatização e cozinha equipada.",

  contato: {
    telefone: "(31) 97251-9129",
    /** Formato internacional sem símbolos — usado nos links wa.me */
    whatsapp: "5531972519129",
    email: "recepcoesdondoka@gmail.com",
    instagram: "dondokarecepcoes",
  },

  endereco: {
    logradouro: "Rua das Petúnias, 1654",
    bairro: "Lindéia",
    regional: "Barreiro",
    cidade: "Belo Horizonte",
    estado: "MG",
    cep: "30690-020",
    pais: "BR",
    /** Uma linha, do jeito exato que deve aparecer em todo lugar. */
    completo: "Rua das Petúnias, 1654 — Lindéia, Belo Horizonte / MG",
  },

  /**
   * Cidades e regiões que a Dondoka atende de fato. O Lindéia faz divisa com
   * Contagem e Ibirité, então essas duas não são chute de alcance — são
   * vizinhança real, e entram no `areaServed` do schema.
   */
  atende: ["Belo Horizonte", "Barreiro", "Contagem", "Ibirité"],

  espaco: {
    capacidadeMaxima: 70,
  },

  /**
   * Coordenadas do pino no Google Maps — vieram direto da própria página do
   * local (parâmetros `3d`/`4d` da URL do Google Business Profile), não de um
   * clique manual no mapa. É a fonte mais confiável: bate exatamente com o
   * que o Google já usa internamente para esse endereço.
   */
  geo: { latitude: -19.9798824, longitude: -44.0552887 } as { latitude: number; longitude: number } | null,

  /**
   * ── PENDENTE DE CONFIRMAÇÃO COM O CLIENTE ──────────────────────────────
   * Horário de funcionamento — até que horas o evento pode ir. Ex.:
   * [{ dias: ["Sa", "Su"], abre: "11:00", fecha: "23:00" }]
   * Enquanto for `null`, o schema simplesmente omite o campo.
   */
  horarios: null as Array<{ dias: string[]; abre: string; fecha: string }> | null,

  /**
   * Perfis oficiais da marca em outros lugares da web — vira `sameAs` no
   * schema e é o que conecta site, Instagram e Google Business Profile como
   * uma coisa só aos olhos do Google e das IAs.
   *
   * O link do Maps usa o formato `?cid=`, construído a partir do Place ID do
   * negócio. É permanente — ao contrário de um link curto (`share.google/…`
   * ou `maps.app.goo.gl/…`), que é só um redirecionador e pode ser reciclado
   * pelo Google com o tempo.
   */
  perfis: [
    "https://instagram.com/dondokarecepcoes",
    "https://maps.google.com/?cid=15967989551749459951",
  ],
} as const;

/** Link do WhatsApp com mensagem pré-preenchida. */
export function whatsappUrl(mensagem?: string) {
  const texto = mensagem ?? "Olá! Tenho interesse no espaço da Dondoka Recepções.";
  return `https://wa.me/${SITE.contato.whatsapp}?text=${encodeURIComponent(texto)}`;
}

/** URL absoluta a partir de um caminho — canonical, OG e sitemap dependem disso. */
export function urlAbsoluta(caminho = "/") {
  return new URL(caminho, SITE.dominio).toString();
}

export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${SITE.nome}, ${SITE.endereco.completo}`
)}`;

/**
 * Navegação principal — a ordem é a que a Camila definiu no documento de
 * ajustes. Seis itens, sem submenu.
 *
 * O que NÃO está aqui continua existindo e sendo indexado: os guias vivem em
 * /guias e aparecem só no rodapé. Página fora do menu não pesa na experiência
 * e segue trabalhando para a busca — é o item 9 do documento dela, a
 * estratégia acontecendo nos bastidores.
 */
export const NAV = [
  { href: "/o-espaco", label: "O espaço" },
  { href: "/eventos", label: "Eventos" },
  { href: "/galeria", label: "Galeria" },
  { href: "/buffet", label: "Buffet e decoração" },
  { href: "/perguntas-frequentes", label: "Perguntas frequentes" },
  { href: "/contato", label: "Contato" },
] as const;
