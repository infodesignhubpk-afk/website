"use client";

import { whatsappLink } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/ui/Icons";

type Props = {
  number: string;
  message?: string;
};

export function WhatsAppButton({ number, message }: Props) {
  const href = whatsappLink(number, message ?? `Hi, I would like a quote.`);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-20 right-4 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 md:bottom-6 md:right-6 md:h-16 md:w-16"
    >
      <WhatsAppIcon size={28} />
    </a>
  );
}
