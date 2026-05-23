"use client";

import { Fragment, type ReactNode } from "react";

function parseInline(segment: string): ReactNode {
  const parts = segment.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return (
        <strong key={i} className="font-semibold text-foreground/90">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

/** Markdown leve: parágrafos, listas `- ` e negrito `** **` */
export function LightMarkdown({ text }: { text: string }) {
  const blocks = text
    .split(/\n\n+/)
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <div className="space-y-2 text-[0.9375rem] leading-relaxed">
      {blocks.map((block, bi) => {
        const lines = block.split("\n");
        const isBulletList =
          lines.length > 1 &&
          lines.every((l) => l.trimStart().startsWith("- ") || l.trim() === "");
        const isNumbered =
          lines.length > 1 &&
          lines.every(
            (l) => /^\d+\.\s+/.test(l.trimStart()) || l.trim() === "",
          );

        if (isBulletList) {
          return (
            <ul key={`b-${bi}`} className="list-disc pl-5 space-y-1">
              {lines
                .filter((line) => line.trim().length > 0)
                .map((line, li) => (
                  <li key={li} className="break-words">
                    {parseInline(line.replace(/^[-*]\s+/, "").trim())}
                  </li>
                ))}
            </ul>
          );
        }

        if (isNumbered) {
          return (
            <ol key={`n-${bi}`} className="list-decimal pl-5 space-y-1">
              {lines
                .filter((line) => line.trim().length > 0)
                .map((line, li) => (
                  <li key={li} className="break-words">
                    {parseInline(line.replace(/^\d+\.\s+/, "").trim())}
                  </li>
                ))}
            </ol>
          );
        }

        return (
          <p key={`p-${bi}`} className="whitespace-pre-wrap break-words">
            {parseInline(block)}
          </p>
        );
      })}
    </div>
  );
}
