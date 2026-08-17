import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { createServerSupabase } from "./supabase/server";

/**
 * Guarda das rotas de API. Devolve a resposta 401 pronta em vez de lançar.
 */
export async function requireAuth() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { user: null, response: NextResponse.json({ error: "unauthorized" }, { status: 401 }) };
  }
  return { user, response: null as null };
}

/**
 * Guarda das páginas do painel. Chamar como PRIMEIRA linha de toda página
 * server-side dentro de /admin.
 *
 * Por que não basta o middleware: ele confere apenas se existe um cookie com
 * nome parecido com o do Supabase, sem ler o valor nem validar assinatura.
 * Um `document.cookie = "sb-x-auth-token=1"` no console passava por ele. Como
 * as páginas liam o banco sem verificar sessão, isso dava acesso de leitura a
 * nome de cliente, valores negociados, observações internas e à base de leads
 * inteira.
 *
 * `getUser()` valida o token contra o servidor do Supabase, então cookie
 * inventado não passa. É a mesma checagem que as rotas de API já faziam.
 */
export async function requirePageAuth() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return user;
}
