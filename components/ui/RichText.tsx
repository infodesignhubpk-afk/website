import DOMPurify from "isomorphic-dompurify";
import { cn } from "@/lib/utils";

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "em",
  "u",
  "s",
  "h2",
  "h3",
  "ul",
  "ol",
  "li",
  "a",
  "blockquote",
  "code",
  "pre",
  "span",
];

const ALLOWED_ATTR = ["href", "target", "rel"];

export function sanitizeRichText(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
  });
}

type Props = {
  html: string;
  className?: string;
};

export function RichText({ html, className }: Props) {
  const safe = sanitizeRichText(html);
  return (
    <div
      className={cn("rich-text text-base md:text-lg leading-relaxed text-ink", className)}
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
