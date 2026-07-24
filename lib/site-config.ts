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
    "Espaço para eventos em Belo Horizonte, no bairro Lindéia (Barreiro), com capacidade para até 70 pessoas, ambiente climatizado, cozinha equipada e espaço kids.",

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
   * ── PENDENTE DE CONFIRMAÇÃO COM O CLIENTE ──────────────────────────────
   * Estes dois campos entram no JSON-LD e aparecem para o usuário. Dado
   * errado aqui é pior que dado ausente: quebra a confiança de quem chega
   * pelo Google e conflita com o Google Business Profile.
   *
   * Enquanto forem `null`, o schema simplesmente omite o campo e o site não
   * exibe a informação. Nada quebra — só fica incompleto.
   */
  /** Coordenadas exatas da porta. Pegar no Google Maps, botão direito → copiar. */
  geo: null as { latitude: number; longitude: number } | null,
  /** Ex.: [{ dias: ["Sa", "Su"], abre: "11:00", fecha: "23:00" }] */
  horarios: null as Array<{ dias: string[]; abre: string; fecha: string }> | null,

  /**
   * Perfis oficiais da marca em outros lugares da web — vira `sameAs` no
   * schema e é o que conecta site, Instagram e Google Business Profile como
   * uma coisa só aos olhos de quem indexa. Adicionar a URL do GBP e de cada
   * diretório assim que forem criados (Fase 7).
   */
  perfis: [
    "https://instagram.com/dondokarecepcoes",
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

/** Navegação principal — header, footer e sitemap saem daqui. */
export const NAV = [
  { href: "/o-espaco", label: "O espaço" },
  { href: "/buffet", label: "Buffet" },
  { href: "/galeria", label: "Galeria" },
  { href: "/perguntas-frequentes", label: "Perguntas frequentes" },
  { href: "/contato", label: "Contato" },
] as const;

export const NAV_EVENTOS = [
  { href: "/eventos/aniversario", label: "Aniversário" },
  { href: "/eventos/quinze-anos", label: "15 anos" },
  { href: "/eventos/casamento", label: "Casamento e mini wedding" },
  { href: "/eventos/corporativo", label: "Corporativo" },
] as const;
