# Teleconsulta — rotas por papel (paciente / profissional)

## Problema

Uma única URL (`/teleconsulta/[roomCode]`) servia os dois lados. O papel vinha só de `viewerRole` na API, o que:

- misturava copy/UI de paciente e clínico na mesma página;
- facilitava os dois abrirem o mesmo link e quebrarem o par WebRTC (offer/answer);
- dificultava depurar câmera/áudio por papel.

## Decisão

Rotas **explícitas por papel**, ambas usando o mesmo `roomCode`:

| Papel | Rota |
|--------|------|
| Paciente | `/teleconsulta/[roomCode]/paciente` |
| Profissional | `/teleconsulta/[roomCode]/profissional` |

Compatibilidade:

- `/teleconsulta/[roomCode]` → redirect 308 para `.../paciente` (links antigos / WhatsApp).
- Painel da clínica (`/clinic/.../teleconsulta/[sessionId]`) → redirect para `.../profissional` quando a sessão carrega.

## Papéis WebRTC

| Rota | `viewerRole` forçado | `isInitiator` |
|------|----------------------|---------------|
| `.../paciente` | `PATIENT` | `false` (sempre answer) |
| `.../profissional` | `PROFESSIONAL` / `CLINIC_ADMIN` (API) | `true` (sempre offer) |

Join usa `GET /teleconsult/join/:roomCode?as=PATIENT|PROFESSIONAL` para alinhar com a rota.

Signaling usa `fromPeer = userId:ROLE` (não só `userId`), então a **mesma conta** pode abrir `/paciente` e `/profissional` em abas/navegadores diferentes e trocar offer/answer.

Chat: poll ~800ms; consentimento não é revalidado a cada listagem (só no join).

## URLs geradas

- Paciente (WhatsApp / copiar link): `{FRONTEND}/teleconsulta/{roomCode}/paciente`
- Profissional (agenda / clínica): `{FRONTEND}/teleconsulta/{roomCode}/profissional`

API (`patientJoinUrl`) alinha com o sufixo `/paciente`.

## Componentes

- `TeleconsultRoleJoinShell` — join por `roomCode` + gate de papel + `TeleconsultRoom`
- `TeleconsultRoom` — UI/WebRTC compartilhado (sem mudar o protocolo de signaling)

## Fluxo esperado

```
Agenda clínica ──abrir──► /teleconsulta/{code}/profissional  (offer)
Paciente (link) ─────────► /teleconsulta/{code}/paciente       (answer)
         │
         └── signaling HTTP poll (inalterado)
```

## Checklist de verificação

- [ ] Paciente abre só `.../paciente` e vê câmera local
- [ ] Profissional abre só `.../profissional` e inicia offer
- [ ] Vídeo remoto aparece nos dois lados
- [ ] Link antigo `/teleconsulta/{code}` cai em `.../paciente`
- [ ] Feature flag `teleconsult` continua bloqueando as rotas via `TeleconsultFeatureGate`
