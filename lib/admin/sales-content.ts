export type SalesSection = {
  id: string;
  category: "pitch" | "produto" | "preco" | "script" | "objecao" | "email" | "whatsapp";
  title: string;
  summary?: string;
  html?: string;
  copyText?: string;
};

export const SALES_SECTIONS: SalesSection[] = [
  {
    id: "visao-geral",
    category: "produto",
    title: "Visão geral — o que vendemos",
    summary: "Dois produtos, quatro planos no app, modelo de receita.",
    html: `
      <p>A <strong>EmotiveCare</strong> não é terapia nem diagnóstico automático. É autoconhecimento emocional com IA assistiva (SENTIO AI) e, para profissionais, acompanhamento entre sessões.</p>
      <h4>Dois produtos</h4>
      <ul>
        <li><strong>App EmotiveCare</strong> — jornada da pessoa (diário, insights, assistente) + plano profissional Cuidado (dashboards por convite).</li>
        <li><strong>EmotiveCare Clínicas</strong> — operação B2B: CRM, agenda, teleconsulta, prontuário, consentimentos, planos de cuidado, sínteses revisáveis.</li>
      </ul>
      <h4>Planos do app</h4>
      <ul>
        <li><strong>Essencial</strong> (grátis) — porta de entrada, limites baixos.</li>
        <li><strong>Pleno</strong> (R$ 9,99/mês) — plano completo da pessoa; paga o paciente.</li>
        <li><strong>Cuidado</strong> (R$ 149/mês) — plano do profissional no app; paga o psicólogo/psiquiatra.</li>
      </ul>
      <p><strong>Clínicas</strong> exige plano Cuidado para criar/administrar organização.</p>
    `,
  },
  {
    id: "pitch-1-linha",
    category: "pitch",
    title: "Pitch de 1 linha",
    copyText:
      "EmotiveCare é o segundo cérebro emocional da pessoa — diário, SENTIO AI e assistente — e para profissionais, dashboards entre sessões e operação completa da clínica.",
  },
  {
    id: "pitch-30s",
    category: "pitch",
    title: "Pitch 30 segundos",
    copyText: `A EmotiveCare ajuda a pessoa a se entender entre consultas: registra emoções, energia e sono, e a SENTIO AI encontra padrões no histórico.

Para o profissional, o plano Cuidado mostra dashboards em leitura dos pacientes que autorizam — contexto emocional, não prontuário.

E a EmotiveCare Clínicas opera a clínica de ponta a ponta: agenda, teleconsulta, consentimentos e notas clínicas.

Não substituímos terapia. Ampliamos o cuidado com privacidade e controle do paciente.`,
  },
  {
    id: "pitch-2min",
    category: "pitch",
    title: "Pitch 2 minutos (reunião)",
    copyText: `Hoje muita gente registra emoções no WhatsApp ou num caderno — e perde o fio da meada. A EmotiveCare centraliza isso num diário emocional com IA que reflete padrões, não diagnostica.

O paciente começa grátis no Essencial. Quando faz sentido, faz upgrade pro Pleno — R$ 9,99 — diário ilimitado, assistente com memória, e pode compartilhar o painel com um profissional de confiança.

Para você, profissional, o plano Cuidado — R$ 149/mês — dá dashboards em leitura dos pacientes que te convidam, sem limite. Você vê tendências entre sessões, só o que a pessoa autorizou, e pode pausar ou revogar a qualquer momento.

Se quiser oferecer o app a pacientes que ainda não pagam o Pleno, você patrocina até 15 contas free com benefícios Pleno — R$ 5 por conta ativa — direto pela clínica.

E quando a equipe precisa de CRM, agenda e teleconsulta, entra EmotiveCare Clínicas — produto separado, multi-tenant, com auditoria e consentimento por propósito.

Resumindo: a pessoa cuida da jornada no app; você acompanha no Cuidado; a clínica opera no Clínicas.`,
  },
  {
    id: "plano-essencial",
    category: "produto",
    title: "Essencial — descrição comercial",
    html: `
      <p><strong>Para quem:</strong> experimentar sem cartão.</p>
      <ul>
        <li>15 registros emocionais/mês</li>
        <li>1 análise SENTIO AI/mês</li>
        <li>10 mensagens do assistente/mês</li>
        <li>Histórico de 30 dias</li>
        <li>Sem vínculos de acompanhamento</li>
      </ul>
      <p><strong>Preço:</strong> grátis · <strong>Quem paga:</strong> ninguém · <strong>Objetivo:</strong> conversão para Pleno ou vínculo com profissional Cuidado.</p>
    `,
  },
  {
    id: "plano-pleno",
    category: "produto",
    title: "Pleno — descrição comercial",
    html: `
      <p><strong>Para quem:</strong> pessoa que quer jornada completa no app.</p>
      <ul>
        <li>Diário e tracking ilimitados</li>
        <li>10 análises IA/mês · 500 mensagens do assistente/mês</li>
        <li>Linha do tempo completa (memória semântica)</li>
        <li>1 vínculo ativo: compartilhar painel com clínica ou outro Pleno</li>
        <li>1 painel de outro Pleno em leitura (peer)</li>
      </ul>
      <p><strong>Preço:</strong> R$ 9,99/mês · <strong>Quem paga:</strong> o paciente.</p>
    `,
  },
  {
    id: "plano-cuidado",
    category: "produto",
    title: "Cuidado — descrição comercial",
    html: `
      <p><strong>Para quem:</strong> psicólogo, psiquiatra ou profissional que acompanha entre sessões.</p>
      <ul>
        <li><strong>Dashboards ilimitados</strong> — pacientes Pleno que te convidam por e-mail</li>
        <li><strong>Até 15 contas free patrocinadas</strong> — paciente Essencial com benefícios Pleno via clínica (+ R$ 5/mês por conta)</li>
        <li>40 análises clínicas/mês · 500 mensagens assistente/mês</li>
        <li>Leitura apenas — não é prontuário</li>
      </ul>
      <p><strong>Preço base:</strong> R$ 149/mês · <strong>Add-on:</strong> R$ 5/mês por conta patrocinada (máx. 15).</p>
      <p><strong>Quem paga:</strong> o profissional. Pacientes Pleno que convidam não geram custo extra.</p>
    `,
  },
  {
    id: "plano-clinicas",
    category: "produto",
    title: "EmotiveCare Clínicas — descrição comercial",
    html: `
      <p><strong>Para quem:</strong> clínica, consultório com equipe, operação multi-profissional.</p>
      <ul>
        <li>CRM de pacientes (ilimitado)</li>
        <li>Agenda com anti-sobreposição</li>
        <li>Teleconsulta com consentimento TELECONSULTA</li>
        <li>Prontuário, consentimentos por propósito, lembretes</li>
        <li>Planos de cuidado · Sínteses SENTIO AI revisáveis</li>
        <li>Convite ao app com Pleno patrocinado (grantPleno)</li>
        <li>Multi-tenant, papéis, auditoria LGPD</li>
      </ul>
      <p><strong>Requisito:</strong> plano Cuidado no app para administrar a organização.</p>
    `,
  },
  {
    id: "tabela-precos",
    category: "preco",
    title: "Tabela de preços e cenários",
    html: `
      <table>
        <thead><tr><th>Item</th><th>Valor</th><th>Quem paga</th></tr></thead>
        <tbody>
          <tr><td>Essencial</td><td>Grátis</td><td>—</td></tr>
          <tr><td>Pleno</td><td>R$ 9,99/mês</td><td>Paciente</td></tr>
          <tr><td>Cuidado (base)</td><td>R$ 149/mês</td><td>Profissional</td></tr>
          <tr><td>Assento Pleno patrocinado</td><td>R$ 5/mês (máx. 15)</td><td>Profissional Cuidado</td></tr>
        </tbody>
      </table>
      <h4>Cenários Cuidado</h4>
      <ul>
        <li>Só base, pacientes Pleno te convidam → <strong>R$ 149/mês</strong></li>
        <li>Base + 5 contas patrocinadas → <strong>R$ 174/mês</strong></li>
        <li>Base + 15 contas patrocinadas (teto) → <strong>R$ 224/mês</strong></li>
      </ul>
    `,
  },
  {
    id: "script-cold-linkedin",
    category: "script",
    title: "Script — abordagem fria (LinkedIn / DM)",
    copyText: `Oi [Nome], tudo bem?

Vi que você atua com [saúde mental / psicologia clínica]. Trabalho com a EmotiveCare — ferramenta de autoconhecimento emocional para pacientes e dashboards de acompanhamento para profissionais entre sessões.

Não é prontuário nem terapia online: o paciente registra emoções no app e, se quiser, compartilha leitura com você. Muitos profissionais usam o plano Cuidado (R$ 149/mês) justamente pra ter contexto emocional antes da consulta.

Topa uma conversa de 15 min essa semana? Posso te mostrar em 5 minutos como funciona o convite e o dashboard.`,
  },
  {
    id: "script-call-abertura",
    category: "script",
    title: "Script — call de vendas (abertura)",
    copyText: `[Nome], obrigado pelo tempo.

Antes de mostrar a plataforma, quero alinhar: hoje, entre uma sessão e outra, como seus pacientes registram emoções ou você acompanha o que aconteceu na semana?

[ouvir]

Perfeito. A EmotiveCare nasceu pra preencher exatamente esse gap — autoconhecimento estruturado pro paciente e visão em leitura pra você, com consentimento explícito.

Vou te mostrar três coisas: o app da pessoa, o plano Cuidado pro profissional, e se fizer sentido, a operação Clínicas. Pode interromper a qualquer momento com dúvidas.`,
  },
  {
    id: "script-demo-cuidado",
    category: "script",
    title: "Script — demo plano Cuidado (5 min)",
    copyText: `1. PACIENTE PLENO CONVIDA (ilimitado, sem custo extra)
   → Paciente paga R$ 9,99/mês no Pleno
   → Envia convite por e-mail
   → Você aceita e vê dashboard em leitura
   → Sem limite de quantos pacientes Pleno podem te convidar

2. VOCÊ PATROCINA CONTA FREE (até 15, R$ 5/mês cada)
   → Pela clínica, convite com Pleno patrocinado
   → Paciente continua Essencial no cadastro, usa limites Pleno
   → Você paga R$ 5/mês por conta ativa
   → Ideal pra quem ainda não quer assinar o app

3. DIFERENCIAL
   → Dashboard ≠ prontuário
   → Paciente controla, pausa e revoga
   → LGPD e consentimento por propósito na clínica

Quer testar com 1 paciente real essa semana? Posso te ajudar no primeiro convite.`,
  },
  {
    id: "script-fechamento",
    category: "script",
    title: "Script — fechamento",
    copyText: `[Nome], pelo que conversamos, o plano [Pleno / Cuidado] resolve [dor que ele citou].

Próximo passo simples:
1. Criar conta grátis em emotivecare.com/register
2. Fazer upgrade pro [plano] na página de assinatura
3. [Se Cuidado] Enviar o primeiro convite a um paciente ou configurar a clínica

Posso te acompanhar no setup em 10 minutos ainda hoje. Prefere começar pelo app da pessoa ou pelo dashboard profissional?`,
  },
  {
    id: "objecao-terapia",
    category: "objecao",
    title: "Objeção — “Isso substitui terapia?”",
    copyText: `Não — e deixamos isso explícito em termos e na interface.

A EmotiveCare é autoconhecimento e apoio emocional com IA assistiva. Não diagnosticamos, não prescrevemos e não substituímos o julgamento clínico.

Para profissionais, é contexto complementar entre sessões — o que o paciente escolheu compartilhar — não conduta terapêutica automatizada.`,
  },
  {
    id: "objecao-prontuario",
    category: "objecao",
    title: "Objeção — “Já tenho prontuário”",
    copyText: `Perfeito — o Cuidado não compete com prontuário.

Prontuário = registro clínico, notas, conduta, faturamento.
Cuidado = leitura do diário emocional e tendências que o paciente autorizou no app pessoal.

Quem precisa de CRM, agenda e teleconsulta usa EmotiveCare Clínicas. O Cuidado é a camada de acompanhamento emocional entre consultas.`,
  },
  {
    id: "objecao-preco-cuidado",
    category: "objecao",
    title: "Objeção — “R$ 149 é caro”",
    copyText: `Entendo. Vamos olhar o retorno:

• Se 3 pacientes Pleno te convidam, você já tem contexto ilimitado sem pagar assento extra — só os R$ 149 base.
• Cada conta patrocinada (R$ 5) costuma ser menos que o valor de 5 minutos de consulta — e aumenta adesão entre sessões.
• Comparado a ferramentas genéricas de diário, aqui o paciente tem IA, memória e fluxo desenhado pra saúde emocional.

Quer começar só com pacientes que já pagam Pleno e patrocinar contas depois?`,
  },
  {
    id: "objecao-lgpd",
    category: "objecao",
    title: "Objeção — “E a LGPD?”",
    copyText: `Dados sob LGPD. No app, o paciente controla o que compartilha e pode revogar.

Na clínica, consentimento é por propósito (teleconsulta, prontuário, check-in de diário, etc.). Temos auditoria de ações, papéis por organização e separação entre app pessoal (B2C) e operação clínica (B2B).`,
  },
  {
    id: "email-pos-demo",
    category: "email",
    title: "E-mail — pós-demo",
    copyText: `Assunto: EmotiveCare — resumo da nossa conversa

Oi [Nome],

Obrigado pela conversa hoje. Resumo do que vimos:

• App para o paciente: diário emocional + SENTIO AI (Essencial grátis · Pleno R$ 9,99/mês)
• Plano Cuidado para você: dashboards ilimitados por convite + até 15 contas patrocinadas (R$ 149/mês + R$ 5/conta)
• Clínicas: CRM, agenda, teleconsulta e prontuário quando a equipe precisar

Link para criar conta: [URL]/register
Planos: [URL]/plans

Próximo passo que sugeri: [personalizar]

Qualquer dúvida, responda este e-mail.

Abraço,
[Seu nome]`,
  },
  {
    id: "email-convite-cuidado",
    category: "email",
    title: "E-mail — convite para trial Cuidado",
    copyText: `Assunto: [Nome], experimente o plano Cuidado por [X dias]

Oi [Nome],

Preparamos acesso ao plano Cuidado da EmotiveCare para você testar com 1–2 pacientes reais.

O que você consegue fazer:
→ Receber convites de pacientes Pleno (ilimitado)
→ Ver dashboards em leitura entre sessões
→ Convidar pacientes free com Pleno patrocinado (até 15 contas)

Não é prontuário — é contexto emocional com consentimento do paciente.

Ativar: [URL campanha ou checkout]

Conte comigo no setup inicial.

[Seu nome]`,
  },
  {
    id: "whatsapp-curto",
    category: "whatsapp",
    title: "WhatsApp — mensagem curta",
    copyText: `Oi [Nome]! Aqui é [Seu nome] da EmotiveCare 👋

Ferramenta de diário emocional + dashboard pro profissional ver tendências entre sessões (só o que o paciente autorizar).

Plano Cuidado: R$ 149/mês · dashboards ilimitados · até 15 pacientes free patrocinados (+ R$ 5/cada).

Posso te mandar um vídeo de 2 min ou marcar uma call rápida?`,
  },
  {
    id: "whatsapp-followup",
    category: "whatsapp",
    title: "WhatsApp — follow-up pós-demo",
    copyText: `[Nome], conseguiu criar a conta?

Lembrete do fluxo:
1️⃣ Register grátis
2️⃣ Assinar Cuidado em /assinatura
3️⃣ Paciente Pleno te convida OU você patrocina via clínica

Precisa de ajuda no passo [X]?`,
  },
  {
    id: "comparativo-produtos",
    category: "produto",
    title: "Comparativo — App vs Clínicas vs Cuidado",
    html: `
      <table>
        <thead>
          <tr><th></th><th>Essencial/Pleno</th><th>Cuidado</th><th>Clínicas</th></tr>
        </thead>
        <tbody>
          <tr><td>Quem usa</td><td>Paciente</td><td>Profissional</td><td>Equipe da clínica</td></tr>
          <tr><td>Diário emocional</td><td>✓</td><td>—</td><td>Visão clínica (com consentimento)</td></tr>
          <tr><td>Dashboard leitura</td><td>Compartilha 1 vínculo</td><td>Ilimitado (convite)</td><td>Via CRM + app</td></tr>
          <tr><td>CRM / Agenda</td><td>—</td><td>—</td><td>✓</td></tr>
          <tr><td>Teleconsulta</td><td>—</td><td>—</td><td>✓</td></tr>
          <tr><td>Prontuário</td><td>—</td><td>—</td><td>✓</td></tr>
          <tr><td>Patrocinar Pleno</td><td>—</td><td>Até 15 contas</td><td>Via convite clínica</td></tr>
        </tbody>
      </table>
    `,
  },
  {
    id: "checklist-vendedor",
    category: "script",
    title: "Checklist — antes de fechar",
    copyText: `□ Identifiquei se o lead é paciente, profissional ou clínica
□ Expliquei que NÃO é terapia nem diagnóstico
□ Mostrei diferença Cuidado (dashboard) vs Clínicas (operação)
□ Expliquei convite Pleno (ilimitado) vs patrocínio (15 × R$ 5)
□ Alinhei quem paga: paciente (Pleno) vs profissional (Cuidado)
□ Próximo passo concreto com data (conta, convite, demo clínica)
□ Enviei follow-up por e-mail ou WhatsApp em 24h`,
  },
];

export const SALES_CATEGORY_LABELS: Record<SalesSection["category"], string> = {
  pitch: "Pitches",
  produto: "Produto",
  preco: "Preços",
  script: "Scripts de venda",
  objecao: "Objeções",
  email: "E-mails",
  whatsapp: "WhatsApp",
};

export const SALES_CATEGORY_ORDER: SalesSection["category"][] = [
  "pitch",
  "produto",
  "preco",
  "script",
  "objecao",
  "email",
  "whatsapp",
];
