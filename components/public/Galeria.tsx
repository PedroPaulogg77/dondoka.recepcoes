"use client";
import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";

function resolveSrc(path: string) {
  if (path.startsWith("http") || path.startsWith("/")) return path;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/object/public/fotos-espaco/${path}`;
}

export function Galeria({ fotos }: { fotos: string[] }) {
  const [aberto, setAberto] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll, fotos]);

  function scroll(dir: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  }

  if (!fotos.length) return null;

  return (
    <section id="galeria" className="py-20 md:py-28 bg-areia/25">
      <div className="max-w-6xl mx-auto px-6">
        <SectionTitle eyebrow="Galeria" title="Conheça o espaço" />
      </div>

      {/* Carrossel */}
      <Reveal>
        <div className="relative mt-14 group/carousel">
          {/* Scroll container */}
          <div
            ref={scrollRef}
            className="flex gap-3 md:gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-6 md:px-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] pb-4 no-scrollbar"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {fotos.map((foto, i) => (
              <button
                key={foto}
                type="button"
                onClick={() => setAberto(foto)}
                className="group relative flex-none w-[70vw] sm:w-[45vw] md:w-[30vw] lg:w-[22vw] aspect-[3/4] overflow-hidden rounded-xl bg-areia snap-start no-print"
              >
                <Image
                  src={resolveSrc(foto)}
                  alt={`Foto ${i + 1} do espaço Dondoka`}
                  fill
                  sizes="(max-width: 640px) 70vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 22vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-carvao/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
              </button>
            ))}
          </div>

          {/* Setas de navegação — desktop */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scroll("left")}
              className="no-print hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 items-center justify-center rounded-full bg-white/90 shadow-soft text-carvao/70 hover:text-carvao hover:shadow-premium backdrop-blur transition"
              aria-label="Anterior"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => scroll("right")}
              className="no-print hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 items-center justify-center rounded-full bg-white/90 shadow-soft text-carvao/70 hover:text-carvao hover:shadow-premium backdrop-blur transition"
              aria-label="Próxima"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          )}

          {/* Indicador de scroll (mobile) — pontinhos */}
          {fotos.length > 1 && (
            <div className="flex justify-center gap-1.5 mt-4 md:hidden" aria-hidden>
              <span className="text-[10px] text-carvao/40 tracking-wider">
                Deslize para ver mais →
              </span>
            </div>
          )}
        </div>
      </Reveal>

      {/* Versão estática para impressão — grid simples com 4 fotos max */}
      <div className="hidden print:block max-w-6xl mx-auto px-6 mt-14">
        <div className="grid grid-cols-4 gap-2">
          {fotos.slice(0, 4).map((foto, i) => (
            <div key={foto} className="relative aspect-[3/4] overflow-hidden rounded-lg bg-areia">
              <Image src={resolveSrc(foto)} alt="" fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {aberto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="no-print fixed inset-0 z-50 bg-carvao/90 flex items-center justify-center p-6"
            onClick={() => setAberto(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-4xl aspect-[3/4] md:aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={resolveSrc(aberto)} alt="" fill className="object-contain" />
              <button
                onClick={() => setAberto(null)}
                aria-label="Fechar"
                className="absolute -top-12 right-0 text-white/80 hover:text-white text-3xl"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
