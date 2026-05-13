"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const PASSOS = [
  {
    num: "1",
    titulo: "Configure o espaço",
    descricao:
      "Antes de tudo, preencha as informações globais: WhatsApp, telefone, endereço, fotos do salão, texto institucional e cardápio padrão do buffet. Esses dados entram automaticamente em todas as propostas.",
    acao: { label: "Ir para Configurações", href: "/admin/configuracoes" },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
  },
  {
    num: "2",
    titulo: "Crie uma proposta",
    descricao:
      'Clique em "+ Novo orçamento". Você verá a proposta ao vivo como o cliente verá. Cada seção tem um lápis ✏️ no canto — toque nele para editar aquela parte.',
    acao: { label: "Criar agora", href: "/admin/novo" },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
  },
  {
    num: "3",
    titulo: "Personalize para o cliente",
    descricao:
      "Toque em qualquer seção da proposta para editar: nome do cliente, data do evento, fotos, decoração, cardápio, valores e condições de pagamento. Cada alteração aparece ao vivo na prévia.",
    acao: null,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
      </svg>
    ),
  },
  {
    num: "4",
    titulo: "Ligue e desligue seções",
    descricao:
      'Cada seção tem um chip no canto superior esquerdo com um ícone de olho 👁. Toque para ocultar seções que não se aplicam ao evento — por exemplo, se o cliente não vai usar o buffet. O cliente não verá o que estiver desligado.',
    acao: null,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    num: "5",
    titulo: "Publique e compartilhe",
    descricao:
      'Quando estiver pronto, toque em "Publicar" no topo. A proposta fica disponível em um link exclusivo. Toque em "Copiar mensagem WhatsApp" para copiar a mensagem pronta e colar direto para o cliente.',
    acao: null,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
      </svg>
    ),
  },
  {
    num: "6",
    titulo: "Salve como PDF",
    descricao:
      'O cliente pode abrir o link e tocar em "Salvar PDF". Na tela que aparecer, ele deve selecionar "Salvar como PDF" no lugar de uma impressora. O arquivo fica salvo no celular ou computador.',
    acao: null,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
      </svg>
    ),
  },
];

export function GuiaUso() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-areia text-carvao/70 text-sm hover:border-oliva/40 hover:text-oliva transition"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" />
        </svg>
        Como usar
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[120] flex items-end md:items-center md:justify-center"
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
              aria-label="Como usar o Dondoka"
              className="relative w-full md:max-w-xl md:rounded-2xl rounded-t-3xl bg-creme shadow-premium flex flex-col"
              style={{ maxHeight: "90dvh" }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
            >
              {/* Pull bar */}
              <div className="pt-2.5 pb-1 md:hidden flex justify-center">
                <span className="block w-10 h-1 rounded-full bg-areia" aria-hidden />
              </div>

              {/* Header */}
              <header className="px-5 md:px-7 pt-3 pb-4 border-b border-areia/60 flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-xl text-carvao">Como usar o Dondoka</h2>
                  <p className="text-xs text-carvao/50 mt-0.5">Siga estes passos e crie sua primeira proposta em minutos</p>
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

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-5 md:px-7 py-5 md:py-6 space-y-4">
                {PASSOS.map((passo, idx) => (
                  <div
                    key={passo.num}
                    className="flex gap-4"
                  >
                    {/* Número + linha conectora */}
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-9 h-9 rounded-full bg-oliva text-white flex items-center justify-center shrink-0">
                        {passo.icon}
                      </div>
                      {idx < PASSOS.length - 1 && (
                        <div className="w-px flex-1 bg-areia/60 mt-1.5 mb-0 min-h-[20px]" />
                      )}
                    </div>

                    {/* Conteúdo */}
                    <div className="pb-4 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold tracking-widest text-bronze uppercase">
                          Passo {passo.num}
                        </span>
                      </div>
                      <h3 className="font-serif text-base text-carvao mt-0.5 leading-snug">
                        {passo.titulo}
                      </h3>
                      <p className="text-sm text-carvao/65 mt-1.5 leading-relaxed">
                        {passo.descricao}
                      </p>
                      {passo.acao && (
                        <Link
                          href={passo.acao.href}
                          onClick={() => setOpen(false)}
                          className="mt-3 inline-flex items-center gap-1.5 text-sm text-oliva font-medium hover:text-bronze transition"
                        >
                          {passo.acao.label}
                          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                            <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                          </svg>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <footer
                className="px-5 md:px-7 py-3 md:py-4 border-t border-areia/60 bg-creme/80 backdrop-blur flex justify-end"
                style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center h-11 px-6 rounded-full bg-oliva text-white font-medium text-sm hover:bg-oliva/90 transition"
                >
                  Entendido!
                </button>
              </footer>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
