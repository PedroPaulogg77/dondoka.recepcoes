import { notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { OrcamentoForm } from "@/components/admin/OrcamentoForm";
import { fetchConfig } from "@/lib/queries";
import type { Orcamento } from "@/types/orcamento";

export const dynamic = "force-dynamic";

export default async function EditarOrcamento({ params }: { params: { id: string } }) {
  const supabase = createServerSupabase();
  const [orcamentoRes, config] = await Promise.all([
    supabase.from("orcamentos").select("*").eq("id", params.id).maybeSingle(),
    fetchConfig(),
  ]);
  const orcamento = orcamentoRes.data as Orcamento | null;
  if (!orcamento || !config) notFound();
  return <OrcamentoForm mode="editar" orcamento={orcamento} config={config} />;
}
