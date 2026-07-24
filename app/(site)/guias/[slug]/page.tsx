import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Foto } from "@/components/site/Foto";
import { CTASection } from "@/components/site/CTASection";
import { Reveal } from "@/components/ui/Reveal";
import { GUIAS, guiaPorSlug, type Bloco } from "@/content/guias";
import { urlAbsoluta } from "@/lib/site-config";
import { JsonLd, schemaArtigo, schemaBreadcrumb } from "@/lib/schema";

export function generateStaticParams() {
  return GUIAS.map((g) => ({ slug: g.slug }));
}

export const dynamicParams = false;

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const guia = guiaPorSlug(params.slug);
  if (!guia) return {};
  return {
    title: guia.title,
    description: guia.description,
    alternates: { canonical: urlAbsoluta(`/guias/${guia.slug}`) },
    openGraph: {
      type: "article",
      publishedTime: guia.publicadoEm,
      modifiedTime: guia.atualizadoEm,
    },
  };
}

function dataBonita(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(`${iso}T12:00:00`)
  );
}

function Conteudo({ blocos }: { blocos: Bloco[] }) {
  return (
    <>
      {blocos.map((bloco, i) => {
        switch (bloco.tipo) {
          case "h2":
            return (
              <h2 key={i} className="mt-12 text-2xl leading-snug md:text-3xl">
                {bloco.texto}
              </h2>
            );
          case "p":
            return (
              <p key={i} className="mt-5 text-carvao/80">
                {bloco.texto}
              </p>
            );
          case "lista":
            return (
              <ul key={i} className="mt-5 space-y-2.5">
                {bloco.itens.map((item) => (
                  <li key={item} className="flex gap-3 text-carvao/80">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-bronze" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            );
          case "destaque":
            return (
              <aside
                key={i}
                className="mt-8 rounded-2xl border-l-4 border-oliva bg-areia/30 px-6 py-5 font-serif text-lg italic text-carvao/85"
              >
                {bloco.texto}
              </aside>
            );
        }
      })}
    </>
  );
}

export default function GuiaPage({ params }: { params: { slug: string } }) {
  const guia = guiaPorSlug(params.slug);
  if (!guia) notFound();

  const outros = GUIAS.filter((g) => g.slug !== guia.slug);

  return (
    <>
      <JsonLd
        data={[
          schemaArtigo(guia),
          schemaBreadcrumb([
            { nome: "Início", href: "/" },
            { nome: "Guias", href: "/guias" },
            { nome: guia.titulo, href: `/guias/${guia.slug}` },
          ]),
        ]}
      />

      <article>
        {/* Cabeçalho sobre a foto do guia.
            O header do site é transparente no topo e usa texto branco — toda
            página precisa começar com fundo escuro para ele ficar legível. */}
        <header className="relative -mt-16 flex min-h-[68svh] items-end overflow-hidden md:-mt-20">
          <Foto
            src={guia.foto}
            alt={guia.fotoAlt}
            fill
            priority
            quality={75}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-carvao/70 via-carvao/50 to-carvao/75" aria-hidden />

          <div className="relative mx-auto w-full max-w-3xl px-6 pb-14 pt-28 md:pb-20">
            <Reveal>
              <Link href="/guias" className="text-sm text-areia transition hover:text-white">
                ← Todos os guias
              </Link>
              <time dateTime={guia.publicadoEm} className="eyebrow mt-6 block text-white/80">
                {dataBonita(guia.publicadoEm)}
              </time>
              <h1 className="mt-3 font-serif text-3xl leading-tight text-white md:text-5xl">{guia.titulo}</h1>
            </Reveal>
          </div>
        </header>

        {/* O resumo é o trecho que responde a pergunta antes de tudo. */}
        <div className="px-6 pt-12">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <p className="border-l-2 border-bronze/40 pl-5 text-lg text-carvao/75">{guia.resumo}</p>
            </Reveal>
          </div>
        </div>

        <div className="px-6 pb-20 pt-4 md:pb-28">
          <div className="mx-auto max-w-3xl">
            <Conteudo blocos={guia.blocos} />
          </div>
        </div>
      </article>

      {/* Outros guias */}
      {outros.length > 0 && (
        <section className="border-t border-areia/50 bg-areia/25 px-6 py-16 md:py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-2xl md:text-3xl">Continue lendo</h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {outros.map((outro, i) => (
                <Reveal key={outro.slug} delay={i * 0.07}>
                  <Link
                    href={`/guias/${outro.slug}`}
                    className="group block h-full rounded-2xl border border-areia/60 bg-white p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:border-oliva/40 hover:shadow-premium"
                  >
                    <h3 className="font-serif text-lg text-carvao transition group-hover:text-oliva">
                      {outro.titulo}
                    </h3>
                    <p className="mt-3 text-sm text-carvao/65 line-clamp-3">{outro.resumo}</p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection />
    </>
  );
}
