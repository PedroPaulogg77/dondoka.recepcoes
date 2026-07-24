import type { Metadata } from "next";
import { LinksPage } from "@/components/public/LinksPage";
import { fetchConfig } from "@/lib/queries";
import { SITE } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dondoka Recepções — Links",
  description:
    "Fale com a Dondoka Recepções no WhatsApp, Instagram, ou veja como chegar até o espaço em Belo Horizonte.",
  openGraph: {
    title: "Dondoka Recepções",
    description: "Celebre o essencial — espaço premium para eventos em BH.",
    type: "website",
  },
  /**
   * `noindex` proposital. Esta página duplica o contato que já está na home e
   * no /contato — deixá-la indexável só criaria concorrência interna por
   * termos de marca.
   *
   * ATENÇÃO: `noindex` NÃO significa "pode desativar". Esta rota é permanente.
   * Existem cartões de visita impressos com QR Code apontando para
   * dondokarecepcoes.vercel.app/links, e cartão impresso não se recolhe.
   * Nunca renomear esta rota, nunca renomear o projeto na Vercel (o domínio
   * .vercel.app deriva do nome do projeto) e nunca remover o .vercel.app da
   * lista de domínios.
   */
  robots: { index: false, follow: true },
};

/**
 * Fallback quando o config_global não pôde ser lido (banco fora do ar, projeto
 * pausado, migration ainda não rodada).
 *
 * Os dados de contato vêm de `lib/site-config.ts`, não de `null`. Isso não é
 * detalhe: existem cartões de visita impressos com QR Code apontando para esta
 * página. Com os campos nulos, uma instabilidade no Supabase transformaria o
 * QR de todo cartão em circulação numa página sem link nenhum — e cartão
 * impresso não se corrige. Com o fallback preenchido, o pior caso é a página
 * mostrar os dados versionados no código, que são os mesmos do banco.
 */
const FALLBACK = {
  id: 1 as const,
  sobre_texto: null,
  decoracao_texto: null,
  condicoes_pagamento: null,
  contato_telefone: SITE.contato.telefone,
  contato_whatsapp: SITE.contato.whatsapp,
  contato_instagram: SITE.contato.instagram,
  contato_email: SITE.contato.email,
  contato_endereco: SITE.endereco.completo,
  fotos_default: [],
  buffet_dados: null,
  servicos_opcionais_dados: null,
  precos_espaco_por_dia: null,
  updated_at: new Date().toISOString(),
};

export default async function LinksRoute() {
  const config = (await fetchConfig()) ?? FALLBACK;
  return <LinksPage config={config} />;
}
