-- Dondoka Recepções — captura de leads do site institucional
-- Idempotente: pode rodar várias vezes sem quebrar.
--
-- Até aqui, todo contato dependia do clique no WhatsApp: quem não clicava,
-- sumia sem deixar rastro. Esta tabela guarda o pedido de orçamento feito pelo
-- formulário do site, para que nenhum interessado se perca.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),

  nome text not null,
  whatsapp text not null,
  email text,

  tipo_evento text,
  data_pretendida date,
  convidados int,
  mensagem text,

  -- Qual página gerou o lead. Serve para saber o que converte:
  -- /contato, /eventos/quinze-anos, /guias/quanto-custa...
  origem text,

  -- Fluxo de atendimento do painel.
  status text not null default 'novo'
    check (status in ('novo','em_contato','orcado','fechado','perdido')),
  observacoes_internas text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- A listagem do painel é sempre "mais recentes primeiro".
create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);

drop trigger if exists set_leads_updated_at on public.leads;
create trigger set_leads_updated_at
before update on public.leads
for each row execute function public.tg_set_updated_at();

-- =========================
-- RLS
-- =========================
-- Nenhuma policy de insert público de propósito: a inserção acontece na rota
-- /api/leads, que roda no servidor com a service role key e ignora RLS. Assim
-- ninguém consegue escrever direto na tabela usando a anon key exposta no
-- navegador, e a validação (zod + honeypot + rate limit) não tem como ser
-- contornada.
alter table public.leads enable row level security;

drop policy if exists leads_admin_all on public.leads;
create policy leads_admin_all on public.leads
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
