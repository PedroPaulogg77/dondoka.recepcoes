import Image, { type ImageProps } from "next/image";
import { blurDe } from "@/content/blur";

/**
 * `next/image` já com o placeholder de desfoque aplicado.
 *
 * O `placeholder="blur"` só funciona automaticamente quando a imagem é
 * importada como módulo. Aqui os caminhos vêm de strings (`content/espaco.ts`),
 * então o `blurDataURL` precisa ser passado à mão — este componente faz isso
 * consultando o mapa gerado por `npm run gerar-blur`.
 *
 * Usar em toda foto do acervo. Para imagens sem placeholder no mapa (logos,
 * por exemplo) ele se comporta como o `next/image` normal.
 */
export function Foto({ src, ...props }: ImageProps) {
  const blur = typeof src === "string" ? blurDe(src) : undefined;

  return (
    <Image
      src={src}
      {...props}
      {...(blur ? { placeholder: "blur" as const, blurDataURL: blur } : {})}
    />
  );
}
