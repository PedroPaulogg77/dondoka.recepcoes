"use client";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";

export function Pagamento({ texto }: { texto: string | null }) {
  if (!texto) return null;
  return (
    <section id="pagamento" className="py-20 md:py-28 px-6 bg-areia/25">
      <div className="max-w-3xl mx-auto">
        <SectionTitle eyebrow="Condições" title="Forma de pagamento" />
        <Reveal delay={0.1}>
          <div className="mt-12 bg-white border border-areia/60 rounded-2xl p-8 md:p-10 shadow-soft">
            <p className="text-carvao/80 whitespace-pre-line leading-relaxed">{texto}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
