import type { Metadata } from "next";
import Link from "next/link";
import { HeroSite } from "@/components/site/HeroSite";
import { CTASection } from "@/components/site/CTASection";
import { FAQAccordion } from "@/components/site/FAQAccordion";
import { Reveal } from "@/components/ui/Reveal";
import { FAQ_GERAL, FOTOS } from "@/content/espaco";
import { FAQ_EVENTOS } from "@/content/eventos";
import { urlAbsoluta } from "@/lib/site-config";
import { JsonLd, schemaBreadcrumb, schemaFAQ } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Perguntas frequentes sobre capacidade, horários e regras | Dondoka Recepções",
  description:
    "Respostas diretas sobre a Dondoka Recepções: capacidade, tipos de evento, parceiros de buffet e decoração, valor da locação, acessibilidade e como reservar a data.",
  alternates: { canonical: urlAbsoluta("/perguntas-frequentes") },
};

export default function FAQPage() {
  // Esta página mostra a FAQ geral E a de cada tipo de evento. O schema
  // declara o conjunto completo — que é exatamente o que está na tela.
  const todasAsPerguntas = [...FAQ_GERAL, ...FAQ_EVENTOS];

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
        foto={FOTOS.mezanino}
        fotoAlt="Mezanino da Dondoka Recepções, piso superior com guarda-corpo de vidro"
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

      {/* Perguntas sobre os eventos, que antes viviam nas páginas por tipo */}
      <section className="bg-areia/25 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="text-2xl md:text-3xl">
                <span className="font-light italic text-bronze">Sobre</span> os eventos
              </h2>
              <Link href="/eventos" className="text-sm text-oliva transition hover:text-bronze">
                Ver tipos de evento →
              </Link>
            </div>
          </Reveal>
          <div className="mt-8">
            <FAQAccordion itens={FAQ_EVENTOS} />
          </div>
        </div>
      </section>

      <CTASection
        titulo="Ficou alguma dúvida?"
        texto="Manda a pergunta no WhatsApp. A gente responde direto, sem robô e sem formulário de três páginas."
        mensagem="Olá! Tenho uma dúvida sobre o espaço da Dondoka."
      />
    </>
  );
}
