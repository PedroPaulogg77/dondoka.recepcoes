import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { ensureUniqueSlug, generateSlugCandidates } from "@/lib/slug";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const guard = await requireAuth();
  if (guard.response) return guard.response;

  const supabase = createAdminSupabase();
  const { data: source, error } = await supabase
    .from("orcamentos")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();
  if (error || !source) return NextResponse.json({ error: "Orçamento não encontrado." }, { status: 404 });

  const base = generateSlugCandidates(source.cliente_nome, source.cliente_evento);
  const slug = await ensureUniqueSlug(base, async (s) => {
    const { count } = await supabase
      .from("orcamentos")
      .select("id", { head: true, count: "exact" })
      .eq("slug", s);
    return (count || 0) > 0;
  });

  // remove fields not to copy
  const {
    id: _id, created_at: _ca, updated_at: _ua, sent_at: _sa, slug: _slug, ...rest
  } = source;

  const { data: copy, error: insertErr } = await supabase
    .from("orcamentos")
    .insert({ ...rest, slug, status: "rascunho" })
    .select("id, slug")
    .single();

  if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 });
  return NextResponse.json(copy);
}
