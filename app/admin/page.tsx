import Link from "next/link";

const CARDS = [
  {
    href: "/admin/vendas",
    title: "Playbook de vendas",
    description:
      "Pitches, descrições de planos, scripts de call, objeções, e-mails e WhatsApp — tudo copiável.",
    tag: "Comercial",
  },
  {
    href: "/admin/depoimentos",
    title: "Depoimentos da home",
    description:
      "Cadastre foto e texto de quem usa a plataforma. Aparecem na landing entre segurança e planos.",
    tag: "Marketing",
  },
] as const;

export default function AdminHomePage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-white/95">Painel admin</h1>
        <p className="mt-2 text-sm text-white/45 max-w-xl">
          Área restrita à operação EmotiveCare. Materiais internos e ferramentas
          de plataforma.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-colors hover:border-anima-violet/30 hover:bg-anima-violet/[0.06]"
          >
            <span className="text-[10px] uppercase tracking-wider text-anima-violet/70">
              {card.tag}
            </span>
            <h2 className="mt-2 text-lg font-medium text-white/90 group-hover:text-anima-violet">
              {card.title}
            </h2>
            <p className="mt-2 text-sm text-white/45 leading-relaxed">
              {card.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
