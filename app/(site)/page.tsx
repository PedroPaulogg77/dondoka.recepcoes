import Link from "next/link";
import { Foto } from "@/components/site/Foto";
import type { Metadata } from "next";
import { HeroSite } from "@/components/site/HeroSite";
import { CTASection } from "@/components/site/CTASection";
import { VideoTour } from "@/components/site/VideoTour";
import { FAQAccordion } from "@/components/site/FAQAccordion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import {
  IconCapacidade,
  IconClimatizado,
  IconCozinha,
  IconKids,
  IconBanheiros,
  IconSparkle,
} from "@/components/ui/Icons";
import { DIFERENCIAIS, FAQ_GERAL, FOTOS, TIPOS_EVENTO, VIDEOS } from "@/content/espaco";
import { SITE, urlAbsoluta } from "@/lib/site-config";
import { JsonLd, schemaFAQ, schemaVideo } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Dondoka Recepções: espaço para eventos em BH | Lindéia, Barreiro",
  description:
    "Espaço para eventos em Belo Horizonte com capacidade para até 70 pessoas: salão em dois ambientes, climatizado, cozinha equipada, espaço kids e buffet mineiro. No Lindéia, Barreiro.",
  alternates: { canonical: urlAbsoluta("/") },
};

const ICONES = {
  capacidade: IconCapacidade,
  climatizado: IconClimatizado,
  cozinha: IconCozinha,
  kids: IconKids,
  banheiros: IconBanheiros,
  decoracao: IconSparkle,
} as const;

export default function HomePage() {
  // A FAQ da home mostra 6 perguntas — o schema declara exatamente essas 6,
  // nunca a lista inteira. Schema precisa bater com o que está na tela.
  const faqVisivel = FAQ_GERAL.slice(0, 6);

  return (
    <>
      <JsonLd
        data={[
          schemaFAQ(faqVisivel),
          schemaVideo({
            nome: "Um dia de evento na Dondoka Recepções",
            descricao:
              "Casamento civil realizado no espaço da Dondoka Recepções, da fachada ao salão montado.",
            src: VIDEOS.tour.src,
            poster: VIDEOS.tour.poster,
            publicadoEm: "2026-07-23",
          }),
        ]}
      />

      <HeroSite
        altura="alto"
        eyebrow="Espaço para eventos em Belo Horizonte"
        titulo="Celebre o"
        destaque="essencial"
        subtitulo="Um espaço para até 70 pessoas no Lindéia, em BH: salão em dois ambientes, climatizado, com cozinha equipada, espaço kids e buffet mineiro feito na casa."
        foto={FOTOS.salaoMezanino}
        fotoAlt="Salão principal da Dondoka Recepções montado para um evento, com mezanino ao fundo e parede verde oliva"
        ctaSecundario={{ href: "/o-espaco", label: "Conhecer o espaço" }}
      />

      {/* ── Diferenciais ─────────────────────────────────────────────── */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionTitle
            eyebrow="O espaço"
            title="Tudo que a sua festa precisa"
            subtitle="Sem contratar estrutura por fora e sem surpresa no dia."
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {DIFERENCIAIS.map((item, i) => {
              const Icone = ICONES[item.icone];
              return (
                <Reveal key={item.titulo} delay={i * 0.06}>
                  <div className="group h-full rounded-2xl border border-areia/60 bg-white p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-premium">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-areia/40 text-oliva transition group-hover:bg-oliva group-hover:text-white">
                      <Icone className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 text-xl">{item.titulo}</h3>
                    <p className="mt-2 text-sm text-carvao/65">{item.descricao}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Vídeo ────────────────────────────────────────────────────── */}
      <section className="bg-areia/25 px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <p className="eyebrow">Um evento de verdade</p>
            <h2 className="mt-3 text-3xl leading-tight md:text-4xl">
              <span className="font-light italic text-bronze">Veja</span> a casa em movimento
            </h2>
            <p className="mt-5 text-carvao/75">
              Este é um casamento civil que aconteceu aqui, gravado do lado de fora até a mesa de doces
              montada. Sem render e sem foto de banco de imagens.
            </p>
            <p className="mt-4 text-carvao/75">
              A casa com gente dentro, no dia da festa. Ver assim conta mais que qualquer descrição nossa.
            </p>
            <Link
              href="/galeria"
              className="mt-7 inline-flex items-center gap-2 text-sm text-oliva transition hover:gap-3 hover:text-bronze"
            >
              Ver galeria completa
              <span aria-hidden>→</span>
            </Link>
          </Reveal>

          <Reveal delay={0.1}>
            <VideoTour {...VIDEOS.tour} />
          </Reveal>
        </div>
      </section>

      {/* ── Tipos de evento ──────────────────────────────────────────── */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionTitle
            eyebrow="Para o seu momento"
            title="Que evento você vai fazer?"
            subtitle="Cada tipo de festa usa o espaço de um jeito. Veja como o seu se encaixa."
          />

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TIPOS_EVENTO.map((tipo, i) => (
              <Reveal key={tipo.href} delay={i * 0.07}>
                <Link
                  href={tipo.href}
                  className="group relative block h-72 overflow-hidden rounded-2xl bg-areia shadow-soft transition-shadow hover:shadow-premium"
                >
                  <Foto
                    src={tipo.foto}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 22vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-carvao/85 via-carvao/25 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 p-5">
                    <span className="block font-serif text-xl text-white">{tipo.titulo}</span>
                    <span className="mt-1 block text-xs text-white/75">{tipo.descricao}</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Buffet ───────────────────────────────────────────────────── */}
      <section className="bg-areia/25 px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-premium">
              <Foto
                src={FOTOS.cozinha}
                alt="Cozinha equipada da Dondoka Recepções, com fogão industrial, bancadas em inox e freezer"
                fill
                sizes="(max-width: 768px) 90vw, 45vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="eyebrow">Buffet</p>
            <h2 className="mt-3 text-3xl leading-tight md:text-4xl">
              <span className="font-light italic text-bronze">Comida</span> mineira, feita aqui
            </h2>
            <p className="mt-5 text-carvao/75">
              Cantinho mineiro de entrada, feijoada completa ou feijão tropeiro com lombo no prato principal,
              bebidas e equipe de cozinha e copa durante todo o evento.
            </p>
            <p className="mt-4 text-carvao/75">
              A cozinha é industrial: fogão de 6 bocas, freezer, bancadas em inox e passa-prates
              direto para o salão. Se você preferir trazer buffet de fora, a estrutura atende igual.
            </p>
            <Link
              href="/buffet"
              className="mt-7 inline-flex items-center gap-2 text-sm text-oliva transition hover:gap-3 hover:text-bronze"
            >
              Ver o cardápio completo
              <span aria-hidden>→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── Localização ──────────────────────────────────────────────── */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <p className="eyebrow">Onde estamos</p>
            <h2 className="mt-3 text-3xl leading-tight md:text-4xl">
              <span className="font-light italic text-bronze">Lindéia</span>, no Barreiro
            </h2>
            <p className="mt-5 text-carvao/75">
              {SITE.endereco.logradouro} — {SITE.endereco.bairro}, {SITE.endereco.cidade} /{" "}
              {SITE.endereco.estado}. O bairro faz divisa com Contagem e Ibirité, então o acesso é curto
              também para quem vem dessas duas cidades.
            </p>
            <p className="mt-4 text-carvao/75">
              A fachada é fácil de reconhecer: revestimento em pedra branca e vidro, iluminada à noite.
            </p>
            <Link
              href="/contato"
              className="mt-7 inline-flex items-center gap-2 text-sm text-oliva transition hover:gap-3 hover:text-bronze"
            >
              Ver como chegar
              <span aria-hidden>→</span>
            </Link>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-premium">
              <Foto
                src={FOTOS.fachadaNoite}
                alt="Fachada da Dondoka Recepções à noite, com revestimento em pedra branca, vidro e iluminação"
                fill
                sizes="(max-width: 768px) 90vw, 45vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="bg-areia/25 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl">
          <SectionTitle eyebrow="Dúvidas" title="Perguntas frequentes" />
          <div className="mt-12">
            <FAQAccordion itens={faqVisivel} />
          </div>
          <Reveal>
            <div className="mt-10 text-center">
              <Link
                href="/perguntas-frequentes"
                className="inline-flex items-center gap-2 text-sm text-oliva transition hover:gap-3 hover:text-bronze"
              >
                Ver todas as perguntas
                <span aria-hidden>→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection mensagem="Olá! Vi o site da Dondoka e gostaria de um orçamento." />
    </>
  );
}
