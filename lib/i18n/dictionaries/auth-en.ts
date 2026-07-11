import type { AuthDictionary } from "./auth-pt";

export const authEn = {
  common: {
    or: "or",
    loading: "Loading...",
    emailLabel: "Email",
    passwordLabel: "Password",
  },
  login: {
    title: "Welcome back",
    subtitle: "Your gateway to a continuous emotional care platform",
    passwordPlaceholder: "Your password",
    forgotPassword: "Forgot your password?",
    submit: "Sign in",
    noAccount: "Don't have an account yet?",
    createAccount: "Create account",
    resetSuccess: "Password updated. Sign in with your new password.",
    verifiedSuccess: "Email confirmed! Sign in to continue.",
    sessionReuseWarning:
      "Your session was ended for security (possible use of the same login on another device). Please sign in again.",
    errors: {
      validation: "Please check the fields.",
      invalidCredentials: "Incorrect email or password. Please try again.",
    },
  },
  register: {
    title: "Create your account",
    subtitle:
      "Start your journey with EmotiveCare, your emotional second brain — simple and welcoming",
    nameLabel: "Name",
    namePlaceholder: "What should we call you?",
    passwordPlaceholder: "At least 6 characters",
    confirmPasswordLabel: "Confirm password",
    confirmPasswordPlaceholder: "Repeat your password",
    submit: "Create account",
    hasAccount: "Already have an account?",
    signIn: "Sign in",
    errors: {
      required: "Please fill in all required fields.",
      passwordTooShort: "Password must be at least 6 characters.",
      passwordMismatch: "Passwords do not match.",
      createFailed: "Could not create your account. Please try again.",
    },
  },
  forgotPassword: {
    title: "Forgot my password",
    subtitle: "We will send a link to reset your password",
    emailLabel: "Email",
    emailPlaceholder: "you@email.com",
    submit: "Send reset link",
    remembered: "Remembered your password?",
    backToLogin: "Back to sign in",
    checkEmailTitle: "Check your email",
    linkExpires: "The link expires in 1 hour.",
    defaultSuccess:
      "If the email is registered, you will receive instructions to reset your password.",
    errors: {
      invalidEmail: "Invalid email.",
      tryLater: "Please try again later.",
      sendFailed: "Could not send the request. Please try again.",
    },
  },
} as const satisfies AuthDictionary;
