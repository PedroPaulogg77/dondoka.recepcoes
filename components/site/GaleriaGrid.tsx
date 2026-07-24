"use client";
import { useCallback, useEffect, useState } from "react";
import { Foto } from "@/components/site/Foto";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Galeria em grade com lightbox.
 *
 * Diferente do carrossel de `components/public/Galeria.tsx`, que existe para a
 * proposta do cliente, aqui a leitura é de página inteira: grade responsiva,
 * navegação por teclado e foco preso no lightbox.
 */
export function GaleriaGrid({ fotos }: { fotos: readonly string[] }) {
  const [indice, setIndice] = useState<number | null>(null);
  const reduz = useReducedMotion();

  const fechar = useCallback(() => setIndice(null), []);
  const anterior = useCallback(
    () => setIndice((i) => (i === null ? null : (i - 1 + fotos.length) % fotos.length)),
    [fotos.length]
  );
  const proxima = useCallback(
    () => setIndice((i) => (i === null ? null : (i + 1) % fotos.length)),
    [fotos.length]
  );

  useEffect(() => {
    if (indice === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") fechar();
      if (e.key === "ArrowLeft") anterior();
      if (e.key === "ArrowRight") proxima();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [indice, fechar, anterior, proxima]);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {fotos.map((foto, i) => (
          <button
            key={foto}
            type="button"
            onClick={() => setIndice(i)}
            // A primeira foto ocupa dois quadrantes: quebra a monotonia da
            // grade e dá destaque à imagem de abertura.
            className={`group relative overflow-hidden rounded-xl bg-areia ${
              i === 0 ? "col-span-2 aspect-[4/3] md:row-span-2 md:aspect-auto" : "aspect-[3/4]"
            }`}
            aria-label={`Ampliar foto ${i + 1} de ${fotos.length}`}
          >
            <Foto
              src={foto}
              alt={`Espaço da Dondoka Recepções, foto ${i + 1}`}
              fill
              /* A grade vive dentro de um max-w-6xl (1152px), então a célula
                 nunca passa de ~370px em desktop, e a primeira (col-span-2)
                 de ~750px. Sem esses limites o navegador pede a variante de
                 640px para uma célula de 370px e baixa o dobro do necessário. */
              sizes={
                i === 0
                  ? "(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 750px"
                  : "(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 370px"
              }
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-carvao/0 transition-colors group-hover:bg-carvao/20" />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {indice !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-carvao/95 p-4 md:p-10"
            role="dialog"
            aria-modal="true"
            aria-label="Foto ampliada"
            onClick={fechar}
          >
            <button
              type="button"
              onClick={fechar}
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
              aria-label="Fechar"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                anterior();
              }}
              className="absolute left-3 z-10 flex h-12 w-12 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white md:left-8"
              aria-label="Foto anterior"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <motion.div
              key={indice}
              initial={reduz ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="relative h-full max-h-[82vh] w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Foto
                src={fotos[indice]}
                alt={`Espaço da Dondoka Recepções — foto ${indice + 1} ampliada`}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </motion.div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                proxima();
              }}
              className="absolute right-3 z-10 flex h-12 w-12 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white md:right-8"
              aria-label="Próxima foto"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm text-white/60">
              {indice + 1} / {fotos.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
