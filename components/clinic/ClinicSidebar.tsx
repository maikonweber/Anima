"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { AnimaLogo } from "@/components/brand/AnimaLogo";
import { useAuth } from "@/lib/auth/AuthContext";
import { useMyOrganizations, useOrganization } from "@/hooks/use-organizations";

type NavItem = {
  href: string;
  label: string;
  shortLabel?: string;
  match?: (pathname: string) => boolean;
  icon: (props: { active: boolean }) => React.ReactElement;
};

export function ClinicSidebar() {
  const pathname = usePathname();
  const params = useParams<{ orgId?: string }>();
  const orgId = typeof params.orgId === "string" ? params.orgId : undefined;
  const { user, logout } = useAuth();
  const orgQuery = useOrganization(orgId ?? "");
  const { data: orgs } = useMyOrganizations();
  const [menuOpen, setMenuOpen] = useState(false);

  const membershipRole = useMemo(
    () =>
      orgId
        ? orgs?.find((item) => item.organization.id === orgId)?.membership.role
        : undefined,
    [orgs, orgId],
  );
  const canViewAudit =
    membershipRole === "CLINIC_ADMIN" || membershipRole === "DPO";
  const canClinical =
    membershipRole === "CLINIC_ADMIN" || membershipRole === "PROFESSIONAL";
  const canOpsCrm =
    membershipRole === "CLINIC_ADMIN" ||
    membershipRole === "PROFESSIONAL" ||
    membershipRole === "SECRETARY";

  const orgNav: NavItem[] = useMemo(() => {
    if (!orgId) return [];
    const base = `/clinic/${orgId}`;
    const items: NavItem[] = [
      {
        href: base,
        label: "Visão geral",
        shortLabel: "Início",
        match: (p) => p === base,
        icon: HomeIcon,
      },
    ];
    if (canOpsCrm) {
      items.push(
        {
          href: `${base}/patients`,
          label: "Pacientes",
          shortLabel: "CRM",
          match: (p) => p.startsWith(`${base}/patients`),
          icon: PatientsIcon,
        },
        {
          href: `${base}/agenda`,
          label: "Agenda",
          shortLabel: "Agenda",
          match: (p) =>
            p.startsWith(`${base}/agenda`) && !p.includes("/disponibilidade"),
          icon: CalendarIcon,
        },
        {
          href: `${base}/agenda/disponibilidade`,
          label: "Disponibilidade",
          shortLabel: "Horários",
          match: (p) => p.includes("/disponibilidade"),
          icon: ClockIcon,
        },
      );
    }
    if (canClinical) {
      items.push(
        {
          href: `${base}/conhecimento`,
          label: "Conhecimento",
          shortLabel: "RAG",
          match: (p) => p.startsWith(`${base}/conhecimento`),
          icon: BookIcon,
        },
        {
          href: `${base}/alertas`,
          label: "Alertas",
          shortLabel: "Alertas",
          match: (p) => p.startsWith(`${base}/alertas`),
          icon: AlertIcon,
        },
        {
          href: `${base}/crise`,
          label: "Recursos de crise",
          shortLabel: "Crise",
          match: (p) => p.startsWith(`${base}/crise`),
          icon: CrisisIcon,
        },
      );
    }
    if (canViewAudit) {
      items.push({
        href: `${base}/auditoria`,
        label: "Auditoria",
        shortLabel: "Audit",
        match: (p) => p.startsWith(`${base}/auditoria`),
        icon: AuditIcon,
      });
    }
    return items;
  }, [orgId, canViewAudit, canClinical, canOpsCrm]);

  const topNav: NavItem[] = useMemo(
    () => [
      {
        href: "/clinic",
        label: "Minhas clínicas",
        shortLabel: "Clínicas",
        match: (p) => p === "/clinic",
        icon: BuildingIcon,
      },
      ...orgNav,
    ],
    [orgNav],
  );

  const primaryMobile = orgId
    ? orgNav.slice(0, 3)
    : [
        {
          href: "/clinic",
          label: "Clínicas",
          shortLabel: "Clínicas",
          match: (p: string) => p.startsWith("/clinic"),
          icon: BuildingIcon,
        },
      ];

  const isItemActive = (item: NavItem) =>
    item.match ? item.match(pathname) : pathname.startsWith(item.href);

  const isMenuActive = topNav.some(
    (item) => isItemActive(item) && !primaryMobile.some((p) => p.href === item.href),
  );

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <>
      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-40 border-b border-[var(--clinic-sidebar-edge)] bg-[var(--clinic-sidebar)]/95 backdrop-blur-md clinic-safe-top">
        <div className="flex items-center justify-between gap-3 px-3 h-12">
          <Link href="/clinic" className="flex items-center gap-2 min-w-0">
            <AnimaLogo size="sm" className="scale-75 origin-left" />
            <div className="min-w-0 -ml-1">
              <p className="text-[11px] font-semibold text-foreground leading-none truncate">
                EmotiveCare
              </p>
              <p className="text-[9px] uppercase tracking-[0.14em] text-[var(--clinic-accent)] font-semibold mt-0.5">
                Clínicas
              </p>
            </div>
          </Link>
          {orgQuery.data ? (
            <p className="text-[11px] text-[var(--clinic-muted)] truncate max-w-[42%] text-right font-medium">
              {orgQuery.data.name}
            </p>
          ) : null}
        </div>
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 xl:w-64 shrink-0 h-dvh sticky top-0 border-r border-[var(--clinic-sidebar-edge)] bg-[var(--clinic-sidebar)]">
        <div className="p-4 pb-4">
          <Link href="/clinic" className="flex items-center gap-2.5 group">
            <AnimaLogo size="sm" />
            <div className="min-w-0">
              <p className="text-[13px] font-semibold tracking-tight text-foreground leading-tight group-hover:text-[var(--clinic-accent)] transition-colors">
                EmotiveCare
              </p>
              <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--clinic-accent)] font-semibold mt-0.5">
                Clínicas
              </p>
            </div>
          </Link>
        </div>

        {orgId && orgQuery.data && (
          <div className="mx-3 mb-3 rounded-xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)] px-3 py-2.5 shadow-[0_1px_2px_rgba(15,28,36,0.03)]">
            <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--clinic-subtle)] mb-0.5 font-medium">
              Organização
            </p>
            <p className="text-sm font-semibold text-foreground truncate">
              {orgQuery.data.name}
            </p>
          </div>
        )}

        <nav className="flex-1 px-2.5 py-1 space-y-0.5 overflow-y-auto">
          {topNav.map((item) => {
            const active = isItemActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-[var(--clinic-panel)] text-[var(--clinic-accent)] shadow-[0_1px_3px_rgba(15,28,36,0.06)] ring-1 ring-[var(--clinic-border)]"
                    : "text-[var(--clinic-muted)] hover:text-foreground hover:bg-white/50"
                }`}
              >
                <item.icon active={active} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[var(--clinic-sidebar-edge)] space-y-2.5">
          <p className="px-1 text-[10px] text-[var(--clinic-subtle)] leading-relaxed">
            Produto para profissionais de saúde — separado do app do paciente.
          </p>
          <div className="flex items-center gap-2.5 min-w-0 rounded-xl bg-white/60 px-2.5 py-2">
            <div className="w-8 h-8 rounded-full bg-[var(--clinic-accent-soft)] flex items-center justify-center shrink-0">
              <span className="text-xs font-semibold text-[var(--clinic-accent)]">
                {user?.nome?.charAt(0) ?? "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {user?.nome}
              </p>
              <p className="text-[10px] text-[var(--clinic-subtle)] truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <div className="flex gap-1.5">
            <Link
              href="/dashboard"
              className="flex-1 text-center px-2 py-2 rounded-lg text-[11px] font-medium text-[var(--clinic-muted)] hover:text-foreground hover:bg-white/70 transition-colors"
            >
              App paciente
            </Link>
            <button
              type="button"
              onClick={logout}
              className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-[11px] font-medium text-[var(--clinic-muted)] hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogoutIcon />
              Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 border-t border-[var(--clinic-sidebar-edge)] bg-[var(--clinic-sidebar)]/95 backdrop-blur-lg clinic-safe-pb">
        <div className="flex items-stretch justify-between px-1 py-1.5">
          {primaryMobile.map((item) => {
            const active = isItemActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-1 min-w-0 flex-col items-center gap-0.5 px-0.5 py-1.5 rounded-lg transition-colors ${
                  active
                    ? "text-[var(--clinic-accent)]"
                    : "text-[var(--clinic-subtle)] hover:text-[var(--clinic-muted)]"
                }`}
              >
                <item.icon active={active} />
                <span className="w-full text-[10px] font-medium leading-tight text-center truncate">
                  {item.shortLabel ?? item.label}
                </span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
            className={`flex flex-1 min-w-0 flex-col items-center gap-0.5 px-0.5 py-1.5 rounded-lg transition-colors ${
              isMenuActive || menuOpen
                ? "text-[var(--clinic-accent)]"
                : "text-[var(--clinic-subtle)] hover:text-[var(--clinic-muted)]"
            }`}
          >
            <MenuIcon active={isMenuActive || menuOpen} />
            <span className="w-full text-[10px] font-medium leading-tight text-center">
              Mais
            </span>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[60]"
          role="dialog"
          aria-modal="true"
          aria-label="Menu clínicas"
        >
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-black/35"
          />
          <div className="absolute bottom-0 inset-x-0 rounded-t-2xl border-t border-[var(--clinic-border)] bg-[var(--clinic-panel)] p-4 clinic-safe-pb shadow-2xl max-h-[85dvh] overflow-y-auto">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-foreground/12" />
            {orgQuery.data ? (
              <p className="text-xs text-[var(--clinic-muted)] mb-3 px-1 truncate font-medium">
                {orgQuery.data.name}
              </p>
            ) : null}
            <div className="grid grid-cols-2 gap-2 mb-3">
              {topNav.map((item) => {
                const active = isItemActive(item);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                      active
                        ? "bg-[var(--clinic-accent-soft)] text-[var(--clinic-accent)]"
                        : "text-foreground/70 hover:bg-[var(--clinic-row-hover)]"
                    }`}
                  >
                    <item.icon active={active} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
            <Link
              href="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="block w-full rounded-xl px-3 py-3 text-sm text-[var(--clinic-muted)] hover:bg-[var(--clinic-row-hover)] mb-1"
            >
              Voltar ao app do paciente
            </Link>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                logout();
              }}
              className="w-full rounded-xl px-3 py-3 text-sm text-[var(--clinic-muted)] hover:text-red-600 hover:bg-red-50"
            >
              Sair
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
}

function PatientsIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  );
}

function CalendarIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  );
}

function ClockIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function BookIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  );
}

function AlertIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
  );
}

function AuditIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

function CrisisIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
  );
}

function BuildingIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5M3.75 21V8.25A2.25 2.25 0 016 6h4.5a2.25 2.25 0 012.25 2.25V21m0 0V9.75A2.25 2.25 0 0115 7.5h3a2.25 2.25 0 012.25 2.25V21M9 10.5h.008v.008H9V10.5zm0 3h.008v.008H9V13.5zm0 3h.008v.008H9V16.5zm4.5-6h.008v.008H13.5V10.5zm0 3h.008v.008H13.5V13.5zm0 3h.008v.008H13.5V16.5z" />
    </svg>
  );
}

function MenuIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.1 : 1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
  );
}
