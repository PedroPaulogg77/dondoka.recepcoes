import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site-config";

/**
 * Imagem de compartilhamento (WhatsApp, Instagram, Facebook, iMessage).
 *
 * Gerada no build, sem serviço externo. Vale para todas as páginas do site —
 * o Next aplica esta imagem a `/` e a todas as rotas filhas do route group.
 *
 * `ImageResponse` não usa `next/image` nem as fontes de `next/font`. Por isso a
 * composição é feita com gradiente, tipografia serif do sistema e a paleta da
 * marca em valores literais — Playfair não está disponível aqui.
 *
 * `runtime = "edge"` é necessário: no runtime padrão o Next tenta pré-renderizar
 * esta rota no build e falha com "Invalid URL". No edge ela é gerada sob
 * demanda — sem custo prático, porque redes sociais buscam a imagem uma vez e
 * depois servem do cache delas.
 */
export const runtime = "edge";
export const alt = `${SITE.nome} — ${SITE.descricaoCurta}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #F7F4EE 0%, #DBD1C3 100%)",
          padding: 80,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 26,
            letterSpacing: 12,
            textTransform: "uppercase",
            color: "#907655",
            display: "flex",
          }}
        >
          Dondoka Recepções
        </div>

        <div
          style={{
            marginTop: 34,
            fontSize: 86,
            fontFamily: "Georgia, serif",
            color: "#7F7957",
            display: "flex",
          }}
        >
          Celebre o essencial
        </div>

        <div
          style={{
            marginTop: 40,
            width: 180,
            height: 2,
            background: "#907655",
            opacity: 0.45,
            display: "flex",
          }}
        />

        <div
          style={{
            marginTop: 40,
            fontSize: 30,
            color: "#010101",
            opacity: 0.72,
            maxWidth: 880,
            lineHeight: 1.45,
            display: "flex",
          }}
        >
          Espaço para eventos em Belo Horizonte · até 70 pessoas · Lindéia, Barreiro
        </div>
      </div>
    ),
    size
  );
}
