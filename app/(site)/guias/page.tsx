import type { Metadata } from "next";
import Link from "next/link";
import { Foto } from "@/components/site/Foto";
import { CTASection } from "@/components/site/CTASection";
import { HeroSite } from "@/components/site/HeroSite";
import { Reveal } from "@/components/ui/Reveal";
import { FOTOS } from "@/content/espaco";
import { GUIAS } from "@/content/guias";
import { urlAbsoluta } from "@/lib/site-config";
import { JsonLd, schemaBreadcrumb } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Guias para planejar seu evento | Dondoka Recepções",
  description:
    "Guias práticos sobre como escolher e contratar espaço para festa em Belo Horizonte: o que define o preço, o que perguntar na visita e como avaliar a região.",
  alternates: { canonical: urlAbsoluta("/guias") },
};

function dataBonita(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(`${iso}T12:00:00`)
  );
}

export default function GuiasPage() {
  return (
    <>
      <JsonLd
        data={schemaBreadcrumb([
          { nome: "Início", href: "/" },
          { nome: "Guias", href: "/guias" },
        ])}
      />

      {/* Usa HeroSite como todas as outras páginas do site. O header é
          transparente no topo e conta com um hero escuro embaixo para o texto
          branco ter contraste — página com topo claro deixaria o menu ilegível. */}
      <HeroSite
        eyebrow="Guias"
        titulo="Para planejar"
        destaque="sem susto"
        subtitulo="O que a gente aprende organizando evento todo fim de semana, escrito para você usar. Mesmo que a festa não seja aqui."
        foto={FOTOS.mezanino}
        fotoAlt="Mezanino da Dondoka Recepções, o segundo ambiente do espaço"
        ctaSecundario={{ href: "/o-espaco", label: "Conhecer o espaço" }}
      />

      <section className="px-6 pb-20 md:pb-28">
        <div className="mx-auto max-w-4xl space-y-8">
          {GUIAS.map((guia, i) => (
            <Reveal key={guia.slug} delay={i * 0.07}>
              <Link
                href={`/guias/${guia.slug}`}
                className="group grid gap-6 overflow-hidden rounded-2xl border border-areia/60 bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-oliva/40 hover:shadow-premium sm:grid-cols-[240px_1fr] sm:p-6"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-areia sm:aspect-auto sm:h-full">
                  <Foto
                    src={guia.foto}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 90vw, 240px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-col justify-center">
                  <time dateTime={guia.publicadoEm} className="eyebrow">
                    {dataBonita(guia.publicadoEm)}
                  </time>
                  <h2 className="mt-2 font-serif text-xl text-carvao transition group-hover:text-oliva md:text-2xl">
                    {guia.titulo}
                  </h2>
                  <p className="mt-3 text-sm text-carvao/70">{guia.resumo}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm text-oliva transition-all group-hover:gap-3">
                    Ler o guia
                    <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <CTASection />
    </>
  );
}
