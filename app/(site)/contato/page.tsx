import type { Metadata } from "next";
import { HeroSite } from "@/components/site/HeroSite";
import { FormOrcamento } from "@/components/site/FormOrcamento";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { FOTOS } from "@/content/espaco";
import { MAPS_URL, SITE, urlAbsoluta, whatsappUrl } from "@/lib/site-config";
import { JsonLd, schemaBreadcrumb } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Contato e localização em Lindéia, Barreiro, BH | Dondoka Recepções",
  description:
    "Fale com a Dondoka Recepções: WhatsApp (31) 97251-9129, Instagram @dondokarecepcoes. Rua das Petúnias, 1654 — Lindéia, Belo Horizonte. Peça seu orçamento.",
  alternates: { canonical: urlAbsoluta("/contato") },
};

const CANAIS = [
  {
    label: "WhatsApp",
    valor: SITE.contato.telefone,
    detalhe: "O caminho mais rápido. Respondemos por aqui.",
    href: whatsappUrl(),
    externo: true,
  },
  {
    label: "Instagram",
    valor: `@${SITE.contato.instagram}`,
    detalhe: "Fotos dos eventos que acontecem na casa.",
    href: `https://instagram.com/${SITE.contato.instagram}`,
    externo: true,
  },
  {
    label: "E-mail",
    valor: SITE.contato.email,
    detalhe: "Para propostas corporativas e notas fiscais.",
    href: `mailto:${SITE.contato.email}`,
    externo: false,
  },
  {
    label: "Endereço",
    valor: SITE.endereco.completo,
    detalhe: `CEP ${SITE.endereco.cep} — abrir no Google Maps.`,
    href: MAPS_URL,
    externo: true,
  },
] as const;

export default function ContatoPage() {
  return (
    <>
      <JsonLd
        data={schemaBreadcrumb([
          { nome: "Início", href: "/" },
          { nome: "Contato", href: "/contato" },
        ])}
      />

      <HeroSite
        eyebrow="Contato"
        titulo="Vamos"
        destaque="conversar?"
        subtitulo="Conte a data, o tipo de evento e quantas pessoas você espera. A gente devolve o orçamento fechado, sem surpresa depois."
        foto={FOTOS.fachadaNoiteAmpla}
        fotoAlt="Fachada iluminada da Dondoka Recepções vista da rua, à noite"
        ctaSecundario={{ href: "/perguntas-frequentes", label: "Ver perguntas frequentes" }}
      />

      {/* Formulário + canais */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionTitle
            eyebrow="Orçamento"
            title="Peça o seu"
            subtitle="Preencha os campos ou chame direto no WhatsApp, o que for mais confortável para você."
          />

          <div className="mt-14 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
            <Reveal>
              <FormOrcamento />
            </Reveal>

            <Reveal delay={0.1}>
              <div className="space-y-4">
                {CANAIS.map((canal) => (
                  <a
                    key={canal.label}
                    href={canal.href}
                    target={canal.externo ? "_blank" : undefined}
                    rel={canal.externo ? "noreferrer" : undefined}
                    className="group block rounded-2xl border border-areia/60 bg-white p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:border-oliva/40 hover:shadow-premium"
                  >
                    <p className="eyebrow">{canal.label}</p>
                    <p className="mt-2 break-words font-serif text-lg text-carvao transition group-hover:text-oliva">
                      {canal.valor}
                    </p>
                    <p className="mt-1 text-sm text-carvao/55">{canal.detalhe}</p>
                  </a>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Mapa */}
      <section className="bg-areia/25 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionTitle
            eyebrow="Como chegar"
            title="Lindéia, no Barreiro"
            subtitle="O bairro faz divisa com Contagem e Ibirité. De lá o acesso costuma ser mais curto que ir ao Centro de BH."
          />

          <Reveal delay={0.1}>
            <div className="mt-12 overflow-hidden rounded-2xl border border-areia/60 shadow-premium">
              <iframe
                title="Mapa com a localização da Dondoka Recepções"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  `${SITE.endereco.logradouro}, ${SITE.endereco.bairro}, ${SITE.endereco.cidade}, ${SITE.endereco.estado}, ${SITE.endereco.cep}`
                )}&output=embed`}
                width="100%"
                height="420"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block border-0"
              />
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-8 text-center">
              <address className="not-italic text-carvao/75">
                {SITE.endereco.logradouro} — {SITE.endereco.bairro}
                <br />
                {SITE.endereco.cidade} / {SITE.endereco.estado} · CEP {SITE.endereco.cep}
              </address>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center justify-center rounded-full bg-oliva px-7 py-3 text-sm font-medium text-white transition hover:bg-bronze"
              >
                Traçar rota no Google Maps
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
