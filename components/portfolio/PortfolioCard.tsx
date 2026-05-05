import Link from "next/link";
import Image from "next/image";
import type { ServiceCategory } from "@/types";
import type { AdminPortfolioItem } from "@/types/admin";
import { cn } from "@/lib/utils";

const categoryLabels: Record<ServiceCategory, string> = {
  logo: "Logo",
  branding: "Branding",
  signage: "Signage",
  printing: "Print",
  vehicle: "Vehicle",
  social: "Social",
};

const initialsBg: Record<ServiceCategory, string> = {
  logo: "bg-ink text-white",
  branding: "bg-brand text-ink",
  signage: "bg-cta text-ink",
  printing: "bg-surface text-ink",
  vehicle: "bg-ink text-white",
  social: "bg-brand text-ink",
};

type Props = {
  item: AdminPortfolioItem;
  showCategory?: boolean;
  sizes?: string;
  className?: string;
};

export function PortfolioCard({
  item,
  showCategory = true,
  sizes = "(max-width: 1024px) 50vw, 33vw",
  className,
}: Props) {
  const hasImage = item.image && /^https?:\/\//.test(item.image);
  return (
    <Link
      href={`/portfolio/${item.slug}`}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-bg transition-all hover:-translate-y-0.5 hover:border-ink hover:shadow-sm",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface">
        {hasImage ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes={sizes}
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
            unoptimized
          />
        ) : (
          <div className={cn("grid h-full place-items-center p-6 text-center", initialsBg[item.category])}>
            <span className="text-2xl font-bold tracking-tight md:text-3xl">{item.client}</span>
          </div>
        )}
        {showCategory ? (
          <span className="absolute right-3 top-3 rounded-full bg-bg/95 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ink shadow-sm backdrop-blur">
            {categoryLabels[item.category]}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">
          {item.client} · {item.year}
        </p>
        <h3 className="text-base font-semibold tracking-tight md:text-lg">{item.title}</h3>
        <p className="text-sm text-ink-soft">{item.summary}</p>
      </div>
    </Link>
  );
}
