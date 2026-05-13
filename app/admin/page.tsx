import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";
import { brl, dataBR } from "@/lib/format";
import type { Orcamento } from "@/types/orcamento";
import { CriarExemploButton } from "@/components/admin/CriarExemploButton";

export const dynamic = "force-dynamic";

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

export default async function AdminHome() {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("orcamentos")
    .select("*")
    .order("created_at", { ascending: false });
  const orcamentos = (data || []) as Orcamento[];

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="eyebrow">Painel</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-serif text-carvao">Orçamentos</h1>
          <p className="mt-1 text-sm text-carvao/60">
            {orcamentos.length} {orcamentos.length === 1 ? "proposta" : "propostas"} cadastradas.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {orcamentos.length === 0 && <CriarExemploButton />}
          <Link href="/admin/novo">
            <Button size="lg">+ Novo orçamento</Button>
          </Link>
        </div>
      </div>

      <div className="mt-10">
        {orcamentos.length === 0 ? (
          <div className="bg-white border border-areia/60 rounded-2xl p-12 text-center">
            <p className="text-carvao/60">Nenhum orçamento ainda. Crie o primeiro!</p>
          </div>
        ) : (
          <div className="bg-white border border-areia/60 rounded-2xl overflow-hidden shadow-soft">
            <ul className="divide-y divide-areia/40">
              {orcamentos.map((o) => {
                const total = calcularTotal(o);
                const st = STATUS_LABEL[o.status] || STATUS_LABEL.rascunho;
                return (
                  <li key={o.id} className="px-5 md:px-8 py-5 flex items-center gap-4 hover:bg-creme/40 transition">
                    <Link href={`/admin/${o.id}`} className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-lg text-carvao truncate">{o.cliente_nome}</p>
                        <p className="text-xs text-carvao/55 truncate">
                          {o.cliente_evento || "Evento"} {o.cliente_data ? `· ${dataBR(o.cliente_data)}` : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${st.cls}`}>
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
    </div>
  );
}
