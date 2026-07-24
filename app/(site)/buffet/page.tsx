import type { Metadata } from "next";
import { Foto } from "@/components/site/Foto";
import Link from "next/link";
import { HeroSite } from "@/components/site/HeroSite";
import { CTASection } from "@/components/site/CTASection";
import { FAQAccordion } from "@/components/site/FAQAccordion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { IconChefHat, IconTrayBell, IconWineGlass } from "@/components/ui/Icons";
import { BUFFET_FALLBACK, SERVICOS_FALLBACK } from "@/types/orcamento";
import { FOTOS } from "@/content/espaco";
import { urlAbsoluta } from "@/lib/site-config";
import { JsonLd, schemaBreadcrumb, schemaFAQ } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Buffet e cardápio: feijoada e feijão tropeiro | Dondoka Recepções",
  description:
    "Buffet mineiro próprio da Dondoka Recepções em BH: cantinho mineiro de entrada, feijoada completa ou feijão tropeiro com lombo, bebidas e equipe de cozinha e copa inclusas.",
  alternates: { canonical: urlAbsoluta("/buffet") },
};

/**
 * O cardápio vem de `BUFFET_FALLBACK`, o mesmo objeto que alimenta as propostas
 * enviadas aos clientes. Uma fonte só: se o cardápio mudar lá, muda aqui.
 */
const { entrada, principal, bebidas, servico } = BUFFET_FALLBACK;

const FAQ_BUFFET = [
  {
    pergunta: "O buffet é obrigatório?",
    resposta:
      "Não. O buffet próprio pode ser contratado junto com o espaço, mas você também pode trazer buffet de fora ou fazer a comida no local. A cozinha industrial equipada atende as duas situações.",
  },
  {
    pergunta: "O que está incluso no buffet?",
    resposta:
      "Cantinho mineiro de entrada, o prato principal escolhido com os acompanhamentos, bebidas (refrigerante, suco e água) e equipe completa de cozinha e copa durante todo o evento, com louças, talheres, copos e guardanapos.",
  },
  {
    pergunta: "Dá para escolher entre feijoada e feijão tropeiro?",
    resposta:
      "Sim, o prato principal é uma escolha entre feijoada completa (com arroz, couve, laranja e farofa) ou feijão tropeiro com lombo assado (com arroz e couve). A definição acontece no fechamento do orçamento.",
  },
  {
    pergunta: "E bebida alcoólica?",
    resposta:
      "As bebidas inclusas são refrigerante, suco e água. Cerveja e destilados ficam por sua conta ou entram como item à parte no orçamento. É só combinar antes.",
  },
  {
    pergunta: "Posso levar o bolo e os doces?",
    resposta:
      "Pode, e é o mais comum. A cozinha e as bancadas em inox dão apoio para montar a mesa de doces no dia.",
  },
];

export default function BuffetPage() {
  return (
    <>
      <JsonLd
        data={[
          schemaFAQ(FAQ_BUFFET),
          schemaBreadcrumb([
            { nome: "Início", href: "/" },
            { nome: "Buffet", href: "/buffet" },
          ]),
        ]}
      />

      <HeroSite
        eyebrow="Buffet"
        titulo="Comida mineira,"
        destaque="feita aqui"
        subtitulo="Cantinho mineiro de entrada, feijoada completa ou feijão tropeiro com lombo no prato principal, bebidas e equipe de cozinha e copa durante todo o evento."
        foto={FOTOS.cozinha}
        fotoAlt="Cozinha industrial da Dondoka Recepções com fogão de 6 bocas e bancadas em inox"
        ctaSecundario={{ href: "/o-espaco", label: "Ver a estrutura" }}
        mensagemWhatsapp="Olá! Gostaria de saber mais sobre o buffet da Dondoka."
      />

      {/* Cardápio */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          <SectionTitle
            eyebrow="Cardápio"
            title="O que vai à mesa"
            subtitle="O mesmo cardápio que sai na proposta, sem letra miúda."
          />

          <div className="mt-14 space-y-8">
            {/* Entrada */}
            <Reveal>
              <div className="rounded-2xl border border-areia/60 bg-white p-7 shadow-soft md:p-9">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-areia/40 text-oliva">
                    <IconTrayBell className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="eyebrow">Entrada</p>
                    <h3 className="mt-0.5 text-xl">{entrada.titulo}</h3>
                  </div>
                </div>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {entrada.itens.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-areia/70 bg-creme px-4 py-1.5 text-sm text-carvao/75"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* Prato principal */}
            <Reveal delay={0.08}>
              <div className="rounded-2xl border border-areia/60 bg-white p-7 shadow-soft md:p-9">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-areia/40 text-oliva">
                    <IconChefHat className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="eyebrow">Prato principal</p>
                    <h3 className="mt-0.5 text-xl">Escolha uma opção</h3>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {principal.opcoes.map((opcao) => (
                    <div key={opcao.titulo} className="rounded-xl bg-areia/25 p-5">
                      <h4 className="font-serif text-lg text-oliva">{opcao.titulo}</h4>
                      <p className="mt-2 text-sm text-carvao/70">
                        Acompanha: {opcao.itens.join(", ").toLowerCase()}.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Bebidas + serviço */}
            <Reveal delay={0.16}>
              <div className="rounded-2xl border border-areia/60 bg-white p-7 shadow-soft md:p-9">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-areia/40 text-oliva">
                    <IconWineGlass className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="eyebrow">Bebidas e serviço</p>
                    <h3 className="mt-0.5 text-xl">Inclusos no buffet</h3>
                  </div>
                </div>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {bebidas.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-areia/70 bg-creme px-4 py-1.5 text-sm text-carvao/75"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-carvao/75">{servico}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Buffet de fora */}
      <section className="bg-areia/25 px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <p className="eyebrow">Sem amarra</p>
            <h2 className="mt-3 text-3xl leading-tight md:text-4xl">
              <span className="font-light italic text-bronze">Prefere</span> outro buffet?
            </h2>
            <p className="mt-5 text-carvao/75">
              Sem problema, e sem taxa de rolha escondida. Muita gente já tem uma cozinheira de confiança ou
              um buffet de família, e faz todo sentido manter.
            </p>
            <p className="mt-4 text-carvao/75">
              A cozinha é industrial e está pronta para receber equipe de fora: fogão de 6 bocas com forno,
              freezer, cuba e bancadas em inox, além da janela de passagem direta para o salão.
            </p>
            <Link
              href="/o-espaco"
              className="mt-7 inline-flex items-center gap-2 text-sm text-oliva transition hover:gap-3 hover:text-bronze"
            >
              Ver a cozinha por dentro
              <span aria-hidden>→</span>
            </Link>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-premium">
              <Foto
                src={FOTOS.cozinhaApoio}
                alt="Área de apoio da cozinha da Dondoka Recepções, com cuba e bancada em inox"
                fill
                sizes="(max-width: 768px) 90vw, 45vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Serviços opcionais */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          <SectionTitle eyebrow="Serviços opcionais" title="Para completar o evento" />
          <Reveal delay={0.1}>
            <p className="mx-auto mt-8 max-w-2xl text-center text-carvao/75">{SERVICOS_FALLBACK.intro}</p>
            <ul className="mt-10 flex flex-wrap justify-center gap-2.5">
              {SERVICOS_FALLBACK.lista.map((servicoNome) => (
                <li
                  key={servicoNome}
                  className="rounded-full border border-areia/70 bg-white px-5 py-2 text-sm text-carvao/75 shadow-soft"
                >
                  {servicoNome}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-center text-sm text-carvao/55">{SERVICOS_FALLBACK.disclaimer}</p>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-areia/25 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl">
          <SectionTitle eyebrow="Dúvidas" title="Sobre o buffet" />
          <div className="mt-12">
            <FAQAccordion itens={FAQ_BUFFET} />
          </div>
        </div>
      </section>

      <CTASection
        titulo="Quer o cardápio no seu orçamento?"
        texto="Conte a data, o tipo de evento e quantas pessoas. A gente devolve o valor com buffet incluso e sem buffet, para você comparar."
        mensagem="Olá! Gostaria de um orçamento com o buffet da Dondoka."
      />
    </>
  );
}
