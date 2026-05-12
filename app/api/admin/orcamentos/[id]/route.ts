import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { createAdminSupabase } from "@/lib/supabase/admin";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const guard = await requireAuth();
  if (guard.response) return guard.response;

  const body = await request.json();
  const supabase = createAdminSupabase();

  // Define sent_at quando status muda para "enviado" e ainda não foi setado
  const patch: Record<string, unknown> = { ...body };
  if (body.status === "enviado") {
    const { data: cur } = await supabase
      .from("orcamentos")
      .select("sent_at")
      .eq("id", params.id)
      .maybeSingle();
    if (cur && !cur.sent_at) patch.sent_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("orcamentos")
    .update(patch)
    .eq("id", params.id)
    .select("id, slug")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const guard = await requireAuth();
  if (guard.response) return guard.response;
  const supabase = createAdminSupabase();
  const { error } = await supabase.from("orcamentos").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
