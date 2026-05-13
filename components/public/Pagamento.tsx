"use client";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { IconCard } from "@/components/ui/Icons";

export function Pagamento({ texto }: { texto: string | null }) {
  if (!texto) return null;
  return (
    <section id="pagamento" className="py-20 md:py-28 px-6 bg-areia/25">
      <div className="max-w-3xl mx-auto">
        <SectionTitle eyebrow="Condições" title="Forma de pagamento" />
        <Reveal delay={0.1}>
          <div className="mt-12 flex gap-6 md:gap-8 max-w-2xl mx-auto">
            <span className="hidden md:flex w-12 h-12 rounded-full bg-oliva/10 text-oliva items-center justify-center shrink-0">
              <IconCard className="w-6 h-6" />
            </span>
            <div className="flex-1 border-l-2 border-oliva/60 pl-6 md:pl-8">
              <p className="text-carvao/80 whitespace-pre-line leading-relaxed">{texto}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
