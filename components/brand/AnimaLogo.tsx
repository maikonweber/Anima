import Image from "next/image";
import Link from "next/link";

const SIZES = {
  sm: 36,
  md: 48,
  lg: 56,
  xl: 72,
} as const;

type AnimaLogoSize = keyof typeof SIZES;

interface AnimaLogoProps {
  size?: AnimaLogoSize;
  showWordmark?: boolean;
  className?: string;
  href?: string;
}

export function AnimaLogo({
  size = "md",
  showWordmark = false,
  className = "",
  href,
}: AnimaLogoProps) {
  const px = SIZES[size];

  const content = (
    <span
      className={`inline-flex items-center gap-2.5 ${className}`.trim()}
    >
      <Image
        src="/logo.png"
        alt="Anima"
        width={px}
        height={px}
        className="rounded-full shrink-0"
        priority={size === "xl"}
      />
      {showWordmark && (
        <span
          className={`font-bold tracking-tight text-foreground/90 ${
            px >= 48 ? "text-2xl" : "text-xl"
          }`}
        >
          Anima
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
