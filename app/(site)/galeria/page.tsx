import type { Metadata } from "next";
import { HeroSite } from "@/components/site/HeroSite";
import { CTASection } from "@/components/site/CTASection";
import { GaleriaGrid } from "@/components/site/GaleriaGrid";
import { VideoTour, VideoLoop } from "@/components/site/VideoTour";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { FOTOS, GALERIA_COMPLETA, VIDEOS } from "@/content/espaco";
import { urlAbsoluta } from "@/lib/site-config";
import { JsonLd, schemaBreadcrumb, schemaVideo } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Fotos e vídeo do espaço | Dondoka Recepções",
  description:
    "Galeria da Dondoka Recepções: fotos do salão, do mezanino, da cozinha equipada, do espaço kids e da fachada, além do vídeo de um evento real realizado no espaço.",
  alternates: { canonical: urlAbsoluta("/galeria") },
};

export default function GaleriaPage() {
  return (
    <>
      <JsonLd
        data={[
          schemaBreadcrumb([
            { nome: "Início", href: "/" },
            { nome: "Galeria", href: "/galeria" },
          ]),
          schemaVideo({
            nome: "Um dia de evento na Dondoka Recepções",
            descricao: "Da fachada ao salão montado, num casamento civil realizado no espaço.",
            src: VIDEOS.tour.src,
            poster: VIDEOS.tour.poster,
            publicadoEm: "2026-07-23",
          }),
          schemaVideo({
            nome: "Um evento completo na Dondoka Recepções",
            descricao: "Casamento civil realizado no espaço, do início ao fim.",
            src: VIDEOS.evento.src,
            poster: VIDEOS.evento.poster,
            publicadoEm: "2026-07-23",
          }),
        ]}
      />

      <HeroSite
        eyebrow="Galeria"
        titulo="Conheça o"
        destaque="espaço"
        subtitulo="Fotos do salão, do mezanino, da cozinha, do espaço kids e da fachada, mais o vídeo de um casamento civil que aconteceu aqui."
        foto={FOTOS.fachadaNoite}
        fotoAlt="Fachada iluminada da Dondoka Recepções à noite"
        ctaSecundario={{ href: "/contato", label: "Agendar uma visita" }}
      />

      {/* Vídeos */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionTitle
            eyebrow="Em vídeo"
            title="O espaço em movimento"
            subtitle="Dois cortes de um mesmo evento realizado na casa, e um recorte só da decoração."
          />

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            <Reveal>
              <VideoTour {...VIDEOS.tour} />
              <p className="mt-4 text-center text-sm text-carvao/60">Da fachada ao salão montado</p>
            </Reveal>
            <Reveal delay={0.08}>
              <VideoTour {...VIDEOS.evento} />
              <p className="mt-4 text-center text-sm text-carvao/60">O evento completo</p>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="mx-auto w-full max-w-[380px]">
                <VideoLoop {...VIDEOS.decorLoop} />
              </div>
              <p className="mt-4 text-center text-sm text-carvao/60">Detalhes da decoração</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Fotos */}
      <section className="bg-areia/25 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionTitle eyebrow="Fotos" title="Cada canto da casa" />
          <div className="mt-14">
            <GaleriaGrid fotos={GALERIA_COMPLETA} />
          </div>
          <Reveal>
            <p className="mt-10 text-center text-sm text-carvao/55">
              Todas as fotos são do espaço real, sem montagem. Clique para ampliar.
            </p>
          </Reveal>
        </div>
      </section>

      <CTASection
        titulo="Quer ver pessoalmente?"
        texto="Foto e vídeo ajudam, mas nada substitui pisar no espaço. Marque uma visita. A gente mostra a casa sem compromisso."
        mensagem="Olá! Gostaria de agendar uma visita ao espaço da Dondoka."
      />
    </>
  );
}
