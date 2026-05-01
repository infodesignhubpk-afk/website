"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Item = { question: string; answer: string };

type Props = {
  items: Item[];
  className?: string;
  idPrefix?: string;
};

export function Accordion({ items, className, idPrefix = "faq" }: Props) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <ul className={cn("divide-y divide-line border-y border-line", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        const id = `${idPrefix}-${i}`;
        return (
          <li key={id}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`${id}-panel`}
              id={`${id}-header`}
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-start justify-between gap-6 py-5 text-left md:py-6"
            >
              <span className="text-lg font-semibold tracking-tight md:text-xl">
                {item.question}
              </span>
              <span
                aria-hidden
                className={cn(
                  "mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-ink transition-transform duration-200",
                  isOpen && "rotate-45 bg-brand",
                )}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
            </button>
            <div
              id={`${id}-panel`}
              role="region"
              aria-labelledby={`${id}-header`}
              hidden={!isOpen}
              className="pb-6 pr-12 text-base leading-relaxed text-ink-soft md:text-lg"
            >
              {item.answer}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
