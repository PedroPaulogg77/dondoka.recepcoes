"use client";
import { useState } from "react";
import { cn } from "@/lib/format";

export type Pergunta = { pergunta: string; resposta: string };

/**
 * Acordeão de perguntas frequentes.
 *
 * DETALHE QUE NÃO PODE SER PERDIDO NUMA REFATORAÇÃO: as respostas ficam SEMPRE
 * montadas no DOM. Fecham por altura, nunca por desmontagem condicional.
 *
 * O motivo é de SEO, não de estética. Com `{aberta && <resposta/>}` dentro de
 * um AnimatePresence, só a resposta aberta chega ao HTML servido — as outras
 * nascem no clique, no navegador. Isso quebra duas coisas de uma vez: o
 * FAQPage schema passa a declarar conteúdo que não está na página (o Google
 * exige que esteja), e crawlers que não executam JavaScript não enxergam
 * resposta nenhuma. Justamente as respostas são o que se quer indexar aqui.
 *
 * A animação é CSS puro, via `grid-template-rows` de `0fr` para `1fr`. O truque
 * depende do filho ter `overflow: hidden` — é isso que permite à faixa encolher
 * abaixo do min-content. Escolhido em vez de animar `height: "auto"` com
 * framer-motion por ser mais simples e não precisar de JS para animar; ambos
 * funcionam, este só tem menos peças móveis.
 *
 * Colapsado recebe `aria-hidden` para o leitor de tela não anunciar texto que
 * está visualmente escondido.
 */
export function FAQAccordion({ itens }: { itens: readonly Pergunta[] }) {
  const [aberta, setAberta] = useState<number | null>(0);

  return (
    <div className="divide-y divide-areia/70 border-y border-areia/70">
      {itens.map((item, i) => {
        const estaAberta = aberta === i;
        return (
          <div key={item.pergunta}>
            <h3>
              <button
                type="button"
                onClick={() => setAberta(estaAberta ? null : i)}
                aria-expanded={estaAberta}
                className="flex w-full items-start justify-between gap-4 py-5 text-left transition hover:text-oliva"
              >
                <span className="font-serif text-lg text-carvao md:text-xl">{item.pergunta}</span>
                <span
                  className={cn(
                    "mt-1 shrink-0 text-bronze transition-transform duration-300",
                    estaAberta && "rotate-45"
                  )}
                  aria-hidden
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="h-5 w-5">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </button>
            </h3>

            <div
              className={cn(
                "grid transition-all duration-300 ease-out motion-reduce:transition-none",
                estaAberta ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
              aria-hidden={!estaAberta}
            >
              {/* O filho com overflow-hidden é o que permite ao grid animar a
                  altura: a linha vai de 0fr a 1fr e este contêiner acompanha. */}
              <div className="overflow-hidden">
                <p className="whitespace-pre-line pb-6 pr-10 leading-relaxed text-carvao/75">
                  {item.resposta}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
