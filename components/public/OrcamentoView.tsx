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
import { SectionChip } from "@/components/admin/SectionChip";
import { temFaixasAtivas } from "@/lib/orcamento-helpers";
import {
  BUFFET_FALLBACK,
  PRECOS_ESPACO_FALLBACK,
  SERVICOS_FALLBACK,
  type ConfigGlobal,
  type Orcamento,
  type SecoesVisiveis,
} from "@/types/orcamento";

export type EditorMode = {
  secoesVisiveis: SecoesVisiveis;
  onToggleSecao: (key: keyof SecoesVisiveis) => void;
  onEditSection: (key: SectionEditableKey) => void;
};

export type SectionEditableKey =
  | "cliente"
  | "sobre"
  | "galeria"
  | "decoracao"
  | "buffet"
  | "servicos"
  | "dados"
  | "investimento"
  | "pagamento"
  | "contato";

type Props = {
  orcamento: Orcamento;
  config: ConfigGlobal;
  editorMode?: EditorMode;
};

export function OrcamentoView({ orcamento, config, editorMode }: Props) {
  const s = orcamento.secoes_visiveis;
  const sobreTexto = orcamento.sobre_texto ?? config.sobre_texto;
  const decoracaoTexto = orcamento.decoracao_texto ?? config.decoracao_texto;
  const condicoesPagamento = orcamento.condicoes_pagamento ?? config.condicoes_pagamento;
  const fotos = orcamento.fotos_selecionadas?.length
    ? orcamento.fotos_selecionadas
    : config.fotos_default || [];

  const buffetDados = orcamento.buffet_dados ?? config.buffet_dados ?? BUFFET_FALLBACK;
  const servicosDados = orcamento.servicos_opcionais_dados ?? config.servicos_opcionais_dados ?? SERVICOS_FALLBACK;
  const precosEspaco =
    orcamento.precos_espaco_por_dia ?? config.precos_espaco_por_dia ?? PRECOS_ESPACO_FALLBACK;

  // Mesma condição do early return do Investimento.
  const investimentoVazio =
    !orcamento.itens_espaco.length &&
    !orcamento.itens_decoracao.length &&
    !orcamento.itens_buffet.length &&
    !temFaixasAtivas(precosEspaco);

  const mensagemWpp = `Olá! Acabei de ver a proposta da Dondoka Recepções e gostaria de conversar. (Proposta: ${process.env.NEXT_PUBLIC_APP_URL}/orcamento/${orcamento.slug})`;

  const isEditor = !!editorMode;

  return (
    <main className="bg-creme overflow-x-hidden">
      {!isEditor && <ScrollProgress />}

      {/* Hero — sempre visível (não tem toggle) */}
      <EditableWrap
        editor={editorMode}
        sectionKey="cliente"
        toggleKey={null}
        label="Capa / Cliente"
      >
        <Hero orcamento={orcamento} />
      </EditableWrap>

      <EditableWrap editor={editorMode} sectionKey="sobre" toggleKey="sobre" label="Sobre o espaço" visivel={s.sobre} vazio={!sobreTexto}>
        {(visivel) => visivel && <SobreEspaco texto={sobreTexto} />}
      </EditableWrap>

      <EditableWrap editor={editorMode} sectionKey="galeria" toggleKey="galeria" label="Galeria" visivel={s.galeria} vazio={!fotos.length}>
        {(visivel) => visivel && <Galeria fotos={fotos} />}
      </EditableWrap>

      <EditableWrap editor={editorMode} sectionKey="decoracao" toggleKey="decoracao" label="Decoração" visivel={s.decoracao} vazio={!decoracaoTexto && !orcamento.itens_decoracao.length}>
        {(visivel) => visivel && <Decoracao texto={decoracaoTexto} itens={orcamento.itens_decoracao} />}
      </EditableWrap>

      <EditableWrap editor={editorMode} sectionKey="buffet" toggleKey="buffet" label="Buffet" visivel={s.buffet}>
        {(visivel) => visivel && <Buffet dados={buffetDados} />}
      </EditableWrap>

      <EditableWrap editor={editorMode} sectionKey="servicos" toggleKey="servicos" label="Serviços opcionais" visivel={s.servicos}>
        {(visivel) => visivel && <ServicosOpcionais dados={servicosDados} />}
      </EditableWrap>

      <EditableWrap editor={editorMode} sectionKey="dados" toggleKey="dados" label="Dados do evento" visivel={s.dados}>
        {(visivel) => visivel && <DadosEvento orcamento={orcamento} />}
      </EditableWrap>

      <EditableWrap editor={editorMode} sectionKey="investimento" toggleKey="investimento" label="Resumo da proposta" visivel={s.investimento} vazio={investimentoVazio}>
        {(visivel) =>
          visivel && (
            <Investimento
              espaco={orcamento.itens_espaco}
              decoracao={orcamento.itens_decoracao}
              buffet={orcamento.itens_buffet}
              precosEspaco={precosEspaco}
              clienteData={orcamento.cliente_data}
            />
          )
        }
      </EditableWrap>

      <EditableWrap editor={editorMode} sectionKey="pagamento" toggleKey="pagamento" label="Forma de pagamento" visivel={s.pagamento} vazio={!condicoesPagamento}>
        {(visivel) => visivel && <Pagamento texto={condicoesPagamento} />}
      </EditableWrap>

      <EditableWrap editor={editorMode} sectionKey="contato" toggleKey="contato" label="Contato" visivel={s.contato}>
        {(visivel) => visivel && <Contato config={config} />}
      </EditableWrap>

      {!isEditor && <FloatingActions whatsapp={config.contato_whatsapp} mensagem={mensagemWpp} />}
    </main>
  );
}

// ===== Wrapper que sobrepõe chip de toggle + botão editar =====
// Sem editorMode: renderiza children direto (modo público).
// Com editorMode: sempre renderiza, mas se a seção está oculta, mostra
// overlay esmaecido com aviso. Mostra também os chips no topo.

type WrapProps = {
  editor: EditorMode | undefined;
  sectionKey: SectionEditableKey;
  toggleKey: keyof SecoesVisiveis | null;
  label: string;
  visivel?: boolean;
  /**
   * Marca que a seção não tem conteúdo para mostrar.
   *
   * Precisa vir de fora porque daqui não dá para saber: `children` devolve um
   * elemento React, que é sempre "verdadeiro", mesmo quando o componente lá
   * dentro renderiza `null`. Sem essa informação, a seção colapsava para altura
   * zero e o chip flutuava por cima da seção seguinte. Era por isso que o
   * Resumo da proposta parecia não existir no modo visual, e o João tinha que
   * entrar no modo formulário só para digitar o primeiro valor.
   */
  vazio?: boolean;
  children: React.ReactNode | ((visivel: boolean) => React.ReactNode);
};

function EditableWrap({
  editor,
  sectionKey,
  toggleKey,
  label,
  visivel = true,
  vazio = false,
  children,
}: WrapProps) {
  // Sem editor: rota pública — render normal
  if (!editor) {
    if (typeof children === "function") return <>{children(visivel)}</>;
    return <>{children}</>;
  }

  // Com editor: sempre renderiza a seção, mesmo se oculta (preview esmaecida)
  const childContent = typeof children === "function" ? children(true) : children;

  const vazia = vazio || !childContent;
  const isHidden = toggleKey !== null && !visivel;

  if (vazia) {
    return (
      <div className="relative">
        <SectionChip
          label={label}
          visivel={!isHidden}
          onToggle={toggleKey ? () => editor.onToggleSecao(toggleKey) : undefined}
          onEdit={() => editor.onEditSection(sectionKey)}
        />
        <button
          type="button"
          onClick={() => editor.onEditSection(sectionKey)}
          className="w-full py-20 px-6 border-y border-dashed border-areia text-center transition hover:bg-areia/15"
        >
          <span className="block font-serif text-lg text-carvao/50">{label}</span>
          <span className="mt-1 block text-sm text-carvao/40">
            Vazia por enquanto. Toque para preencher.
          </span>
          <span className="mt-1 block text-xs text-carvao/35">
            Enquanto estiver assim, o cliente não vê esta seção.
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className={`relative ${isHidden ? "select-none" : ""}`}>
      <SectionChip
        label={label}
        visivel={!isHidden}
        onToggle={toggleKey ? () => editor.onToggleSecao(toggleKey) : undefined}
        onEdit={() => editor.onEditSection(sectionKey)}
      />

      {/* Conteudo com opacity/grayscale quando oculto */}
      <div
        className={
          isHidden
            ? "opacity-30 grayscale pointer-events-none transition"
            : editor && !isHidden
              ? "transition hover:ring-2 hover:ring-oliva/20 hover:ring-dashed cursor-pointer rounded-lg"
              : "transition"
        }
        aria-hidden={isHidden}
        onClick={editor && !isHidden ? () => editor.onEditSection(sectionKey) : undefined}
      >
        {childContent}
      </div>

      {isHidden && (
        <div className="absolute inset-x-0 top-16 z-20 flex justify-center pointer-events-none">
          <div className="px-4 py-2 rounded-full bg-carvao/80 text-white text-xs backdrop-blur shadow-soft">
            Esta seção está oculta — o cliente não verá
          </div>
        </div>
      )}
    </div>
  );
}
