import type { Metadata } from "next";
import Link from "next/link";
import { HeroSite } from "@/components/site/HeroSite";
import { CTASection } from "@/components/site/CTASection";
import { FAQAccordion } from "@/components/site/FAQAccordion";
import { Reveal } from "@/components/ui/Reveal";
import { FAQ_GERAL, FOTOS } from "@/content/espaco";
import { EVENTOS } from "@/content/eventos";
import { urlAbsoluta } from "@/lib/site-config";
import { JsonLd, schemaBreadcrumb, schemaFAQ } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Perguntas frequentes sobre capacidade, horários e regras | Dondoka Recepções",
  description:
    "Respostas diretas sobre a Dondoka Recepções: capacidade, localização no Lindéia, como funciona o valor do aluguel, buffet, decoração, acessibilidade e como reservar a data.",
  alternates: { canonical: urlAbsoluta("/perguntas-frequentes") },
};

export default function FAQPage() {
  // Esta página mostra a FAQ geral E a de cada tipo de evento. O schema
  // declara o conjunto completo — que é exatamente o que está na tela.
  const todasAsPerguntas = [...FAQ_GERAL, ...EVENTOS.flatMap((e) => e.faq)];

  return (
    <>
      <JsonLd
        data={[
          schemaFAQ(todasAsPerguntas),
          schemaBreadcrumb([
            { nome: "Início", href: "/" },
            { nome: "Perguntas frequentes", href: "/perguntas-frequentes" },
          ]),
        ]}
      />

      <HeroSite
        eyebrow="Dúvidas"
        titulo="Perguntas"
        destaque="frequentes"
        subtitulo="As perguntas que mais chegam no nosso WhatsApp, respondidas sem enrolação. Se a sua não estiver aqui, é só chamar."
        foto={FOTOS.salaoDecorado}
        fotoAlt="Salão da Dondoka Recepções montado e decorado para um evento"
        ctaSecundario={{ href: "/o-espaco", label: "Ver o espaço" }}
        mensagemWhatsapp="Olá! Tenho uma dúvida sobre o espaço da Dondoka."
      />

      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <h2 className="text-3xl md:text-4xl">
              <span className="font-light italic text-bronze">Sobre</span> o espaço
            </h2>
          </Reveal>
          <div className="mt-10">
            <FAQAccordion itens={FAQ_GERAL} />
          </div>
        </div>
      </section>

      {/* FAQ por tipo de evento — cada bloco reaproveita o conteúdo da página do evento */}
      {EVENTOS.map((evento, i) => (
        <section
          key={evento.slug}
          className={i % 2 === 0 ? "bg-areia/25 px-6 py-16 md:py-20" : "px-6 py-16 md:py-20"}
        >
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="text-2xl md:text-3xl">
                  <span className="font-light italic text-bronze">Sobre</span> {evento.nav.toLowerCase()}
                </h2>
                <Link
                  href={`/eventos/${evento.slug}`}
                  className="text-sm text-oliva transition hover:text-bronze"
                >
                  Ver a página completa →
                </Link>
              </div>
            </Reveal>
            <div className="mt-8">
              <FAQAccordion itens={evento.faq} />
            </div>
          </div>
        </section>
      ))}

      <CTASection
        titulo="Ficou alguma dúvida?"
        texto="Manda a pergunta no WhatsApp. A gente responde direto, sem robô e sem formulário de três páginas."
        mensagem="Olá! Tenho uma dúvida sobre o espaço da Dondoka."
      />
    </>
  );
}
