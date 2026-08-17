-- Dondoka Recepções — coluna `publicado` + catálogo de kits
-- Idempotente: pode rodar várias vezes sem quebrar.
--
-- ============================================================
-- PARTE 1 — `publicado`
-- ============================================================
-- Esta coluna existe em produção desde sempre, mas foi criada à mão pelo painel
-- do Supabase e nunca entrou em migration nenhuma. O resultado é que um banco
-- levantado do zero pelos arquivos deste diretório sobe sem ela, e o sistema
-- quebra em três pontos: o insert de /api/admin/orcamentos, o gate da página
-- pública e o botão Publicar do editor.
--
-- O `add column if not exists` cobre o banco novo. Os três comandos seguintes
-- cobrem o banco de produção, onde a coluna pode ter sido criada sem default e
-- sem not null. Rodar tudo é seguro nos dois casos.

alter table public.orcamentos
  add column if not exists publicado boolean;

update public.orcamentos set publicado = false where publicado is null;

alter table public.orcamentos alter column publicado set default false;
alter table public.orcamentos alter column publicado set not null;

-- ============================================================
-- PARTE 2 — biblioteca de itens e catálogo de kits
-- ============================================================
-- Duas estruturas novas no config_global, ambas globais e reaproveitadas por
-- todos os orçamentos.
--
-- `biblioteca_itens`: o cardápio bruto do fornecedor, agrupado por tipo. Serve
-- só como fonte para os checkboxes na hora de montar um kit. Formato:
--   [ { "id": "...", "categoria": "buffet", "titulo": "Salgados tradicionais",
--       "itens": ["Coxinha", "Bolinha de queijo", ...] } ]
--
-- `kits_catalogo`: os pacotes que a Dondoka vende. Cada kit guarda uma CÓPIA
-- dos nomes dos itens, não uma referência à biblioteca. Mexer na biblioteca
-- depois não altera kit já montado, e kit já usado num orçamento nunca muda
-- sozinho. É a mesma regra de "Padrão / Customizado" que já vale para os
-- textos. Formato:
--   [ { "id": "...", "categoria": "buffet", "nome": "Festa Básica",
--       "grupos": [ { "id": "...", "titulo": "Salgados",
--                     "nota": "à vontade", "itens": [...] } ],
--       "observacoes": ["4 horas de evento"],
--       "minimo_pessoas": 30 } ]
--
-- Nenhuma das duas guarda preço. O valor é digitado no orçamento, caso a caso.

alter table public.config_global
  add column if not exists biblioteca_itens jsonb,
  add column if not exists kits_catalogo jsonb;

-- ============================================================
-- PARTE 3 — tirar o espaço kids do texto padrão
-- ============================================================
-- A área kids não está pronta (Camila, jul/2026) e saiu do site na época. O
-- texto padrão da proposta, semeado em 0001, continuou anunciando. Removido
-- agora a pedido do João.
--
-- O update mexe só na linha do bullet e só se ela ainda estiver lá, então não
-- atropela nada que a Camila tenha reescrito no painel desde então. Orçamento
-- que já customizou o próprio texto não é tocado: o campo dele não é este.

update public.config_global
   set sobre_texto = regexp_replace(sobre_texto, '[\r\n]*•[ \t]*Espaço kids[^\r\n]*', '', 'g')
 where id = 1
   and sobre_texto like '%Espaço kids%';
