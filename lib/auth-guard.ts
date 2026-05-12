import { NextResponse } from "next/server";
import { createServerSupabase } from "./supabase/server";

export async function requireAuth() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { user: null, response: NextResponse.json({ error: "unauthorized" }, { status: 401 }) };
  }
  return { user, response: null as null };
}
