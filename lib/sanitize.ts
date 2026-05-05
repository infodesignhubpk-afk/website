// Pure-JS HTML sanitizer for admin-authored rich text.
// Whitelist-based — strips anything not explicitly allowed.
// Runs identically in Node and the browser; no jsdom / dompurify needed.

const ALLOWED_TAGS = new Set([
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
]);

const ALLOWED_ATTRS_BY_TAG: Record<string, Set<string>> = {
  a: new Set(["href", "target", "rel"]),
};

const URL_ATTRS = new Set(["href"]);
const SAFE_URL = /^(https?:|mailto:|tel:|\/|#)/i;
const DANGEROUS_TAGS = /<\s*\/?\s*(script|style|iframe|object|embed|link|meta|base|form|input|button|svg|math)\b[^>]*>/gi;
const DANGEROUS_BLOCKS = /<\s*(script|style)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi;
const COMMENTS = /<!--[\s\S]*?-->/g;

function sanitizeAttrs(tag: string, raw: string): string {
  const allowed = ALLOWED_ATTRS_BY_TAG[tag];
  if (!allowed) return "";
  const out: string[] = [];
  const attrRe = /([a-zA-Z_:][a-zA-Z0-9_.:-]*)\s*(?:=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let m: RegExpExecArray | null;
  while ((m = attrRe.exec(raw))) {
    const name = m[1].toLowerCase();
    if (name.startsWith("on")) continue;
    if (!allowed.has(name)) continue;
    const value = (m[2] ?? m[3] ?? m[4] ?? "").trim();
    if (URL_ATTRS.has(name)) {
      if (!value || !SAFE_URL.test(value)) continue;
    }
    const escaped = value.replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    out.push(`${name}="${escaped}"`);
  }
  if (tag === "a") {
    const hasRel = out.some((a) => a.startsWith("rel="));
    const hasTargetBlank = out.some((a) => a.startsWith('target="_blank"'));
    if (hasTargetBlank && !hasRel) out.push('rel="noopener noreferrer"');
  }
  return out.length ? " " + out.join(" ") : "";
}

export function sanitizeRichText(html: string | null | undefined): string {
  if (!html) return "";
  let s = String(html);
  s = s.replace(COMMENTS, "");
  s = s.replace(DANGEROUS_BLOCKS, "");
  s = s.replace(DANGEROUS_TAGS, "");
  s = s.replace(/&nbsp;|&#160;|&#xA0;|\u00a0/gi, " ");
  // Walk tags, keep allowed, strip the rest while keeping inner content.
  return s.replace(
    /<\s*(\/?)\s*([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g,
    (_match, slash: string, tagRaw: string, rest: string) => {
      const tag = tagRaw.toLowerCase();
      if (!ALLOWED_TAGS.has(tag)) return "";
      if (slash) return `</${tag}>`;
      const attrs = sanitizeAttrs(tag, rest);
      return `<${tag}${attrs}>`;
    },
  );
}
