import type { AuthPageDictionary } from "./auth-pt";

export const authEs = {
  common: {
    or: "o",
    loading: "Cargando...",
    emailLabel: "Email",
    passwordLabel: "Contraseña",
  },
  login: {
    title: "Bienvenido de nuevo",
    subtitle:
      "Tu puerta de entrada a una plataforma de cuidado emocional continuo",
    passwordPlaceholder: "Tu contraseña",
    forgotPassword: "¿Olvidaste tu contraseña?",
    submit: "Entrar",
    noAccount: "¿Aún no tienes cuenta?",
    createAccount: "Crear cuenta",
    resetSuccess: "Contraseña actualizada. Entra con tu nueva contraseña.",
    verifiedSuccess: "¡Email confirmado! Entra para continuar.",
    sessionReuseWarning:
      "Tu sesión se cerró por seguridad (posible uso del mismo acceso en otro dispositivo). Vuelve a entrar.",
    errors: {
      validation: "Revisa los campos.",
      invalidCredentials: "Email o contraseña incorrectos. Inténtalo de nuevo.",
    },
  },
  register: {
    title: "Crea tu cuenta",
    subtitle:
      "Comienza tu camino en EmotiveCare, tu segundo cerebro emocional — simple y acogedor",
    nameLabel: "Nombre",
    namePlaceholder: "¿Cómo podemos llamarte?",
    passwordPlaceholder: "Mínimo 6 caracteres",
    confirmPasswordLabel: "Confirmar contraseña",
    confirmPasswordPlaceholder: "Repite tu contraseña",
    submit: "Crear cuenta",
    hasAccount: "¿Ya tienes cuenta?",
    signIn: "Entrar",
    errors: {
      required: "Completa todos los campos obligatorios.",
      passwordTooShort: "La contraseña debe tener al menos 6 caracteres.",
      passwordMismatch: "Las contraseñas no coinciden.",
      createFailed: "No se pudo crear tu cuenta. Inténtalo de nuevo.",
    },
  },
  forgotPassword: {
    title: "Olvidé mi contraseña",
    subtitle: "Te enviaremos un enlace para restablecer tu contraseña",
    emailLabel: "Email",
    emailPlaceholder: "tu@email.com",
    submit: "Enviar enlace",
    remembered: "¿Recordaste la contraseña?",
    backToLogin: "Volver al inicio de sesión",
    checkEmailTitle: "Revisa tu email",
    linkExpires: "El enlace caduca en 1 hora.",
    defaultSuccess:
      "Si el email está registrado, recibirás instrucciones para restablecer la contraseña.",
    errors: {
      invalidEmail: "Email inválido.",
      tryLater: "Inténtalo de nuevo más tarde.",
      sendFailed: "No se pudo enviar la solicitud. Inténtalo de nuevo.",
    },
  },
  resetPassword: {
    title: "Nueva contraseña",
    subtitle: "Elige una contraseña segura para tu cuenta",
    passwordLabel: "Nueva contraseña",
    passwordPlaceholder: "Mínimo 6 caracteres",
    confirmLabel: "Confirmar contraseña",
    confirmPlaceholder: "Repite la nueva contraseña",
    submit: "Guardar contraseña",
    successRedirect: "Contraseña actualizada. Redirigiendo…",
    invalidToken: "Enlace inválido o caducado. Solicita uno nuevo.",
    errors: {
      passwordTooShort: "La contraseña debe tener al menos 6 caracteres.",
      passwordMismatch: "Las contraseñas no coinciden.",
      failed: "No se pudo restablecer la contraseña. Inténtalo de nuevo.",
    },
  },
  verifyEmail: {
    title: "Verificar email",
    verifying: "Confirmando tu email…",
    success: "Email confirmado. Ya puedes entrar.",
    failed: "No se pudo verificar el email. El enlace puede haber caducado.",
    goLogin: "Ir a iniciar sesión",
  },
  awaitingVerification: {
    title: "Confirma tu email",
    body: "Enviamos un enlace de verificación a tu correo. Ábrelo para activar tu cuenta.",
    resend: "Reenviar email",
    resent: "Email reenviado.",
    logout: "Salir",
    goLogin: "Ir a iniciar sesión",
  },
} as const satisfies AuthPageDictionary;
