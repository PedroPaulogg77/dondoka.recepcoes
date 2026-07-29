import type { Metadata } from "next";
import Link from "next/link";
import { Foto } from "@/components/site/Foto";
import { HeroSite } from "@/components/site/HeroSite";
import { CTASection } from "@/components/site/CTASection";
import { FAQAccordion } from "@/components/site/FAQAccordion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { FAQ_EVENTOS, SECOES_EVENTO } from "@/content/eventos";
import { FOTOS } from "@/content/espaco";
import { urlAbsoluta } from "@/lib/site-config";
import { JsonLd, schemaBreadcrumb, schemaFAQ } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Eventos: aniversário, casamento, 15 anos e corporativo | Dondoka Recepções",
  description:
    "Espaço para aniversário, casamento e mini wedding, festa de 15 anos, evento corporativo, chás e workshops em Belo Horizonte. Até 70 convidados, no Lindéia, Barreiro.",
  alternates: { canonical: urlAbsoluta("/eventos") },
};

export default function EventosPage() {
  return (
    <>
      <JsonLd
        data={[
          schemaFAQ(FAQ_EVENTOS),
          schemaBreadcrumb([
            { nome: "Início", href: "/" },
            { nome: "Eventos", href: "/eventos" },
          ]),
        ]}
      />

      <HeroSite
        eyebrow="Eventos"
        titulo="Momentos que merecem"
        destaque="ser celebrados"
        subtitulo="Aniversários, casamentos, festas de 15 anos, eventos corporativos, chás e workshops. Até 70 convidados, em Belo Horizonte."
        foto={FOTOS.escadaVidro}
        fotoAlt="Escada e guarda-corpo de vidro que ligam os dois ambientes da Dondoka Recepções"
        ctaSecundario={{ href: "/galeria", label: "Ver o espaço" }}
      />

      {/* Índice dos tipos: leva direto à seção e já mostra tudo que atendemos */}
      <section className="border-b border-areia/50 bg-white px-6 py-10">
        <nav aria-label="Tipos de evento" className="mx-auto max-w-4xl">
          <ul className="flex flex-wrap justify-center gap-2.5">
            {SECOES_EVENTO.map((secao) => (
              <li key={secao.id}>
                <a
                  href={`#${secao.id}`}
                  className="inline-flex rounded-full border border-areia/70 bg-creme px-5 py-2 text-sm text-carvao/75 transition hover:border-oliva/50 hover:text-oliva"
                >
                  {secao.titulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      {/* Uma seção por tipo, alternando o lado da foto */}
      {SECOES_EVENTO.map((secao, i) => (
        <section
          key={secao.id}
          id={secao.id}
          // scroll-mt compensa o header fixo: sem isso a âncora para com o
          // título escondido atrás da barra de navegação.
          className={`scroll-mt-24 px-6 py-16 md:py-20 ${i % 2 === 1 ? "bg-areia/25" : ""}`}
        >
          <div
            className={`mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-16 ${
              i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
            }`}
          >
            <Reveal>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-premium">
                <Foto
                  src={secao.foto}
                  alt={secao.fotoAlt}
                  fill
                  sizes="(max-width: 768px) 90vw, 45vw"
                  className="object-cover"
                />
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="text-2xl md:text-3xl">{secao.titulo}</h2>
              <p className="mt-4 text-carvao/85">{secao.abertura}</p>
              <div className="mt-4 space-y-4 text-carvao/75">
                {secao.paragrafos.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      ))}

      {/* Parceiros: aparece aqui porque é a dúvida que vem logo depois */}
      <section className="bg-oliva/5 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="eyebrow">Buffet e decoração</p>
            <h2 className="mt-3 text-2xl md:text-3xl">
              <span className="font-light italic text-bronze">Parceiros</span> de confiança
            </h2>
            <p className="mt-5 text-carvao/75">
              A Dondoka indica parceiros para buffet e decoração conforme o perfil do seu evento. Se você
              já tem fornecedores de confiança, pode trazer: a cozinha equipada fica à disposição de quem
              for servir.
            </p>
            <Link
              href="/buffet"
              className="mt-6 inline-flex items-center gap-2 text-sm text-oliva transition hover:gap-3 hover:text-bronze"
            >
              Como funcionam as parcerias
              <span aria-hidden>→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          <SectionTitle eyebrow="Dúvidas" title="Sobre os eventos" />
          <div className="mt-10">
            <FAQAccordion itens={FAQ_EVENTOS} />
          </div>
          <Reveal>
            <div className="mt-10 text-center">
              <Link
                href="/perguntas-frequentes"
                className="inline-flex items-center gap-2 text-sm text-oliva transition hover:gap-3 hover:text-bronze"
              >
                Ver todas as perguntas frequentes
                <span aria-hidden>→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection
        titulo="Vamos falar sobre o seu evento?"
        mensagem="Olá! Gostaria de um orçamento para um evento na Dondoka."
      />
    </>
  );
}
