import type { ReactNode } from "react";

export type ClinicHelpLocale = "pt" | "en" | "es";

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

export type ClinicPatientTabId =
  | "resumo"
  | "diario"
  | "plano"
  | "alertas"
  | "ia"
  | "prontuario";

export const CLINIC_HELP_UI = {
  pt: {
    eyebrow: "Explore com a gente",
    topicLabel: "Quero saber sobre",
    ariaPrefix: "Ajuda",
    languageLabel: "Idioma",
  },
  en: {
    eyebrow: "Explore with us",
    topicLabel: "I want to learn about",
    ariaPrefix: "Help",
    languageLabel: "Language",
  },
  es: {
    eyebrow: "Explora con nosotros",
    topicLabel: "Quiero saber sobre",
    ariaPrefix: "Ayuda",
    languageLabel: "Idioma",
  },
} as const;

const helpPt: Record<ClinicPatientTabId, ClinicToolHelpDefinition> = {
  resumo: {
    title: "Comece pelo resumo",
    summary:
      "Aqui você organiza o paciente na clínica: vínculo com o app, funil, consentimentos e contatos — o ponto de partida para usar o restante da plataforma com segurança.",
    topics: [
      {
        id: "o-que-e",
        label: "Por que começar aqui?",
        content: (
          <p>
            É o painel operacional do CRM. Atualize o status, confira consentimentos
            e vincule o app — assim diário, plano, alertas e IA ficam prontos para
            o acompanhamento contínuo.
          </p>
        ),
      },
      {
        id: "vinculo",
        label: "Convidar o paciente ao app",
        content: (
          <p>
            Quando o paciente usa o app EmotiveCare com o mesmo e-mail, você
            conecta o cadastro aqui. Aí o cuidado entre sessões ganha vida: diário
            compartilhado, lembretes e planos liberados.
          </p>
        ),
      },
      {
        id: "consentimentos",
        label: "Ativar as finalidades",
        content: (
          <p>
            Cada finalidade (diário, prontuário, teleconsulta, lembretes, IA) é
            um convite consciente ao compartilhamento. Com elas ativas, a
            plataforma revela as ferramentas certas — sempre com trilha de
            auditoria.
          </p>
        ),
      },
    ],
  },
  diario: {
    title: "Acompanhe o diário entre sessões",
    summary:
      "Veja os check-ins que o paciente escolheu compartilhar e a adesão aos lembretes — contexto emocional contínuo, com privacidade no comando dele.",
    topics: [
      {
        id: "o-que-e",
        label: "O que você encontra aqui",
        content: (
          <p>
            Momentos do diário marcados como <strong>compartilhados</strong>,
            quando há vínculo com o app e consentimento de diário. É o jeito de
            chegar à sessão já com contexto — sem substituir a escuta clínica.
          </p>
        ),
      },
      {
        id: "lembretes",
        label: "Lembretes e adesão",
        content: (
          <p>
            Acompanhe como o paciente responde aos lembretes que ele mesmo
            registrou. A clínica observa a adesão; doses e prescritos continuam
            sob responsabilidade profissional fora da plataforma.
          </p>
        ),
      },
      {
        id: "privacidade",
        label: "Privacidade como valor",
        content: (
          <p>
            O que for privado no diário permanece só com o paciente. Esse
            controle registro a registro fortalece a confiança — e torna o
            compartilhamento mais significativo quando acontece.
          </p>
        ),
      },
    ],
  },
  plano: {
    title: "Monte um plano que o paciente leva no bolso",
    summary:
      "Transforme orientações em um plano vivo: atividades e objetivos que você libera no app — para o cuidado continuar entre as sessões.",
    topics: [
      {
        id: "o-que-e",
        label: "Para que serve o plano?",
        content: (
          <p>
            É o espaço para alinhar próximos passos com o paciente. Você
            escreve; ele vê no app só o que você <strong>liberar</strong>. Um
            convite claro a seguir a rotina combinada, com transparência.
          </p>
        ),
      },
      {
        id: "como-usar",
        label: "Comece em 4 passos",
        content: (
          <ol className="list-decimal pl-4 space-y-1.5">
            <li>Crie o plano ativo com um título acolhedor.</li>
            <li>Adicione itens práticos (sono, movimento, reflexões…).</li>
            <li>
              Clique em <strong>Liberar</strong> no que ele pode acompanhar no
              app.
            </li>
            <li>
              Use <strong>Ocultar</strong> quando quiser pausar a visibilidade
              sem perder o histórico.
            </li>
          </ol>
        ),
      },
      {
        id: "paciente",
        label: "A experiência do paciente",
        content: (
          <p>
            No app, em <strong>Plano de cuidado</strong>, ele encontra o que você
            liberou e as próximas sessões. Assim o acompanhamento deixa de ser só
            “na sessão” e passa a ser um hábito compartilhado.
          </p>
        ),
      },
    ],
  },
  alertas: {
    title: "Deixe a plataforma destacar padrões",
    summary:
      "Sugestões assistivas a partir do diário compartilhado — para você revisar com critério humano e enriquecer a próxima conversa.",
    topics: [
      {
        id: "o-que-e",
        label: "O que os alertas oferecem",
        content: (
          <p>
            Sinais automáticos (como ansiedade elevada em vários check-ins) que
            ajudam a priorizar o olhar clínico. São convites à revisão —{" "}
            <strong>não diagnosticam</strong> e não substituem seu julgamento.
          </p>
        ),
      },
      {
        id: "como-usar",
        label: "Como aproveitar bem",
        content: (
          <ol className="list-decimal pl-4 space-y-1.5">
            <li>
              Toque em <strong>Varrer padrões</strong> (com consentimento de IA).
            </li>
            <li>Leia o rascunho e ajuste o texto se fizer sentido.</li>
            <li>
              <strong>Aprove</strong> ou <strong>Rejeite</strong> — você fecha o
              ciclo com responsabilidade.
            </li>
          </ol>
        ),
      },
      {
        id: "limites",
        label: "Segurança em primeiro lugar",
        content: (
          <p>
            Isto não é canal de emergência. Em risco à vida, oriente SAMU (192),
            CVV (188) ou os recursos de crise da clínica. A plataforma apoia o
            cuidado — você conduz a resposta humana.
          </p>
        ),
      },
    ],
  },
  ia: {
    title: "Use a IA como rascunho, não como decisão",
    summary:
      "Gere sínteses a partir do diário e da sessão, revise com calma e aprove só o que fizer sentido para o cuidado.",
    topics: [
      {
        id: "o-que-e",
        label: "O que a síntese faz por você",
        content: (
          <p>
            Um texto assistivo com base em dados autorizados — diário
            compartilhado e/ou sessão. Fica{" "}
            <strong>pendente de revisão</strong> até você decidir. Economia de
            tempo, com você no comando.
          </p>
        ),
      },
      {
        id: "como-usar",
        label: "Fluxo leve e seguro",
        content: (
          <ol className="list-decimal pl-4 space-y-1.5">
            <li>Escolha a fonte (diário, sessão ou misto) e gere.</li>
            <li>Edite o rascunho com a sua voz clínica.</li>
            <li>
              Aprove quando estiver pronto — isso{" "}
              <strong>não grava prontuário automaticamente</strong>.
            </li>
          </ol>
        ),
      },
      {
        id: "humano",
        label: "Humano no comando",
        content: (
          <p>
            A EmotiveCare sugere; você confirma. Use a síntese como apoio à
            reflexão — nunca como diagnóstico, prescrição ou decisão clínica
            autônoma.
          </p>
        ),
      },
    ],
  },
  prontuario: {
    title: "Registre a evolução com clareza",
    summary:
      "Notas formais com autoria e assinatura — o registro clínico que a equipe precisa, separado do CRM e do diário do paciente.",
    topics: [
      {
        id: "o-que-e",
        label: "O valor do prontuário aqui",
        content: (
          <p>
            Espaço para a evolução oficial da sessão: rascunho, assinatura e
            adendo. Diferente do funil do CRM — aqui a integridade do registro
            clínico vem primeiro.
          </p>
        ),
      },
      {
        id: "como-usar",
        label: "Como registrar com fluidez",
        content: (
          <ol className="list-decimal pl-4 space-y-1.5">
            <li>Crie a nota em rascunho enquanto o contexto está fresco.</li>
            <li>Revise o texto com calma.</li>
            <li>
              <strong>Assine</strong> para fechar; complementos depois entram
              como adendo.
            </li>
          </ol>
        ),
      },
      {
        id: "integridade",
        label: "Confiança e rastreio",
        content: (
          <p>
            Depois de assinada, a nota não some nem é reescrita em silêncio.
            Adendos preservam a história — e as leituras entram na auditoria da
            organização.
          </p>
        ),
      },
    ],
  },
};

const helpEn: Record<ClinicPatientTabId, ClinicToolHelpDefinition> = {
  resumo: {
    title: "Start with the patient overview",
    summary:
      "Set up the patient in your clinic: app link, funnel status, consents, and contacts — the foundation for using the rest of EmotiveCare Clinics with confidence.",
    topics: [
      {
        id: "o-que-e",
        label: "Why start here?",
        content: (
          <p>
            This is your operational CRM hub. Update status, confirm consents,
            and link the patient app so diary, care plan, alerts, and AI are
            ready for continuous care between sessions.
          </p>
        ),
      },
      {
        id: "vinculo",
        label: "Invite them into the app",
        content: (
          <p>
            When the patient uses EmotiveCare with the same email, connect the
            account here. Between-session care comes alive: shared diary,
            reminders, and released care-plan items.
          </p>
        ),
      },
      {
        id: "consentimentos",
        label: "Turn on the right purposes",
        content: (
          <p>
            Each purpose (diary, chart, teleconsult, reminders, AI) is a clear
            invitation to share. Once active, the platform unlocks the right
            tools — always with an audit trail.
          </p>
        ),
      },
    ],
  },
  diario: {
    title: "Follow the diary between sessions",
    summary:
      "See the check-ins the patient chose to share and how reminders are going — continuous emotional context, with their privacy in control.",
    topics: [
      {
        id: "o-que-e",
        label: "What you will find",
        content: (
          <p>
            Diary moments marked as <strong>shared</strong>, when the app is
            linked and diary consent is active. Arrive at the next session with
            richer context — without replacing clinical listening.
          </p>
        ),
      },
      {
        id: "lembretes",
        label: "Reminders and adherence",
        content: (
          <p>
            Follow how the patient responds to reminders they registered. The
            clinic observes adherence; dosing and prescriptions stay with the
            professional, outside this product.
          </p>
        ),
      },
      {
        id: "privacidade",
        label: "Privacy as a feature",
        content: (
          <p>
            Private diary items stay with the patient only. That per-entry
            control builds trust — and makes sharing more meaningful when it
            happens.
          </p>
        ),
      },
    ],
  },
  plano: {
    title: "Build a plan they can carry with them",
    summary:
      "Turn guidance into a living plan: activities and goals you release in the app — so care continues between sessions.",
    topics: [
      {
        id: "o-que-e",
        label: "What is the care plan for?",
        content: (
          <p>
            A shared space for next steps. You write; they see in the app only
            what you <strong>release</strong>. A clear invitation to follow the
            agreed routine, with transparency.
          </p>
        ),
      },
      {
        id: "como-usar",
        label: "Get started in 4 steps",
        content: (
          <ol className="list-decimal pl-4 space-y-1.5">
            <li>Create an active plan with a welcoming title.</li>
            <li>Add practical items (sleep, movement, reflections…).</li>
            <li>
              Click <strong>Release</strong> on what they can follow in the app.
            </li>
            <li>
              Use <strong>Hide</strong> to pause visibility without losing
              history.
            </li>
          </ol>
        ),
      },
      {
        id: "paciente",
        label: "What the patient experiences",
        content: (
          <p>
            In the app under <strong>Care plan</strong>, they see what you
            released plus upcoming sessions. Care becomes a shared habit — not
            only what happens in the room.
          </p>
        ),
      },
    ],
  },
  alertas: {
    title: "Let the platform surface patterns",
    summary:
      "Assistive suggestions from the shared diary — for you to review with human judgment and enrich the next conversation.",
    topics: [
      {
        id: "o-que-e",
        label: "What alerts offer",
        content: (
          <p>
            Automatic signals (such as elevated anxiety across check-ins) that
            help you prioritize clinical attention. They invite review — they{" "}
            <strong>do not diagnose</strong> and never replace your judgment.
          </p>
        ),
      },
      {
        id: "como-usar",
        label: "How to use them well",
        content: (
          <ol className="list-decimal pl-4 space-y-1.5">
            <li>
              Tap <strong>Scan patterns</strong> (with AI assistive consent).
            </li>
            <li>Read the draft and refine the wording if needed.</li>
            <li>
              <strong>Approve</strong> or <strong>Reject</strong> — you close
              the loop responsibly.
            </li>
          </ol>
        ),
      },
      {
        id: "limites",
        label: "Safety first",
        content: (
          <p>
            This is not an emergency channel. If life is at risk, guide people
            to local emergency services or your clinic’s crisis resources. The
            platform supports care — you lead the human response.
          </p>
        ),
      },
    ],
  },
  ia: {
    title: "Use AI as a draft, not a decision",
    summary:
      "Generate syntheses from diary and session data, review calmly, and approve only what fits the care.",
    topics: [
      {
        id: "o-que-e",
        label: "What synthesis does for you",
        content: (
          <p>
            An assistive draft based on authorized data — shared diary and/or
            session. It stays <strong>pending review</strong> until you decide.
            Time saved, with you in charge.
          </p>
        ),
      },
      {
        id: "como-usar",
        label: "A light, safe flow",
        content: (
          <ol className="list-decimal pl-4 space-y-1.5">
            <li>Pick the source (diary, session, or mixed) and generate.</li>
            <li>Edit the draft in your clinical voice.</li>
            <li>
              Approve when ready — this{" "}
              <strong>does not auto-write the chart</strong>.
            </li>
          </ol>
        ),
      },
      {
        id: "humano",
        label: "Human in the loop",
        content: (
          <p>
            EmotiveCare suggests; you confirm. Use synthesis as reflection
            support — never as diagnosis, prescription, or autonomous clinical
            decision.
          </p>
        ),
      },
    ],
  },
  prontuario: {
    title: "Record progress with clarity",
    summary:
      "Formal notes with authorship and signature — the clinical record your team needs, separate from CRM and the patient diary.",
    topics: [
      {
        id: "o-que-e",
        label: "Why chart here",
        content: (
          <p>
            The official session evolution space: draft, sign, and addendum.
            Unlike the CRM funnel, clinical integrity comes first.
          </p>
        ),
      },
      {
        id: "como-usar",
        label: "How to chart smoothly",
        content: (
          <ol className="list-decimal pl-4 space-y-1.5">
            <li>Create a draft while context is fresh.</li>
            <li>Review the wording carefully.</li>
            <li>
              <strong>Sign</strong> to close; later additions go in as an
              addendum.
            </li>
          </ol>
        ),
      },
      {
        id: "integridade",
        label: "Trust and traceability",
        content: (
          <p>
            Once signed, the note is not silently rewritten. Addenda preserve
            the story — and reads land in the organization audit trail.
          </p>
        ),
      },
    ],
  },
};

const helpEs: Record<ClinicPatientTabId, ClinicToolHelpDefinition> = {
  resumo: {
    title: "Empieza por el resumen",
    summary:
      "Aquí organizas al paciente en la clínica: vínculo con la app, embudo, consentimientos y contactos — el punto de partida para usar el resto de la plataforma con seguridad.",
    topics: [
      {
        id: "o-que-e",
        label: "¿Por qué empezar aquí?",
        content: (
          <p>
            Es el panel operativo del CRM. Actualiza el estado, revisa
            consentimientos y vincula la app — así el diario, el plan, las
            alertas y la IA quedan listos para el acompañamiento continuo.
          </p>
        ),
      },
      {
        id: "vinculo",
        label: "Invitar al paciente a la app",
        content: (
          <p>
            Cuando el paciente usa EmotiveCare con el mismo correo, conectas el
            registro aquí. El cuidado entre sesiones cobra vida: diario
            compartido, recordatorios y planes liberados.
          </p>
        ),
      },
      {
        id: "consentimentos",
        label: "Activar las finalidades",
        content: (
          <p>
            Cada finalidad (diario, historia clínica, teleconsulta,
            recordatorios, IA) es una invitación consciente a compartir. Con
            ellas activas, la plataforma muestra las herramientas adecuadas —
            siempre con pista de auditoría.
          </p>
        ),
      },
    ],
  },
  diario: {
    title: "Sigue el diario entre sesiones",
    summary:
      "Mira los check-ins que el paciente eligió compartir y la adhesión a recordatorios — contexto emocional continuo, con su privacidad al mando.",
    topics: [
      {
        id: "o-que-e",
        label: "Qué encuentras aquí",
        content: (
          <p>
            Momentos del diario marcados como <strong>compartidos</strong>,
            cuando hay vínculo con la app y consentimiento de diario. Llegas a
            la sesión con más contexto — sin reemplazar la escucha clínica.
          </p>
        ),
      },
      {
        id: "lembretes",
        label: "Recordatorios y adhesión",
        content: (
          <p>
            Sigue cómo responde el paciente a los recordatorios que él mismo
            registró. La clínica observa la adhesión; dosis y prescritos siguen
            bajo responsabilidad profesional fuera de la plataforma.
          </p>
        ),
      },
      {
        id: "privacidade",
        label: "Privacidad como valor",
        content: (
          <p>
            Lo privado en el diario permanece solo con el paciente. Ese control
            registro a registro fortalece la confianza — y hace más significativo
            el compartir cuando ocurre.
          </p>
        ),
      },
    ],
  },
  plano: {
    title: "Arma un plan que el paciente lleva consigo",
    summary:
      "Convierte orientaciones en un plan vivo: actividades y objetivos que liberas en la app — para que el cuidado continúe entre sesiones.",
    topics: [
      {
        id: "o-que-e",
        label: "¿Para qué sirve el plan?",
        content: (
          <p>
            Es el espacio para alinear próximos pasos con el paciente. Tú
            escribes; él ve en la app solo lo que <strong>liberas</strong>. Una
            invitación clara a seguir la rutina acordada, con transparencia.
          </p>
        ),
      },
      {
        id: "como-usar",
        label: "Empieza en 4 pasos",
        content: (
          <ol className="list-decimal pl-4 space-y-1.5">
            <li>Crea el plan activo con un título acogedor.</li>
            <li>Añade ítems prácticos (sueño, movimiento, reflexiones…).</li>
            <li>
              Pulsa <strong>Liberar</strong> en lo que puede seguir en la app.
            </li>
            <li>
              Usa <strong>Ocultar</strong> si quieres pausar la visibilidad sin
              perder el historial.
            </li>
          </ol>
        ),
      },
      {
        id: "paciente",
        label: "La experiencia del paciente",
        content: (
          <p>
            En la app, en <strong>Plan de cuidado</strong>, encuentra lo que
            liberaste y las próximas sesiones. Así el acompañamiento deja de ser
            solo “en sesión” y pasa a ser un hábito compartido.
          </p>
        ),
      },
    ],
  },
  alertas: {
    title: "Deja que la plataforma destaque patrones",
    summary:
      "Sugerencias asistivas a partir del diario compartido — para que las revises con criterio humano y enriquezcas la próxima conversación.",
    topics: [
      {
        id: "o-que-e",
        label: "Qué ofrecen las alertas",
        content: (
          <p>
            Señales automáticas (como ansiedad elevada en varios check-ins) que
            ayudan a priorizar la mirada clínica. Son invitaciones a revisar —{" "}
            <strong>no diagnostican</strong> y no sustituyen tu juicio.
          </p>
        ),
      },
      {
        id: "como-usar",
        label: "Cómo aprovecharlas bien",
        content: (
          <ol className="list-decimal pl-4 space-y-1.5">
            <li>
              Pulsa <strong>Escanear patrones</strong> (con consentimiento de
              IA).
            </li>
            <li>Lee el borrador y ajusta el texto si hace falta.</li>
            <li>
              <strong>Aprueba</strong> o <strong>Rechaza</strong> — cierras el
              ciclo con responsabilidad.
            </li>
          </ol>
        ),
      },
      {
        id: "limites",
        label: "La seguridad primero",
        content: (
          <p>
            Esto no es un canal de emergencia. Ante riesgo vital, orienta a
            servicios de urgencia locales o a los recursos de crisis de la
            clínica. La plataforma apoya el cuidado — tú conduces la respuesta
            humana.
          </p>
        ),
      },
    ],
  },
  ia: {
    title: "Usa la IA como borrador, no como decisión",
    summary:
      "Genera síntesis a partir del diario y de la sesión, revisa con calma y aprueba solo lo que encaje con el cuidado.",
    topics: [
      {
        id: "o-que-e",
        label: "Qué hace la síntesis por ti",
        content: (
          <p>
            Un texto asistivo con base en datos autorizados — diario compartido
            y/o sesión. Queda <strong>pendiente de revisión</strong> hasta que
            decidas. Ahorro de tiempo, con tú al mando.
          </p>
        ),
      },
      {
        id: "como-usar",
        label: "Flujo ligero y seguro",
        content: (
          <ol className="list-decimal pl-4 space-y-1.5">
            <li>Elige la fuente (diario, sesión o mixto) y genera.</li>
            <li>Edita el borrador con tu voz clínica.</li>
            <li>
              Aprueba cuando esté listo — esto{" "}
              <strong>no escribe la historia clínica automáticamente</strong>.
            </li>
          </ol>
        ),
      },
      {
        id: "humano",
        label: "Humano al mando",
        content: (
          <p>
            EmotiveCare sugiere; tú confirmas. Usa la síntesis como apoyo a la
            reflexión — nunca como diagnóstico, prescripción o decisión clínica
            autónoma.
          </p>
        ),
      },
    ],
  },
  prontuario: {
    title: "Registra la evolución con claridad",
    summary:
      "Notas formales con autoría y firma — el registro clínico que el equipo necesita, separado del CRM y del diario del paciente.",
    topics: [
      {
        id: "o-que-e",
        label: "El valor de la historia clínica aquí",
        content: (
          <p>
            Espacio para la evolución oficial de la sesión: borrador, firma y
            addendum. Distinto del embudo del CRM — aquí la integridad del
            registro clínico va primero.
          </p>
        ),
      },
      {
        id: "como-usar",
        label: "Cómo registrar con fluidez",
        content: (
          <ol className="list-decimal pl-4 space-y-1.5">
            <li>Crea la nota en borrador mientras el contexto está fresco.</li>
            <li>Revisa el texto con calma.</li>
            <li>
              <strong>Firma</strong> para cerrar; los complementos después
              entran como addendum.
            </li>
          </ol>
        ),
      },
      {
        id: "integridade",
        label: "Confianza y trazabilidad",
        content: (
          <p>
            Tras firmarse, la nota no desaparece ni se reescribe en silencio. Los
            addenda preservan la historia — y las lecturas entran en la
            auditoría de la organización.
          </p>
        ),
      },
    ],
  },
};

const HELP_BY_LOCALE: Record<
  ClinicHelpLocale,
  Record<ClinicPatientTabId, ClinicToolHelpDefinition>
> = {
  pt: helpPt,
  en: helpEn,
  es: helpEs,
};

export type ClinicPageHelpId = "conhecimento";

const pageHelpPt: Record<ClinicPageHelpId, ClinicToolHelpDefinition> = {
  conhecimento: {
    title: "Para que serve o Conhecimento clínico",
    summary:
      "É a biblioteca curada da clínica: artigos que você publica aqui passam a orientar as sínteses da SENTIO AI — só o que a equipe validar entra no raciocínio da IA.",
    topics: [
      {
        id: "o-que-e",
        label: "O que é e por que usar",
        content: (
          <>
            <p>
              Em vez de a IA buscar a internet aberta, ela consulta esta base
              curada (RAG). Assim as sínteses ficam alinhadas à linha de cuidado
              da sua clínica — materiais educativos, critérios de encaminhamento,
              textos de acolhimento, orientações de governança.
            </p>
            <p>
              <strong>Não é protocolo diagnóstico</strong> nem substitui julgamento
              clínico. Use para educação, padronização interna e contexto seguro
              para a IA.
            </p>
          </>
        ),
      },
      {
        id: "como-usar",
        label: "Como usar no dia a dia",
        content: (
          <ol className="list-decimal pl-4 space-y-1.5">
            <li>
              Escreva um artigo com título claro e conteúdo objetivo (o que a
              equipe ou a IA devem lembrar).
            </li>
            <li>
              Salve como <strong>rascunho</strong>, revise com calma e só então
              clique em <strong>Publicar</strong>.
            </li>
            <li>
              Artigos publicados passam a poder ser usados nas sínteses IA do
              paciente; rascunhos e arquivados ficam de fora.
            </li>
            <li>
              Arquive quando o conteúdo ficar desatualizado — assim a IA deixa de
              usá-lo sem apagar o histórico.
            </li>
          </ol>
        ),
      },
      {
        id: "exemplos",
        label: "Exemplos do dia a dia",
        content: (
          <ul className="list-disc pl-4 space-y-2">
            <li>
              <strong>Antes da sessão:</strong> publique psicoeducação sobre
              ansiedade; a síntese IA pode ancorar sugestões nesse material.
            </li>
            <li>
              <strong>Acolhimento e crise:</strong> cadastre o roteiro interno
              (CVV, SAMU, critérios da clínica) para a equipe e a IA falarem a
              mesma linguagem.
            </li>
            <li>
              <strong>Padronizar a equipe:</strong> documente triagem ou critérios
              de alta do funil CRM — novos profissionais e a IA usam a mesma regra.
            </li>
            <li>
              <strong>Revisão mensal:</strong> atualize o que mudou e arquive o
              obsoleto para manter a base confiável.
            </li>
          </ul>
        ),
      },
      {
        id: "plataforma-vs-clinica",
        label: "Catálogo da plataforma vs. da clínica",
        content: (
          <p>
            Há artigos da <strong>plataforma</strong> (somente leitura) e artigos
            da <strong>sua clínica</strong>, que você cria e gerencia. Publique o
            que for específico da sua prática — a IA combina as duas fontes, sempre
            com humano no comando na revisão da síntese.
          </p>
        ),
      },
      {
        id: "boas-praticas",
        label: "Boas práticas de conteúdo",
        content: (
          <ul className="list-disc pl-4 space-y-1.5">
            <li>Prefira textos curtos, datados e com linguagem da equipe.</li>
            <li>
              Evite dados identificáveis de pacientes — isto é base educativa,
              não prontuário.
            </li>
            <li>
              Use categorias (ex.: crise, acolhimento, psicoeducação) para
              organizar o catálogo.
            </li>
            <li>
              Revise periodicamente: publique o atual, arquive o obsoleto.
            </li>
          </ul>
        ),
      },
    ],
  },
};

const pageHelpEn: Record<ClinicPageHelpId, ClinicToolHelpDefinition> = {
  conhecimento: {
    title: "What Clinical knowledge is for",
    summary:
      "Your clinic’s curated library: articles you publish here guide SENTIO AI syntheses — only content the team validates enters the AI’s reasoning.",
    topics: [
      {
        id: "o-que-e",
        label: "What it is and why use it",
        content: (
          <>
            <p>
              Instead of browsing the open web, the AI queries this curated base
              (RAG). Syntheses stay aligned with your clinic’s care approach —
              educational materials, referral criteria, support scripts, and
              governance guidance.
            </p>
            <p>
              <strong>This is not a diagnostic protocol</strong> and does not
              replace clinical judgment. Use it for education, internal standards,
              and safe context for the AI.
            </p>
          </>
        ),
      },
      {
        id: "como-usar",
        label: "How to use it day to day",
        content: (
          <ol className="list-decimal pl-4 space-y-1.5">
            <li>
              Write an article with a clear title and focused content (what the
              team or AI should remember).
            </li>
            <li>
              Save as a <strong>draft</strong>, review carefully, then click{" "}
              <strong>Publish</strong>.
            </li>
            <li>
              Published articles can be used in patient AI syntheses; drafts and
              archived items stay out.
            </li>
            <li>
              Archive when content is outdated — the AI stops using it without
              deleting history.
            </li>
          </ol>
        ),
      },
      {
        id: "exemplos",
        label: "Day-to-day examples",
        content: (
          <ul className="list-disc pl-4 space-y-2">
            <li>
              <strong>Before a session:</strong> publish psychoeducation on
              anxiety; AI syntheses can ground suggestions in that material.
            </li>
            <li>
              <strong>Intake and crisis:</strong> add your internal support
              script so the team and AI speak the same language.
            </li>
            <li>
              <strong>Align the team:</strong> document triage or CRM discharge
              criteria — new professionals and the AI use the same rule.
            </li>
            <li>
              <strong>Monthly review:</strong> update what changed and archive
              what is obsolete to keep the base trustworthy.
            </li>
          </ul>
        ),
      },
      {
        id: "plataforma-vs-clinica",
        label: "Platform catalog vs. clinic articles",
        content: (
          <p>
            There are <strong>platform</strong> articles (read-only) and{" "}
            <strong>your clinic’s</strong> articles, which you create and manage.
            Publish what is specific to your practice — the AI combines both
            sources, always with a human reviewing the synthesis.
          </p>
        ),
      },
      {
        id: "boas-praticas",
        label: "Content best practices",
        content: (
          <ul className="list-disc pl-4 space-y-1.5">
            <li>Prefer short, dated texts in the team’s language.</li>
            <li>
              Avoid identifiable patient data — this is an educational base, not
              the clinical record.
            </li>
            <li>
              Use categories (e.g. crisis, intake, psychoeducation) to organize
              the catalog.
            </li>
            <li>
              Review regularly: publish what is current, archive what is obsolete.
            </li>
          </ul>
        ),
      },
    ],
  },
};

const pageHelpEs: Record<ClinicPageHelpId, ClinicToolHelpDefinition> = {
  conhecimento: {
    title: "Para qué sirve el Conocimiento clínico",
    summary:
      "Es la biblioteca curada de la clínica: los artículos que publicas aquí orientan las síntesis de SENTIO AI — solo lo que el equipo valide entra en el razonamiento de la IA.",
    topics: [
      {
        id: "o-que-e",
        label: "Qué es y por qué usarlo",
        content: (
          <>
            <p>
              En lugar de buscar en la web abierta, la IA consulta esta base
              curada (RAG). Así las síntesis se alinean con la línea de cuidado de
              tu clínica — materiales educativos, criterios de derivación, textos
              de acogida y orientación de gobernanza.
            </p>
            <p>
              <strong>No es un protocolo diagnóstico</strong> ni sustituye el
              juicio clínico. Úsalo para educación, estandarización interna y
              contexto seguro para la IA.
            </p>
          </>
        ),
      },
      {
        id: "como-usar",
        label: "Cómo usarlo día a día",
        content: (
          <ol className="list-decimal pl-4 space-y-1.5">
            <li>
              Escribe un artículo con título claro y contenido concreto (lo que
              el equipo o la IA deben recordar).
            </li>
            <li>
              Guárdalo como <strong>borrador</strong>, revísalo con calma y solo
              entonces pulsa <strong>Publicar</strong>.
            </li>
            <li>
              Los artículos publicados pueden usarse en las síntesis IA del
              paciente; borradores y archivados quedan fuera.
            </li>
            <li>
              Archiva cuando el contenido quede desactualizado — la IA deja de
              usarlo sin borrar el historial.
            </li>
          </ol>
        ),
      },
      {
        id: "exemplos",
        label: "Ejemplos del día a día",
        content: (
          <ul className="list-disc pl-4 space-y-2">
            <li>
              <strong>Antes de la sesión:</strong> publica psicoeducación sobre
              ansiedad; la síntesis IA puede anclar sugerencias en ese material.
            </li>
            <li>
              <strong>Acogida y crisis:</strong> registra el guion interno de
              apoyo para que el equipo y la IA hablen el mismo idioma.
            </li>
            <li>
              <strong>Alinear al equipo:</strong> documenta triaje o criterios de
              alta del embudo CRM — profesionales nuevos y la IA usan la misma
              regla.
            </li>
            <li>
              <strong>Revisión mensual:</strong> actualiza lo que cambió y
              archiva lo obsoleto para mantener la base confiable.
            </li>
          </ul>
        ),
      },
      {
        id: "plataforma-vs-clinica",
        label: "Catálogo de la plataforma vs. de la clínica",
        content: (
          <p>
            Hay artículos de la <strong>plataforma</strong> (solo lectura) y
            artículos de <strong>tu clínica</strong>, que creas y gestionas.
            Publica lo específico de tu práctica — la IA combina ambas fuentes,
            siempre con revisión humana de la síntesis.
          </p>
        ),
      },
      {
        id: "boas-praticas",
        label: "Buenas prácticas de contenido",
        content: (
          <ul className="list-disc pl-4 space-y-1.5">
            <li>Prefiere textos cortos, fechados y con el lenguaje del equipo.</li>
            <li>
              Evita datos identificables de pacientes — esto es base educativa,
              no prontuario.
            </li>
            <li>
              Usa categorías (p. ej. crisis, acogida, psicoeducación) para
              organizar el catálogo.
            </li>
            <li>
              Revisa periódicamente: publica lo actual, archiva lo obsoleto.
            </li>
          </ul>
        ),
      },
    ],
  },
};

const PAGE_HELP_BY_LOCALE: Record<
  ClinicHelpLocale,
  Record<ClinicPageHelpId, ClinicToolHelpDefinition>
> = {
  pt: pageHelpPt,
  en: pageHelpEn,
  es: pageHelpEs,
};

export function getClinicPatientTabHelp(
  tab: ClinicPatientTabId,
  locale: ClinicHelpLocale = "pt",
): ClinicToolHelpDefinition {
  return HELP_BY_LOCALE[locale][tab];
}

export function getClinicPageHelp(
  page: ClinicPageHelpId,
  locale: ClinicHelpLocale = "pt",
): ClinicToolHelpDefinition {
  return PAGE_HELP_BY_LOCALE[locale][page];
}

/** @deprecated Prefer getClinicPatientTabHelp(tab, locale) */
export const CLINIC_PATIENT_TAB_HELP = helpPt;
