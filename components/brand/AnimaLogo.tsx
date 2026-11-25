import Image from "next/image";
import Link from "next/link";

const SIZES = {
  nav: 36,
  sm: 44,
  md: 56,
  lg: 64,
  xl: 80,
  header: 40,
} as const;

type AnimaLogoSize = keyof typeof SIZES;

interface AnimaLogoProps {
  size?: AnimaLogoSize;
  showWordmark?: boolean;
  className?: string;
  wordmarkClassName?: string;
  href?: string;
}

function wordmarkSizeClass(px: number): string {
  if (px >= 64) return "text-3xl";
  if (px >= 56) return "text-2xl";
  if (px >= 44) return "text-xl";
  return "text-base sm:text-lg";
}

export function AnimaLogo({
  size = "md",
  showWordmark = false,
  className = "",
  wordmarkClassName = "",
  href,
}: AnimaLogoProps) {
  const px = SIZES[size];

  const content = (
    <span
      className={`inline-flex items-center gap-2 min-w-0 ${className}`.trim()}
    >
      <Image
        src="/logo.png"
        alt="EmotiveCare"
        width={px}
        height={px}
        className="rounded-full shrink-0"
        priority={size === "xl"}
      />
      {showWordmark && (
        <span
          className={`font-bold tracking-tight text-foreground/90 truncate ${wordmarkSizeClass(px)} ${wordmarkClassName}`.trim()}
        >
          EmotiveCare
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex min-w-0 hover:opacity-90 transition-opacity"
      >
        {content}
      </Link>
    );
  }

  return content;
}
