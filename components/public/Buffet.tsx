"use client";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { IconTrayBell, IconChefHat, IconWineGlass } from "@/components/ui/Icons";
import type { BuffetDados } from "@/types/orcamento";

export function Buffet({ dados }: { dados: BuffetDados }) {
  return (
    <section id="buffet" className="py-20 md:py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionTitle eyebrow="Buffet" title="O cardápio" />

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {/* Entrada */}
          <Reveal>
            <div>
              <div className="flex items-center gap-3 text-oliva">
                <IconTrayBell className="w-6 h-6" />
                <span className="eyebrow text-bronze">Entrada</span>
              </div>
              <h3 className="mt-3 font-serif text-2xl text-carvao">{dados.entrada.titulo}</h3>
              <ul className="mt-5 space-y-2">
                {dados.entrada.itens.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-carvao/80">
                    <span className="text-oliva mt-1.5 text-[10px]">◆</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Prato principal */}
          <Reveal delay={0.1}>
            <div>
              <div className="flex items-center gap-3 text-oliva">
                <IconChefHat className="w-6 h-6" />
                <span className="eyebrow text-bronze">Prato principal</span>
              </div>
              <div className="mt-3 space-y-7">
                {dados.principal.opcoes.map((op, idx) => (
                  <div key={op.titulo}>
                    <span className="inline-block px-3 py-1 rounded-full bg-oliva/10 text-oliva text-[11px] tracking-widest uppercase">
                      Opção {idx + 1}
                    </span>
                    <h4 className="mt-2 font-serif text-xl text-carvao">{op.titulo}</h4>
                    <ul className="mt-3 space-y-1.5">
                      {op.itens.map((acomp) => (
                        <li key={acomp} className="flex items-start gap-3 text-carvao/75 text-sm">
                          <span className="text-oliva mt-1 text-[10px]">◆</span>
                          <span>{acomp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Bebidas */}
        {dados.bebidas.length > 0 && (
          <Reveal delay={0.2}>
            <div className="mt-14 pt-10 border-t border-areia/50 text-center">
              <div className="inline-flex items-center gap-3 text-oliva">
                <IconWineGlass className="w-6 h-6" />
                <span className="eyebrow text-bronze">Bebidas</span>
              </div>
              <p className="mt-4 text-carvao/80">
                {dados.bebidas.map((b, i) => (
                  <span key={b}>
                    {b}
                    {i < dados.bebidas.length - 1 && <span className="mx-3 text-oliva/60">·</span>}
                  </span>
                ))}
              </p>
            </div>
          </Reveal>
        )}

        {/* Serviço */}
        {dados.servico && (
          <Reveal delay={0.25}>
            <p className="mt-10 italic text-carvao/65 text-center max-w-2xl mx-auto leading-relaxed">
              {dados.servico}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
