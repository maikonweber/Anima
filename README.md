# EmotiveCare (MutterCorp) — produto frontend

Cliente web Next.js (App Router) da plataforma de acompanhamento emocional contínuo com **SENTIO AI**, integrado à API NestJS.

## Pré-requisitos

- Node.js 20+
- API NestJS rodando (com seed: `pnpm db:seed`)
- Swagger da API: `{API_URL}/api`

## Configuração

1. Copie as variáveis de ambiente:

```bash
cp .env.local.example .env.local
```

2. Ajuste `NEXT_PUBLIC_API_URL` se a API não estiver em `http://localhost:3000`.

> **Portas:** a API costuma usar a porta `3000`. Rode o Next em outra porta, por exemplo:
>
> ```bash
> npm run dev -- -p 3001
> ```

## Instalação e execução

```bash
npm install
npm run dev -- -p 3001
```

Abra [http://localhost:3001](http://localhost:3001).

## Deploy na Vercel

No painel do projeto: **Settings → Environment Variables**, adicione:

| Nome | Valor (Production) |
|------|----------------------|
| `NEXT_PUBLIC_API_URL` | `https://api.muttercorp.com.br` |

Use o mesmo valor em **Preview** se os previews também devem falar com a API de produção.

Depois de salvar, faça um **Redeploy** (variáveis `NEXT_PUBLIC_*` entram no build).

> A API em [https://api.muttercorp.com.br](https://api.muttercorp.com.br) precisa permitir CORS com a origem do seu app Vercel (ex.: `https://seu-app.vercel.app`).

## Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Landing |
| `/login`, `/register` | Autenticação |
| `/forgot-password` | Solicitar link de redefinição de senha |
| `/reset-password?token=...` | Nova senha (link do e-mail) |
| `/dashboard` | Resumo semanal + atalho novo registro |
| `/diary/new` | Formulário de novo registro |
| `/diary/[id]` | Detalhe + análise IA |
| `/diary` | Histórico |

## Arquitetura

```
lib/
  api-client.ts      # fetch + Bearer JWT
  types.ts           # tipos da API (camelCase)
  api/               # auth, diary
providers/           # AuthProvider, QueryProvider
hooks/               # use-diary, use-auth
components/
  diary/             # EnergySlider, EmotionPicker, WeekSummaryChart
  analysis/          # AnalysisCard
```

## Fluxo principal

1. Login/registro → token em `localStorage` + redirecionamento para `/dashboard`
2. Novo registro em `/diary/new` → `POST /diary-entries`
3. Redirecionamento para `/diary/[id]` → análise automática via `POST /diary-entries/:id/analyze`
4. Dashboard consome `GET /diary-entries/week-summary` (JWT)
5. Esqueci a senha: `POST /auth/forgot-password` → e-mail com link para `/reset-password?token=...` → `POST /auth/reset-password`

## Scripts

```bash
npm run dev      # desenvolvimento
npm run build    # build de produção
npm run start    # servidor de produção
npm run lint     # ESLint
```
