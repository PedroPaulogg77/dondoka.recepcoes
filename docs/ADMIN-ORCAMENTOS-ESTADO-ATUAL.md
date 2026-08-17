# Admin e Orçamentos: levantamento de 17/08/2026

Levantamento de ponta a ponta do painel `/admin` e do sistema de propostas
`/orcamento/[slug]`, feito antes da entrada dos kits. Descreve o que existia
naquele dia, não o que deveria existir.

Base: commit `0523397`, branch `main`.

> ## ⚠️ Este documento é histórico
>
> Boa parte dele foi resolvida na sequência, entre 17 e 18/08/2026. Os itens
> corrigidos estão marcados **RESOLVIDO** ao longo do texto, e a
> [seção 15](#15-o-que-mudou-depois-deste-levantamento) resume o que entrou.
> O levantamento fica de pé como registro do que foi encontrado e por quê.

---

## 1. Resumo executivo

O sistema funciona e está em produção, com propostas já enviadas por WhatsApp.
A arquitetura é sólida: um editor visual mobile-first onde a prévia é a própria
interface de edição, herança de textos padrão a partir de um registro global, e
um link público por cliente com PDF via `window.print()`.

Três coisas pediam atenção antes de qualquer refatoração. **As três foram
corrigidas em 18/08/2026**, e ficam aqui porque explicam decisões do código atual:

1. **A proteção do `/admin` era só aparência.** O middleware conferia se existia
   um cookie com nome parecido com o do Supabase, sem validar nada. Qualquer
   pessoa que criasse esse cookie no navegador lia a lista de orçamentos, os
   valores, as observações internas e a página de leads inteira.
   *(RESOLVIDO: `requirePageAuth()` nas seis páginas, ver 12.1)*
2. **A coluna `publicado` não existia em nenhuma migration.** Foi criada direto
   no painel do Supabase. Quem rodasse as migrations num projeto novo levantava
   um banco em que o sistema quebra.
   *(RESOLVIDO: migration 0005, ver 12.2)*
3. **A política RLS `orcamentos_public_select` liberava `select` para todo
   mundo.** Com a anon key, que está no bundle do navegador, dava para baixar a
   tabela inteira de propostas pela API REST do Supabase.
   *(RESOLVIDO: migration 0006, ver 12.1)*

Havia ainda dois editores paralelos (visual e formulário) que compartilhavam o
tipo de estado mas não a instância *(RESOLVIDO, ver 12.4)*, e um guia de uso que
descreve botões que não existem *(ainda aberto, ver 12.7)*.

---

## 2. Mapa do território

### Rotas

| Rota | Arquivo | Renderização | Proteção |
|---|---|---|---|
| `/admin/login` | [app/admin/login/page.tsx](../app/admin/login/page.tsx) | client | pública (redireciona se logado) |
| `/admin` | [app/admin/page.tsx](../app/admin/page.tsx) | server, `force-dynamic` | middleware |
| `/admin/novo` | [app/admin/novo/page.tsx](../app/admin/novo/page.tsx) | server, `force-dynamic` | middleware |
| `/admin/[id]` | [app/admin/[id]/page.tsx](../app/admin/[id]/page.tsx) | server, `force-dynamic` | middleware |
| `/admin/configuracoes` | [app/admin/configuracoes/page.tsx](../app/admin/configuracoes/page.tsx) | server, `force-dynamic` | middleware |
| `/admin/leads` | [app/admin/leads/page.tsx](../app/admin/leads/page.tsx) | server, `force-dynamic` | middleware |
| `/orcamento/[slug]` | [app/orcamento/[slug]/page.tsx](../app/orcamento/[slug]/page.tsx) | server, `revalidate = 0` | nenhuma, gate por `publicado` |

Todo `/admin/*` sai com `robots: noindex, nofollow, nocache` pelo
[app/admin/layout.tsx](../app/admin/layout.tsx). A proposta pública também.

### API

| Rota | Métodos | Auth | Arquivo |
|---|---|---|---|
| `/api/admin/orcamentos` | POST | `requireAuth()` | [route.ts](../app/api/admin/orcamentos/route.ts) |
| `/api/admin/orcamentos/[id]` | PATCH, DELETE | `requireAuth()` | [route.ts](../app/api/admin/orcamentos/[id]/route.ts) |
| `/api/admin/orcamentos/[id]/duplicate` | POST | `requireAuth()` | [route.ts](../app/api/admin/orcamentos/[id]/duplicate/route.ts) |
| `/api/admin/orcamentos/exemplo` | POST | `requireAuth()` | [route.ts](../app/api/admin/orcamentos/exemplo/route.ts) |
| `/api/admin/config` | PATCH | `requireAuth()` | [route.ts](../app/api/admin/config/route.ts) |
| `/api/leads` | POST | pública (zod + honeypot + rate limit) | [route.ts](../app/api/leads/route.ts) |

### Componentes de admin (21 arquivos)

```
components/admin/
  AdminShell.tsx          casca: header, nav de 3 itens, botão Ajuda, Sair
  GuiaUso.tsx             modal de 5 seções com o manual da dona (492 linhas)
  OrcamentosList.tsx      busca + abas de status + lista
  SetupBanner.tsx         checklist de 6 itens de configuração
  CriarExemploButton.tsx  aparece só quando não há nenhum orçamento
  OrcamentoEditor.tsx     editor visual (632 linhas), o coração do sistema
  OrcamentoForm.tsx       editor clássico em formulário (470 linhas)
  ConfigForm.tsx          tela de configurações globais
  Drawer.tsx              bottom sheet genérico (mobile) / modal (desktop)
  SectionChip.tsx         chip de olho + lápis sobreposto a cada seção
  SectionNav.tsx          bolinhas de navegação lateral (só desktop)
  SectionHelp.tsx         "?" expansível usado no modo formulário
  ItensEditor.tsx         tabela de itens (descrição, qtd, valor, reordenar)
  EspacoPrecosEditor.tsx  toggle + 3 campos das faixas por dia
  BuffetEditor.tsx        editor do cardápio
  ServicosEditor.tsx      lista de serviços com preview de ícone
  FotosPicker.tsx         grade de fotos + upload pro Storage
  EditableTextField.tsx   textarea com badge Padrão/Customizado
  drawers/                9 gavetas, uma por seção editável
```

### Componentes públicos da proposta (14 arquivos)

`OrcamentoView` orquestra tudo. É o mesmo componente usado no editor e na página
do cliente, com a diferença de receber ou não a prop `editorMode`.

```
Hero · SobreEspaco · Galeria · Decoracao · Buffet · ServicosOpcionais ·
DadosEvento · Investimento (+ EspacoFaixas) · Pagamento · Contato ·
FloatingActions · TextoFormatado
```

### Lib

| Arquivo | Papel |
|---|---|
| [lib/orcamento-helpers.ts](../lib/orcamento-helpers.ts) | `FormState`, defaults, `buildInitialForm`, `buildVirtualOrcamento`, `normalizeForSave` |
| [lib/format.ts](../lib/format.ts) | `brl`, `dataBR`, `dataExtenso`, `slugify`, `tierFromDate`, `tempoRelativo` |
| [lib/slug.ts](../lib/slug.ts) | geração e unicidade de slug |
| [lib/auth-guard.ts](../lib/auth-guard.ts) | `requireAuth()` usado só nas rotas de API |
| [lib/queries.ts](../lib/queries.ts) | `fetchOrcamentoBySlug`, `fetchConfig` (ambas com service role) |
| [lib/supabase/](../lib/supabase/) | três clientes: browser (anon), server (anon + cookie), admin (service role) |

---

## 3. Banco de dados

Quatro migrations em [supabase/migrations/](../supabase/migrations/), todas
idempotentes. São aplicadas manualmente pelo SQL Editor do Supabase, sem CLI e
sem controle de versão aplicado.

### `orcamentos`

| Coluna | Tipo | Origem | Observação |
|---|---|---|---|
| `id` | uuid pk | 0001 | |
| `slug` | text unique | 0001 | gerado do nome + evento, nunca recalculado depois |
| `status` | text check | 0001 | rascunho / enviado / aceito / recusado |
| `publicado` | **ausente** | **nenhuma** | usada no código, criada só no painel |
| `cliente_nome` | text not null | 0001 | único campo obrigatório |
| `cliente_evento` | text | 0001 | |
| `cliente_data` | date | 0001 | define a faixa de preço em destaque |
| `cliente_horario` | text | 0001 | texto livre, ex "19h às 23h" |
| `cliente_convidados` | int | 0001 | |
| `secoes_visiveis` | jsonb | 0001, default ampliado em 0002 | 9 flags |
| `fotos_selecionadas` | text[] | 0001 | |
| `sobre_texto` | text | 0001 | null significa herdar do config |
| `decoracao_texto` | text | 0001 | idem |
| `itens_espaco` | jsonb | 0001 | array de `ItemOrcamento` |
| `itens_decoracao` | jsonb | 0001 | |
| `itens_buffet` | jsonb | 0001 | |
| `condicoes_pagamento` | text | 0001 | null significa herdar |
| `observacoes` | text | 0001 | interno, nunca exibido ao cliente |
| `buffet_dados` | jsonb | 0002 | null significa herdar |
| `servicos_opcionais_dados` | jsonb | 0002 | null significa herdar |
| `precos_espaco_por_dia` | jsonb | 0003 | null significa herdar |
| `created_at` / `updated_at` | timestamptz | 0001 | trigger `tg_set_updated_at` |
| `sent_at` | timestamptz | 0001 | preenchido só quando status vira "enviado" |

Índices: `(status, created_at desc)` e `(slug)`.

### `config_global`

Singleton com `id = 1`, protegido por `check (id = 1)`. Guarda os padrões que
todo orçamento herda: os três textos, os cinco contatos, `fotos_default`,
`buffet_dados`, `servicos_opcionais_dados` e `precos_espaco_por_dia`. A migration
0001 já semeia os textos reais da Dondoka.

### `leads`

Criada em 0004. Campos: nome, whatsapp, email, tipo_evento, data_pretendida,
convidados, mensagem, origem, `status` (novo / em_contato / orcado / fechado /
perdido) e `observacoes_internas`.

**As duas últimas colunas nunca são lidas nem escritas por nenhuma tela.** O
fluxo de atendimento existe no schema e não existe no produto.

### RLS

| Tabela | Política | Efeito |
|---|---|---|
| `orcamentos` | `orcamentos_public_select` `using (true)` | **qualquer um com a anon key lê a tabela inteira** |
| `orcamentos` | `orcamentos_admin_all` | CRUD para `authenticated` |
| `config_global` | `config_public_select` `using (true)` | leitura pública (só dados de contato) |
| `config_global` | insert e update para `authenticated` | |
| `leads` | `leads_admin_all` | só `authenticated`, sem insert público de propósito |
| `storage.objects` | leitura pública no bucket `fotos-espaco`, escrita para `authenticated` | |

A política pública em `orcamentos` é dispensável: a página do cliente lê pela
service role em `fetchOrcamentoBySlug`, e o painel lê como usuário autenticado,
coberto por `orcamentos_admin_all`.

---

## 4. Autenticação

### Como está montada

O login é Supabase Auth por e-mail e senha, feito no navegador
([login/page.tsx:30](../app/admin/login/page.tsx)). Não existe cadastro: o
usuário admin é criado à mão no painel do Supabase.

Existem três camadas, e só uma delas protege de verdade.

**Middleware** ([middleware.ts:12](../middleware.ts)). Roda em `/admin/:path*` e
faz uma única verificação:

```ts
authenticated = cookies.some(
  (c) => c.name.startsWith("sb-") && c.name.includes("-auth-token")
);
```

Confere o **nome** do cookie. Não lê o valor, não valida assinatura, não consulta
o Supabase. `document.cookie = "sb-x-auth-token=1"` no console derruba a barreira.

**Páginas do admin.** Nenhuma delas chama `requireAuth()` nem verifica sessão.
Elas apenas consultam o banco:

- `/admin` e `/admin/[id]` usam `createServerSupabase()` (anon key + cookie).
  Como a RLS libera `select` para todos, a consulta funciona mesmo sem sessão
  válida e devolve os dados.
- `/admin/leads` usa `createAdminSupabase()`, ou seja, **service role direto,
  ignorando RLS por completo** ([leads/page.tsx:29](../app/admin/leads/page.tsx)).
- `/admin/configuracoes` e `/admin/novo` usam `fetchConfig()`, que também é
  service role.

**Rotas de API.** Aqui sim: `requireAuth()` chama `supabase.auth.getUser()`, que
valida o token contra o servidor do Supabase
([lib/auth-guard.ts:6](../lib/auth-guard.ts)). Toda escrita está protegida.

### O que isso significa na prática

Escrita está segura. Leitura não. Com um cookie forjado, um visitante chega em
`/admin` e vê nomes de clientes, datas, valores e status; abre qualquer proposta
e lê as observações internas; e abre `/admin/leads` para ver nome, WhatsApp e
e-mail de todo mundo que preencheu o formulário do site.

---

## 5. Fluxo operacional, do zero ao cliente

1. **Login** em `/admin/login`. Sucesso leva para `?redirect` ou `/admin`.
2. **Painel.** Lista todas as propostas ordenadas por `created_at desc`, sem
   paginação. Acima dela, o `SetupBanner` some quando os 6 itens de configuração
   estão preenchidos. Se não houver nenhum orçamento, aparece o botão
   "Criar orçamento de exemplo", que insere uma proposta fictícia com valores e
   fotos fixos no código.
3. **Nova proposta.** `/admin/novo` monta o `OrcamentoEditor` em modo `criar`,
   já com todos os padrões do config aplicados.
4. **Edição.** A prévia da proposta é a interface. Cada seção tem um chip com
   olho (mostrar/ocultar) e um lápis (abrir a gaveta). Clicar em qualquer ponto
   da seção também abre a gaveta.
5. **Publicar.** O botão do cabeçalho verde faz POST, grava `publicado: true` e
   redireciona para `/admin/[id]`.
6. **Edições seguintes** salvam sozinhas 4 segundos após a última alteração.
7. **Enviar.** No menu `⋯`: "Copiar link" ou "Copiar mensagem WhatsApp". Ambos
   copiam para a área de transferência e, se o status ainda for "rascunho" e a
   proposta estiver publicada, mudam o status para "enviado" e gravam `sent_at`.
8. **Cliente** abre o link. Se `publicado` for falso, vê só a tela "Proposta em
   preparação". Se for verdadeiro, vê a proposta com as seções ligadas e dois
   botões flutuantes: WhatsApp e Baixar PDF.
9. **PDF.** `window.print()` com as regras `@media print` do
   [globals.css](../app/globals.css). Antes de imprimir, um evento
   `prepare-print` abre as categorias colapsadas do investimento e crava o
   contador do total no valor final. A galeria em carrossel é escondida e
   substituída por um grid de 4 fotos.

---

## 6. O editor visual em detalhe

[components/admin/OrcamentoEditor.tsx](../components/admin/OrcamentoEditor.tsx)

### Estado

Um único objeto `FormState` com 18 campos, montado por `buildInitialForm(config,
orcamento)`. O padrão do config entra em qualquer campo que esteja `null` no
registro.

`useDeferredValue(form)` alimenta `buildVirtualOrcamento`, que monta um objeto
`Orcamento` sintético para a prévia. A intenção é que o preview seja idêntico ao
que o cliente verá depois de salvar e recarregar.

`dirty` é `JSON.stringify(form) !== initialSnapshot`. Há um `beforeunload` ligado
enquanto estiver sujo.

### Gavetas

| Gaveta | Abre para | O que edita | Onde grava |
|---|---|---|---|
| `DrawerCliente` | `cliente`, `dados` | nome, evento, data, horário, convidados, status | orçamento |
| `DrawerTexto` | `sobre` | `sobre_texto` | orçamento |
| `DrawerFotos` | `galeria` | `fotos_selecionadas` + upload | orçamento + Storage |
| `DrawerDecoracao` | `decoracao` | `decoracao_texto` + `itens_decoracao` | orçamento |
| `DrawerBuffet` | `buffet` | `buffet_dados` | orçamento |
| `DrawerServicos` | `servicos` | `servicos_opcionais_dados` | orçamento |
| `DrawerItens` | `investimento` | 3 listas de itens + faixas por dia | orçamento |
| `DrawerTexto` | `pagamento` | `condicoes_pagamento` | orçamento |
| `DrawerContato` | `contato` | 5 campos de contato | **config global, na hora** |
| `DrawerObservacoes` | menu `⋯` | `observacoes` | orçamento |

`DrawerContato` é o ponto fora da curva: salva direto em `/api/admin/config` com
botão próprio, fora do ciclo de estado do editor. Tem um aviso amarelo dizendo
que a mudança afeta todos os orçamentos.

### Desfazer

Duas coisas diferentes com o mesmo nome.

- **Botão no cabeçalho** (ícone de seta). Pilha de até 20 estados
  (`MAX_HISTORY`). Recebe um push quando uma gaveta fecha, quando uma seção é
  ligada ou desligada e quando um save termina. Não registra digitação.
- **Botão "Desfazer" no rodapé da gaveta.** Restaura o snapshot tirado no momento
  em que aquela gaveta abriu e fecha a gaveta.

### Autosave

```ts
useEffect(() => {
  if (mode !== "editar" || !dirty || !orcamento) return;
  autoSaveTimer.current = setTimeout(autoSave, 4000);
}, [form]);
```

Vale para qualquer proposta já criada, publicada ou não. Em modo `criar` não
existe autosave, porque não há `id` ainda.

### Botão principal e menu

O botão do cabeçalho tem três estados: "Publicar" (enquanto `publicado` for
falso), "Salvar" (publicado e sujo) e "Salvo" com check (publicado e limpo,
desabilitado).

O menu `⋯` reúne: Copiar link, Copiar mensagem WhatsApp, Ver como cliente,
Observações internas, alternar Modo formulário / Modo visual, Duplicar e Excluir.
Os três primeiros só aparecem quando já existe `publicUrl`, ou seja, em modo
`editar`.

---

## 7. Modo formulário

[components/admin/OrcamentoForm.tsx](../components/admin/OrcamentoForm.tsx) é o
editor original, anterior ao visual, ainda alcançável pelo menu `⋯`. Usa o mesmo
`FormState` e as mesmas funções de normalização, mas **instancia o próprio
estado**, com `useState(() => buildInitialForm(config, orcamento))`.

| | Modo visual | Modo formulário |
|---|---|---|
| Prévia ao vivo | sim | não |
| Autosave | sim | não |
| Botão publicar | sim | não, salva com o `publicado` que já existia |
| Cria rascunho não publicado | não | sim |
| Blocos de ajuda `SectionHelp` | não | sim, em toda seção |
| Seções visíveis | chips na prévia | grade de 9 checkboxes |
| Copiar para WhatsApp | menu `⋯` | botão no topo, com `alert()` |

Trocar de modo dentro do editor descarta silenciosamente o que estiver não salvo
no outro. Ver item 12.4.

---

## 8. Herança de padrões: como funciona

O mecanismo central do sistema, e a origem de três problemas.

**Ao carregar** (`buildInitialForm`), todo campo `null` no orçamento recebe o
valor do `config_global`. A dona vê os textos padrão já preenchidos.

**Ao salvar** (`normalizeForSave`), o caminho inverso: se o valor do formulário
for idêntico ao padrão, grava `null` em vez do texto.

```ts
sobre_texto: form.sobre_texto.trim() === defaults.sobre.trim()
  ? null
  : form.sobre_texto || null,
```

Assim, mudar o texto em Configurações propaga para todos os orçamentos que nunca
customizaram aquele campo, e não toca nos que customizaram. É uma boa decisão.

**Ao exibir** ([OrcamentoView.tsx:49](../components/public/OrcamentoView.tsx)),
o `??` fecha o ciclo:

```ts
const sobreTexto = orcamento.sobre_texto ?? config.sobre_texto;
```

A consequência: `null` quer dizer "herdar", então **não existe forma de gravar
"vazio"**. Ver itens 12.5 e 12.6.

Campos que participam da herança: `sobre_texto`, `decoracao_texto`,
`condicoes_pagamento`, `buffet_dados`, `servicos_opcionais_dados`,
`precos_espaco_por_dia`, `fotos_selecionadas` (quando o array está vazio).

---

## 9. Faixas de aluguel por dia da semana

A regra de negócio mais sutil do sistema, introduzida no commit `66ac1db` e
corrigida duas vezes depois (`86b1360`, `0968ed7`).

A dona cobra valores diferentes pelo salão conforme o dia. Antes ela criava três
itens em `itens_espaco` como gambiarra, e os três somavam no total, inflando a
proposta.

**Formato.** `{ seg_qui, sex, sab_dom }`, cada um `number | null`.

**Estados.**
- Campo `null`: modo legado. "Espaço" é uma categoria colapsável normal com
  `itens_espaco`.
- Campo preenchido com pelo menos um valor maior que zero (`temFaixasAtivas`):
  o componente `EspacoFaixas` substitui a categoria e mostra os três cartões.

**Destaque.** `tierFromDate(cliente_data)` mapeia a data para a faixa e marca
aquele cartão com "Seu dia". Usa `T12:00:00` para não escorregar de fuso.
Sem data, nenhum cartão é destacado.

**Regra de ouro:** o aluguel nunca entra no total. O cliente lê os três valores
e soma mentalmente o do dia escolhido. A caixa verde muda de "Valor total" para
"Demais categorias", e some por completo se decoração e buffet estiverem zerados.

Com as faixas ativas, `itens_espaco` continua existindo, renomeado para "Outros
itens do espaço (caução, extras)", e esses sim somam.

---

## 10. Cálculo do total: quatro implementações

A mesma fórmula está escrita quatro vezes, em arquivos diferentes:

| Local | Função |
|---|---|
| [OrcamentosList.tsx:8](../components/admin/OrcamentosList.tsx) | `calcularTotal` |
| [OrcamentoForm.tsx:75](../components/admin/OrcamentoForm.tsx) | inline |
| [DrawerItens.tsx:55](../components/admin/drawers/DrawerItens.tsx) | inline |
| [Investimento.tsx:162](../components/public/Investimento.tsx) | `totalSemAluguel` |

Todas concordam hoje (espaço + decoração + buffet, sem faixas). Nenhuma é
compartilhada. Existe ainda `valorAluguelEspaco` em
[orcamento-helpers.ts:47](../lib/orcamento-helpers.ts), 19 linhas que **nunca são
chamadas por ninguém**, sobra da versão em que o aluguel somava.

---

## 11. Outras áreas

### Fotos

`FotosPicker` monta a grade a partir de duas fontes: uma lista fixa de 16
caminhos no código
([FotosPicker.tsx:12](../components/admin/FotosPicker.tsx)) e o que estiver no
bucket `fotos-espaco` do Storage, limitado a 200 itens.

`public/fotos/` tem **19 arquivos WebP**, e `content/espaco.ts` cataloga os 19.
Os três que faltam na lista do picker são `img_6587`, `img_6592` e `img_6658`
(fachada de dia, detalhe da fachada e cozinha). São invisíveis para o admin.

Upload manda para o Storage com nome `${Date.now()}-${nome-sanitizado}` e cache
de um ano. Não existe interface para apagar, renomear ou reordenar fotos.

### Leads

`/admin/leads` é uma lista somente leitura dos 200 mais recentes. Cada card
mostra nome, tipo de evento, data, convidados, mensagem, tempo relativo, origem
e um botão que abre o WhatsApp com mensagem pronta.

Sem busca, sem filtro, sem paginação, sem mudança de status e sem anotação
interna. Não há ligação nenhuma entre um lead e o orçamento gerado a partir dele.

A rota `/api/leads` é a parte mais bem defendida do projeto: zod, honeypot
(responde 200 para o bot não insistir) e rate limit em memória de 5 por 10
minutos por IP, com a limitação declarada no comentário de não ser compartilhado
entre instâncias serverless.

### Guia de uso

`GuiaUso` é um modal com cinco abas e cerca de 35 tópicos escritos para a dona.
Está no header de toda página do admin. É documentação de produto de verdade, e
está desatualizada em quatro pontos. Ver item 12.7.

---

## 12. Divergências, riscos e lacunas

Ordenado por gravidade.

### 12.1 Proteção do admin é forjável (crítico). RESOLVIDO em 18/08

`middleware.ts` validava o nome do cookie, e nenhuma página do admin verificava
sessão. Como a RLS de `orcamentos` era pública e `/admin/leads` usava service
role, um cookie inventado dava acesso de leitura a tudo: clientes, valores,
observações internas e a base de leads.

Corrigido em três frentes:

- `requirePageAuth()` em [lib/auth-guard.ts](../lib/auth-guard.ts), chamado na
  primeira linha das seis páginas do painel. Usa `getUser()`, que valida o token
  contra o servidor do Supabase.
- `/admin/leads` deixou de usar a service role e passou a ler como o usuário
  logado, pela policy `leads_admin_all`.
- Migration [0006](../supabase/migrations/0006_fecha_leitura_publica_orcamentos.sql)
  derrubou `orcamentos_public_select`.

**Cuidado herdado dessa correção:** o middleware tinha uma regra que mandava
quem "parecia logado" de `/admin/login` para `/admin`. Com a guarda nas páginas,
isso virou laço infinito toda vez que a sessão expirava, porque a página mandava
de volta para o login. A regra foi removida. Não reintroduzir.

### 12.2 A coluna `publicado` não existe nas migrations (crítico). RESOLVIDO em 18/08

Corrigido pela migration
[0005](../supabase/migrations/0005_kits_e_publicado.sql), que também acerta o
default e o `not null` no banco de produção, onde a coluna tinha sido criada à
mão. O texto abaixo fica como registro do que era.

Aparece em [types/orcamento.ts:52](../types/orcamento.ts), no insert de
[orcamentos/route.ts:27](../app/api/admin/orcamentos/route.ts) e no gate de
[orcamento/[slug]/page.tsx:41](../app/orcamento/[slug]/page.tsx). Não aparece em
nenhum `.sql`. Um banco novo levantado pelas migrations não roda o sistema.

Precisa de uma migration `0005` com `alter table ... add column if not exists
publicado boolean not null default false`.

### 12.3 Não dá para desligar as faixas num orçamento específico (alto). RESOLVIDO em 18/08

Sequência: config global tem faixas ativas, você desliga o toggle num orçamento.
`normalizeForSave` gravava `null`. Na exibição,
`orcamento.precos_espaco_por_dia ?? config.precos_espaco_por_dia` trazia as
faixas de volta. O toggle não tinha efeito enquanto o padrão global estivesse
ligado.

A raiz era `null` significando duas coisas: "herdar o padrão" e "desligado".
Desligado passou a gravar `FAIXAS_DESLIGADAS`
([lib/orcamento-helpers.ts](../lib/orcamento-helpers.ts)), um objeto com as três
faixas nulas: atravessa o `??` intacto e `temFaixasAtivas` continua devolvendo
falso. Sem coluna nova.

O liga/desliga do `EspacoPrecosEditor` também virou estado próprio do
componente. Derivado do valor, ele pulava para desligado sozinho no instante em
que os três campos ficavam vazios para redigitação.

### 12.4 Trocar de modo descarta edições (alto). RESOLVIDO em 18/08

`OrcamentoEditor` e `OrcamentoForm` mantinham estados independentes construídos
do mesmo registro. Editar no visual, abrir "Modo formulário" e salvar gravava a
versão antiga do banco por cima. Pior: o autosave do editor pai continuava ativo
enquanto o formulário estava na tela, então os dois escreviam alternadamente.

O `OrcamentoForm` não tem mais estado próprio. Recebe `form`, `up`, `onSalvar`,
`onExcluir` e `onDuplicar` por props, e os dois modos passaram a ser duas telas
do mesmo formulário. Saíram 109 linhas duplicadas de submit, delete e duplicate.

### 12.5 Não é possível esvaziar um texto (médio)

`form.sobre_texto || null` transforma string vazia em `null`, e `null` significa
herdar. Apagar o texto de uma seção faz o padrão global voltar. Para "esconder"
o texto, o caminho é desligar a seção inteira.

### 12.6 O badge Padrão/Customizado mente quando o campo está vazio (médio)

`EditableTextField` compara `value === defaultValue`. Com o campo limpo, mostra
"Customizado", mas o que será gravado é `null`, que é exatamente o padrão.

### 12.7 O guia de uso descreve o que não existe (médio)

- "Salvar rascunho, botão discreto ao lado de Publicar"
  ([GuiaUso.tsx:164](../components/admin/GuiaUso.tsx)). Esse botão nunca foi
  construído. O parâmetro `draftOnly` em
  [OrcamentoEditor.tsx:178](../components/admin/OrcamentoEditor.tsx) está na
  assinatura e não é usado em lugar nenhum.
- "Esqueci minha senha" na tela de login
  ([GuiaUso.tsx:260](../components/admin/GuiaUso.tsx)). A tela não tem esse link,
  e não existe rota de recuperação.
- "Duplicar" e "Copiar mensagem WhatsApp" descritos como estando no rodapé do
  editor. Migraram para o menu `⋯` no commit `e3368f2`.
- O indicador de status citado como "Rascunho, não publicado" e "Publicado ✓"
  mostra hoje "Rascunho", "Publicado", "Não salvo", "Salvando..." ou "Salvo ✓".

### 12.8 Em modo `criar` só existe publicar (médio)

O botão principal sempre chama `handleSave({ publish: true })` para uma proposta
nova. Não há como criar um rascunho pelo editor visual. Pelo modo formulário há,
o que torna o comportamento inconsistente entre as duas telas.

### 12.9 Propostas de faixas aparecem como R$ 0,00 na lista (médio)

`calcularTotal` ignora `precos_espaco_por_dia`, coerente com a regra de negócio.
O efeito colateral é que um orçamento em que todo o valor está nas faixas aparece
zerado no painel. A dona não consegue ordenar nem comparar propostas por ela.

### 12.10 Duplicar copia `publicado` mas zera `status` (baixo)

[duplicate/route.ts:34](../app/api/admin/orcamentos/[id]/duplicate/route.ts)
remove `id`, `created_at`, `updated_at`, `sent_at` e `slug`, força
`status: "rascunho"` e deixa `publicado` passar no spread. Duplicar uma proposta
publicada gera uma cópia já no ar, com status de rascunho.

### 12.11 Rotas de admin aceitam qualquer corpo (baixo)

`POST /api/admin/orcamentos` faz `insert({ ...body })` e
`PATCH /api/admin/config` faz `update(body)`. Sem zod, sem allowlist de colunas.
Com um único usuário admin o risco é pequeno, mas contrasta com o cuidado de
`/api/leads`, e qualquer erro de campo vira erro cru do Postgres na tela.

### 12.12 "Desfazer" na gaveta de contato não desfaz nada (baixo)

`DrawerContato` grava no config global via fetch próprio, e o `onUndo` que recebe
é `undoDrawer`, que restaura o `FormState` do orçamento. O botão existe, aparece
e não tem relação com o que foi alterado.

### 12.13 Sem paginação em nenhuma lista (baixo)

`/admin` faz `select("*")` de todos os orçamentos, com todos os jsonb. `/admin/leads`
limita a 200. Hoje o volume é pequeno. Degrada de forma previsível.

### 12.14 Código morto (baixo)

- `valorAluguelEspaco` em [orcamento-helpers.ts:47](../lib/orcamento-helpers.ts)
- `TIER_LABELS_CURTO` em [format.ts:50](../lib/format.ts)
- `draftOnly` em `handleSave`
- `leads.status` e `leads.observacoes_internas` no schema

### 12.15 `.env.local` tem chaves duplicadas (baixo)

`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` e
`SUPABASE_SERVICE_ROLE_KEY` aparecem duas vezes no arquivo. Vale a última
ocorrência, o que torna fácil editar a linha errada e não entender o resultado.

### 12.16 Três fotos fora do picker (baixo). RESOLVIDO em 18/08

`img_6587`, `img_6592`, `img_6658` estavam em `public/fotos/`, catalogadas em
`content/espaco.ts` e com blur gerado, mas fora de `FOTOS_BUNDLED`.

O `FotosPicker` parou de manter a lista escrita à mão e passou a derivar de
`FOTOS`, em `content/espaco.ts`. Foram de 16 para 18 fotos, com `espacoKids` de
fora porque a área não está pronta. Entrou também um botão de excluir foto do
Storage, que não existia, e era a causa de "não conseguimos trocar as fotos": dava
para subir, não para apagar.

---

## 13. O que não existe hoje

Levantado para servir de matéria-prima ao escopo da atualização, sem juízo sobre
prioridade.

**Propostas**
- Rascunho de verdade no editor visual
- Histórico de versões ou de alterações
- Data de validade da proposta
- Aceite do cliente registrado no sistema (o status é sempre manual)
- Notificação quando o cliente abre o link
- Desconto, acréscimo, imposto ou qualquer linha que não seja `qtd × valor`
- Modelos de proposta (só duplicação)
- Exportação em PDF do lado do servidor (depende do diálogo de impressão do
  navegador do cliente)

**Leads**
- Mudar status, anotar, arquivar
- Buscar e filtrar
- Converter lead em orçamento com os dados já preenchidos
- Aviso de lead novo por e-mail ou WhatsApp

**Painel**
- Qualquer número agregado: propostas no mês, taxa de conversão, ticket médio
- Agenda ou visão de calendário das datas já reservadas
- Verificação de conflito de data entre propostas aceitas

**Plataforma**
- Segundo usuário, papéis, log de quem alterou o quê
- Recuperação de senha
- Testes de qualquer natureza, e nenhum workflow de CI em `.github/`
- Migrations versionadas por ferramenta (hoje é copiar e colar no SQL Editor)

---

## 14. Restrições que a atualização precisa respeitar

Do [README](../README.md), e valem como regra dura:

- `/orcamento/[slug]` **não pode mudar de nome nem de formato**. Existem
  propostas já enviadas por WhatsApp apontando para esses endereços.
- `/links` idem, e por motivo mais grave: há cartão de visita impresso com QR
  Code para `dondokarecepcoes.vercel.app/links`.
- O domínio `.vercel.app` não pode ser removido nem o projeto renomeado na
  Vercel, porque o domínio deriva do nome do projeto.
- Slug de orçamento nunca é recalculado depois da criação, mesmo que o nome do
  cliente mude. Manter assim.

---

## 15. O que mudou depois deste levantamento

Entre 17 e 18/08/2026, a pedido do João, entrou o sistema de kits e saíram as
correções marcadas acima. Resumo do que existe agora e não existia no
levantamento.

### Kits

Três níveis, com o kit guardando **cópia** dos itens e nunca referência, de modo
que mexer na biblioteca não altera kit montado nem proposta enviada:

| Nível | Onde mora | O que é |
|---|---|---|
| Biblioteca | `config_global.biblioteca_itens` | o cardápio cru do fornecedor, agrupado. Só serve de fonte para os checkboxes |
| Kit | `config_global.kits_catalogo` | o pacote de venda, sem preço nenhum |
| Linha do orçamento | `itens_buffet` / `itens_decoracao` | o kit escolhido, com o preço que o João digita |

Semente em [content/kits.ts](../content/kits.ts), transcrita dos PDFs do
fornecedor: 21 grupos de biblioteca de buffet, 3 de decoração, 7 kits de buffet
e 1 de decoração. Sem preço e sem logística (deslocamento, frete, gás, botijão,
material de preparo e de servir ficaram de fora), e sem o nome do fornecedor em
nada que chegue ao cliente.

Cada grupo do kit tem uma **nota** opcional. É ela que separa "à vontade" de
"4 por convidado, à escolha", e sem ela o kit promete mais do que o fornecedor
entrega.

`ItemOrcamento` ganhou `inclui`, `observacoes`, `kit_id` e `por_pessoa`, todos
opcionais, então orçamento antigo continua válido.

**Por pessoa:** com a marcação ligada, `qtd` acompanha `cliente_convidados` via
`sincronizarPorPessoa` ([lib/kits.ts](../lib/kits.ts)). A quantidade é escrita no
próprio item em vez de multiplicada na exibição, porque o total é calculado em
quatro lugares diferentes a partir de `qtd` (ver seção 10) e assim os quatro
continuam certos sem serem tocados.

### Telas

- `/admin/kits`, quarta entrada do menu. Abas Buffet e Decoração, sub-abas Kits
  e Biblioteca. Criar, renomear, duplicar, excluir. Seleção por checkbox com
  busca, mais campo para item fora da lista.
- Na gaveta de itens do orçamento, botão **Adicionar kit** nas abas Buffet e
  Decoração, com aviso quando o orçamento tem menos convidados que o mínimo do
  kit.
- Na proposta, a linha do kit expande com a microcópia "Toque para ver os N
  itens inclusos". Categoria que contém kit já abre expandida, para não exigir
  dois cliques. As regras `@media print` ganharam `.kit-inclusos`, senão o PDF
  sairia com o nome do pacote e nenhum item.

### Área kids

Saiu da proposta. A seção "Sobre o ambiente" passou a ler `DIFERENCIAIS` de
`content/espaco.ts`, a mesma lista curada que a home usa, o que de quebra
eliminou a duplicação de verdades sobre a casa e trouxe "Dois ambientes", que
faltava. O bullet no texto padrão foi removido pela migration 0005.

### Pendência de negócio

`content/espaco.ts` afirma que a Dondoka **não faz buffet nem decoração**, que
indica parceiros. Vender pacote dos dois contradiz o site e a FAQ pública. O
João disse que o site muda depois.
