-- Dondoka Recepções — orçamentos schema
-- Idempotente: pode rodar várias vezes sem quebrar.

create extension if not exists "pgcrypto";

-- =========================
-- orcamentos
-- =========================
create table if not exists public.orcamentos (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  status text not null default 'rascunho' check (status in ('rascunho','enviado','aceito','recusado')),

  cliente_nome text not null,
  cliente_evento text,
  cliente_data date,
  cliente_horario text,
  cliente_convidados int,

  secoes_visiveis jsonb not null default jsonb_build_object(
    'sobre', true,
    'galeria', true,
    'decoracao', true,
    'dados', true,
    'investimento', true,
    'pagamento', true,
    'contato', true
  ),

  fotos_selecionadas text[] not null default '{}',

  sobre_texto text,
  decoracao_texto text,

  itens_espaco jsonb not null default '[]'::jsonb,
  itens_decoracao jsonb not null default '[]'::jsonb,
  itens_buffet jsonb not null default '[]'::jsonb,

  condicoes_pagamento text,
  observacoes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  sent_at timestamptz
);

create index if not exists orcamentos_status_idx on public.orcamentos (status, created_at desc);
create index if not exists orcamentos_slug_idx on public.orcamentos (slug);

-- updated_at trigger
create or replace function public.tg_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists set_orcamentos_updated_at on public.orcamentos;
create trigger set_orcamentos_updated_at
before update on public.orcamentos
for each row execute function public.tg_set_updated_at();

-- =========================
-- config_global (singleton, id=1)
-- =========================
create table if not exists public.config_global (
  id int primary key check (id = 1),
  sobre_texto text,
  decoracao_texto text,
  condicoes_pagamento text,
  contato_telefone text,
  contato_whatsapp text,
  contato_instagram text,
  contato_email text,
  contato_endereco text,
  fotos_default text[] not null default '{}',
  updated_at timestamptz not null default now()
);

drop trigger if exists set_config_updated_at on public.config_global;
create trigger set_config_updated_at
before update on public.config_global
for each row execute function public.tg_set_updated_at();

-- Seed defaults from TEXTOS.txt
insert into public.config_global (
  id, sobre_texto, decoracao_texto, condicoes_pagamento,
  contato_telefone, contato_whatsapp, contato_instagram, contato_email, contato_endereco
) values (
  1,
  'Ambiente aconchegante e climatizado, ideal para eventos sociais e corporativos.

• Capacidade para até 70 pessoas
• Espaço climatizado
• 03 banheiros, sendo 01 com acessibilidade e fraldário
• Cozinha equipada
• Espaço kids',
  'Cada detalhe pensado para transformar sua celebração em um momento inesquecível, com elegância e personalidade.

A decoração é personalizada conforme o tema de cada evento. Itens comumente inclusos: arco de balão na cor escolhida, tapete, número de LED, peças para mesa de bolo e doces, e demais elementos definidos em briefing.',
  'Formas de pagamento: Pix, cartão de crédito, débito ou transferência. Parcelamento com juros por conta do comprador.

Para reserva da data, é necessário o pagamento de 30% do valor total. O restante deverá ser quitado em até 20 dias antes do evento.',
  '(31) 97251-9129',
  '5531972519129',
  'dondokarecepcoes',
  'recepcoesdondoka@gmail.com',
  'Rua das Petúnias, 1654 — Lindeia, Belo Horizonte / MG'
)
on conflict (id) do nothing;

-- =========================
-- RLS
-- =========================
alter table public.orcamentos enable row level security;
alter table public.config_global enable row level security;

-- Public select on orcamentos (qualquer um com o slug pode ver)
drop policy if exists orcamentos_public_select on public.orcamentos;
create policy orcamentos_public_select on public.orcamentos
  for select using (true);

-- Admin (authenticated) pode CRUD
drop policy if exists orcamentos_admin_all on public.orcamentos;
create policy orcamentos_admin_all on public.orcamentos
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Public select config (precisa para landing)
drop policy if exists config_public_select on public.config_global;
create policy config_public_select on public.config_global
  for select using (true);

drop policy if exists config_admin_update on public.config_global;
create policy config_admin_update on public.config_global
  for update using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists config_admin_insert on public.config_global;
create policy config_admin_insert on public.config_global
  for insert with check (auth.role() = 'authenticated');

-- =========================
-- Storage bucket: fotos-espaco
-- =========================
insert into storage.buckets (id, name, public)
values ('fotos-espaco', 'fotos-espaco', true)
on conflict (id) do update set public = true;

drop policy if exists fotos_public_read on storage.objects;
create policy fotos_public_read on storage.objects
  for select using (bucket_id = 'fotos-espaco');

drop policy if exists fotos_admin_write on storage.objects;
create policy fotos_admin_write on storage.objects
  for insert with check (bucket_id = 'fotos-espaco' and auth.role() = 'authenticated');

drop policy if exists fotos_admin_update on storage.objects;
create policy fotos_admin_update on storage.objects
  for update using (bucket_id = 'fotos-espaco' and auth.role() = 'authenticated');

drop policy if exists fotos_admin_delete on storage.objects;
create policy fotos_admin_delete on storage.objects
  for delete using (bucket_id = 'fotos-espaco' and auth.role() = 'authenticated');
