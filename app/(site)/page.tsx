import Link from "next/link";
import { Foto } from "@/components/site/Foto";
import type { Metadata } from "next";
import { HeroSite } from "@/components/site/HeroSite";
import { CTASection } from "@/components/site/CTASection";
import { CarrosselFotos } from "@/components/site/CarrosselFotos";
import { VideoTour } from "@/components/site/VideoTour";
import { FAQAccordion } from "@/components/site/FAQAccordion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import {
  IconCapacidade,
  IconAmbientes,
  IconClimatizado,
  IconCozinha,
  IconBanheiros,
} from "@/components/ui/Icons";
import { CARROSSEL_HOME, DIFERENCIAIS, FAQ_GERAL, FOTOS, TIPOS_EVENTO, VIDEOS } from "@/content/espaco";
import { SITE, urlAbsoluta } from "@/lib/site-config";
import { JsonLd, schemaFAQ, schemaVideo } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Espaço para eventos em Belo Horizonte | Dondoka Recepções",
  description:
    "Espaço para eventos de até 70 convidados em Belo Horizonte, no Lindéia (Barreiro). Dois ambientes, climatizado e com cozinha equipada. Solicite seu orçamento.",
  alternates: { canonical: urlAbsoluta("/") },
};

const ICONES = {
  capacidade: IconCapacidade,
  ambientes: IconAmbientes,
  climatizado: IconClimatizado,
  cozinha: IconCozinha,
  banheiros: IconBanheiros,
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
        eyebrow="Dondoka Recepções"
        titulo="Um espaço para celebrar"
        destaque="momentos especiais"
        subtitulo="Espaço para eventos de até 70 convidados em Belo Horizonte, no bairro Lindéia."
        foto={FOTOS.mezaninoEscada}
        fotoAlt="Salão da Dondoka Recepções visto da escada, com o mezanino no piso superior"
        ctaSecundario={{ href: "/o-espaco", label: "Conhecer o espaço" }}
      />

      {/* ── Vídeo ────────────────────────────────────────────────────────
          Logo depois do hero, de propósito: é o material mais forte que a casa
          tem. Um evento real, com gente dentro, convence mais rápido que
          qualquer foto de espaço vazio. Fundo escuro para o vídeo virar o
          ponto de atenção da seção. */}
      <section className="relative overflow-hidden bg-carvao px-6 py-20 text-white md:py-28">
        <div className="absolute inset-0 pattern-claro opacity-[0.06]" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <p className="eyebrow text-areia">Um evento de verdade</p>
            <h2 className="mt-3 text-3xl leading-tight text-white md:text-4xl">
              <span className="font-light italic text-areia">Veja</span> a casa em movimento
            </h2>
            <p className="mt-5 text-white/80">
              Este é um casamento civil que aconteceu aqui, gravado do lado de fora até a mesa de doces
              montada. Sem render e sem foto de banco de imagens.
            </p>
            <p className="mt-4 text-white/80">
              A casa com gente dentro, no dia da festa. Ver assim conta mais que qualquer descrição nossa.
            </p>
            <Link
              href="/o-espaco"
              className="mt-7 inline-flex items-center gap-2 text-sm text-areia transition hover:gap-3 hover:text-white"
            >
              Conhecer a estrutura
              <span aria-hidden>→</span>
            </Link>
          </Reveal>

          <Reveal delay={0.1}>
            <VideoTour {...VIDEOS.tour} prioridade />
          </Reveal>
        </div>
      </section>

      {/* ── Diferenciais ─────────────────────────────────────────────── */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionTitle
            eyebrow="O espaço"
            title="Tudo que a sua festa precisa"
            subtitle="Sem contratar estrutura por fora e sem surpresa no dia."
          />

          {/* Flex em vez de grid: são 5 itens, e numa grade de 3 colunas a
              última linha ficaria com um buraco à direita. Com flex-wrap e
              justify-center, as duas últimas centralizam sozinhas. */}
          <div className="mt-14 flex flex-wrap justify-center gap-6">
            {DIFERENCIAIS.map((item, i) => {
              const Icone = ICONES[item.icone];
              return (
                <Reveal
                  key={item.titulo}
                  delay={i * 0.06}
                  className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
                >
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

      {/* ── Carrossel do espaço ──────────────────────────────────────────
          A Camila pediu prioridade para as fotos, e a home não mostrava
          nenhuma além do hero. O carrossel fica em largura total de propósito:
          sangrando até a borda, as fotos ganham o peso visual que uma grade
          contida não daria. */}
      <section className="bg-areia/25 py-20 md:py-28">
        <div className="mx-auto mb-12 max-w-6xl px-6">
          <SectionTitle
            eyebrow="O espaço"
            title="A Dondoka em momentos reais"
            subtitle="Fotos da casa e de eventos que aconteceram aqui."
          />
        </div>

        <Reveal>
          <CarrosselFotos slides={CARROSSEL_HOME} />
        </Reveal>

        <Reveal>
          <div className="mt-10 text-center">
            <Link
              href="/galeria"
              className="inline-flex items-center gap-2 text-sm text-oliva transition-all hover:gap-3 hover:text-bronze"
            >
              Ver a galeria completa
              <span aria-hidden>→</span>
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ── Tipos de evento ──────────────────────────────────────────────
          Lista de texto, sem foto. Antes eram seis cards grandes com imagem,
          e as imagens não representavam o tipo (workshops com foto do
          mezanino vazio, chás com uma mesa de doces qualquer). Sem ilustrar
          nada, a foto só roubava espaço das fotos do espaço, que é o que
          precisa aparecer. Cada item leva à seção correspondente em /eventos. */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          <SectionTitle
            eyebrow="Eventos"
            title="Momentos que merecem ser celebrados"
            subtitle="O espaço recebe celebrações de até 70 convidados."
          />

          <div className="mt-12 divide-y divide-areia/70 border-y border-areia/70">
            {TIPOS_EVENTO.map((tipo, i) => (
              <Reveal key={tipo.id} delay={i * 0.04}>
                <Link
                  href={`/eventos#${tipo.id}`}
                  className="group flex items-baseline justify-between gap-6 py-5 transition-colors hover:text-oliva"
                >
                  <span className="font-serif text-xl text-carvao transition-colors group-hover:text-oliva md:text-2xl">
                    {tipo.titulo}
                  </span>
                  <span className="flex items-baseline gap-3 text-right">
                    <span className="hidden text-sm text-carvao/55 sm:inline">{tipo.descricao}</span>
                    <span
                      className="text-bronze transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden
                    >
                      →
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Buffet e decoração: parceiros, não serviço da casa ───────── */}
      <section className="bg-areia/25 px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-premium">
              <Foto
                src={FOTOS.cozinha}
                alt="Cozinha industrial da Dondoka Recepções, com fogão de 6 bocas, bancadas em inox e freezer"
                fill
                sizes="(max-width: 768px) 90vw, 45vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="eyebrow">Buffet e decoração</p>
            <h2 className="mt-3 text-3xl leading-tight md:text-4xl">
              <span className="font-light italic text-bronze">Tudo</span> para o seu evento
            </h2>
            <p className="mt-5 text-carvao/75">
              Contamos com parceiros de confiança para buffet e decoração, indicados de acordo com o perfil
              e as necessidades do seu evento.
            </p>
            <p className="mt-4 text-carvao/75">
              Se você já tem fornecedores, pode trazer sem taxa. A cozinha industrial da casa fica à
              disposição de quem for servir: fogão de 6 bocas, freezer, bancadas em inox e passagem direta
              para o salão.
            </p>
            <Link
              href="/buffet"
              className="mt-7 inline-flex items-center gap-2 text-sm text-oliva transition hover:gap-3 hover:text-bronze"
            >
              Como funcionam as parcerias
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
