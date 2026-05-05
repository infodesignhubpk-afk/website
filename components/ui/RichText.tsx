import { sanitizeRichText } from "@/lib/sanitize";
import { cn } from "@/lib/utils";

export { sanitizeRichText };

type Props = {
  html: string | null | undefined;
  className?: string;
};

export function RichText({ html, className }: Props) {
  if (!html) return null;
  const safe = sanitizeRichText(html);
  if (!safe) return null;
  return (
    <div
      className={cn("rich-text text-base md:text-lg leading-relaxed text-ink", className)}
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
