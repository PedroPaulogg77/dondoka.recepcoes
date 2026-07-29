import { SITE, urlAbsoluta } from "./site-config";
import { GALERIA_COMPLETA } from "@/content/espaco";

/**
 * JSON-LD — a camada que faz a página ser lida como *dado*, não como texto.
 *
 * É o que alimenta o painel de conhecimento do Google, o pacote local e as
 * respostas de IA. Duas regras que valem para tudo aqui:
 *
 * 1. Só declarar o que está visível na página. Schema que afirma o que o
 *    usuário não vê é violação de diretriz e pode gerar penalidade manual.
 * 2. Campo sem dado confirmado fica de fora. Um `geo` com coordenada chutada
 *    joga gente no lugar errado — é pior que não ter `geo` nenhum.
 */

type Json = Record<string, unknown>;

/** Remove chaves nulas/vazias para nunca emitir `"telephone": null`. */
function limpar(obj: Json): Json {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== null && v !== undefined && v !== "")
  );
}

const ID_NEGOCIO = urlAbsoluta("/#negocio");

/**
 * EventVenue é subtipo de LocalBusiness (via CivicStructure/Place). Declarar os
 * dois no @type dá o encaixe específico — "local de eventos" — sem perder os
 * campos de negócio local que o Google usa no pacote local.
 */
export function schemaNegocio(): Json {
  const { endereco, contato, espaco } = SITE;

  return limpar({
    "@context": "https://schema.org",
    "@type": ["EventVenue", "LocalBusiness"],
    "@id": ID_NEGOCIO,
    name: SITE.nome,
    alternateName: "Dondoka",
    description: SITE.descricaoCurta,
    url: SITE.dominio,
    telephone: `+55${contato.whatsapp.slice(2)}`,
    email: contato.email,
    slogan: SITE.tagline,
    // "$$" é indicador de faixa, não valor publicado — respeita a decisão de
    // não expor preço e ainda assim preenche o campo que o Google espera.
    priceRange: "$$",
    currenciesAccepted: "BRL",
    paymentAccepted: "Pix, Cartão de crédito, Cartão de débito, Transferência",
    address: {
      "@type": "PostalAddress",
      streetAddress: endereco.logradouro,
      addressLocality: endereco.cidade,
      addressRegion: endereco.estado,
      postalCode: endereco.cep,
      addressCountry: endereco.pais,
    },
    // Só entra quando alguém confirmar a coordenada no Maps. Ver site-config.
    geo: SITE.geo
      ? { "@type": "GeoCoordinates", latitude: SITE.geo.latitude, longitude: SITE.geo.longitude }
      : undefined,
    openingHoursSpecification: SITE.horarios?.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.dias,
      opens: h.abre,
      closes: h.fecha,
    })),
    maximumAttendeeCapacity: espaco.capacidadeMaxima,
    areaServed: SITE.atende.map((cidade) => ({ "@type": "City", name: cidade })),
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${SITE.nome}, ${endereco.completo}`
    )}`,
    image: GALERIA_COMPLETA.slice(0, 6).map((f) => urlAbsoluta(f)),
    logo: urlAbsoluta("/logos/logo-1.webp"),
    sameAs: SITE.perfis,
    // Só o que a casa tem hoje. Espaço kids saiu daqui em jul/2026: a área
    // ainda não está pronta, e declarar comodidade inexistente em dado
    // estruturado é pior que omitir — é o Google e as IAs repetindo a
    // informação errada por conta própria.
    amenityFeature: [
      { nome: "Ar-condicionado", valor: true },
      { nome: "Cozinha equipada", valor: true },
      { nome: "Banheiro acessível", valor: true },
      { nome: "Fraldário", valor: true },
      { nome: "Mezanino", valor: true },
    ].map((a) => ({
      "@type": "LocationFeatureSpecification",
      name: a.nome,
      value: a.valor,
    })),
  });
}

export function schemaWebSite(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": urlAbsoluta("/#site"),
    name: SITE.nome,
    url: SITE.dominio,
    inLanguage: "pt-BR",
    publisher: { "@id": ID_NEGOCIO },
  };
}

export function schemaFAQ(itens: ReadonlyArray<{ pergunta: string; resposta: string }>): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: itens.map((item) => ({
      "@type": "Question",
      name: item.pergunta,
      acceptedAnswer: { "@type": "Answer", text: item.resposta },
    })),
  };
}

export function schemaBreadcrumb(trilha: Array<{ nome: string; href: string }>): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trilha.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.nome,
      item: urlAbsoluta(item.href),
    })),
  };
}

export function schemaVideo(video: {
  nome: string;
  descricao: string;
  src: string;
  poster: string;
  publicadoEm: string;
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.nome,
    description: video.descricao,
    thumbnailUrl: urlAbsoluta(video.poster),
    contentUrl: urlAbsoluta(video.src),
    uploadDate: video.publicadoEm,
  };
}

export function schemaArtigo(guia: {
  titulo: string;
  description: string;
  slug: string;
  foto: string;
  publicadoEm: string;
  atualizadoEm: string;
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guia.titulo,
    description: guia.description,
    image: urlAbsoluta(guia.foto),
    datePublished: guia.publicadoEm,
    dateModified: guia.atualizadoEm,
    inLanguage: "pt-BR",
    author: { "@id": ID_NEGOCIO },
    publisher: { "@id": ID_NEGOCIO },
    mainEntityOfPage: urlAbsoluta(`/guias/${guia.slug}`),
  };
}

/**
 * Componente para injetar o JSON-LD.
 *
 * `JSON.stringify` sem escape de `<` permitiria injeção se algum texto do
 * conteúdo contivesse `</script>`. Como todo o conteúdo é nosso e versionado o
 * risco é teórico, mas o escape custa nada.
 */
export function JsonLd({ data }: { data: Json | Json[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
