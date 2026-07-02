"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimaLogo } from "@/components/brand/AnimaLogo";
import { useAuth } from "@/lib/auth/AuthContext";
import { useSubscription } from "@/providers/subscription-provider";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Início", icon: HomeIcon },
  { href: "/diary/new", label: "Novo registro", icon: PlusIcon },
  { href: "/diary", label: "Linha do tempo", icon: ClockIcon },
  {
    href: "/dashboard/insights",
    label: "Insights",
    shortLabel: "Insights",
    icon: ChartIcon,
  },
  {
    href: "/dashboard/conquistas",
    label: "Conquistas",
    shortLabel: "Conquistas",
    icon: TrophyNavIcon,
  },
  {
    href: "/assistente",
    label: "Assistente emocional",
    shortLabel: "Assistente",
    icon: AssistantChatIcon,
  },
  { href: "/care/patients", label: "Acompanhamentos", icon: PatientsIcon },
  { href: "/dashboard/care", label: "Convidar profissional", icon: ShareIcon },
  { href: "/dashboard/perfil", label: "Perfil", icon: UserIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { subscription, shouldSuggestUpgrade } = useSubscription();
  const planLabel = subscription?.plan.nome ?? "Essencial";

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-full border-r border-foreground/[0.06] bg-background/80 backdrop-blur-sm">
        <div className="p-6 pb-4">
          <AnimaLogo href="/dashboard" size="header" />
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
        <div className="flex items-stretch justify-between px-1 py-2">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-1 min-w-0 flex-col items-center gap-0.5 px-0.5 py-1.5 rounded-lg transition-colors ${
                  isActive
                    ? "text-anima-violet"
                    : "text-foreground/35 hover:text-foreground/60"
                }`}
              >
                <item.icon active={isActive} />
                <span className="w-full text-[10px] font-medium leading-tight text-center">
                  {"shortLabel" in item && item.shortLabel ? item.shortLabel : item.label}
                </span>
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

function ChartIcon({ active }: { active: boolean }) {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={active ? 2.1 : 1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 3v16.5A1.5 1.5 0 0 0 5.25 21H21M7.5 15.75l3-3 3 3 4.5-5.25"
      />
    </svg>
  );
}

function TrophyNavIcon({ active }: { active: boolean }) {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={active ? 2.1 : 1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 21h8m-4-4v4m-5-17h10v3a5 5 0 0 1-10 0V4Zm10 1h2.5a1.5 1.5 0 0 1 0 5H17m-10 0H4.5a1.5 1.5 0 0 1 0-5H7"
      />
    </svg>
  );
}

function AssistantChatIcon({ active }: { active: boolean }) {
  return (
    <svg
      className="w-5 h-5"
      fill={active ? "currentColor" : "none"}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={active ? 0 : 1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.875 13.813v-6.938a3.188 3.188 0 013.187-3.187h8.625a3.188 3.188 0 013.188 3.187v5.063a3.188 3.188 0 01-3.188 3.187h-5.063l-3.562 4.594v-4.594H8.063a3.188 3.188 0 01-3.188-3.187z" />
      {!active ? (
        <>
          <path d="M8.063 11.063h8.156" strokeWidth={1.75} />
          <path d="M8.063 13.969h5.063" strokeWidth={1.75} />
          <circle cx={18} cy={8} r={1} fill="currentColor" stroke="none" aria-hidden />
        </>
      ) : (
        <>
          <path stroke="white" fill="none" opacity={0.9} strokeWidth={1.5} d="M8 11h9M8 14h6" />
        </>
      )}
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
