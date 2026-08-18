import type { Metadata } from "next";
import Link from "next/link";
import { Foto } from "@/components/site/Foto";
import { HeroSite } from "@/components/site/HeroSite";
import { CTASection } from "@/components/site/CTASection";
import { FAQAccordion } from "@/components/site/FAQAccordion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { IconChefHat, IconSparkle, IconStar } from "@/components/ui/Icons";
import { FOTOS } from "@/content/espaco";
import { urlAbsoluta } from "@/lib/site-config";
import { JsonLd, schemaBreadcrumb, schemaFAQ } from "@/lib/schema";

/**
 * Buffet e decoração.
 *
 * A rota continua sendo /buffet de propósito: é o termo que as pessoas
 * digitam ("espaço para eventos com buffet em BH"), e a URL já está indexada.
 * O que mudou foi o conteúdo.
 *
 * ATENÇÃO AO REESCREVER: a Dondoka NÃO tem buffet próprio e NÃO executa
 * decoração. Trabalha com parceiros. A cozinha equipada é estrutura física da
 * casa, isso sim é verdade e é diferencial — o que não pode é sugerir que a
 * comida sai daqui.
 */
export const metadata: Metadata = {
  title: "Buffet e decoração: parceiros de confiança | Dondoka Recepções",
  description:
    "A Dondoka indica parceiros de confiança para buffet e decoração, conforme o perfil do seu evento. Você também pode trazer seus fornecedores: a cozinha equipada fica à disposição.",
  alternates: { canonical: urlAbsoluta("/buffet") },
};

const FAQ_PARCEIROS = [
  {
    pergunta: "A Dondoka tem buffet próprio?",
    resposta:
      "Não. A Dondoka é o espaço. Para buffet e decoração, indicamos parceiros de confiança conforme o perfil e as necessidades do seu evento.",
  },
  {
    pergunta: "Sou obrigado a usar os parceiros indicados?",
    resposta:
      "Não. A indicação existe para facilitar a sua vida, principalmente para quem está organizando um evento pela primeira vez. Se você já tem fornecedores de confiança, pode trazer sem taxa nenhuma.",
  },
  {
    pergunta: "A cozinha fica disponível para o buffet que eu contratar?",
    resposta:
      "Fica. É cozinha industrial: fogão de 4 bocas com forno, freezer, cuba e bancadas em inox. A equipe que você contratar encontra tudo o que precisa, sem improviso e sem aluguel de estrutura extra.",
  },
  {
    pergunta: "Como faço para conhecer os parceiros?",
    resposta:
      "Chame no WhatsApp e conte o tipo de evento, a data e quantas pessoas você espera. A gente indica os parceiros que combinam com o seu perfil e você negocia direto com eles.",
  },
  {
    pergunta: "Posso levar o bolo e os doces?",
    resposta:
      "Pode, e é o mais comum. Muita gente já tem confeiteira de confiança. As bancadas em inox dão apoio para montar a mesa no dia.",
  },
];

const COMO_FUNCIONA = [
  {
    icone: IconChefHat,
    titulo: "Buffet",
    texto:
      "Indicamos parceiros que já trabalharam no espaço e conhecem a cozinha. Você negocia direto com eles, com liberdade para escolher cardápio e formato.",
  },
  {
    icone: IconSparkle,
    titulo: "Decoração",
    texto:
      "Mesma lógica: parceiros que conhecem as medidas do salão, o pé-direito e a luz do lugar. Isso encurta muita conversa na hora de montar.",
  },
  {
    icone: IconStar,
    titulo: "Seus próprios fornecedores",
    texto:
      "Se você já tem quem faça a comida ou a decoração, traga. Não cobramos taxa para fornecedor de fora, e a estrutura da casa fica à disposição.",
  },
];

export default function BuffetPage() {
  return (
    <>
      <JsonLd
        data={[
          schemaFAQ(FAQ_PARCEIROS),
          schemaBreadcrumb([
            { nome: "Início", href: "/" },
            { nome: "Buffet e decoração", href: "/buffet" },
          ]),
        ]}
      />

      <HeroSite
        eyebrow="Buffet e decoração"
        titulo="Tudo para o"
        destaque="seu evento"
        subtitulo="Contamos com parceiros de confiança para buffet e decoração, indicados de acordo com o perfil e as necessidades do seu evento."
        foto={FOTOS.eventoDoces}
        fotoAlt="Mesa de doces montada em um evento realizado na Dondoka Recepções"
        ctaSecundario={{ href: "/eventos", label: "Ver tipos de evento" }}
        mensagemWhatsapp="Olá! Gostaria de saber sobre os parceiros de buffet e decoração da Dondoka."
      />

      {/* Como funciona */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <SectionTitle
            eyebrow="Como funciona"
            title="Você escolhe como quer fazer"
            subtitle="A Dondoka é o espaço. O que vai na mesa e na parede fica com quem você contratar."
          />

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {COMO_FUNCIONA.map((item, i) => {
              const Icone = item.icone;
              return (
                <Reveal key={item.titulo} delay={i * 0.08}>
                  <div className="h-full rounded-2xl border border-areia/60 bg-white p-7 shadow-soft">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-areia/40 text-oliva">
                      <Icone className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 text-xl">{item.titulo}</h3>
                    <p className="mt-2 text-sm text-carvao/70">{item.texto}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* A cozinha: o diferencial que é de verdade da casa */}
      <section className="bg-areia/25 px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-premium">
              <Foto
                src={FOTOS.cozinha}
                alt="Cozinha industrial da Dondoka Recepções, com fogão de 4 bocas com forno, bancadas em inox e freezer"
                fill
                sizes="(max-width: 768px) 90vw, 45vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="eyebrow">A estrutura é nossa</p>
            <h2 className="mt-3 text-3xl leading-tight md:text-4xl">
              <span className="font-light italic text-bronze">Cozinha</span> industrial equipada
            </h2>
            <p className="mt-5 text-carvao/75">
              Fogão de 4 bocas com forno, freezer, cuba e bancadas em inox.
            </p>
            <p className="mt-4 text-carvao/75">
              Isso muda a vida de quem vai servir. A equipe do buffet chega e encontra tudo pronto, sem
              precisar alugar estrutura por fora nem improvisar no dia.
            </p>
            <Link
              href="/o-espaco"
              className="mt-7 inline-flex items-center gap-2 text-sm text-oliva transition hover:gap-3 hover:text-bronze"
            >
              Ver a estrutura completa
              <span aria-hidden>→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl">
          <SectionTitle eyebrow="Dúvidas" title="Sobre os parceiros" />
          <div className="mt-12">
            <FAQAccordion itens={FAQ_PARCEIROS} />
          </div>
        </div>
      </section>

      <CTASection
        titulo="Quer conhecer os parceiros?"
        texto="Conte a data, o tipo de evento e quantas pessoas você espera. A gente indica quem combina com o seu perfil."
        mensagem="Olá! Gostaria de saber sobre os parceiros de buffet e decoração da Dondoka."
      />
    </>
  );
}
