"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/Button";

type CopyBlockProps = {
  label?: string;
  text: string;
  asHtml?: boolean;
};

export function CopyBlock({ label, text, asHtml = false }: CopyBlockProps) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, [text]);

  return (
    <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] overflow-hidden">
      {label ? (
        <div className="flex items-center justify-between gap-3 px-4 py-2 border-b border-foreground/[0.06] bg-foreground/[0.03]">
          <span className="text-xs font-medium uppercase tracking-wide text-foreground/45">
            {label}
          </span>
          <button
            type="button"
            onClick={copy}
            className="text-xs text-anima-violet hover:underline shrink-0"
          >
            {copied ? "Copiado!" : "Copiar"}
          </button>
        </div>
      ) : null}
      <div className="p-4">
        {asHtml ? (
          <div
            className="prose prose-sm max-w-none text-foreground/80 [&_ul]:my-2 [&_p]:my-2 [&_strong]:text-foreground [&_table]:w-full [&_table]:text-xs [&_th]:text-left [&_th]:pb-2 [&_td]:py-1.5 [&_td]:border-t [&_td]:border-white/[0.06] [&_th]:text-white/50"
            dangerouslySetInnerHTML={{ __html: text }}
          />
        ) : (
          <pre className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/75 font-[family-name:var(--font-patient)]">
            {text}
          </pre>
        )}
      </div>
      {!label ? (
        <div className="px-4 pb-4">
          <Button
            type="button"
            variant="secondary"
            className="!w-auto !py-2 !px-4 text-xs"
            onClick={copy}
          >
            {copied ? "Copiado!" : "Copiar texto"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
