export const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/plans",
  "/about",
  "/faq",
  "/contact",
  "/privacy",
  "/terms",
  "/blog",
  "/resources",
  "/psychologists",
  "/clinicas",
  "/trial",
  "/campanha",
  "/depoimento",
  "/care-invite",
  "/patient-invite",
  "/org-invite",
  "/verify-email",
  "/reset-password",
  "/aguardando-verificacao",
] as const;

export const AUTHENTICATED_ROUTES = [
  "/dashboard",
  "/dashboard/perfil",
  "/dashboard/insights",
  "/dashboard/historico",
  "/dashboard/conquistas",
  "/dashboard/mapa",
  "/dashboard/lembretes",
  "/dashboard/plano",
  "/dashboard/recursos",
  "/dashboard/consents",
  "/dashboard/care",
  "/diary",
  "/diary/new",
  "/assistente",
  "/assinatura",
  "/assinatura/gerenciar",
  "/suporte",
  "/care/patients",
  "/clinic",
] as const;

export const ADMIN_ROUTES = [
  "/admin",
  "/admin/trials",
  "/admin/vendas",
  "/admin/depoimentos",
] as const;

export const CLINIC_SUBROUTES = [
  "",
  "/patients",
  "/patients/new",
  "/agenda",
  "/agenda/new",
  "/agenda/disponibilidade",
  "/alertas",
  "/conhecimento",
  "/auditoria",
  "/crise",
  "/whatsapp",
] as const;

export function routeToSlug(route: string): string {
  const slug = route
    .replace(/^\//, "")
    .replace(/\//g, "__")
    .replace(/\[|\]/g, "")
    .replace(/[^a-zA-Z0-9_-]/g, "_");
  return slug || "home";
}
