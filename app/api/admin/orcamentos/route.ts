import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { ensureUniqueSlug, generateSlugCandidates } from "@/lib/slug";

export async function POST(request: Request) {
  const guard = await requireAuth();
  if (guard.response) return guard.response;

  const body = await request.json();
  if (!body.cliente_nome?.trim()) {
    return NextResponse.json({ error: "Nome do cliente é obrigatório." }, { status: 400 });
  }

  const supabase = createAdminSupabase();
  const base = generateSlugCandidates(body.cliente_nome, body.cliente_evento);
  const slug = await ensureUniqueSlug(base, async (s) => {
    const { count } = await supabase
      .from("orcamentos")
      .select("id", { head: true, count: "exact" })
      .eq("slug", s);
    return (count || 0) > 0;
  });

  const { data, error } = await supabase
    .from("orcamentos")
    .insert({ ...body, slug })
    .select("id, slug")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
