import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { createAdminSupabase } from "@/lib/supabase/admin";

export async function PATCH(request: Request) {
  const guard = await requireAuth();
  if (guard.response) return guard.response;

  const body = await request.json();
  const supabase = createAdminSupabase();
  const { error } = await supabase
    .from("config_global")
    .update(body)
    .eq("id", 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
