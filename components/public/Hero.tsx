"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { dataExtenso } from "@/lib/format";
import type { Orcamento } from "@/types/orcamento";

export function Hero({ orcamento }: { orcamento: Orcamento }) {
  const primeiroNome = orcamento.cliente_nome.split(" ")[0];
  return (
    <section className="hero-print-compact relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 pattern-claro opacity-50" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-creme/40 via-creme/10 to-creme" aria-hidden />

      <div className="relative z-10 text-center px-6 py-20 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <Image
            src="/logos/logo-1.png"
            alt="Dondoka Recepções"
            width={260}
            height={260}
            priority
            className="mx-auto h-32 md:h-44 w-auto"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-6"
        >
          <p className="eyebrow">Proposta exclusiva</p>
          <h1 className="mt-3 text-4xl md:text-6xl leading-tight text-carvao font-serif">
            Para <span className="italic text-oliva">{primeiroNome}</span>
          </h1>
          {orcamento.cliente_evento && (
            <p className="mt-3 text-bronze tracking-wide uppercase text-xs md:text-sm">
              {orcamento.cliente_evento}
              {orcamento.cliente_data ? ` • ${dataExtenso(orcamento.cliente_data)}` : ""}
            </p>
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-8 italic text-carvao/70 font-serif text-lg"
        >
          Celebre o essencial.
        </motion.p>

        <motion.div
          className="no-print absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1px] h-12 bg-bronze/60"
          />
        </motion.div>
      </div>
    </section>
  );
}
