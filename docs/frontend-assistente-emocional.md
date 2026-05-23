# Resumo para o frontend — Assistente emocional (Anima)

Copie este documento para o agente ou PR do repositório do frontend (`anima-navy.vercel.app`).

**API:** `https://api.muttercorp.com.br` (dev: `http://localhost:3000`)  
**Auth:** `Authorization: Bearer <accessToken>` em todas as rotas abaixo.  
**Swagger:** `https://api.muttercorp.com.br/api` (tag `assistant`)

---

## 1. O que é (e o que não é)

- Chat **emocional** ligado ao **diário** do usuário — não é ChatGPT genérico.
- A API **bloqueia** programação, tarefas escolares, receitas, etc. (400).
- Exige **pelo menos 1 entrada no diário** antes de usar (403 `ASSISTANT_DIARY_REQUIRED`).
- **Limites reais** — não mostrar "Mensagens ilimitadas" no UI.

---

## 2. Rotas

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/assistant/chat` | Enviar mensagem (cria sessão se omitir `sessionId`) |
| `GET` | `/assistant/sessions?page=1&limit=20` | Listar conversas |
| `GET` | `/assistant/sessions/:id` | Resgatar histórico + limites + grafo emocional |
| `DELETE` | `/assistant/sessions/:id` | Excluir conversa, mensagens e contexto (Redis) |

Não existe rota só de "contexto". O grafo vem em `conversationGraph` no POST/GET.

---

## 3. Enviar mensagem — `POST /assistant/chat`

**Body:**

```json
{
  "message": "Estou muito triste e não consigo identificar o que sinto",
  "sessionId": "uuid-opcional"
}
```

- `message`: 1–2000 caracteres.
- `sessionId`: omitir na **primeira** mensagem de uma conversa nova.

**Response 200:** inclui `sessionId`, `message` (assinatura do assistente), `limits`, `conversationGraph`.

Salvar `sessionId` após a primeira resposta e enviá-lo nas próximas mensagens da mesma conversa.

---

## 4–6. Sessão, listagem, DELETE

Ver Swagger. No front: `DELETE` → remover da sidebar, limpar estado local, voltar para lista ou nova conversa.

---

## 7. Limites — fonte da verdade para o UI

### Por plano (mensal)

| Plano | Mensagens/mês |
|-------|----------------|
| Essencial | 10 |
| Pleno | 40 |
| Cuidado | 40 |
| Preview (`PREVIEW_MODE`) | 15 |

### Por conversa aberta

Máx. mensagens **suas** por conversa: **10**.

### O que exibir no header do chat

```
{{limits.messagesUsedInSession}}/{{limits.messagesLimitPerSession}} nesta conversa
{{limits.messagesUsedThisMonth}}/{{limits.messagesLimitThisMonth}} este mês
```

- Só mostrar "sem limite mensal" se `messagesLimitThisMonth === null` (raro).
- **Nunca** hardcodar "Mensagens ilimitadas".

### Quando desabilitar o input

- `limits.messagesRemainingInSession === 0` → CTA **"Nova conversa"**
- `limits.messagesRemainingThisMonth === 0` → modal upgrade (402 já pode ter ocorrido antes)

### Badge no menu (opcional)

`GET /subscription/me` → `usage.assistantMessages: { used, limit }` — no chat, preferir `limits` do último POST/GET sessão (mais atual).

---

## 8. Erros — como tratar no UI

| HTTP | Código (ex.) | O que fazer |
|------|----------------|-------------|
| 400 | `ASSISTANT_SCOPE_*` | **Toast/alerta** com `message` — **não** criar bolha do assistente |
| 400 | `ASSISTANT_SESSION_TURN_LIMIT` | Aviso: máx. 10 msg/conversa → botão Nova conversa |
| 403 | `ASSISTANT_DIARY_REQUIRED` | CTA → criar registro no diário |
| 402 | `PLAN_LIMIT_ASSISTANT_MESSAGES` | Modal upgrade + `details.resetsAt` |
| 429 | `ASSISTANT_RATE_LIMIT_*` | Toast; desabilitar envio por `retryAfterSeconds` segundos |
| 401 | JWT inválido | Refresh token → retry; senão login |
| 503 | Assistente indisponível | Mensagem amigável + tentar de novo |

Quando a API rejeita mensagem fora do escopo: **não** adicionar a resposta como bolha do assistente; opcional manter texto no input para editar.

---

## 9. Layout sugerido

`/assistente` — sidebar (nova conversa + lista), área do chat com header (título + contadores + excluir), aviso de escopo, mensagens, input.

---

## 10. Tipos TypeScript

Ver `types/assistant.ts` no repositório (`AssistantLimits`, `ConversationGraph`, etc.).

---

## 11–14. Serviço exemplo, checklist de aceite, anti-padrões, docs relacionados

- **Não:** WebSocket/SSE; histórico no body; dados do diário no body; tratar 400 como mensagem na thread; assumir ilimitado em preview (15).
- **Docs:** `docs/frontend-auth-refresh-prompt.md`, `docs/frontend-preview-plans-banner-prompt.md` (quando existirem no repo).
