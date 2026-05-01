import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "ink";
type Size = "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-cta text-ink hover:bg-cta-dark active:bg-cta-dark border border-cta hover:border-cta-dark shadow-sm",
  secondary:
    "bg-white text-ink border border-ink hover:bg-ink hover:text-white",
  ghost:
    "bg-transparent text-ink border border-line hover:border-ink",
  ink: "bg-ink text-white border border-ink hover:bg-ink-soft",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-3 text-sm md:text-base",
  lg: "px-7 py-4 text-base md:text-lg",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type AnchorProps = CommonProps & {
  href: string;
  external?: boolean;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">;

type ButtonElProps = CommonProps & {
  href?: undefined;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

function splitProps<T extends CommonProps>(p: T) {
  const { variant, size, className, children, ...rest } = p;
  void variant; void size; void className;
  return { children, rest };
}

export function Button(props: AnchorProps | ButtonElProps) {
  const { variant = "primary", size = "md", className } = props;
  const cls = cn(base, variants[variant], sizes[size], className);

  if ("href" in props && props.href !== undefined) {
    const { href, external } = props;
    const { children, rest } = splitProps(props);
    const { href: _h, external: _e, ...anchorRest } = rest as Record<string, unknown>;
    void _h; void _e;
    if (external || href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:")) {
      return (
        <a
          href={href}
          className={cls}
          rel={external || href.startsWith("http") ? "noopener noreferrer" : undefined}
          target={external || href.startsWith("http") ? "_blank" : undefined}
          {...(anchorRest as AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...(anchorRest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </Link>
    );
  }

  const { children, rest } = splitProps(props);
  return (
    <button className={cls} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
