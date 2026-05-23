import Link from "next/link";
import type { Metadata } from "next";
import { AnimaLogo } from "@/components/brand/AnimaLogo";
import { NO_INDEX_METADATA } from "@/lib/seo/private-metadata";

export const metadata: Metadata = NO_INDEX_METADATA;

export default function AssinaturaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full flex flex-col">
      <header className="border-b border-foreground/[0.06] px-4 sm:px-6 py-5 sm:py-6 min-h-[5rem]">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <AnimaLogo href="/dashboard" size="header" showWordmark />
          <Link
            href="/dashboard/perfil"
            className="text-sm text-foreground/50 hover:text-anima-violet transition-colors"
          >
            Perfil
          </Link>
        </div>
      </header>
      <main id="main-content" className="flex-1">
        {children}
      </main>
    </div>
  );
}
