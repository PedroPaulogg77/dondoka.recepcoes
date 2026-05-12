import { createAdminSupabase } from "./supabase/admin";
import type { ConfigGlobal, Orcamento } from "@/types/orcamento";

export async function fetchOrcamentoBySlug(slug: string) {
  const supabase = createAdminSupabase();
  const [orcamentoRes, configRes] = await Promise.all([
    supabase.from("orcamentos").select("*").eq("slug", slug).maybeSingle(),
    supabase.from("config_global").select("*").eq("id", 1).maybeSingle(),
  ]);

  return {
    orcamento: orcamentoRes.data as Orcamento | null,
    config: configRes.data as ConfigGlobal | null,
  };
}

export async function fetchConfig() {
  const supabase = createAdminSupabase();
  const { data } = await supabase.from("config_global").select("*").eq("id", 1).maybeSingle();
  return data as ConfigGlobal | null;
}
