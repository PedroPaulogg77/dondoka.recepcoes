"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

/* ─── tipos ─────────────────────────────────────────────────── */
type Item = { titulo: string; descricao: string; dica?: string };
type Secao = { id: string; label: string; icon: React.ReactNode; itens: Item[] };

/* ─── ícones inline simples ──────────────────────────────────── */
function IconCog() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5 shrink-0">
      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}
function IconEdit() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5 shrink-0">
      <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  );
}
function IconShare() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5 shrink-0">
      <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}
function IconList() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5 shrink-0">
      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}
function IconQuestion() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5 shrink-0">
      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

/* ─── conteúdo do guia ───────────────────────────────────────── */
const SECOES: Secao[] = [
  {
    id: "configurar",
    label: "Configuração inicial",
    icon: <IconCog />,
    itens: [
      {
        titulo: "Configure o espaço antes de tudo",
        descricao:
          "Vá em Configurações (menu no topo) e preencha: WhatsApp, telefone, endereço, Instagram, e-mail, fotos padrão do salão, texto de apresentação e cardápio do buffet. Esses dados entram automaticamente em toda proposta nova — você só configura uma vez.",
        dica: "Acesse: painel → Configurações",
      },
      {
        titulo: "Fotos do espaço",
        descricao:
          "Em Configurações, role até \"Fotos padrão\" e selecione as fotos que melhor apresentam o salão. Essas são as fotos que aparecem em todas as propostas por padrão. Em cada proposta individual você pode trocar ou remover fotos sem afetar o padrão.",
      },
      {
        titulo: "Cardápio do buffet",
        descricao:
          "Preencha o cardápio padrão em Configurações → Buffet. Você pode editar entrada, prato principal (com opções), bebidas e descrição do serviço. Cada proposta herda esse cardápio e pode ser personalizado para o cliente específico.",
      },
      {
        titulo: "Serviços opcionais",
        descricao:
          "A lista de extras (segurança, garçons, cerimonialista etc.) também fica em Configurações. Cada item recebe um ícone automático baseado no nome. Se adicionar um serviço novo, o sistema escolhe o ícone mais adequado.",
      },
      {
        titulo: "Textos padrão",
        descricao:
          "Escreva o texto \"Sobre o espaço\" e as \"Condições de pagamento\" uma vez em Configurações. Eles aparecem em todas as propostas. Em cada proposta você pode personalizar sem alterar o padrão global.",
        dica: "Pagamento: escreva em 2 parágrafos separados por linha em branco — cada um vira um card diferente na proposta.",
      },
    ],
  },
  {
    id: "editor",
    label: "Criar e editar propostas",
    icon: <IconEdit />,
    itens: [
      {
        titulo: "Criar uma nova proposta",
        descricao:
          "Toque em \"+ Novo orçamento\" no painel. Você verá a proposta ao vivo, exatamente como o cliente vai ver. Ela começa com os dados padrão do espaço — você personaliza para o cliente.",
      },
      {
        titulo: "Editar qualquer seção",
        descricao:
          "Toque em qualquer parte da proposta para editar aquela seção. Uma gaveta (drawer) sobe da parte de baixo da tela com os campos certos. Ao fechar a gaveta, a alteração aparece na prévia imediatamente.",
        dica: "Também funciona pelo botão de lápis ✏️ no canto superior direito de cada seção.",
      },
      {
        titulo: "Ligar e desligar seções",
        descricao:
          "Cada seção tem um botão com ícone de olho 👁 no canto superior esquerdo. Toque para ocultar seções que não se aplicam ao evento — por exemplo, se o cliente não vai usar buffet, desligue essa seção. O cliente não verá o que estiver desligado.",
        dica: "A seção fica esmaecida na prévia para você, mas sumida para o cliente.",
      },
      {
        titulo: "Desfazer uma alteração",
        descricao:
          "Abriu a gaveta e mudou algo mas se arrependeu? Toque em \"Desfazer\" no rodapé da gaveta. Isso restaura exatamente como estava antes de você abrir aquela gaveta.",
      },
      {
        titulo: "Dados do cliente",
        descricao:
          "Toque na seção de Capa ou nos Dados do evento para preencher: nome, tipo de evento (casamento, aniversário…), data, horário e número de convidados. O nome do cliente aparece no título da proposta.",
      },
      {
        titulo: "Valores e investimento",
        descricao:
          "Toque na seção \"Resumo da proposta\" (Investimento) para adicionar itens com quantidade e valor unitário, separados por Espaço, Decoração e Buffet. O total é calculado automaticamente e exibido com animação para o cliente.",
      },
      {
        titulo: "Contatos na proposta",
        descricao:
          "Toque na seção de Contato para editar diretamente WhatsApp, telefone, Instagram, e-mail e endereço. Atenção: esses dados são globais — alterar aqui atualiza em todos os orçamentos.",
      },
      {
        titulo: "Observações internas",
        descricao:
          "O ícone de documento 📄 no cabeçalho do editor abre um espaço para notas internas — anotações suas sobre o cliente, negociações, detalhes do evento. O cliente nunca vê essas observações.",
      },
      {
        titulo: "Duplicar uma proposta",
        descricao:
          "No rodapé do editor, toque em \"Duplicar orçamento\" para criar uma cópia. Ideal para propostas similares — edite apenas o que muda para o novo cliente.",
      },
    ],
  },
  {
    id: "publicar",
    label: "Publicar e compartilhar",
    icon: <IconShare />,
    itens: [
      {
        titulo: "Rascunho vs Publicado",
        descricao:
          "Enquanto a proposta não for publicada, o link existe mas o cliente vê apenas \"Proposta em preparação\" — nada do conteúdo. Somente ao tocar em \"Publicar\" a proposta fica visível. Você pode editar à vontade antes disso sem preocupação.",
        dica: "O indicador no cabeçalho mostra: \"Rascunho — não publicado\" ou \"Publicado ✓\".",
      },
      {
        titulo: "Publicar a proposta",
        descricao:
          "Quando estiver pronta, toque em \"Publicar\" no cabeçalho verde do editor. A proposta fica disponível no link exclusivo do cliente. Depois de publicada, qualquer edição salva atualiza a proposta em tempo real — o link continua o mesmo.",
      },
      {
        titulo: "Auto-save (salvo automático)",
        descricao:
          "Depois de publicada, a proposta é salva automaticamente 4 segundos após cada alteração. Você verá \"Salvando...\" e depois \"Salvo ✓\" no cabeçalho. Não precisa tocar em nenhum botão para não perder as mudanças.",
      },
      {
        titulo: "Salvar como rascunho",
        descricao:
          "Se quiser salvar sem publicar (guardar o progresso sem deixar o cliente ver), toque em \"Salvar rascunho\" — botão discreto ao lado de \"Publicar\", visível enquanto a proposta ainda não estiver publicada.",
      },
      {
        titulo: "Copiar mensagem para WhatsApp",
        descricao:
          "No rodapé do editor, toque em \"Copiar mensagem WhatsApp\". Uma mensagem pronta é copiada com o link da proposta e o nome do cliente. Cole direto na conversa do WhatsApp. O status muda automaticamente para \"Enviado\".",
        dica: "A mensagem já vem formatada: \"Olá, [Nome]! Preparei sua proposta personalizada…\"",
      },
      {
        titulo: "Copiar só o link",
        descricao:
          "Toque em \"Copiar link\" no cabeçalho do editor para copiar só o link da proposta, sem a mensagem. Útil para colar em outros canais ou salvar para si.",
      },
      {
        titulo: "Ver como o cliente vai ver",
        descricao:
          "Toque em \"Ver como cliente\" no cabeçalho para abrir o link público em uma nova aba. Você vê exatamente o que o cliente vai ver — sem os botões de edição.",
      },
      {
        titulo: "O cliente salva o PDF",
        descricao:
          "O cliente abre o link no celular ou computador e toca em \"Salvar PDF\" no canto inferior da tela. Na tela que aparecer, deve selecionar \"Salvar como PDF\" no lugar de uma impressora. O arquivo fica salvo no celular ou computador.",
        dica: "No iPhone: toque em \"Salvar PDF\" → Imprimir → aperte e segure a prévia do PDF que aparece → Compartilhar → Salvar em Arquivos.",
      },
    ],
  },
  {
    id: "gerenciar",
    label: "Gerenciar propostas",
    icon: <IconList />,
    itens: [
      {
        titulo: "Painel de orçamentos",
        descricao:
          "Na página inicial do admin você vê todas as propostas com nome do cliente, tipo de evento, data, status e valor total. Toque em qualquer uma para editar.",
      },
      {
        titulo: "Buscar e filtrar",
        descricao:
          "Use o campo de busca para encontrar pelo nome do cliente ou tipo de evento. Use as abas (Todos / Rascunho / Enviado / Aceito / Recusado) para filtrar por etapa do negócio.",
      },
      {
        titulo: "Status das propostas",
        descricao:
          "O status é uma marcação interna sua — não aparece para o cliente. Use para controlar o fluxo: Rascunho (ainda preparando) → Enviado (link já foi para o cliente) → Aceito ou Recusado. O status muda automaticamente para Enviado quando você copia o link ou a mensagem.",
      },
      {
        titulo: "Excluir uma proposta",
        descricao:
          "No rodapé do editor, toque em \"Excluir\". Isso remove permanentemente a proposta e o link deixa de funcionar. Use com cuidado — não tem como desfazer.",
      },
    ],
  },
  {
    id: "duvidas",
    label: "Dúvidas frequentes",
    icon: <IconQuestion />,
    itens: [
      {
        titulo: "Posso editar a proposta depois de enviar para o cliente?",
        descricao:
          "Sim. O link continua o mesmo e qualquer edição é salva automaticamente. Se o cliente abrir o link depois da sua edição, já verá a versão atualizada.",
      },
      {
        titulo: "O cliente pode ver a proposta antes de eu publicar?",
        descricao:
          "Não. Enquanto não estiver publicada, o cliente que acessar o link vê apenas uma tela de \"Proposta em preparação\" — sem nenhum conteúdo. Você controla quando ela fica visível.",
      },
      {
        titulo: "Como adicionar novas fotos ao acervo?",
        descricao:
          "Dentro de uma proposta, toque na seção Galeria → gaveta de fotos → botão de upload. As fotos enviadas ficam disponíveis em todos os orçamentos.",
      },
      {
        titulo: "E se eu mudar o cardápio padrão em Configurações?",
        descricao:
          "Propostas que já estão com o cardápio padrão são atualizadas. Propostas que tiveram o cardápio personalizado mantêm a versão personalizada — a mudança global não sobrescreve customizações individuais.",
      },
      {
        titulo: "Como trocar os contatos (WhatsApp, endereço)?",
        descricao:
          "Dois caminhos: (1) vá em Configurações → Contato e edite lá. Ou (2) dentro de qualquer proposta, toque na seção de Contato e edite diretamente no drawer. Os contatos são globais — mudar em um lugar muda em todos.",
      },
      {
        titulo: "Posso ter propostas para eventos diferentes com cardápios diferentes?",
        descricao:
          "Sim. Em cada proposta, toque na seção Buffet e edite o cardápio especificamente para aquele cliente. Isso não afeta o cardápio padrão nem as outras propostas.",
      },
      {
        titulo: "A proposta funciona no celular do cliente?",
        descricao:
          "Sim, a proposta é totalmente adaptada para celular. O cliente pode rolar a página, ver as fotos, e usar o botão de WhatsApp para entrar em contato diretamente com você.",
      },
      {
        titulo: "Esqueci a senha — como entro?",
        descricao:
          "Na tela de login, use a opção \"Esqueci minha senha\" para receber um link de redefinição no e-mail cadastrado.",
      },
    ],
  },
];

/* ─── componente principal ───────────────────────────────────── */
export function GuiaUso() {
  const [open, setOpen] = useState(false);
  const [secaoAberta, setSecaoAberta] = useState<string>("configurar");
  const [mounted, setMounted] = useState(false);

  // Precisa estar montado no client para usar createPortal
  useEffect(() => { setMounted(true); }, []);

  const secaoAtual = SECOES.find((s) => s.id === secaoAberta) ?? SECOES[0];

  return (
    <>
      {/* Botão no header */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full text-sm text-carvao/65 hover:bg-areia/40 hover:text-carvao transition"
        title="Como usar o sistema"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <span className="hidden sm:inline">Ajuda</span>
      </button>

      {/* Modal — renderizado no body via portal para evitar z-index/stacking context do header */}
      {mounted && createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              className="fixed inset-0 z-[9999] flex items-end md:items-center md:justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-carvao/40 backdrop-blur-[2px]"
              onClick={() => setOpen(false)}
              aria-hidden
            />

            {/* Sheet */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Guia de uso"
              className="relative w-full md:max-w-2xl md:rounded-2xl rounded-t-3xl bg-creme shadow-premium flex flex-col overflow-hidden"
              style={{ maxHeight: "92dvh" }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
            >
              {/* Pull bar */}
              <div className="pt-2.5 pb-0 md:hidden flex justify-center shrink-0">
                <span className="block w-10 h-1 rounded-full bg-areia" aria-hidden />
              </div>

              {/* Header */}
              <header className="px-5 md:px-7 pt-3 pb-3 border-b border-areia/60 flex items-center justify-between gap-4 shrink-0">
                <div>
                  <h2 className="font-serif text-xl text-carvao">Guia de uso</h2>
                  <p className="text-xs text-carvao/50 mt-0.5">Tudo que você precisa saber para criar propostas</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Fechar"
                  className="-mr-1 w-8 h-8 inline-flex items-center justify-center rounded-full text-carvao/50 hover:bg-areia/40 hover:text-carvao transition shrink-0"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </header>

              {/* Layout: tabs + conteúdo */}
              <div className="flex flex-1 min-h-0">

                {/* Sidebar de seções — horizontal em mobile, vertical em desktop */}
                <nav className="shrink-0 border-r border-areia/60 hidden md:flex flex-col py-3 w-52">
                  {SECOES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSecaoAberta(s.id)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition ${
                        secaoAberta === s.id
                          ? "bg-oliva/10 text-oliva font-medium border-r-2 border-oliva"
                          : "text-carvao/65 hover:bg-areia/30 hover:text-carvao"
                      }`}
                    >
                      {s.icon}
                      {s.label}
                    </button>
                  ))}
                </nav>

                {/* Tabs horizontais em mobile */}
                <div className="flex flex-col flex-1 min-h-0 min-w-0">
                  <div className="md:hidden flex gap-1.5 overflow-x-auto px-4 py-2.5 border-b border-areia/60 shrink-0 scrollbar-hide">
                    {SECOES.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSecaoAberta(s.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap shrink-0 transition ${
                          secaoAberta === s.id
                            ? "bg-oliva text-white"
                            : "bg-areia/40 text-carvao/65 hover:bg-areia/70"
                        }`}
                      >
                        {s.icon}
                        {s.label}
                      </button>
                    ))}
                  </div>

                  {/* Conteúdo da seção selecionada */}
                  <div className="flex-1 overflow-y-auto px-5 md:px-6 py-4 space-y-1">
                    <h3 className="font-serif text-lg text-carvao mb-4">{secaoAtual.label}</h3>
                    {secaoAtual.itens.map((item, i) => (
                      <Accordion key={i} titulo={item.titulo} descricao={item.descricao} dica={item.dica} />
                    ))}

                    {/* Link para configurações na seção de config */}
                    {secaoAtual.id === "configurar" && (
                      <div className="pt-3">
                        <Link
                          href="/admin/configuracoes"
                          onClick={() => setOpen(false)}
                          className="inline-flex items-center gap-2 text-sm text-oliva font-medium hover:text-bronze transition"
                        >
                          Ir para Configurações
                          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                            <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                          </svg>
                        </Link>
                      </div>
                    )}
                    {secaoAtual.id === "editor" && (
                      <div className="pt-3">
                        <Link
                          href="/admin/novo"
                          onClick={() => setOpen(false)}
                          className="inline-flex items-center gap-2 text-sm text-oliva font-medium hover:text-bronze transition"
                        >
                          Criar novo orçamento
                          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                            <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                          </svg>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <footer
                className="px-5 md:px-7 py-3 border-t border-areia/60 bg-creme/80 backdrop-blur flex justify-end shrink-0"
                style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center h-10 px-6 rounded-full bg-oliva text-white font-medium text-sm hover:bg-oliva/90 transition"
                >
                  Fechar
                </button>
              </footer>
            </motion.div>
          </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

/* ─── accordion de item ──────────────────────────────────────── */
function Accordion({ titulo, descricao, dica }: { titulo: string; descricao: string; dica?: string }) {
  const [aberto, setAberto] = useState(false);
  return (
    <div className="border-b border-areia/50 last:border-b-0">
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        className="w-full py-3 flex items-start justify-between gap-3 text-left hover:text-oliva transition group"
      >
        <span className="text-sm font-medium text-carvao group-hover:text-oliva leading-snug">{titulo}</span>
        <span className={`text-carvao/40 transition-transform shrink-0 mt-0.5 ${aberto ? "rotate-180" : ""}`}>
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {aberto && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-4 space-y-2">
              <p className="text-sm text-carvao/70 leading-relaxed">{descricao}</p>
              {dica && (
                <div className="flex gap-2 bg-oliva/8 rounded-xl px-3 py-2.5">
                  <span className="text-oliva text-xs mt-0.5 shrink-0">💡</span>
                  <p className="text-xs text-carvao/65 leading-relaxed">{dica}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
