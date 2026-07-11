export const authPt = {
  common: {
    or: "ou",
    loading: "Carregando...",
    emailLabel: "Email",
    passwordLabel: "Senha",
  },
  login: {
    title: "Bem-vindo de volta",
    subtitle:
      "Sua porta de entrada para uma plataforma de cuidado emocional contínuo",
    passwordPlaceholder: "Sua senha",
    forgotPassword: "Esqueceu a senha?",
    submit: "Entrar",
    noAccount: "Ainda não tem conta?",
    createAccount: "Criar conta",
    resetSuccess: "Senha alterada. Faça login com sua nova senha.",
    verifiedSuccess: "E-mail confirmado! Faça login para continuar.",
    sessionReuseWarning:
      "Sua sessão foi encerrada por segurança (possível uso do mesmo login em outro dispositivo). Entre novamente.",
    errors: {
      validation: "Verifique os campos.",
      invalidCredentials: "Email ou senha incorretos. Tente novamente.",
    },
  },
  register: {
    title: "Criar sua conta",
    subtitle:
      "Comece sua jornada na EmotiveCare, seu segundo cérebro emocional — simples e acolhedor",
    nameLabel: "Nome",
    namePlaceholder: "Como podemos te chamar?",
    passwordPlaceholder: "Mínimo 6 caracteres",
    confirmPasswordLabel: "Confirmar senha",
    confirmPasswordPlaceholder: "Repita sua senha",
    submit: "Criar conta",
    hasAccount: "Já tem conta?",
    signIn: "Entrar",
    errors: {
      required: "Preencha todos os campos obrigatórios.",
      passwordTooShort: "A senha deve ter pelo menos 6 caracteres.",
      passwordMismatch: "As senhas não coincidem.",
      createFailed: "Não foi possível criar sua conta. Tente novamente.",
    },
  },
  forgotPassword: {
    title: "Esqueci minha senha",
    subtitle: "Enviaremos um link para redefinir sua senha",
    emailLabel: "E-mail",
    emailPlaceholder: "seu@email.com",
    submit: "Enviar link de redefinição",
    remembered: "Lembrou a senha?",
    backToLogin: "Voltar ao login",
    checkEmailTitle: "Verifique seu e-mail",
    linkExpires: "O link expira em 1 hora.",
    defaultSuccess:
      "Se o e-mail estiver cadastrado, você receberá instruções para redefinir a senha.",
    errors: {
      invalidEmail: "E-mail inválido.",
      tryLater: "Tente novamente mais tarde.",
      sendFailed: "Não foi possível enviar o pedido. Tente novamente.",
    },
  },
} as const;

type DeepStringify<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? DeepStringify<U>[]
    : T extends object
      ? { -readonly [K in keyof T]: DeepStringify<T[K]> }
      : T;

/** Page-level auth copy (login / register / forgot-password). */
export type AuthPageDictionary = DeepStringify<typeof authPt>;
