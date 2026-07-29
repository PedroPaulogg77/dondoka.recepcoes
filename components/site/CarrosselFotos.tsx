"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Foto } from "@/components/site/Foto";
import { cn } from "@/lib/format";

type Slide = { foto: string; legenda: string };

/**
 * Carrossel de fotos da home.
 *
 * Rola horizontalmente com scroll-snap nativo do CSS, sem biblioteca. Isso
 * mantém o gesto de arrastar funcionando igual ao que a pessoa já espera no
 * celular, e a rolagem do trackpad no desktop, sem custo de JavaScript.
 *
 * O JS aqui faz três coisas e mais nada: mostrar as setas só quando há para
 * onde ir, marcar o slide ativo nos indicadores, e mover ao clique. Tudo o
 * mais é CSS.
 *
 * A primeira foto entra sem `loading="lazy"` (via `priority` no primeiro
 * slide) porque costuma estar visível logo abaixo do hero; o resto carrega
 * conforme a pessoa arrasta.
 */
export function CarrosselFotos({ slides }: { slides: readonly Slide[] }) {
  const trilhoRef = useRef<HTMLDivElement>(null);
  const [podeVoltar, setPodeVoltar] = useState(false);
  const [podeAvancar, setPodeAvancar] = useState(true);
  const [ativo, setAtivo] = useState(0);

  const medir = useCallback(() => {
    const el = trilhoRef.current;
    if (!el) return;
    setPodeVoltar(el.scrollLeft > 8);
    setPodeAvancar(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);

    // Slide ativo = o que está mais perto da borda esquerda do trilho.
    const filhos = Array.from(el.children) as HTMLElement[];
    const base = el.scrollLeft;
    let maisPerto = 0;
    let menorDist = Infinity;
    filhos.forEach((filho, i) => {
      const dist = Math.abs(filho.offsetLeft - el.offsetLeft - base);
      if (dist < menorDist) {
        menorDist = dist;
        maisPerto = i;
      }
    });
    setAtivo(maisPerto);
  }, []);

  useEffect(() => {
    const el = trilhoRef.current;
    if (!el) return;
    medir();
    el.addEventListener("scroll", medir, { passive: true });
    window.addEventListener("resize", medir);
    return () => {
      el.removeEventListener("scroll", medir);
      window.removeEventListener("resize", medir);
    };
  }, [medir]);

  function mover(direcao: "anterior" | "proxima") {
    const el = trilhoRef.current;
    if (!el) return;
    const passo = el.clientWidth * 0.8;
    el.scrollBy({ left: direcao === "anterior" ? -passo : passo, behavior: "smooth" });
  }

  function irPara(indice: number) {
    const el = trilhoRef.current;
    const alvo = el?.children[indice] as HTMLElement | undefined;
    if (!el || !alvo) return;
    el.scrollTo({ left: alvo.offsetLeft - el.offsetLeft, behavior: "smooth" });
  }

  return (
    <div className="relative px-6">
      {/* O trilho repete a estrutura das outras seções da página: o padding
          lateral fica no wrapper, e o trilho é só `mx-auto max-w-6xl`. Assim
          a primeira foto alinha com os cards e os títulos por construção.

          Tentar calcular a margem com `100vw` erra por ~30px, porque `100vw`
          inclui a barra de rolagem e o layout não. E padding dentro do próprio
          trilho desloca tudo pela largura do padding. */}
      <div
        ref={trilhoRef}
        className="no-scrollbar mx-auto flex max-w-6xl snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 md:gap-5"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {slides.map((slide, i) => (
          <figure
            key={slide.foto}
            className="group relative aspect-[3/4] w-[76vw] flex-none snap-start overflow-hidden rounded-2xl bg-areia sm:w-[46vw] md:w-[31vw] lg:w-[25vw]"
          >
            <Foto
              src={slide.foto}
              alt={slide.legenda}
              fill
              priority={i === 0}
              sizes="(max-width: 640px) 76vw, (max-width: 768px) 46vw, (max-width: 1024px) 31vw, 290px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <span
              className="absolute inset-0 bg-gradient-to-t from-carvao/75 via-carvao/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              aria-hidden
            />
            <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 p-4 text-sm text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              {slide.legenda}
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Setas — só no desktop, e só quando há para onde ir */}
      {podeVoltar && (
        <button
          type="button"
          onClick={() => mover("anterior")}
          className="absolute left-8 top-[42%] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-carvao/70 shadow-soft backdrop-blur transition hover:text-carvao hover:shadow-premium md:flex"
          aria-label="Fotos anteriores"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
      {podeAvancar && (
        <button
          type="button"
          onClick={() => mover("proxima")}
          className="absolute right-8 top-[42%] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-carvao/70 shadow-soft backdrop-blur transition hover:text-carvao hover:shadow-premium md:flex"
          aria-label="Próximas fotos"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Indicadores: traços finos, não bolinhas — combina com o resto da marca */}
      <div className="mt-6 flex items-center justify-center gap-1.5">
        {slides.map((slide, i) => (
          <button
            key={slide.foto}
            type="button"
            onClick={() => irPara(i)}
            className="group py-2"
            aria-label={`Ir para a foto ${i + 1} de ${slides.length}`}
            aria-current={i === ativo}
          >
            <span
              className={cn(
                "block h-px transition-all duration-300",
                i === ativo ? "w-7 bg-oliva" : "w-4 bg-carvao/25 group-hover:bg-carvao/50"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
