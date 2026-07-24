import type { MetadataRoute } from "next";
import { urlAbsoluta } from "@/lib/site-config";

/**
 * robots.txt
 *
 * Duas decisões que valem explicação:
 *
 * 1. CRAWLERS DE IA ESTÃO LIBERADOS — de propósito.
 *    Os bots que geram citação são os de recuperação ao vivo: OAI-SearchBot e
 *    ChatGPT-User (OpenAI), PerplexityBot, Claude-SearchBot e Claude-User
 *    (Anthropic), além de Googlebot e Bingbot. Bloquear qualquer um deles
 *    remove a Dondoka das respostas de IA — que é justamente o canal que
 *    queremos conquistar. A busca do ChatGPT usa o índice do Bing, então
 *    Bingbot é tão importante quanto Googlebot aqui.
 *
 *    Os bots de treino (GPTBot, ClaudeBot, Google-Extended) também ficam
 *    liberados. Para uma marca que hoje não existe na web, entrar no
 *    conhecimento dos modelos é ganho puro, sem contrapartida relevante.
 *
 * 2. O QUE É BLOQUEADO é só o que não deve ser público:
 *    /admin (painel), /api (rotas internas) e /orcamento (proposta de cliente
 *    — cada uma tem dados de uma pessoa real e não pode virar resultado de
 *    busca). Essas rotas também emitem `noindex` no HTML, que é o sinal que
 *    de fato tira da indexação; o Disallow apenas evita o rastreamento.
 */
export default function robots(): MetadataRoute.Robots {
  const privadas = ["/admin", "/admin/", "/api/", "/orcamento/"];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: privadas,
      },
    ],
    sitemap: urlAbsoluta("/sitemap.xml"),
    host: urlAbsoluta("/"),
  };
}
