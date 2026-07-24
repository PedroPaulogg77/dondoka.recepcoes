/**
 * Gera os placeholders de desfoque das fotos e posters de vídeo.
 *
 * Enquanto a foto de verdade não chega, o next/image mostra este placeholder
 * esticado. São ~200 bytes por imagem, embutidos no HTML, então aparecem
 * instantaneamente — sem retângulo vazio e sem o salto de layout que faz o
 * site parecer travado em conexão lenta.
 *
 * Rodar depois de adicionar ou trocar qualquer foto:
 *   npm run gerar-blur
 */
import sharp from "sharp";
import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const PASTAS = ["public/fotos", "public/video"];
const SAIDA = "content/blur.ts";

async function main() {
  const mapa = {};

  for (const pasta of PASTAS) {
    const arquivos = (await readdir(pasta)).filter((f) => /\.webp$/i.test(f));
    for (const arquivo of arquivos) {
      const caminho = path.join(pasta, arquivo);
      // 10px de largura é o suficiente: a imagem será exibida borrada e
      // esticada, então detalhe nenhum sobrevive — só a mancha de cor.
      const buf = await sharp(caminho).resize(10).webp({ quality: 40 }).toBuffer();
      const url = `/${pasta.replace("public/", "")}/${arquivo}`;
      mapa[url] = `data:image/webp;base64,${buf.toString("base64")}`;
    }
  }

  const linhas = Object.entries(mapa)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `  "${k}": "${v}",`)
    .join("\n");

  const conteudo = `/**
 * ARQUIVO GERADO — não editar à mão.
 * Regenerar com: npm run gerar-blur  (scripts/gerar-blur.mjs)
 *
 * Placeholders de desfoque das fotos, embutidos no HTML para a página não
 * mostrar retângulo vazio enquanto a imagem real carrega.
 */
export const BLUR: Record<string, string> = {
${linhas}
};

/** Devolve o placeholder de uma foto, ou undefined se ela não tiver um. */
export function blurDe(src: string) {
  return BLUR[src];
}
`;

  await writeFile(SAIDA, conteudo, "utf8");

  const tamanho = Math.round(Buffer.byteLength(conteudo) / 1024);
  console.log(`${Object.keys(mapa).length} placeholders gerados em ${SAIDA} (${tamanho} KB)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
