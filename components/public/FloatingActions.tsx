"use client";
import { motion } from "framer-motion";

type Props = {
  whatsapp: string | null;
  mensagem: string;
};

export function FloatingActions({ whatsapp, mensagem }: Props) {
  async function imprimirPDF() {
    // Avisa componentes que estamos prestes a imprimir
    // (Investimento e outros escutam pra forçar estado expandido)
    window.dispatchEvent(new Event("prepare-print"));
    // Espera 2 frames pra React fazer re-render e DOM atualizar
    await new Promise((r) => requestAnimationFrame(r));
    await new Promise((r) => requestAnimationFrame(r));
    // E mais um beat pequeno pra garantir layout pintado
    await new Promise((r) => setTimeout(r, 80));
    window.print();
  }

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.6 }}
      className="no-print fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 z-40 flex gap-3 justify-center md:justify-end"
    >
      {whatsapp && (
        <a
          href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(mensagem)}`}
          target="_blank"
          rel="noreferrer"
          className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 h-12 rounded-full bg-oliva text-white shadow-premium hover:bg-bronze transition font-medium text-sm"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.503 5.234l.16.255-1 3.645 3.746-.833zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.149-.173.198-.297.297-.495.099-.198.05-.372-.025-.521-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01a1.09 1.09 0 00-.793.372c-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413z" />
          </svg>
          Falar no WhatsApp
        </a>
      )}
      <button
        type="button"
        onClick={imprimirPDF}
        className="inline-flex items-center justify-center gap-2 px-5 h-12 rounded-full bg-carvao text-white shadow-premium hover:bg-oliva transition font-medium text-sm"
        aria-label="Baixar PDF"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
        </svg>
        PDF
      </button>
    </motion.div>
  );
}
