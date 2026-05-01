import Link from "next/link";

type Crumb = { name: string; href: string };

type Props = {
  items: Crumb[];
  className?: string;
};

export function Breadcrumbs({ items, className }: Props) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs uppercase tracking-wider text-muted">
        {items.map((c, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={c.href} className="flex items-center gap-2">
              {isLast ? (
                <span aria-current="page" className="text-ink-soft">
                  {c.name}
                </span>
              ) : (
                <Link href={c.href} className="hover:text-ink">
                  {c.name}
                </Link>
              )}
              {!isLast && <span aria-hidden>/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
