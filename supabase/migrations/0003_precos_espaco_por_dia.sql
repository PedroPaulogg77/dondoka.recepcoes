-- Dondoka Recepções — Faixas de preço do aluguel do espaço por dia da semana
-- Idempotente: pode rodar várias vezes sem quebrar.
--
-- Contexto: a dona cobra valores diferentes pelo aluguel dependendo do dia
-- (ex: seg-qui R$700, sex R$800, sáb-dom R$950). Antes ela criava 3 itens
-- separados em itens_espaco como workaround, o que inflava o TOTAL. Agora
-- existe um campo dedicado `precos_espaco_por_dia` com formato:
--   { "seg_qui": number|null, "sex": number|null, "sab_dom": number|null }
--
-- Quando o campo é NULL, o sistema opera em modo legado (Espaço com setinha
-- colapsável usando itens_espaco normal). Quando preenchido, o aluguel vira
-- um item especial sem setinha + faixa cobrada conforme cliente_data.

alter table public.config_global
  add column if not exists precos_espaco_por_dia jsonb;

alter table public.orcamentos
  add column if not exists precos_espaco_por_dia jsonb;
