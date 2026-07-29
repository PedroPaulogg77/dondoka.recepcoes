"use client";
import { useRef, useState } from "react";
import { Foto } from "@/components/site/Foto";
import { motion, useReducedMotion } from "framer-motion";

type Props = {
  src: string;
  poster: string;
  /** Descrição do que se vê — vira o alt do poster e ajuda leitor de tela. */
  legenda: string;
  className?: string;
  /**
   * Marque quando o player aparecer logo abaixo do hero. Sem isso o poster
   * espera o lazy loading, e o primeiro elemento que a pessoa vê ao rolar
   * aparece em branco por um instante. O vídeo em si continua com
   * `preload="none"`: o que carrega antes é só o poster, de ~40 KB.
   */
  prioridade?: boolean;
};

/**
 * Player para os vídeos verticais (9:16) do espaço.
 *
 * Regras de performance que este componente garante:
 * - `preload="none"`: o arquivo (~9 MB) só começa a baixar quando a pessoa
 *   clica. Antes disso o que existe na tela é o poster, de ~70 KB.
 * - O poster é servido por `next/image`, então vira AVIF/WebP no tamanho certo.
 * - Nada de autoplay: som ligado por decisão de quem assiste.
 */
export function VideoTour({ src, poster, legenda, className, prioridade = false }: Props) {
  const [tocando, setTocando] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduz = useReducedMotion();

  function play() {
    setTocando(true);
    // O <video> só é montado a partir daqui, então esperamos o próximo frame.
    requestAnimationFrame(() => videoRef.current?.play());
  }

  return (
    <div
      /* O anel branco translúcido dá contorno ao player quando ele fica sobre
         fundo escuro, onde a `shadow-premium` (sombra oliva) desaparece. Em
         fundo claro, ele é discreto o bastante para não pesar. */
      className={`relative mx-auto aspect-[9/16] w-full max-w-[380px] overflow-hidden rounded-3xl bg-carvao shadow-premium ring-1 ring-white/10 ${className || ""}`}
    >
      {tocando ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          controls
          playsInline
          preload="none"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <button
          type="button"
          onClick={play}
          className="group absolute inset-0 h-full w-full"
          aria-label={`Assistir ao vídeo: ${legenda}`}
        >
          <Foto
            src={poster}
            alt={legenda}
            fill
            priority={prioridade}
            sizes="(max-width: 640px) 90vw, 380px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-carvao/60 via-transparent to-transparent" />

          <motion.span
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-20 w-20 items-center justify-center rounded-full bg-white/90 text-oliva shadow-premium backdrop-blur"
            whileHover={reduz ? undefined : { scale: 1.08 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-8 w-8" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </motion.span>

          <span className="absolute inset-x-0 bottom-0 p-5 text-left text-sm text-white/90">{legenda}</span>
        </button>
      )}
    </div>
  );
}

/**
 * Loop ambiente, sem som e sem controles — usado como elemento decorativo.
 * O arquivo é pequeno (~700 KB) justamente porque roda em autoplay.
 * Respeita `prefers-reduced-motion`: quem pediu menos movimento vê o poster.
 */
export function VideoLoop({ src, poster, legenda, className }: Props) {
  const reduz = useReducedMotion();

  return (
    <div className={`relative aspect-[9/16] w-full overflow-hidden rounded-3xl bg-areia ${className || ""}`}>
      {reduz ? (
        <Foto src={poster} alt={legenda} fill sizes="(max-width: 768px) 90vw, 33vw" className="object-cover" />
      ) : (
        <video
          src={src}
          poster={poster}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-label={legenda}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  );
}
