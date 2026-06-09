# Frontend — Planos, Stripe e fim do preview

API base: `https://api.muttercorp.com.br` (ou `NEXT_PUBLIC_API_URL`)

## 1. O que mudou (breaking changes)

| Antes | Agora |
|---|---|
| Pagamentos via AbacatePay | Pagamentos via Stripe |
| `abacatePayConfigured` | `stripeConfigured` |
| `abacateProductId` em `/subscription/plans` | `stripePriceId` |
| `POST /subscription/portal` = cancelamento (legado) | `POST /subscription/portal` = portal de cobrança Stripe |
| `PREVIEW_MODE=true` (tudo liberado) | `previewMode: false` — limites ativos |

**Remover do frontend:**

- Banner de preview (quando `previewMode === false`)
- Referências a AbacatePay
- Lógica que assumia uso ilimitado

## 2. Feature flags (público, sem auth)

`GET /feature-flags`

```json
{ "previewMode": false }
```

- `false` → aplicar paywall/limites normalmente
- `true` → modo demonstração (improvável em produção agora)

## 3. Configuração Stripe (público, sem auth)

`GET /subscription/config`

```json
{
  "paymentsEnabled": true,
  "stripePublishableKey": "pk_live_..."
}
```

**Uso no front:**

- Chamar no boot da app (junto com `/feature-flags`)
- Se `paymentsEnabled === false`, desabilitar botões de upgrade/checkout
- A publishable key vem da API — não hardcodar no front

## 4. Catálogo de planos (público)

`GET /subscription/plans`

```json
[
  {
    "slug": "essencial",
    "nome": "Essencial",
    "descricao": "Plano gratuito com limites mensais",
    "limits": { },
    "stripePriceId": null
  },
  {
    "slug": "pleno",
    "nome": "Pleno",
    "descricao": "...",
    "limits": { },
    "stripePriceId": "price_xxx"
  },
  {
    "slug": "cuidado",
    "nome": "Cuidado",
    "descricao": "...",
    "limits": { },
    "stripePriceId": "price_xxx"
  }
]
```

### Limites por plano (referência UI)

| Slug | Diário/mês | IA/mês | Assistente/mês | Histórico | Care share | Care view | Pacientes |
|---|---|---|---|---|---|---|---|
| essencial | 15 | ilimitado | 10 | 30 dias | 1 convite | não | 0 |
| pleno | ilimitado | ilimitado | 40 | ilimitado | 1 convite | não | 0 |
| cuidado | ilimitado | ilimitado | 40 | ilimitado | não | sim | 20 |

`limit: null` = sem limite mensal.

## 5. Assinatura do usuário (auth obrigatório)

`GET /subscription/me`  
`Authorization: Bearer <accessToken>`

```json
{
  "plan": {
    "slug": "essencial",
    "nome": "Essencial",
    "limits": { }
  },
  "status": "active",
  "currentPeriodEnd": "2026-07-09T00:00:00.000Z",
  "stripeConfigured": true,
  "sponsoredByPsychologist": true,
  "usage": {
    "period": "2026-06",
    "diaryEntries": { "used": 3, "limit": 15 },
    "aiAnalyses": { "used": 1, "limit": null },
    "assistantMessages": { "used": 2, "limit": 10 },
    "careInvitesActive": { "used": 0, "limit": 1 },
    "accessiblePatients": { "used": 0, "limit": 0 }
  }
}
```

**Campos importantes:**

- `plan.slug` + `usage.*` → barras de progresso e paywall
- `stripeConfigured` → mostrar CTA de upgrade só se pagamentos estiverem ativos
- `sponsoredByPsychologist: true` → paciente no Essencial com benefícios de Pleno via psicólogo; mostrar badge tipo "Benefício pelo seu profissional"
- `status`: `active` | `trialing` | `past_due` | `canceled`
- `currentPeriodEnd` → data de renovação/fim do ciclo

**Fonte da verdade para limites:** sempre `GET /subscription/me`, não valores fixos no front.

## 6. Fluxo de pagamento (Stripe Checkout)

### Iniciar checkout

`POST /subscription/checkout`  
`Authorization: Bearer <accessToken>`  
`Content-Type: application/json`

```json
{ "planSlug": "pleno" }
```

`planSlug` aceito: `"pleno"` | `"cuidado"` (não existe checkout para essencial).

**Resposta:**

```json
{ "url": "https://checkout.stripe.com/c/pay/..." }
```

Front: `window.location.href = url` (redirect externo).

### URLs de retorno (já configuradas na API)

| Rota front | Quando |
|---|---|
| `/assinatura/sucesso?session_id={CHECKOUT_SESSION_ID}` | Pagamento OK |
| `/assinatura` | Usuário cancelou |

**Página `/assinatura/sucesso`:**

- Mostrar confirmação
- Chamar `GET /subscription/me` para atualizar plano
- O webhook do Stripe libera o plano; pode haver delay de alguns segundos — considerar polling ou botão "Atualizar"

### Portal de cobrança (gerenciar assinatura)

`POST /subscription/portal`  
`Authorization: Bearer <accessToken>`

```json
{ "url": "https://billing.stripe.com/..." }
```

Usar para: trocar cartão, ver faturas, cancelar pelo portal Stripe.

### Cancelar direto pela API

`POST /subscription/cancel`  
`Authorization: Bearer <accessToken>`

```json
{ "message": "Assinatura cancelada com sucesso" }
```

## 7. Erros de limite (paywall)

Quando o usuário estoura limite, a API retorna HTTP 402:

```json
{
  "statusCode": 402,
  "error": "Payment Required",
  "code": "PLAN_LIMIT_DIARY_ENTRIES",
  "message": "Você atingiu o limite de 15 registros este mês...",
  "limit": 15,
  "used": 15,
  "resetsAt": "2026-07-01T00:00:00.000Z",
  "planSlug": "essencial"
}
```

| code | Contexto |
|---|---|
| `PLAN_LIMIT_DIARY_ENTRIES` | Criar registro no diário |
| `PLAN_LIMIT_AI_ANALYSES` | Análise de IA |
| `PLAN_LIMIT_ASSISTANT_MESSAGES` | Mensagem do assistente |
| `PLAN_LIMIT_CARE_SHARE` | Compartilhar dashboard (precisa Pleno) |
| `PLAN_LIMIT_CARE_INVITES` | Convites ativos |
| `PLAN_LIMIT_CARE_VIEW` | Ver dashboard de paciente (precisa Cuidado) |
| `PLAN_LIMIT_ACCESSIBLE_PATIENTS` | Limite de pacientes no Cuidado |
| `PLAN_LIMIT_OWNER_SHARE` | Paciente sem Pleno tentando compartilhar |

**UI sugerida:** modal/toast com `message` + CTA "Fazer upgrade" → `/assinatura` ou checkout direto.

## 8. Páginas/telas sugeridas no front

- `/planos` ou `/assinatura` — lista planos (`GET /plans`) + botões upgrade
- `/assinatura/sucesso` — pós-checkout
- `/conta` ou `/configuracoes` — plano atual (`GET /me`) + link "Gerenciar assinatura" (`POST /portal`)
- Paywall global — interceptor HTTP que trata 402 com code conhecido

## 9. Checklist de implementação

- [x] Buscar `/feature-flags` e `/subscription/config` no boot
- [x] Remover banner de preview (quando `previewMode === false`)
- [x] Trocar `abacatePayConfigured` → `stripeConfigured`
- [x] Trocar `abacateProductId` → `stripePriceId` (só informativo; checkout usa `planSlug`)
- [x] Implementar fluxo: `POST /checkout` → redirect → `/assinatura/sucesso` → refresh `/me`
- [x] Botão "Gerenciar assinatura" via `POST /portal`
- [x] Tratar HTTP 402 nos fluxos de diário, IA, assistente e care
- [x] Badge `sponsoredByPsychologist` quando presente
- [x] Limites de UI baseados em `subscription.me.usage` e `limits`
- [x] Não assumir ilimitado em nenhum plano (exceto campos com `limit: null`)

## 10. Snippet de referência

```ts
const api = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.muttercorp.com.br';

export async function fetchSubscriptionConfig() {
  const res = await fetch(`${api}/subscription/config`, { cache: 'no-store' });
  return res.json() as Promise<{
    paymentsEnabled: boolean;
    stripePublishableKey: string | null;
  }>;
}

export async function startCheckout(accessToken: string, planSlug: 'pleno' | 'cuidado') {
  const res = await fetch(`${api}/subscription/checkout`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ planSlug }),
  });
  if (!res.ok) throw await res.json();
  const { url } = await res.json();
  window.location.href = url;
}
```

## 11. Observação de backend (para alinhar expectativa)

O checkout só funciona quando no servidor existem:

- `STRIPE_SECRET_KEY` + `STRIPE_PUBLISHABLE_KEY`
- Price IDs válidos (`price_...`) em `STRIPE_PRICE_PREMIUM` / `STRIPE_PRICE_TOP`
- Webhook configurado no Stripe apontando para `POST /subscription/webhook`

Enquanto isso não estiver 100% configurado, `paymentsEnabled` pode vir `false` e os botões de upgrade devem ficar desabilitados ou mostrar "Em breve".

## Implementação neste repositório

| Arquivo | Responsabilidade |
|---|---|
| `lib/api/subscription.ts` | `fetchSubscriptionConfig`, checkout, portal, cancel |
| `providers/subscription-config-provider.tsx` | `paymentsEnabled` no boot |
| `providers/subscription-provider.tsx` | `canPurchase`, paywall, `stripeConfigured` |
| `components/subscription/PlanCard.tsx` | Gating de checkout |
| `components/subscription/PaywallModal.tsx` | Modal global 402 |
| `app/assinatura/*` | Planos, sucesso, gerenciar |
| `next.config.ts` | Redirect `/planos` → `/assinatura` |
