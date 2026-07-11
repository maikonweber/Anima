# EmotiveCare Mobile (Expo)

App React Native do EmotiveCare / Anima.

## Setup

```bash
# na raiz do monorepo
npm install

# copiar env
cp apps/mobile/.env.example apps/mobile/.env

# iniciar
npm run mobile
```

## Variáveis

- `EXPO_PUBLIC_API_URL` — Nest API (default `https://api.muttercorp.com.br`)
- `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` — opcional, login Google

## Estrutura

- `apps/mobile` — Expo Router
- `packages/shared` — API client, JWT, tipos, validações (`@anima/shared`)

## Deep links

Scheme: `emotivecare://` (assinatura sucesso, care-invite).
