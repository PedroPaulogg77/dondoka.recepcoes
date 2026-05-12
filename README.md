# Dondoka Recepções — Sistema de Orçamentos

Web app para a Dondoka enviar propostas personalizadas via WhatsApp.
Cada cliente recebe um link único, mobile-first, com a apresentação visual da marca
e opção de baixar PDF.

## Stack
- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Supabase (Auth + Postgres + Storage)
- Framer Motion (animações)

## Setup (uma única vez)

### 1. Variáveis de ambiente
Crie `.env.local` (copie do `.env.example`) e preencha:

```
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_APP_URL=https://seu-dominio.vercel.app
NEXT_PUBLIC_WHATSAPP_NUMERO=5531972519129
```

### 2. Supabase
1. Crie um projeto novo em supabase.com
2. SQL Editor → cole e rode `supabase/migrations/0001_init.sql`
3. Authentication → Users → "Add user" → criar o usuário admin com email/senha
   (apenas esse usuário poderá entrar no /admin)

### 3. Subir fotos iniciais (já estão em `public/fotos/`)
O FotosPicker já mostra as 16 fotos convertidas como fonte primária.
Uploads novos via painel vão para o bucket `fotos-espaco` no Supabase Storage.

### 4. Local
```
npm install
npm run dev
```

### 5. Deploy Vercel
- `vercel link` → escolha o projeto
- Configure as 5 envs no dashboard da Vercel
- `vercel --prod`

## Como usar (operação diária)

1. Acessar `/admin/login` e entrar
2. Clicar em **+ Novo orçamento**
3. Preencher cliente, data, evento, horário, convidados
4. Adicionar itens em **Espaço**, **Decoração**, **Buffet** (qtd × valor unitário)
5. Marcar/desmarcar seções visíveis (todas marcadas por default)
6. Selecionar fotos do espaço para a galeria deste orçamento
7. **Salvar** → aparece o botão "Copiar para WhatsApp"
8. Cole no WhatsApp do cliente
9. Cliente abre o link → vê a proposta → pode baixar PDF (botão flutuante)

## Estrutura de arquivos

```
app/
  page.tsx                    landing institucional
  orcamento/[slug]/page.tsx   proposta pública (1 por cliente)
  admin/                      painel (protegido por auth)
    login/                    tela de login
    page.tsx                  lista de orçamentos
    novo/                     criar
    [id]/                     editar
    configuracoes/            defaults globais
  api/admin/                  rotas autenticadas (CRUD)
components/
  public/                     Hero, Sobre, Galeria, Decoração, Investimento, Pagamento, Contato
  admin/                      Form, ItensEditor, FotosPicker, ConfigForm, AdminShell
  ui/                         Button, Reveal, SectionTitle, ScrollProgress
lib/
  supabase/                   clients
  format.ts                   brl, dataExtenso, slugify
  slug.ts                     unicidade de slug
  auth-guard.ts               proteção das API routes
  queries.ts                  fetch de orçamento + config
public/
  logos/                      logo-1..6, icone-1..5, logo-tagline-1..5
  patterns/                   pattern-claro.jpg, pattern-escuro.jpg
  fotos/                      16 fotos do espaço (WebP otimizado)
supabase/migrations/0001_init.sql
middleware.ts                 protege /admin/*
```

## Comandos úteis

- `npm run dev` — desenvolvimento (porta 3000 padrão)
- `npm run build` — build de produção
- `npm run convert-fotos` — reconverter HEICs originais para WebP

## Identidade visual

Paleta: `#7F7957` oliva · `#907655` bronze · `#DBD1C3` areia · `#F7F4EE` creme · `#010101` carvão
Tipografia: Playfair Display (títulos) + Inter (corpo)

## PDF

O download de PDF usa `window.print()` com regras `@media print` em `globals.css`.
Sem dependências, fidelidade visual completa. O cliente faz "Salvar como PDF" no diálogo do navegador.
