# Dondoka Recepções

Três coisas no mesmo projeto Next.js e no mesmo deploy:

1. **Site institucional** (`/`, `/o-espaco`, `/buffet`, `/eventos/*`, `/galeria`,
   `/perguntas-frequentes`, `/contato`, `/guias/*`) — público, estático, otimizado
   para busca no Google e para citação por assistentes de IA.
2. **Sistema de propostas** (`/admin` + `/orcamento/[slug]`) — cada cliente recebe
   um link único, mobile-first, com opção de baixar PDF.
3. **Bio-link do Instagram** (`/links`).

## ⚠️ URLs que não podem cair

Existem **cartões de visita impressos** com QR Code apontando para
`dondokarecepcoes.vercel.app/links`, e propostas já enviadas a clientes pelo
WhatsApp em `dondokarecepcoes.vercel.app/orcamento/[slug]`. Material impresso não
se recolhe, e mensagem de WhatsApp não se reescreve.

Portanto:

- **Nunca renomear o projeto na Vercel** — o domínio `.vercel.app` deriva do nome
  do projeto. Renomear quebra o QR de todos os cartões, de forma irreversível.
- **Nunca remover o domínio `.vercel.app`** da lista de domínios do projeto, mesmo
  depois que `dondokarecepcoes.com.br` estiver ativo. Adicionar domínio próprio
  não desliga o `.vercel.app`.
- **Nunca renomear as rotas `/links` e `/orcamento/[slug]`.**
- Todo material novo impresso deve usar `dondokarecepcoes.com.br/links`.

Depois de qualquer deploy que toque em `middleware.ts`, roteamento ou domínios:
abrir `dondokarecepcoes.vercel.app/links` e escanear um cartão físico.

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
  (site)/                     SITE INSTITUCIONAL — route group com header/footer próprios
    layout.tsx                header + footer + JSON-LD do negócio
    page.tsx                  home
    o-espaco/ buffet/ galeria/ perguntas-frequentes/ contato/
    eventos/[slug]/           4 páginas estáticas (generateStaticParams)
    guias/ guias/[slug]/      índice + guias estáticos
    opengraph-image.tsx       imagem de compartilhamento gerada no deploy
  orcamento/[slug]/page.tsx   proposta pública (1 por cliente) — noindex
  links/page.tsx              bio-link do Instagram — noindex, rota permanente
  admin/                      painel (protegido por auth) — noindex
    login/ page.tsx novo/ [id]/ configuracoes/
    leads/                    leads vindos do formulário do site
  api/admin/                  rotas autenticadas (CRUD)
  api/leads/                  recebe o formulário público (zod + honeypot + rate limit)
  sitemap.ts robots.ts        SEO técnico
components/
  site/                       SiteHeader, SiteFooter, HeroSite, VideoTour,
                              FAQAccordion, GaleriaGrid, FormOrcamento, CTASection
  public/                     Hero, Sobre, Galeria, Investimento, Pagamento, Contato (proposta)
  admin/                      Form, ItensEditor, FotosPicker, ConfigForm, AdminShell
  ui/                         Button, Reveal, SectionTitle, Icons, ScrollProgress
content/                      COPY DO SITE — versionada, sem banco
  espaco.ts                   diferenciais, fotos, vídeos, FAQ geral
  eventos.ts                  conteúdo das 4 páginas de tipo de evento
  guias.ts                    os guias (adicionar objeto = publicar guia)
lib/
  site-config.ts              NAP canônico (nome, endereço, telefone) — fonte única
  schema.tsx                  JSON-LD: EventVenue, FAQPage, VideoObject, Article…
  supabase/ format.ts slug.ts auth-guard.ts queries.ts
public/
  logos/ patterns/
  fotos/                      19 fotos do espaço (WebP otimizado)
  video/                      tour.mp4, evento.mp4, decor-loop.mp4 + posters
  llms.txt                    resumo da marca para crawlers de IA
supabase/migrations/          0001_init … 0004_leads
middleware.ts                 protege /admin/*
```

### Onde mexer para cada coisa

| Quero… | Arquivo |
|---|---|
| Trocar telefone, endereço, Instagram | `lib/site-config.ts` (muda em todo lugar de uma vez) |
| Editar texto de uma página de evento | `content/eventos.ts` |
| Publicar um guia novo | adicionar objeto em `content/guias.ts` |
| Adicionar/remover pergunta da FAQ | `content/espaco.ts` |
| Trocar foto de uma seção | `content/espaco.ts` → `FOTOS` |

## Comandos úteis

- `npm run dev` — desenvolvimento (porta 3000 padrão)
- `npm run build` — build de produção. **Não rodar com o `dev` ligado**: os dois
  escrevem no mesmo `.next` e corrompem os chunks. Se acontecer, `rm -rf .next`.
- `npm run convert-fotos` — converter HEICs originais para WebP
- `npm run otimizar-fotos` — reduzir fotos grandes já em `public/fotos/` e
  padronizar o nome em minúsculo (a Vercel roda Linux, onde a URL diferencia
  maiúscula de minúscula)

### Performance de imagem

Quatro decisões medidas, todas em `next.config.mjs`:

| Decisão | Porquê |
|---|---|
| **WebP, sem AVIF** | Codificar AVIF leva ~3s por variante contra ~0,45s do WebP, e economiza só 5% de peso. Como a otimização acontece sob demanda na primeira vez que alguém pede aquele tamanho, os 3s viram "imagem demorando pra carregar" na tela do visitante. |
| **`deviceSizes` sem 2048 e 3840** | O site nunca usa essas larguras. Cada uma seria uma transformação a mais gerada e cobrada. |
| **`Cache-Control: immutable`** em `/fotos`, `/video`, `/logos`, `/patterns` | Esses arquivos não mudam. Para trocar algum, troque o nome do arquivo em vez de sobrescrever. |
| **Patterns em WebP** | O `pattern-claro.jpg` tinha 382 KB e aparece no rodapé de toda página, servido cru porque `background-image` não passa pelo `next/image`. Em WebP a 1920px são 10 KB. |

**Sempre defina `sizes`** em imagem com `fill` ou logo. Sem ele o navegador baixa a maior variante do `srcset`: o logo do header chegou a vir em 3840px de largura para ser exibido a 40px.

**Placeholders de desfoque**: o componente [`components/site/Foto.tsx`](components/site/Foto.tsx) embute uma miniatura borrada de ~200 bytes no HTML, então a área da foto nunca fica vazia. Use `<Foto>` no lugar de `<Image>` para fotos do acervo. Depois de adicionar fotos novas, rode `npm run gerar-blur`.

### Vídeos

Os `.mov` originais ficam fora do git (`.gitignore`). O que vai a produção é o
transcodificado em `public/video/`, ~8 MB cada em 720×1280:

```bash
ffmpeg -i "entrada.mov" -vf "scale=-2:1280" -c:v libx264 -crf 28 -preset slow -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 96k "public/video/tour.mp4"
```

## Identidade visual

Paleta: `#7F7957` oliva · `#907655` bronze · `#DBD1C3` areia · `#F7F4EE` creme · `#010101` carvão
Tipografia: Playfair Display (títulos) + Inter (corpo)

## PDF

O download de PDF usa `window.print()` com regras `@media print` em `globals.css`.
Sem dependências, fidelidade visual completa. O cliente faz "Salvar como PDF" no diálogo do navegador.
