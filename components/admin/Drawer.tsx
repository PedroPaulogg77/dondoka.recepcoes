"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  /** Texto do botão de "concluir" no rodapé (default: "Pronto") */
  doneLabel?: string;
};

export function Drawer({ open, onClose, title, subtitle, children, doneLabel = "Pronto" }: Props) {
  // Lock body scroll quando aberto
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Esc fecha
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end md:items-center md:justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-carvao/40 backdrop-blur-[2px]"
            onClick={onClose}
            aria-hidden
          />

          {/* Sheet */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="relative w-full md:max-w-xl md:rounded-2xl rounded-t-3xl bg-creme shadow-premium flex flex-col"
            style={{ maxHeight: "85dvh" }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
          >
            {/* Pull bar (mobile only visual) */}
            <div className="pt-2.5 pb-1 md:hidden flex justify-center">
              <span className="block w-10 h-1 rounded-full bg-areia" aria-hidden />
            </div>

            {/* Header */}
            <header className="px-5 md:px-7 pt-3 pb-4 border-b border-areia/60 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="font-serif text-lg md:text-xl text-carvao leading-tight">{title}</h2>
                {subtitle && (
                  <p className="text-xs text-carvao/55 mt-0.5">{subtitle}</p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar"
                className="-mr-1 w-8 h-8 inline-flex items-center justify-center rounded-full text-carvao/50 hover:bg-areia/40 hover:text-carvao transition shrink-0"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </header>

            {/* Body (scrollable) */}
            <div className="flex-1 overflow-y-auto px-5 md:px-7 py-5 md:py-6">
              {children}
            </div>

            {/* Footer */}
            <footer className="px-5 md:px-7 py-3 md:py-4 border-t border-areia/60 bg-creme/80 backdrop-blur flex justify-end gap-2" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center h-11 px-6 rounded-full bg-oliva text-white font-medium text-sm hover:bg-oliva/90 transition"
              >
                {doneLabel}
              </button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
