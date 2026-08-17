"use client";
import { useState } from "react";
import { contarItens, kitParaItem, kitsDaCategoria } from "@/lib/kits";
import type { CategoriaKit, ItemOrcamento, Kit } from "@/types/orcamento";

type Props = {
  categoria: CategoriaKit;
  kits: Kit[];
  convidados: number;
  onAdicionar: (item: ItemOrcamento) => void;
};

/**
 * Lista os kits do catálogo daquela categoria.
 *
 * O kit entra com o preço em branco de propósito: o valor é a única decisão que
 * muda de cliente para cliente, então é a única coisa que o João digita.
 *
 * Vive em arquivo próprio porque é usado nos dois editores, o visual (dentro da
 * gaveta de itens) e o de formulário.
 */
export function AdicionarKit({ categoria, kits, convidados, onAdicionar }: Props) {
  const [aberto, setAberto] = useState(false);
  const disponiveis = kitsDaCategoria(kits, categoria);

  if (disponiveis.length === 0) {
    return (
      <p className="rounded-xl bg-creme border border-areia/60 px-4 py-3 text-xs text-carvao/60">
        Nenhum kit de {categoria === "buffet" ? "buffet" : "decoração"} no catálogo ainda.
        Monte em <b>Kits</b>, no menu do topo.
      </p>
    );
  }

  return (
    <div className="rounded-2xl border border-oliva/25 bg-oliva/[0.04] p-3 md:p-4">
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        className="w-full flex items-center justify-between gap-3 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-oliva">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Adicionar kit
        </span>
        <span className={`text-oliva transition-transform ${aberto ? "rotate-90" : ""}`} aria-hidden>▸</span>
      </button>

      {aberto && (
        <ul className="mt-3 space-y-2">
          {disponiveis.map((kit) => {
            const abaixoDoMinimo =
              kit.minimo_pessoas != null && convidados > 0 && convidados < kit.minimo_pessoas;
            return (
              <li key={kit.id}>
                <button
                  type="button"
                  onClick={() => {
                    onAdicionar(kitParaItem(kit, convidados));
                    setAberto(false);
                  }}
                  className="w-full text-left rounded-xl bg-white border border-areia/60 px-4 py-3 hover:border-oliva/50 hover:shadow-soft transition"
                >
                  <span className="block font-serif text-carvao">{kit.nome || "Kit sem nome"}</span>
                  <span className="mt-0.5 block text-[11px] text-carvao/55">
                    {contarItens(kit)} itens
                    {kit.observacoes.length > 0 && ` · ${kit.observacoes.length} inclusos`}
                    {kit.minimo_pessoas ? ` · mín. ${kit.minimo_pessoas} pessoas` : ""}
                  </span>
                  {abaixoDoMinimo && (
                    <span className="mt-1.5 block text-[11px] text-bronze">
                      Este orçamento tem {convidados} convidados, abaixo do mínimo do kit.
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
