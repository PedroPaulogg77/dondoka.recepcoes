-- Dondoka Recepções — Buffet + Serviços Opcionais
-- Idempotente: pode rodar várias vezes sem quebrar.

-- =========================
-- Novas colunas
-- =========================
alter table public.config_global
  add column if not exists buffet_dados jsonb,
  add column if not exists servicos_opcionais_dados jsonb;

alter table public.orcamentos
  add column if not exists buffet_dados jsonb,
  add column if not exists servicos_opcionais_dados jsonb;

-- =========================
-- Default do secoes_visiveis: incluir buffet (off) e servicos (on)
-- =========================
alter table public.orcamentos
  alter column secoes_visiveis set default jsonb_build_object(
    'sobre', true,
    'galeria', true,
    'decoracao', true,
    'buffet', false,
    'servicos', true,
    'dados', true,
    'investimento', true,
    'pagamento', true,
    'contato', true
  );

-- Backfill: orçamentos antigos ganham as flags ausentes
update public.orcamentos
   set secoes_visiveis = secoes_visiveis
       || jsonb_build_object('buffet', coalesce(secoes_visiveis->'buffet', 'false'::jsonb))
       || jsonb_build_object('servicos', coalesce(secoes_visiveis->'servicos', 'true'::jsonb))
 where not (secoes_visiveis ? 'buffet' and secoes_visiveis ? 'servicos');

-- =========================
-- Seed dos defaults em config_global (só se ainda nulo)
-- =========================
update public.config_global
   set buffet_dados = '{
     "entrada": {
       "titulo": "Cantinho mineiro",
       "itens": ["Linguiça", "Almôndega", "Mandioca", "Batata", "Torresmo", "Mussarela", "Ovo de codorna", "Azeitona", "Torradas"]
     },
     "principal": {
       "opcoes": [
         {"titulo": "Feijoada completa", "itens": ["Arroz", "Couve", "Laranja", "Farofa"]},
         {"titulo": "Feijão tropeiro e lombo assado", "itens": ["Arroz", "Couve"]}
       ]
     },
     "bebidas": ["Refrigerante", "Suco de caixinha", "Água"],
     "servico": "Equipe completa de cozinha e copa durante todo o evento, com louças, talheres, copos e guardanapos inclusos."
   }'::jsonb
 where id = 1 and buffet_dados is null;

update public.config_global
   set servicos_opcionais_dados = '{
     "intro": "Pensando em proporcionar uma experiência ainda mais completa, a Dondoka Recepções oferece serviços adicionais para auxiliar na organização e execução do seu evento:",
     "lista": ["Segurança", "Recepcionista", "Cerimonialista", "Apoio de limpeza", "Garçons", "Música ao vivo"],
     "disclaimer": "Serviços contratados à parte, conforme disponibilidade e necessidade do evento."
   }'::jsonb
 where id = 1 and servicos_opcionais_dados is null;
