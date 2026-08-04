import type { ReactNode } from "react";

export type ClinicHelpTopic = {
  id: string;
  label: string;
  content: ReactNode;
};

export type ClinicToolHelpDefinition = {
  title: string;
  summary: string;
  topics: ClinicHelpTopic[];
};

export const CLINIC_PATIENT_TAB_HELP: Record<
  "resumo" | "diario" | "plano" | "alertas" | "ia" | "prontuario",
  ClinicToolHelpDefinition
> = {
  resumo: {
    title: "Resumo do paciente",
    summary:
      "Visão operacional do CRM: vínculo com o app, status no funil, consentimentos e contatos. Não é prontuário clínico.",
    topics: [
      {
        id: "o-que-e",
        label: "O que é esta aba?",
        content: (
          <>
            <p>
              Centraliza dados cadastrais e de governança do paciente na clínica.
              Use para manter o funil atualizado e conferir permissões antes de
              abrir diário, plano ou IA.
            </p>
          </>
        ),
      },
      {
        id: "vinculo",
        label: "Vínculo com o app",
        content: (
          <>
            <p>
              Sem vincular a conta do app, a clínica não consegue ler o diário
              compartilhado. Vincule pelo e-mail da conta EmotiveCare do
              paciente.
            </p>
          </>
        ),
      },
      {
        id: "consentimentos",
        label: "Consentimentos",
        content: (
          <>
            <p>
              Cada finalidade (diário, prontuário, teleconsulta, lembretes, IA)
              precisa estar concedida. Sem consentimento ativo, as outras abas
              bloqueiam o acesso.
            </p>
          </>
        ),
      },
    ],
  },
  diario: {
    title: "Diário e lembretes",
    summary:
      "Check-ins que o paciente compartilhou e adesão a lembretes. Somente leitura na clínica.",
    topics: [
      {
        id: "o-que-e",
        label: "O que aparece aqui?",
        content: (
          <>
            <p>
              Só registros de diário marcados como <strong>compartilhados</strong>{" "}
              pelo paciente, e apenas se houver consentimento{" "}
              <strong>DIARIO_CHECKIN</strong> + vínculo com o app.
            </p>
          </>
        ),
      },
      {
        id: "lembretes",
        label: "Lembretes / adesão",
        content: (
          <>
            <p>
              Mostra medicações e respostas que o paciente registrou. A clínica
              não altera doses — o sistema não prescreve.
            </p>
          </>
        ),
      },
      {
        id: "privacidade",
        label: "Privacidade",
        content: (
          <>
            <p>
              Itens privados do diário nunca aparecem aqui. O paciente controla
              isso registro a registro no app.
            </p>
          </>
        ),
      },
    ],
  },
  plano: {
    title: "Plano de cuidado",
    summary:
      "Monte objetivos e atividades para o paciente. Só o que você liberar aparece no app dele.",
    topics: [
      {
        id: "o-que-e",
        label: "Para que serve?",
        content: (
          <>
            <p>
              É o plano terapêutico compartilhado: atividades, orientações e
              objetivos. A clínica escreve; o paciente só vê o que foi{" "}
              <strong>liberado</strong> em <em>Plano de cuidado</em> no app.
            </p>
          </>
        ),
      },
      {
        id: "como-usar",
        label: "Como usar (passo a passo)",
        content: (
          <ol className="list-decimal pl-4 space-y-1.5">
            <li>Crie o plano ativo com um título claro.</li>
            <li>Adicione itens (ex.: caminhada, higiene do sono).</li>
            <li>
              Clique em <strong>Liberar</strong> nos itens que o paciente pode
              ver.
            </li>
            <li>
              Use <strong>Ocultar</strong> se precisar retirar do app sem apagar.
            </li>
          </ol>
        ),
      },
      {
        id: "paciente",
        label: "O que o paciente vê?",
        content: (
          <>
            <p>
              Em <strong>/dashboard/plano</strong>: título do plano, itens
              liberados e próximas sessões (quando houver). Itens não liberados
              ficam só na clínica.
            </p>
          </>
        ),
      },
    ],
  },
  alertas: {
    title: "Alertas assistivos",
    summary:
      "Sugestões geradas a partir do diário compartilhado. Exigem revisão humana — não são emergência.",
    topics: [
      {
        id: "o-que-e",
        label: "O que são os alertas?",
        content: (
          <>
            <p>
              Candidatos automáticos (ex.: ansiedade elevada em vários
              check-ins). Servem para apoiar a conversa clínica;{" "}
              <strong>não diagnosticam</strong> e não substituem avaliação
              profissional.
            </p>
          </>
        ),
      },
      {
        id: "como-usar",
        label: "Como revisar",
        content: (
          <ol className="list-decimal pl-4 space-y-1.5">
            <li>
              Use <strong>Varrer padrões</strong> (requer consentimento
              IA_ASSISTIVA).
            </li>
            <li>Leia o rascunho e edite se necessário.</li>
            <li>
              <strong>Aprove</strong> ou <strong>Rejeite</strong> — só então o
              alerta deixa de ficar pendente.
            </li>
          </ol>
        ),
      },
      {
        id: "limites",
        label: "Limites importantes",
        content: (
          <>
            <p>
              Não é canal de crise. Em risco à vida, oriente SAMU (192) / CVV
              (188) ou os recursos da clínica. A plataforma não dispara
              emergência.
            </p>
          </>
        ),
      },
    ],
  },
  ia: {
    title: "Sínteses de IA",
    summary:
      "Rascunhos revisáveis a partir do diário/sessão. Só entram no cuidado depois da sua aprovação.",
    topics: [
      {
        id: "o-que-e",
        label: "O que é a síntese?",
        content: (
          <>
            <p>
              Texto assistivo gerado com base em dados autorizados (diário
              compartilhado e/ou sessão). Fica{" "}
              <strong>pendente de revisão</strong> até você aprovar ou rejeitar.
            </p>
          </>
        ),
      },
      {
        id: "como-usar",
        label: "Fluxo recomendado",
        content: (
          <ol className="list-decimal pl-4 space-y-1.5">
            <li>Gere a síntese escolhendo a fonte (diário, sessão ou misto).</li>
            <li>Edite o rascunho se precisar.</li>
            <li>
              Aprove para registrar o uso assistivo — isso{" "}
              <strong>não grava prontuário automaticamente</strong>.
            </li>
          </ol>
        ),
      },
      {
        id: "humano",
        label: "Humano no comando",
        content: (
          <>
            <p>
              A IA sugere; o profissional decide. Nunca use a síntese como
              diagnóstico, prescrição ou decisão clínica autônoma.
            </p>
          </>
        ),
      },
    ],
  },
  prontuario: {
    title: "Prontuário clínico",
    summary:
      "Notas formais com autoria e assinatura. Exige consentimento PRONTUARIO. Secretária não acessa.",
    topics: [
      {
        id: "o-que-e",
        label: "O que é o prontuário?",
        content: (
          <>
            <p>
              Registro clínico oficial da sessão/evolução. Diferente do CRM e do
              diário do paciente: aqui há rascunho, assinatura e adendo.
            </p>
          </>
        ),
      },
      {
        id: "como-usar",
        label: "Como registrar",
        content: (
          <ol className="list-decimal pl-4 space-y-1.5">
            <li>Crie a nota em rascunho.</li>
            <li>Revise o conteúdo.</li>
            <li>
              <strong>Assine</strong> para fechar a versão (alterações depois
              vão em adendo).
            </li>
          </ol>
        ),
      },
      {
        id: "integridade",
        label: "Integridade",
        content: (
          <>
            <p>
              Após assinada, a nota não é reescrita silenciosamente: use adendo
              para complementos. Leituras ficam na auditoria da organização.
            </p>
          </>
        ),
      },
    ],
  },
};
