import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { fetchConfig } from "@/lib/queries";
import { Button } from "@/components/ui/Button";
import { SetupBanner } from "@/components/admin/SetupBanner";
import { OrcamentosList } from "@/components/admin/OrcamentosList";
import { CriarExemploButton } from "@/components/admin/CriarExemploButton";
import type { Orcamento } from "@/types/orcamento";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const supabase = createServerSupabase();
  const [{ data }, config] = await Promise.all([
    supabase
      .from("orcamentos")
      .select("*")
      .order("created_at", { ascending: false }),
    fetchConfig(),
  ]);
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
        <div className="flex flex-wrap items-center gap-2">
          {orcamentos.length === 0 && <CriarExemploButton />}
          <Link href="/admin/novo">
            <Button size="lg">+ Novo orçamento</Button>
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <SetupBanner config={config} />
      </div>

      <div className="mt-8">
        <OrcamentosList orcamentos={orcamentos} />
      </div>
    </div>
  );
}
