import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { createAdminSupabase } from "@/lib/supabase/admin";

/**
 * Gestão das fotos do bucket `fotos-espaco`.
 *
 * Apagar um arquivo do Storage nunca foi suficiente. Cada orçamento guarda a
 * própria cópia da lista em `fotos_selecionadas`, e o config global guarda
 * `fotos_default`, então o arquivo sumia e os caminhos ficavam apontando para
 * o nada: a proposta do cliente passava a mostrar quadro quebrado. Por isso
 * toda exclusão aqui também limpa as referências.
 *
 * Roda com a service role de propósito: precisa escrever em todas as linhas de
 * `orcamentos`, inclusive nas de propostas já enviadas.
 */

type Supa = ReturnType<typeof createAdminSupabase>;

/** Tira os caminhos indicados de todo lugar que os referencia. */
async function purgarReferencias(supabase: Supa, caminhos: string[]) {
  if (caminhos.length === 0) return { orcamentosAtualizados: 0, configAtualizado: false };
  const alvo = new Set(caminhos);

  const { data: linhas } = await supabase
    .from("orcamentos")
    .select("id, fotos_selecionadas");

  let orcamentosAtualizados = 0;
  for (const linha of linhas ?? []) {
    const atuais: string[] = linha.fotos_selecionadas ?? [];
    const limpas = atuais.filter((p) => !alvo.has(p));
    if (limpas.length !== atuais.length) {
      await supabase.from("orcamentos").update({ fotos_selecionadas: limpas }).eq("id", linha.id);
      orcamentosAtualizados++;
    }
  }

  const { data: config } = await supabase
    .from("config_global")
    .select("fotos_default")
    .eq("id", 1)
    .maybeSingle();

  let configAtualizado = false;
  const padrao: string[] = config?.fotos_default ?? [];
  const padraoLimpo = padrao.filter((p) => !alvo.has(p));
  if (padraoLimpo.length !== padrao.length) {
    await supabase.from("config_global").update({ fotos_default: padraoLimpo }).eq("id", 1);
    configAtualizado = true;
  }

  return { orcamentosAtualizados, configAtualizado };
}

/** Apaga uma foto do bucket e some com ela de todas as propostas. */
export async function DELETE(request: Request) {
  const guard = await requireAuth();
  if (guard.response) return guard.response;

  const { path } = (await request.json().catch(() => ({}))) as { path?: string };
  if (!path || path.startsWith("/") || path.startsWith("http")) {
    return NextResponse.json(
      { error: "Só dá pra apagar foto enviada pelo painel." },
      { status: 400 }
    );
  }

  const supabase = createAdminSupabase();
  const { error } = await supabase.storage.from("fotos-espaco").remove([path]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const resultado = await purgarReferencias(supabase, [path]);
  return NextResponse.json({ ok: true, ...resultado });
}

/**
 * Varredura: acha caminho de Storage que não existe mais no bucket e limpa as
 * referências. É o conserto para as fotos que já foram apagadas antes desta
 * rota existir e deixaram quadro quebrado espalhado pelas propostas.
 */
export async function POST() {
  const guard = await requireAuth();
  if (guard.response) return guard.response;

  const supabase = createAdminSupabase();

  const { data: arquivos, error: erroLista } = await supabase.storage
    .from("fotos-espaco")
    .list("", { limit: 1000 });
  if (erroLista) return NextResponse.json({ error: erroLista.message }, { status: 500 });
  const existentes = new Set((arquivos ?? []).map((f) => f.name));

  const { data: linhas } = await supabase.from("orcamentos").select("fotos_selecionadas");
  const { data: config } = await supabase
    .from("config_global")
    .select("fotos_default")
    .eq("id", 1)
    .maybeSingle();

  const referenciados = new Set<string>();
  for (const linha of linhas ?? []) {
    for (const p of (linha.fotos_selecionadas ?? []) as string[]) referenciados.add(p);
  }
  for (const p of (config?.fotos_default ?? []) as string[]) referenciados.add(p);

  // Só caminho de Storage entra na conta. As fotos de public/fotos começam com
  // "/" e vêm do repositório, então nunca são órfãs.
  const orfas = [...referenciados].filter(
    (p) => !p.startsWith("/") && !p.startsWith("http") && !existentes.has(p)
  );

  const resultado = await purgarReferencias(supabase, orfas);
  return NextResponse.json({ ok: true, orfas, ...resultado });
}
