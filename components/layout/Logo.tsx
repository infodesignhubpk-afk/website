import Link from "next/link";
import Image from "next/image";

type Props = {
  name: string;
  logoUrl?: string;
  href?: string;
  variant?: "ink" | "white" | "brand";
  className?: string;
};

const tones = {
  ink: { dot: "bg-ink text-white", text: "text-ink" },
  white: { dot: "bg-white text-ink", text: "text-white" },
  brand: { dot: "bg-brand text-ink", text: "text-ink" },
};

export function Logo({ name, logoUrl, href = "/", variant = "ink", className }: Props) {
  const tone = tones[variant];
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const inner = (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt={`${name} logo`}
          width={180}
          height={54}
          className="h-[54px] w-auto"
          priority
          unoptimized
        />
      ) : (
        <>
          <span className={`grid h-[54px] w-[54px] place-items-center rounded-full ${tone.dot} text-base font-bold tracking-tight`}>
            {initials}
          </span>
          <span className={`text-2xl font-bold tracking-tight md:text-3xl ${tone.text}`}>{name}</span>
        </>
      )}
    </span>
  );

  return (
    <Link href={href} aria-label={`${name} home`}>
      {inner}
    </Link>
  );
}
