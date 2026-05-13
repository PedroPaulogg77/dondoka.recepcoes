"use client";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { iconForServico } from "@/components/ui/Icons";
import type { ServicosOpcionaisDados } from "@/types/orcamento";

export function ServicosOpcionais({ dados }: { dados: ServicosOpcionaisDados }) {
  return (
    <section id="servicos" className="py-20 md:py-28 px-6 bg-areia/25">
      <div className="max-w-4xl mx-auto">
        <SectionTitle eyebrow="Serviços" title="Para deixar tudo redondo" />

        {dados.intro && (
          <Reveal delay={0.1}>
            <p className="mt-10 max-w-2xl mx-auto text-center text-carvao/75 leading-relaxed">
              {dados.intro}
            </p>
          </Reveal>
        )}

        <Reveal delay={0.2}>
          <ul className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            {dados.lista.map((servico) => {
              const Icon = iconForServico(servico);
              return (
                <li
                  key={servico}
                  className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-areia/40"
                >
                  <span className="w-10 h-10 rounded-full bg-oliva/10 text-oliva flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="font-serif text-carvao text-sm md:text-base">{servico}</span>
                </li>
              );
            })}
          </ul>
        </Reveal>

        {dados.disclaimer && (
          <Reveal delay={0.3}>
            <p className="mt-10 text-center text-xs md:text-sm text-carvao/55 italic max-w-xl mx-auto">
              {dados.disclaimer}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
