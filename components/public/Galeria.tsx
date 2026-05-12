"use client";
import { useState } from "react";
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
  if (!fotos.length) return null;

  return (
    <section id="galeria" className="py-20 md:py-28 px-6 bg-areia/25">
      <div className="max-w-6xl mx-auto">
        <SectionTitle eyebrow="Galeria" title="Conheça o espaço" />

        <div className="mt-14 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {fotos.map((foto, i) => (
            <Reveal key={foto} delay={(i % 8) * 0.05}>
              <button
                type="button"
                onClick={() => setAberto(foto)}
                className="group relative w-full aspect-[3/4] overflow-hidden rounded-xl bg-areia no-print"
              >
                <Image
                  src={resolveSrc(foto)}
                  alt={`Foto ${i + 1} do espaço Dondoka`}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-carvao/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
              </button>
              {/* Versão estática para impressão */}
              <div className="hidden print:block relative w-full aspect-[3/4] overflow-hidden rounded-xl bg-areia">
                <Image src={resolveSrc(foto)} alt="" fill className="object-cover" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>

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
