import Link from "next/link";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { dataBR, tempoRelativo } from "@/lib/format";

export const dynamic = "force-dynamic";

type Lead = {
  id: string;
  nome: string;
  whatsapp: string;
  email: string | null;
  tipo_evento: string | null;
  data_pretendida: string | null;
  convidados: number | null;
  mensagem: string | null;
  origem: string | null;
  status: string;
  created_at: string;
};

/** Só dígitos — o link wa.me não aceita parênteses nem hífen. */
function paraWhatsapp(telefone: string) {
  const digitos = telefone.replace(/\D/g, "");
  // Número local (10 ou 11 dígitos) precisa do código do país.
  return digitos.length <= 11 ? `55${digitos}` : digitos;
}

export default async function LeadsPage() {
  const supabase = createAdminSupabase();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  const leads = (data ?? []) as Lead[];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-carvao md:text-3xl">Leads do site</h1>
          <p className="mt-1.5 text-sm text-carvao/60">
            Pedidos de orçamento enviados pelo formulário. Os mais recentes primeiro.
          </p>
        </div>
        {leads.length > 0 && (
          <span className="rounded-full bg-oliva/10 px-4 py-1.5 text-sm text-oliva">
            {leads.length} {leads.length === 1 ? "lead" : "leads"}
          </span>
        )}
      </div>

      {error && (
        <div className="mt-8 rounded-2xl border border-bronze/30 bg-bronze/5 p-6">
          <p className="font-medium text-bronze">Não foi possível carregar os leads.</p>
          <p className="mt-2 text-sm text-carvao/70">
            Se esta é a primeira vez, provavelmente a migration ainda não foi aplicada. Rode{" "}
            <code className="rounded bg-white px-1.5 py-0.5 text-xs">
              supabase/migrations/0004_leads.sql
            </code>{" "}
            no SQL Editor do Supabase.
          </p>
        </div>
      )}

      {!error && leads.length === 0 && (
        <div className="mt-8 rounded-2xl border border-areia/60 bg-white p-10 text-center">
          <p className="font-serif text-lg text-carvao">Nenhum lead ainda</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-carvao/60">
            Quando alguém preencher o formulário em{" "}
            <Link href="/contato" className="text-oliva hover:underline">
              /contato
            </Link>
            , o pedido aparece aqui — mesmo que a pessoa não chame no WhatsApp.
          </p>
        </div>
      )}

      <div className="mt-8 space-y-3">
        {leads.map((lead) => (
          <article
            key={lead.id}
            className="rounded-2xl border border-areia/60 bg-white p-5 shadow-soft transition hover:shadow-premium md:p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-serif text-lg text-carvao">{lead.nome}</h2>
                <p className="mt-0.5 text-sm text-carvao/60">
                  {lead.tipo_evento || "Evento não informado"}
                  {lead.data_pretendida ? ` · ${dataBR(lead.data_pretendida)}` : ""}
                  {lead.convidados ? ` · ${lead.convidados} convidados` : ""}
                </p>
              </div>
              <time dateTime={lead.created_at} className="text-xs text-carvao/45">
                {tempoRelativo(lead.created_at)}
              </time>
            </div>

            {lead.mensagem && (
              <p className="mt-4 whitespace-pre-line rounded-xl bg-areia/25 px-4 py-3 text-sm text-carvao/75">
                {lead.mensagem}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <a
                href={`https://wa.me/${paraWhatsapp(lead.whatsapp)}?text=${encodeURIComponent(
                  `Olá, ${lead.nome.split(" ")[0]}! Recebemos seu pedido de orçamento no site da Dondoka Recepções.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center rounded-full bg-oliva px-4 text-sm text-white transition hover:bg-bronze"
              >
                Responder no WhatsApp
              </a>
              <span className="text-sm text-carvao/60">{lead.whatsapp}</span>
              {lead.email && (
                <a href={`mailto:${lead.email}`} className="text-sm text-oliva hover:underline">
                  {lead.email}
                </a>
              )}
              {lead.origem && (
                <span className="ml-auto text-xs text-carvao/40">veio de {lead.origem}</span>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
