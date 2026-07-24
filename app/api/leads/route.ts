import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createAdminSupabase } from "@/lib/supabase/admin";

/**
 * Recebe o formulário de orçamento do site.
 *
 * É a única rota pública que escreve no banco, então ela carrega três camadas
 * de proteção antes do insert: honeypot, rate limit por IP e validação com zod.
 * A escrita usa a service role key no servidor — a anon key do navegador não
 * tem permissão de insert nesta tabela (ver 0004_leads.sql).
 */

const schema = z.object({
  nome: z.string().trim().min(2, "nome muito curto").max(120),
  whatsapp: z.string().trim().min(8, "telefone incompleto").max(30),
  email: z.string().trim().email().max(160).optional().or(z.literal("")),
  tipo_evento: z.string().trim().max(60).optional(),
  data_pretendida: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),
  convidados: z.coerce.number().int().positive().max(500).optional(),
  mensagem: z.string().trim().max(2000).optional(),
  origem: z.string().trim().max(200).optional(),
  /** Campo invisível no formulário. Se veio preenchido, é bot. */
  website: z.string().max(0).optional().or(z.literal("")),
});

/**
 * Rate limit em memória.
 *
 * Suficiente para o volume de um espaço de eventos e sem dependência externa.
 * A limitação conhecida: em serverless o mapa não é compartilhado entre
 * instâncias, então o limite real é por instância. Se algum dia o spam
 * justificar, o caminho é trocar por Upstash/Redis — não por captcha, que
 * cobraria de todo visitante um custo que só o bot deveria pagar.
 */
const JANELA_MS = 10 * 60 * 1000;
const MAX_POR_JANELA = 5;
const historico = new Map<string, number[]>();

function excedeuLimite(ip: string) {
  const agora = Date.now();
  const recentes = (historico.get(ip) ?? []).filter((t) => agora - t < JANELA_MS);
  recentes.push(agora);
  historico.set(ip, recentes);

  // Poda preguiçosa: evita o mapa crescer sem limite em processo longo.
  if (historico.size > 500) {
    for (const [chave, marcas] of historico) {
      if (marcas.every((t) => agora - t >= JANELA_MS)) historico.delete(chave);
    }
  }

  return recentes.length > MAX_POR_JANELA;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "desconhecido";

  if (excedeuLimite(ip)) {
    return NextResponse.json({ erro: "Muitas tentativas. Tente em alguns minutos." }, { status: 429 });
  }

  let corpo: unknown;
  try {
    corpo = await request.json();
  } catch {
    return NextResponse.json({ erro: "Requisição inválida." }, { status: 400 });
  }

  const parsed = schema.safeParse(corpo);
  if (!parsed.success) {
    return NextResponse.json({ erro: "Confira os campos preenchidos." }, { status: 400 });
  }

  const { website, ...dados } = parsed.data;

  // Honeypot acionado: responde 200 para o bot achar que funcionou e não
  // insistir com variações. Nada é gravado.
  if (website) return NextResponse.json({ ok: true });

  const supabase = createAdminSupabase();
  const { error } = await supabase.from("leads").insert({
    nome: dados.nome,
    whatsapp: dados.whatsapp,
    email: dados.email || null,
    tipo_evento: dados.tipo_evento || null,
    data_pretendida: dados.data_pretendida || null,
    convidados: dados.convidados ?? null,
    mensagem: dados.mensagem || null,
    origem: dados.origem || request.headers.get("referer") || null,
  });

  if (error) {
    console.error("[leads] falha ao gravar:", error.message);
    return NextResponse.json({ erro: "Não foi possível registrar agora." }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
