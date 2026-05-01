import Link from "next/link";
import { ArrowRightIcon, PhoneIcon } from "@/components/ui/Icons";

type Props = {
  phone: string;
};

export function StickyMobileCTA({ phone }: Props) {
  return (
    <div
      role="region"
      aria-label="Quick contact"
      className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-2 border-t border-line bg-bg/95 backdrop-blur md:hidden"
    >
      <a
        href={`tel:${phone}`}
        className="flex items-center justify-center gap-2 border-r border-line py-3 text-sm font-semibold text-ink"
      >
        <PhoneIcon size={16} />
        Call Now
      </a>
      <Link
        href="/get-quote"
        className="flex items-center justify-center gap-2 bg-cta py-3 text-sm font-semibold text-ink"
      >
        Get Quote
        <ArrowRightIcon size={16} />
      </Link>
    </div>
  );
}
