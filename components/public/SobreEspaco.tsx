"use client";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { TextoFormatado } from "./TextoFormatado";
import { ICONES_DIFERENCIAL } from "@/components/ui/Icons";
import { DIFERENCIAIS } from "@/content/espaco";

export function SobreEspaco({ texto }: { texto: string | null }) {
  return (
    <section id="sobre" className="py-20 md:py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionTitle eyebrow="O espaço" title="Sobre o ambiente" />

        {texto && (
          <Reveal delay={0.1}>
            <TextoFormatado
              texto={texto}
              className="mt-10 max-w-2xl mx-auto text-center text-carvao/75 space-y-2"
            />
          </Reveal>
        )}

        {/* Cinco itens numa grade de 3 colunas deixariam um buraco na última
            linha. Flex com wrap centraliza as duas que sobram, igual à home. */}
        <div className="mt-14 flex flex-wrap justify-center gap-6">
          {DIFERENCIAIS.map((f, i) => {
            const Icone = ICONES_DIFERENCIAL[f.icone];
            return (
              <Reveal
                key={f.titulo}
                delay={i * 0.08}
                className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
              >
                <div className="group h-full bg-white border border-areia/60 rounded-2xl p-7 shadow-soft hover:shadow-premium transition-all hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-full bg-areia/40 text-oliva flex items-center justify-center group-hover:bg-oliva group-hover:text-white transition">
                    <Icone className="w-6 h-6" />
                  </div>
                  <h3 className="mt-5 text-xl">{f.titulo}</h3>
                  <p className="mt-2 text-sm text-carvao/65">{f.descricao}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
