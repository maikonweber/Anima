interface SponsoredBenefitBadgeProps {
  className?: string;
}

export function SponsoredBenefitBadge({
  className = "",
}: SponsoredBenefitBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 ${className}`}
      title="Benefício vinculado ao plano profissional (Cuidado) do seu acompanhante"
    >
      <svg
        className="w-3 h-3 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
      Benefício pelo seu profissional
    </span>
  );
}
