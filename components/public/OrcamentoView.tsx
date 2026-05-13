"use client";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { Hero } from "./Hero";
import { SobreEspaco } from "./SobreEspaco";
import { Galeria } from "./Galeria";
import { Decoracao } from "./Decoracao";
import { Buffet } from "./Buffet";
import { ServicosOpcionais } from "./ServicosOpcionais";
import { DadosEvento } from "./DadosEvento";
import { Investimento } from "./Investimento";
import { Pagamento } from "./Pagamento";
import { Contato } from "./Contato";
import { FloatingActions } from "./FloatingActions";
import { BUFFET_FALLBACK, SERVICOS_FALLBACK, type ConfigGlobal, type Orcamento } from "@/types/orcamento";

type Props = { orcamento: Orcamento; config: ConfigGlobal };

export function OrcamentoView({ orcamento, config }: Props) {
  const s = orcamento.secoes_visiveis;
  const sobreTexto = orcamento.sobre_texto ?? config.sobre_texto;
  const decoracaoTexto = orcamento.decoracao_texto ?? config.decoracao_texto;
  const condicoesPagamento = orcamento.condicoes_pagamento ?? config.condicoes_pagamento;
  const fotos = orcamento.fotos_selecionadas?.length
    ? orcamento.fotos_selecionadas
    : config.fotos_default || [];

  const buffetDados = orcamento.buffet_dados ?? config.buffet_dados ?? BUFFET_FALLBACK;
  const servicosDados = orcamento.servicos_opcionais_dados ?? config.servicos_opcionais_dados ?? SERVICOS_FALLBACK;

  const mensagemWpp = `Olá! Acabei de ver a proposta da Dondoka Recepções e gostaria de conversar. (Proposta: ${process.env.NEXT_PUBLIC_APP_URL}/orcamento/${orcamento.slug})`;

  return (
    <main className="bg-creme overflow-x-hidden">
      <ScrollProgress />
      <Hero orcamento={orcamento} />
      {s.sobre && <SobreEspaco texto={sobreTexto} />}
      {s.galeria && <Galeria fotos={fotos} />}
      {s.decoracao && <Decoracao texto={decoracaoTexto} itens={orcamento.itens_decoracao} />}
      {s.buffet && <Buffet dados={buffetDados} />}
      {s.servicos && <ServicosOpcionais dados={servicosDados} />}
      {s.dados && <DadosEvento orcamento={orcamento} />}
      {s.investimento && (
        <Investimento
          espaco={orcamento.itens_espaco}
          decoracao={orcamento.itens_decoracao}
          buffet={orcamento.itens_buffet}
        />
      )}
      {s.pagamento && <Pagamento texto={condicoesPagamento} />}
      {s.contato && <Contato config={config} />}
      <FloatingActions whatsapp={config.contato_whatsapp} mensagem={mensagemWpp} />
    </main>
  );
}
