import Link from "next/link";

export default function AssinaturaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full flex flex-col">
      <header className="border-b border-foreground/[0.06] px-4 sm:px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-lg font-bold text-foreground/90"
          >
            Anima
          </Link>
          <Link
            href="/dashboard/perfil"
            className="text-sm text-foreground/50 hover:text-anima-violet transition-colors"
          >
            Perfil
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
