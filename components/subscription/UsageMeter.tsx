"use client";

import { isNearLimit, usagePercent } from "@/lib/subscription/utils";

interface UsageMeterProps {
  label: string;
  used: number;
  limit: number | null;
  className?: string;
}

export function UsageMeter({
  label,
  used,
  limit,
  className = "",
}: UsageMeterProps) {
  const percent = usagePercent(used, limit);
  const near = isNearLimit(used, limit);
  const displayLimit = limit === null ? "∞" : limit;

  return (
    <div className={className}>
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="text-xs text-foreground/50">{label}</span>
        <span
          className={`text-xs font-medium ${
            near ? "text-amber-500" : "text-foreground/60"
          }`}
        >
          {used}/{displayLimit}
        </span>
      </div>
      {limit !== null && (
        <div className="h-1.5 rounded-full bg-foreground/[0.06] overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              near
                ? "bg-gradient-to-r from-amber-400 to-amber-500"
                : "bg-gradient-to-r from-anima-violet to-anima-indigo"
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>
      )}
    </div>
  );
}
