"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimaLogo } from "@/components/brand/AnimaLogo";
import { useAuth } from "@/lib/auth/AuthContext";
import { useSubscription } from "@/providers/subscription-provider";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Início", icon: HomeIcon },
  { href: "/diary/new", label: "Novo registro", icon: PlusIcon },
  { href: "/diary", label: "Histórico", icon: ClockIcon },
  { href: "/care/patients", label: "Acompanhamentos", icon: PatientsIcon },
  { href: "/dashboard/care", label: "Compartilhar", icon: ShareIcon },
  { href: "/dashboard/perfil", label: "Perfil", icon: UserIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { subscription, planSlug, shouldSuggestUpgrade } = useSubscription();
  const planLabel = subscription?.plan.nome ?? "Essencial";

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-full border-r border-foreground/[0.06] bg-background/80 backdrop-blur-sm">
        <div className="p-6 pb-4">
          <AnimaLogo href="/dashboard" size="header" showWordmark />
        </div>

        <nav className="flex-1 px-3 py-2 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-anima-violet/10 text-anima-violet"
                    : "text-foreground/50 hover:text-foreground/80 hover:bg-foreground/[0.04]"
                }`}
              >
                <item.icon active={isActive} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-foreground/[0.06]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-anima-violet/15 flex items-center justify-center">
              <span className="text-xs font-semibold text-anima-violet">
                {user?.nome?.charAt(0) ?? "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground/70 truncate">
                {user?.nome}
              </p>
              <p className="text-[10px] text-foreground/35 truncate">
                {user?.email}
              </p>
              <Link
                href="/assinatura"
                className="text-[10px] text-anima-violet hover:underline mt-0.5 inline-block"
              >
                {planLabel}
                {shouldSuggestUpgrade ? " · Upgrade" : ""}
              </Link>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-foreground/40 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200"
          >
            <LogoutIcon />
            Sair
          </button>
        </div>
      </aside>

      {/* Mobile bottom bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-foreground/[0.06] bg-background/90 backdrop-blur-lg safe-area-pb">
        <div className="flex items-center justify-around py-2">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                  isActive
                    ? "text-anima-violet"
                    : "text-foreground/35 hover:text-foreground/60"
                }`}
              >
                <item.icon active={isActive} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg
      className="w-5 h-5"
      fill={active ? "currentColor" : "none"}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={active ? 0 : 1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
      />
    </svg>
  );
}

function PlusIcon({ active }: { active: boolean }) {
  return (
    <svg
      className="w-5 h-5"
      fill={active ? "currentColor" : "none"}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={active ? 0 : 1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  );
}

function MapIcon({ active }: { active: boolean }) {
  return (
    <svg
      className="w-5 h-5"
      fill={active ? "currentColor" : "none"}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={active ? 0 : 1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
      />
    </svg>
  );
}

function ClockIcon({ active }: { active: boolean }) {
  return (
    <svg
      className="w-5 h-5"
      fill={active ? "currentColor" : "none"}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={active ? 0 : 1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function PatientsIcon({ active }: { active: boolean }) {
  return (
    <svg
      className="w-5 h-5"
      fill={active ? "currentColor" : "none"}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={active ? 0 : 1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-5.058-2.772M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function ShareIcon({ active }: { active: boolean }) {
  return (
    <svg
      className="w-5 h-5"
      fill={active ? "currentColor" : "none"}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={active ? 0 : 1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
      />
    </svg>
  );
}

function UserIcon({ active }: { active: boolean }) {
  return (
    <svg
      className="w-5 h-5"
      fill={active ? "currentColor" : "none"}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={active ? 0 : 1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
      />
    </svg>
  );
}
