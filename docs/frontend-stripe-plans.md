# Frontend — Planos e Stripe

API: `https://api.muttercorp.com.br` (ou `NEXT_PUBLIC_API_URL`) · `previewMode: false` (limites ativos)

## Mudança principal: o que usar para mostrar compra

```ts
// ❌ Antigo — bloqueia demais
paymentsEnabled && plan.stripePriceId

// ✅ Novo
checkoutEnabled
```

| Campo | Onde | Uso |
|---|---|---|
| `checkoutEnabled` | `/subscription/config`, `/subscription/me`, `/subscription/plans` | Mostrar botões de upgrade |
| `paymentsEnabled` | `/subscription/config` | Stripe 100% configurado no backend (só informativo) |
| `stripePriceId` | `/subscription/plans` | Opcional — não bloquear UI se vazio |

## Boot da app (público, sem auth)

`GET /feature-flags` → `{ "previewMode": false }`

`GET /subscription/config` →

```json
{
  "paymentsEnabled": boolean,
  "checkoutEnabled": boolean,
  "stripePublishableKey": string | null
}
```

**Override local (dev):** `NEXT_PUBLIC_CHECKOUT_ENABLED=true`

```ts
const showCheckout =
  config.checkoutEnabled ||
  process.env.NEXT_PUBLIC_CHECKOUT_ENABLED === "true";
```

## Planos

`GET /subscription/plans`

| Slug | Público | Checkout |
|---|---|---|
| essencial | Grátis, limites mensais | `checkoutEnabled: false` |
| pleno | Diário + IA ilimitados | `checkoutEnabled: true` |
| cuidado | Psicólogo, até 20 pacientes | `checkoutEnabled: true` |

Limites vêm em `limits` — sempre usar a API, não hardcodar.

## Usuário logado

`GET /subscription/me` · `Authorization: Bearer <token>`

Campos relevantes:

- `plan.slug`, `plan.limits`, `usage.*` → barras de progresso e paywall
- `checkoutEnabled` → exibir CTA de upgrade
- `sponsoredByPsychologist: true` → badge "Benefício pelo seu profissional"
- `status`: `active` | `trialing` | `past_due` | `canceled`
- `currentPeriodEnd` → renovação

## Fluxo de compra (Stripe)

`POST /subscription/checkout` · `{ "planSlug": "pleno" | "cuidado" }` → `{ "url": "..." }`

Redirect para `url`.

- Sucesso → `/assinatura/sucesso?session_id=...`
- Cancelamento → `/assinatura`
- Na volta, chamar `GET /subscription/me` (webhook pode demorar alguns segundos)

**Gerenciar assinatura:** `POST /subscription/portal` → `{ "url": "..." }`

**Cancelar:** `POST /subscription/cancel` → `{ "message": "..." }`

Se `paymentsEnabled === false`, o botão pode aparecer mas `POST /checkout` falha — mostrar: *"Pagamento em configuração, tente em instantes"* (HTTP 400).

## Paywall (limites) — HTTP 402

Independente do checkout. Exemplo:

```json
{
  "statusCode": 402,
  "code": "PLAN_LIMIT_DIARY_ENTRIES",
  "message": "...",
  "limit": 15,
  "used": 15,
  "resetsAt": "2026-07-01T00:00:00.000Z",
  "planSlug": "essencial"
}
```

Códigos: `PLAN_LIMIT_DIARY_ENTRIES`, `PLAN_LIMIT_AI_ANALYSES`, `PLAN_LIMIT_ASSISTANT_MESSAGES`, `PLAN_LIMIT_CARE_*`.

## Breaking changes

| Removido/trocado | Substituir por |
|---|---|
| AbacatePay | Stripe |
| `abacatePayConfigured` | `checkoutEnabled` |
| `abacateProductId` | `stripePriceId` (informativo) |
| Banner preview | Ocultar (`previewMode: false`) |
| `POST /portal` = cancelar | `POST /portal` = portal Stripe |

## Checklist

- [x] `GET /feature-flags` + `GET /subscription/config` no boot
- [x] Botões de upgrade com `checkoutEnabled`, não `paymentsEnabled && stripePriceId`
- [x] Páginas `/assinatura` e `/assinatura/sucesso`
- [x] Interceptor HTTP 402 → modal de upgrade
- [x] Tratar erro 400 no checkout
- [x] Badge `sponsoredByPsychologist`
- [x] Remover referências a AbacatePay e banner preview

## Snippet

```ts
const api = process.env.NEXT_PUBLIC_API_URL!;

export async function getPaymentConfig() {
  const res = await fetch(`${api}/subscription/config`, { cache: "no-store" });
  return res.json();
}

export function shouldShowUpgrade(config: { checkoutEnabled: boolean }) {
  return (
    config.checkoutEnabled ||
    process.env.NEXT_PUBLIC_CHECKOUT_ENABLED === "true"
  );
}
```

## Implementação neste repositório

| Arquivo | Responsabilidade |
|---|---|
| `lib/subscription/checkout.ts` | `resolveCheckoutEnabled`, `getCheckoutErrorMessage`, `planAllowsCheckout` |
| `lib/api/subscription.ts` | `fetchSubscriptionConfig`, checkout, portal, cancel |
| `providers/subscription-config-provider.tsx` | `checkoutEnabled` + `paymentsEnabled` no boot |
| `providers/subscription-provider.tsx` | `checkoutEnabled` para paywall e upgrade |
| `components/subscription/PlanCard.tsx` | CTA ou "Em breve" via `checkoutEnabled` + `plan.checkoutEnabled` |
| `components/subscription/PaywallModal.tsx` | Modal global 402 |
| `app/assinatura/*` | Planos, sucesso, gerenciar |
| `next.config.ts` | Redirect `/planos` → `/assinatura` |
