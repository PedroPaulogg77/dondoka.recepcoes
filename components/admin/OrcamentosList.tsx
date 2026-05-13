"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Orcamento, StatusOrcamento } from "@/types/orcamento";
import { brl, dataBR, tempoRelativo } from "@/lib/format";

function calcularTotal(o: Orcamento) {
  const sum = (arr: { qtd: number; valor_unitario: number }[]) =>
    arr.reduce((acc, i) => acc + (i.qtd || 0) * (i.valor_unitario || 0), 0);
  return sum(o.itens_espaco) + sum(o.itens_decoracao) + sum(o.itens_buffet);
}

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  rascunho: { label: "Rascunho", cls: "bg-areia/50 text-carvao/70" },
  enviado: { label: "Enviado", cls: "bg-oliva/15 text-oliva" },
  aceito: { label: "Aceito", cls: "bg-emerald-100 text-emerald-700" },
  recusado: { label: "Recusado", cls: "bg-rose-100 text-rose-700" },
};

type FilterTab = "todos" | StatusOrcamento;

const TABS: { value: FilterTab; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "rascunho", label: "Rascunho" },
  { value: "enviado", label: "Enviado" },
  { value: "aceito", label: "Aceito" },
  { value: "recusado", label: "Recusado" },
];

export function OrcamentosList({ orcamentos }: { orcamentos: Orcamento[] }) {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<FilterTab>("todos");

  const filtered = useMemo(() => {
    let list = orcamentos;

    if (tab !== "todos") {
      list = list.filter((o) => o.status === tab);
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (o) =>
          o.cliente_nome.toLowerCase().includes(q) ||
          (o.cliente_evento || "").toLowerCase().includes(q)
      );
    }

    return list;
  }, [orcamentos, tab, search]);

  if (orcamentos.length === 0) {
    return (
      <div className="bg-white border border-areia/60 rounded-2xl p-12 text-center">
        <p className="text-carvao/60">Nenhum orçamento ainda. Crie o primeiro!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-carvao/40 pointer-events-none"
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
            clipRule="evenodd"
          />
        </svg>
        <input
          type="text"
          placeholder="Buscar por nome do cliente ou tipo de evento..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input w-full pl-11 pr-4 h-11 rounded-full border border-areia/60 bg-white text-sm text-carvao placeholder:text-carvao/40 focus:border-oliva focus:ring-1 focus:ring-oliva/30 outline-none transition"
        />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map((t) => {
          const count =
            t.value === "todos"
              ? orcamentos.length
              : orcamentos.filter((o) => o.status === t.value).length;
          const isActive = tab === t.value;
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => setTab(t.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
                isActive
                  ? "bg-oliva text-white"
                  : "bg-areia/40 text-carvao/60 hover:bg-areia/70"
              }`}
            >
              {t.label}
              <span className="ml-1.5 opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-areia/60 rounded-2xl p-12 text-center">
          <p className="text-carvao/60">Nenhuma proposta encontrada.</p>
        </div>
      ) : (
        <div className="bg-white border border-areia/60 rounded-2xl overflow-hidden shadow-soft">
          <ul className="divide-y divide-areia/40">
            {filtered.map((o) => {
              const total = calcularTotal(o);
              const st = STATUS_LABEL[o.status] || STATUS_LABEL.rascunho;
              return (
                <li
                  key={o.id}
                  className="px-5 md:px-8 py-5 flex items-center gap-4 hover:bg-creme/40 transition"
                >
                  <Link
                    href={`/admin/${o.id}`}
                    className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center gap-2 md:gap-6"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-lg text-carvao truncate">
                        {o.cliente_nome}
                      </p>
                      <p className="text-xs text-carvao/55 truncate">
                        {o.cliente_evento || "Evento"}
                        {o.cliente_data ? ` · ${dataBR(o.cliente_data)}` : ""}
                        <span className="mx-1.5 text-carvao/30">·</span>
                        <span className="text-carvao/40">
                          editado {tempoRelativo(o.updated_at)}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${st.cls}`}
                      >
                        {st.label}
                      </span>
                      <span className="tabular-nums text-carvao/80 font-medium min-w-[100px] text-right">
                        {brl(total)}
                      </span>
                    </div>
                  </Link>
                  <Link
                    href={`/orcamento/${o.slug}`}
                    target="_blank"
                    className="text-xs text-oliva hover:text-bronze underline-offset-4 hover:underline whitespace-nowrap"
                  >
                    ver link
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
