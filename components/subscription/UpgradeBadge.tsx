"use client";

import Link from "next/link";

interface UpgradeBadgeProps {
  planName?: string;
  href?: string;
  className?: string;
}

export function UpgradeBadge({
  planName = "Pleno",
  href = "/assinatura",
  className = "",
}: UpgradeBadgeProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-anima-violet/10 text-anima-violet border border-anima-violet/20 hover:bg-anima-violet/15 transition-colors ${className}`}
    >
      <svg
        className="w-3 h-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
      {planName}
    </Link>
  );
}
