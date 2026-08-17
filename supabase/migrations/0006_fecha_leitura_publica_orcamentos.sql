-- Dondoka Recepções — fecha a leitura pública da tabela de orçamentos
-- Idempotente: pode rodar várias vezes sem quebrar.
--
-- A policy `orcamentos_public_select`, criada na 0001, liberava `select` para
-- qualquer requisição: `using (true)`. Como a anon key vai no bundle que o
-- navegador baixa, qualquer pessoa podia pedir a tabela inteira direto na API
-- REST do Supabase e receber nome de cliente, valores negociados, data do
-- evento e as observações internas de cada proposta.
--
-- Nada no sistema depende dela:
--
--   • A página pública /orcamento/[slug] lê por `fetchOrcamentoBySlug`, que usa
--     a service role no servidor e passa por cima de RLS.
--   • O painel lê como usuário autenticado, coberto por `orcamentos_admin_all`,
--     que é `for all` e portanto já inclui select.
--
-- A `config_global` continua com leitura pública de propósito: a página /links
-- é anônima e só tem ali telefone, e-mail e endereço, que já estão no site.

drop policy if exists orcamentos_public_select on public.orcamentos;
