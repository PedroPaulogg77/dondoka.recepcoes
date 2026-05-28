import type { Metadata } from "next";
import { LinksPage } from "@/components/public/LinksPage";
import { fetchConfig } from "@/lib/queries";

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
};

// Fallback caso o config_global ainda não tenha sido populado no banco
const FALLBACK = {
  id: 1 as const,
  sobre_texto: null,
  decoracao_texto: null,
  condicoes_pagamento: null,
  contato_telefone: null,
  contato_whatsapp: null,
  contato_instagram: null,
  contato_email: null,
  contato_endereco: null,
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
