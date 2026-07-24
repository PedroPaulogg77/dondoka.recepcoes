/**
 * Otimiza fotos já em WebP/JPG que entraram na pasta sem passar pelo pipeline.
 *
 * O convert-fotos.mjs cuida do caminho HEIC → WebP a partir da pasta de
 * origem. Este aqui resolve o outro caso: arquivo grande solto em
 * public/fotos (export direto do celular, por exemplo), que precisa ser
 * reduzido no lugar e renomeado para o padrão minúsculo do resto da pasta.
 *
 *   npm run otimizar-fotos
 */
import sharp from "sharp";
import { readdir, readFile, writeFile, unlink, rename } from "node:fs/promises";
import path from "node:path";

const DIR = "E:/dondoka-orcamentos/public/fotos";
const LARGURA_MAX = 1800;
const QUALIDADE = 82;
// Acima disso a foto não passou pelo pipeline — as otimizadas ficam em ~100–400 KB.
const LIMITE_BYTES = 800 * 1024;

function kb(bytes) {
  return `${Math.round(bytes / 1024)} KB`;
}

async function main() {
  const arquivos = (await readdir(DIR)).filter((f) => /\.(webp|jpe?g|png)$/i.test(f));
  let otimizadas = 0;

  for (const arquivo of arquivos) {
    const origem = path.join(DIR, arquivo);
    const buf = await readFile(origem);

    const destino = path.join(DIR, `${path.basename(arquivo, path.extname(arquivo)).toLowerCase()}.webp`);

    // Dois detalhes do Windows que já causaram perda de arquivo aqui:
    //
    // 1. O filesystem é case-insensitive: "IMG_6586.webp" e "img_6586.webp"
    //    são o MESMO arquivo. Escrever no destino e depois dar unlink na
    //    origem apaga justamente o que acabou de ser gravado.
    // 2. Escrever num caminho que já existe NÃO renomeia o arquivo — o nome
    //    original em maiúsculo permanece. E isso quebra em produção, porque
    //    a Vercel roda Linux, onde a URL é case-sensitive.
    //
    // A saída para os dois: gravar sempre num .tmp, remover a origem e só
    // então renomear o .tmp para o destino final. Em nenhum instante o único
    // arquivo com os bytes bons fica sob risco de unlink.
    const jaOtimizada = buf.length <= LIMITE_BYTES;
    const nomeCorreto = path.basename(destino) === arquivo;

    if (jaOtimizada && nomeCorreto) continue;

    try {
      const otimizada = jaOtimizada
        ? buf
        : await sharp(buf)
            .rotate()
            .resize({ width: LARGURA_MAX, withoutEnlargement: true })
            .webp({ quality: QUALIDADE })
            .toBuffer();

      const temp = `${destino}.tmp`;
      await writeFile(temp, otimizada);
      await unlink(origem);
      await rename(temp, destino);

      console.log(`  ${arquivo} → ${path.basename(destino)}  ${kb(buf.length)} → ${kb(otimizada.length)}`);
      otimizadas++;
    } catch (err) {
      console.error(`  ! ${arquivo}: ${err.message}`);
    }
  }

  console.log(otimizadas ? `\n${otimizadas} foto(s) otimizada(s).` : "\nNada a fazer — todas já estão otimizadas.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
