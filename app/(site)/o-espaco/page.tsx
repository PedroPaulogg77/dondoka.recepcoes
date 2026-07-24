import type { Metadata } from "next";
import { Foto } from "@/components/site/Foto";
import Link from "next/link";
import { HeroSite } from "@/components/site/HeroSite";
import { CTASection } from "@/components/site/CTASection";
import { VideoTour } from "@/components/site/VideoTour";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { FOTOS, VIDEOS } from "@/content/espaco";
import { SITE, urlAbsoluta } from "@/lib/site-config";
import { JsonLd, schemaBreadcrumb, schemaVideo } from "@/lib/schema";

export const metadata: Metadata = {
  title: "O espaço: estrutura, capacidade e comodidades | Dondoka Recepções",
  description:
    "Conheça a estrutura da Dondoka Recepções: salão em dois ambientes para até 70 pessoas, mezanino, climatização, cozinha industrial equipada, espaço kids e 3 banheiros. Lindéia, BH.",
  alternates: { canonical: urlAbsoluta("/o-espaco") },
};

/** Cada bloco descreve um ambiente real, com a foto que prova o que o texto diz. */
const AMBIENTES = [
  {
    titulo: "Salão principal",
    foto: FOTOS.salaoMezanino,
    alt: "Salão principal da Dondoka com parede verde oliva, mesas montadas e mezanino ao fundo",
    paragrafos: [
      "É onde a festa acontece. Comporta as mesas dos convidados e a pista, com pé-direito alto e iluminação embutida no teto.",
      "A parede em verde oliva e o piso claro dão um fundo neutro para qualquer decoração. Funciona com o tema colorido de festa infantil e com o branco e dourado de um casamento.",
    ],
  },
  {
    titulo: "Mezanino",
    foto: FOTOS.mezanino,
    alt: "Mezanino da Dondoka Recepções, piso superior amplo com guarda-corpo de vidro e metal",
    paragrafos: [
      "O piso superior é o que diferencia a Dondoka de um salão comum. Ele cria um segundo ambiente sem precisar de parede: dá para usá-lo como área de recepção, mesa de doces, espaço das crianças ou canto de quem quer conversar longe do som.",
      "A escada e o guarda-corpo também resolvem o momento da entrada. Em festa de 15 anos e casamento, descer para o salão à vista de todos muda a cena inteira.",
    ],
  },
  {
    titulo: "Cozinha industrial equipada",
    foto: FOTOS.cozinha,
    alt: "Cozinha industrial da Dondoka com fogão de 6 bocas, bancadas em inox, freezer e cuba",
    paragrafos: [
      "Fogão industrial de 6 bocas com forno, freezer horizontal, cuba e bancadas em inox, e uma janela de passagem direta para o salão.",
      "Isso significa duas coisas: o nosso buffet trabalha com estrutura de verdade, e se você contratar buffet de fora, a equipe dele encontra tudo que precisa. Sem improviso e sem aluguel de estrutura extra.",
    ],
  },
  {
    titulo: "Espaço kids",
    foto: FOTOS.espacoKids,
    alt: "Área kids da Dondoka Recepções com brinquedos e escorregador",
    paragrafos: [
      "Área separada, com brinquedos, para as crianças aproveitarem em segurança enquanto os adultos ficam por perto.",
      "Na prática é o item que mais muda a experiência de quem vai à festa com filho pequeno: dá para sentar, comer e conversar sem perder a criança de vista.",
    ],
  },
  {
    titulo: "Banheiros",
    foto: FOTOS.banheiro,
    alt: "Banheiro da Dondoka Recepções com bancada dupla, cubas de apoio e painel ripado",
    paragrafos: [
      "São 3 banheiros, sendo um deles adaptado para acessibilidade e equipado com fraldário.",
      "Bancada dupla e acabamento em painel ripado. Detalhe pequeno que passa batido na visita e faz diferença numa festa cheia.",
    ],
  },
] as const;

const FICHA = [
  { label: "Capacidade", valor: "Até 70 pessoas" },
  { label: "Ambientes", valor: "Salão principal + mezanino" },
  { label: "Climatização", valor: "Ar-condicionado nos 2 pavimentos" },
  { label: "Cozinha", valor: "Industrial equipada, com passa-prates" },
  { label: "Banheiros", valor: "3, sendo 1 adaptado com fraldário" },
  { label: "Espaço kids", valor: "Sim, área separada" },
  { label: "Bairro", valor: "Lindéia, Barreiro, Belo Horizonte" },
  { label: "Também atende", valor: "Contagem e Ibirité" },
] as const;

export default function OEspacoPage() {
  return (
    <>
      <JsonLd
        data={[
          schemaBreadcrumb([
            { nome: "Início", href: "/" },
            { nome: "O espaço", href: "/o-espaco" },
          ]),
          schemaVideo({
            nome: "Um evento completo na Dondoka Recepções",
            descricao: "Casamento civil realizado no espaço, da chegada dos convidados à mesa de doces.",
            src: VIDEOS.evento.src,
            poster: VIDEOS.evento.poster,
            publicadoEm: "2026-07-23",
          }),
        ]}
      />

      <HeroSite
        eyebrow="O espaço"
        titulo="Um salão para até"
        destaque="70 pessoas"
        subtitulo="Dois ambientes em níveis diferentes, climatizados, com cozinha industrial equipada, espaço kids e 3 banheiros, no Lindéia, região do Barreiro, em Belo Horizonte."
        foto={FOTOS.mezaninoEscada}
        fotoAlt="Vista do mezanino e da escada da Dondoka Recepções, com teto alto e iluminação embutida"
        ctaSecundario={{ href: "/galeria", label: "Ver todas as fotos" }}
      />

      {/* Ficha técnica — bloco denso de fato, fácil de extrair */}
      <section className="border-b border-areia/50 bg-white px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <h2 className="sr-only">Ficha técnica do espaço</h2>
            <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
              {FICHA.map((item) => (
                <div key={item.label} className="border-b border-areia/50 pb-4">
                  <dt className="eyebrow">{item.label}</dt>
                  <dd className="mt-1.5 font-serif text-lg text-carvao">{item.valor}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* Ambientes, alternando lado */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionTitle
            eyebrow="Ambiente por ambiente"
            title="O que você encontra aqui"
            subtitle="Cada espaço com a foto que comprova. Sem render, sem imagem de catálogo."
          />

          <div className="mt-16 space-y-20 md:space-y-28">
            {AMBIENTES.map((amb, i) => (
              <div
                key={amb.titulo}
                className={`grid items-center gap-10 md:grid-cols-2 md:gap-16 ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}
              >
                <Reveal>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-premium">
                    <Foto
                      src={amb.foto}
                      alt={amb.alt}
                      fill
                      sizes="(max-width: 768px) 90vw, 45vw"
                      className="object-cover"
                    />
                  </div>
                </Reveal>
                <Reveal delay={0.1}>
                  <h3 className="text-2xl md:text-3xl">{amb.titulo}</h3>
                  <div className="mt-5 space-y-4 text-carvao/75">
                    {amb.paragrafos.map((p) => (
                      <p key={p.slice(0, 40)}>{p}</p>
                    ))}
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vídeo */}
      <section className="bg-areia/25 px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <p className="eyebrow">Tour em vídeo</p>
            <h2 className="mt-3 text-3xl leading-tight md:text-4xl">
              <span className="font-light italic text-bronze">Percorra</span> o espaço
            </h2>
            <p className="mt-5 text-carvao/75">
              Foto mostra o ambiente parado. O vídeo mostra a distância entre as coisas, o pé-direito, a luz
              que entra, e como fica quando está cheio de gente.
            </p>
            <p className="mt-4 text-carvao/75">
              Este é um casamento civil que aconteceu aqui, do lado de fora até a mesa de doces.
            </p>
            <Link
              href="/contato"
              className="mt-7 inline-flex items-center gap-2 text-sm text-oliva transition hover:gap-3 hover:text-bronze"
            >
              Agendar uma visita presencial
              <span aria-hidden>→</span>
            </Link>
          </Reveal>
          <Reveal delay={0.1}>
            <VideoTour {...VIDEOS.evento} />
          </Reveal>
        </div>
      </section>

      {/* Localização */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-premium">
              <Foto
                src={FOTOS.fachadaDia}
                alt="Fachada da Dondoka Recepções durante o dia, com revestimento em pedra branca e portão escuro"
                fill
                sizes="(max-width: 768px) 90vw, 45vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow">Como chegar</p>
            <h2 className="mt-3 text-3xl leading-tight md:text-4xl">
              <span className="font-light italic text-bronze">Fácil</span> de achar
            </h2>
            <p className="mt-5 text-carvao/75">
              {SITE.endereco.logradouro}, {SITE.endereco.bairro} — {SITE.endereco.cidade} /{" "}
              {SITE.endereco.estado}, CEP {SITE.endereco.cep}.
            </p>
            <p className="mt-4 text-carvao/75">
              A fachada tem revestimento em pedra branca e vidro, com portão escuro ao lado. À noite fica
              iluminada, e quem chega de carro identifica de longe.
            </p>
            <Link
              href="/contato"
              className="mt-7 inline-flex items-center gap-2 text-sm text-oliva transition hover:gap-3 hover:text-bronze"
            >
              Abrir no mapa
              <span aria-hidden>→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      <CTASection mensagem="Olá! Gostaria de conhecer o espaço da Dondoka e receber um orçamento." />
    </>
  );
}
