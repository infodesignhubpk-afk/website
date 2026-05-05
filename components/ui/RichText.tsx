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
  if (!html) return "";
  try {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS,
      ALLOWED_ATTR,
      ALLOW_DATA_ATTR: false,
    });
  } catch (err) {
    console.warn("[sanitizeRichText] DOMPurify failed, falling back to text:", err);
    return html.replace(/<[^>]*>/g, "");
  }
}

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
