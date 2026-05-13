import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { ensureUniqueSlug, generateSlugCandidates } from "@/lib/slug";

export async function POST() {
  const guard = await requireAuth();
  if (guard.response) return guard.response;

  const supabase = createAdminSupabase();

  const proximoSabado = (() => {
    const d = new Date();
    d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7) + 14);
    return d.toISOString().slice(0, 10);
  })();

  const exemplo = {
    cliente_nome: "Maria Helena Souza",
    cliente_evento: "Aniversário de 30 anos",
    cliente_data: proximoSabado,
    cliente_horario: "19h às 23h",
    cliente_convidados: 50,
    status: "rascunho" as const,
    secoes_visiveis: {
      sobre: true,
      galeria: true,
      decoracao: true,
      buffet: true,
      servicos: true,
      dados: true,
      investimento: true,
      pagamento: true,
      contato: true,
    },
    fotos_selecionadas: [
      "/fotos/img_5723.webp",
      "/fotos/img_5743.webp",
      "/fotos/img_5753.webp",
      "/fotos/img_5774.webp",
      "/fotos/img_5916.webp",
      "/fotos/img_5922.webp",
      "/fotos/img_5931.webp",
      "/fotos/img_5933.webp",
    ],
    sobre_texto: null,
    decoracao_texto: null,
    itens_espaco: [
      { id: crypto.randomUUID(), descricao: "Locação do espaço (período completo)", qtd: 1, valor_unitario: 3500 },
      { id: crypto.randomUUID(), descricao: "Mesa e cadeiras para até 70 convidados", qtd: 1, valor_unitario: 600 },
      { id: crypto.randomUUID(), descricao: "Equipe de apoio durante o evento", qtd: 1, valor_unitario: 450 },
      { id: crypto.randomUUID(), descricao: "Limpeza pós-evento", qtd: 1, valor_unitario: 250 },
    ],
    itens_decoracao: [
      { id: crypto.randomUUID(), descricao: "Arranjo central de mesa principal", qtd: 1, valor_unitario: 480 },
      { id: crypto.randomUUID(), descricao: "Arranjos para mesas dos convidados", qtd: 8, valor_unitario: 120 },
      { id: crypto.randomUUID(), descricao: "Painel personalizado de boas-vindas", qtd: 1, valor_unitario: 380 },
      { id: crypto.randomUUID(), descricao: "Iluminação cênica e velas", qtd: 1, valor_unitario: 320 },
    ],
    itens_buffet: [
      { id: crypto.randomUUID(), descricao: "Coquetel de recepção (4 finger foods)", qtd: 50, valor_unitario: 22 },
      { id: crypto.randomUUID(), descricao: "Jantar — prato principal + acompanhamentos", qtd: 50, valor_unitario: 65 },
      { id: crypto.randomUUID(), descricao: "Mesa de doces e bolo", qtd: 1, valor_unitario: 850 },
      { id: crypto.randomUUID(), descricao: "Open bar (refrigerantes, sucos, água)", qtd: 50, valor_unitario: 18 },
    ],
    condicoes_pagamento: null,
    observacoes: "Orçamento de exemplo — duplique este e edite para criar um real.",
    buffet_dados: null,
    servicos_opcionais_dados: null,
  };

  const base = generateSlugCandidates(exemplo.cliente_nome, exemplo.cliente_evento);
  const slug = await ensureUniqueSlug(base, async (s) => {
    const { count } = await supabase
      .from("orcamentos")
      .select("id", { head: true, count: "exact" })
      .eq("slug", s);
    return (count || 0) > 0;
  });

  const { data, error } = await supabase
    .from("orcamentos")
    .insert({ ...exemplo, slug })
    .select("id, slug")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
