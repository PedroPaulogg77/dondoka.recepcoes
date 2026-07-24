import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Foto } from "@/components/site/Foto";
import { HeroSite } from "@/components/site/HeroSite";
import { CTASection } from "@/components/site/CTASection";
import { FAQAccordion } from "@/components/site/FAQAccordion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { IconStar } from "@/components/ui/Icons";
import { EVENTOS, eventoPorSlug } from "@/content/eventos";
import { VIDEOS } from "@/content/espaco";
import { VideoTour } from "@/components/site/VideoTour";
import { urlAbsoluta } from "@/lib/site-config";
import { JsonLd, schemaBreadcrumb, schemaFAQ } from "@/lib/schema";

/**
 * As quatro páginas de tipo de evento saem daqui. São rotas estáticas de
 * verdade — `generateStaticParams` faz o Next pré-renderizar /eventos/aniversario,
 * /eventos/quinze-anos, /eventos/casamento e /eventos/corporativo no build.
 * Uma rota dinâmica só na forma; no ar, são quatro HTMLs prontos.
 */
export function generateStaticParams() {
  return EVENTOS.map((e) => ({ slug: e.slug }));
}

export const dynamicParams = false;

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const evento = eventoPorSlug(params.slug);
  if (!evento) return {};
  return {
    title: evento.title,
    description: evento.description,
    alternates: { canonical: urlAbsoluta(`/eventos/${evento.slug}`) },
  };
}

export default function EventoPage({ params }: { params: { slug: string } }) {
  const evento = eventoPorSlug(params.slug);
  if (!evento) notFound();

  return (
    <>
      <JsonLd
        data={[
          schemaFAQ(evento.faq),
          // Sem nível intermediário: não existe página /eventos, e breadcrumb
          // apontando para URL inexistente é erro no Rich Results Test.
          schemaBreadcrumb([
            { nome: "Início", href: "/" },
            { nome: evento.nav, href: `/eventos/${evento.slug}` },
          ]),
        ]}
      />

      <HeroSite
        eyebrow={evento.eyebrow}
        titulo={evento.h1}
        destaque={evento.h1Destaque}
        subtitulo={evento.resposta}
        foto={evento.foto}
        fotoAlt={evento.fotoAlt}
        ctaSecundario={{ href: "/galeria", label: "Ver o espaço" }}
        mensagemWhatsapp={evento.mensagemWhatsapp}
      />

      {/* Destaques em faixa — leitura rápida antes do texto corrido */}
      <section className="border-b border-areia/50 bg-white px-6 py-10">
        <ul className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-8 gap-y-3">
          {evento.destaques.map((d) => (
            <li key={d} className="flex items-center gap-2 text-sm text-carvao/75">
              <IconStar className="h-4 w-4 shrink-0 text-bronze" />
              {d}
            </li>
          ))}
        </ul>
      </section>

      {/* Seções de conteúdo */}
      {evento.secoes.map((secao, i) => (
        <section key={secao.titulo} className={i % 2 === 0 ? "px-6 py-20 md:py-24" : "bg-areia/25 px-6 py-20 md:py-24"}>
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <h2 className="text-3xl leading-tight md:text-4xl">{secao.titulo}</h2>
              <div className="mt-6 space-y-4 text-carvao/75">
                {secao.paragrafos.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      ))}

      {/* Vídeo do espaço */}
      <section className="px-6 py-20 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <p className="eyebrow">Veja com seus olhos</p>
            <h2 className="mt-3 text-3xl leading-tight md:text-4xl">
              <span className="font-light italic text-bronze">Um dia</span> de evento aqui
            </h2>
            <p className="mt-5 text-carvao/75">
              Da fachada ao salão montado, com convidados dentro. Evento real, gravado aqui. Nenhuma
              imagem de banco.
            </p>
            <Link
              href="/galeria"
              className="mt-7 inline-flex items-center gap-2 text-sm text-oliva transition hover:gap-3 hover:text-bronze"
            >
              Ver todas as fotos
              <span aria-hidden>→</span>
            </Link>
          </Reveal>
          <Reveal delay={0.1}>
            <VideoTour {...VIDEOS.tour} />
          </Reveal>
        </div>
      </section>

      {/* FAQ específico do tipo de evento */}
      <section className="bg-areia/25 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl">
          <SectionTitle eyebrow="Dúvidas" title={`Sobre ${evento.nav.toLowerCase()}`} />
          <div className="mt-12">
            <FAQAccordion itens={evento.faq} />
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

      {/* Outros tipos de evento */}
      <section className="px-6 py-20 md:py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="text-center text-2xl md:text-3xl">Outros tipos de evento</h2>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {EVENTOS.filter((e) => e.slug !== evento.slug).map((outro, i) => (
              <Reveal key={outro.slug} delay={i * 0.07}>
                <Link
                  href={`/eventos/${outro.slug}`}
                  className="group relative block h-56 overflow-hidden rounded-2xl bg-areia shadow-soft transition-shadow hover:shadow-premium"
                >
                  <Foto
                    src={outro.foto}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 90vw, 30vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-carvao/85 via-carvao/20 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 p-5 font-serif text-lg text-white">{outro.nav}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        titulo={`Vamos falar sobre ${evento.nav.toLowerCase()}?`}
        mensagem={evento.mensagemWhatsapp}
      />
    </>
  );
}
