"use client";

import type { CrisisResource } from "@anima/shared";

type Props = {
  disclaimer: string;
  resources: CrisisResource[];
  compact?: boolean;
};

export function CrisisResourcesList({
  disclaimer,
  resources,
  compact = false,
}: Props) {
  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      <p
        className={`leading-relaxed text-foreground/40 ${
          compact ? "text-[11px]" : "text-xs"
        }`}
      >
        {disclaimer}
      </p>
      <ul className="space-y-2">
        {resources.map((item, idx) => (
          <li
            key={item.id ?? `platform-${idx}`}
            className={
              compact
                ? "rounded-lg border border-foreground/[0.08] px-3 py-2"
                : "glass-panel p-4"
            }
          >
            <p
              className={`font-medium text-foreground/80 ${
                compact ? "text-xs" : "text-sm"
              }`}
            >
              {item.title}
            </p>
            <div
              className={`mt-1 flex flex-wrap gap-x-3 gap-y-1 ${
                compact ? "text-[11px]" : "text-xs"
              } text-foreground/50`}
            >
              {item.phone ? (
                <a
                  href={`tel:${item.phone.replace(/\s/g, "")}`}
                  className="text-anima-violet hover:underline"
                >
                  {item.phone}
                </a>
              ) : null}
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-anima-violet hover:underline"
                >
                  Abrir link
                </a>
              ) : null}
            </div>
            {item.note ? (
              <p
                className={`mt-1 text-foreground/40 ${
                  compact ? "text-[10px]" : "text-xs"
                }`}
              >
                {item.note}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
