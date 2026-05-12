import sharp from "sharp";
import heicConvert from "heic-convert";
import { readdir, mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const SOURCE = "E:/Dowloands/DONDOKA RECEPÇÕES/FOTOS";
const DEST = "E:/dondoka-orcamentos/public/fotos";

async function main() {
  if (!existsSync(DEST)) await mkdir(DEST, { recursive: true });
  const files = (await readdir(SOURCE)).filter((f) => /\.heic$/i.test(f));
  console.log(`Converting ${files.length} HEIC files...`);

  for (const file of files) {
    const base = path.basename(file, path.extname(file)).toLowerCase();
    const out = path.join(DEST, `${base}.webp`);
    try {
      const heicBuf = await readFile(path.join(SOURCE, file));
      const jpegBuf = await heicConvert({
        buffer: heicBuf,
        format: "JPEG",
        quality: 0.92,
      });
      await sharp(jpegBuf)
        .rotate()
        .resize({ width: 1800, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(out);
      console.log(`  -> ${base}.webp`);
    } catch (err) {
      console.error(`  ! ${file}: ${err.message}`);
    }
  }
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
