// Pure-JS HTML sanitizer for admin-authored rich text.
// Whitelist-based — strips anything not explicitly allowed.
// Runs identically in Node and the browser; no jsdom / dompurify needed.
//
// The output is rebuilt token by token rather than edited in place: every "<"
// in it starts a tag written here, and every other "<" or ">" is escaped as
// text, so removing one tag can never join its neighbours into a new one.

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

const VOID_TAGS = new Set(["br"]);

const ALLOWED_ATTRS_BY_TAG: Record<string, Set<string>> = {
  a: new Set(["href", "target", "rel"]),
};

const URL_ATTRS = new Set(["href"]);
const SAFE_SCHEMES = new Set(["http", "https", "mailto", "tel"]);
// A link typed without its scheme, e.g. "www.facebook.com/page" or "example.com".
const BARE_HOST = /^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,63}(?::\d{1,5})?(?:[/?#]|$)/i;

// Dropped together with everything up to their closing tag: their content is
// script, CSS or raw text, never visible rich text.
const DROP_WITH_CONTENT = new Set([
  "script",
  "style",
  "iframe",
  "noscript",
  "noembed",
  "noframes",
  "template",
  "textarea",
  "title",
  "xmp",
  "plaintext",
]);

// Used by richTextToPlainText, whose output is text and never parsed as HTML.
const DANGEROUS_TAGS = /<\s*\/?\s*(script|style|iframe|object|embed|link|meta|base|form|input|button|svg|math)\b[^>]*>/gi;
const DANGEROUS_BLOCKS = /<\s*(script|style)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi;
const COMMENTS = /<!--[\s\S]*?-->/g;

type Tag = { name: string; closing: boolean; attrs: [string, string][]; end: number };
// "text": the "<" does not start a tag ("a < b"). "unclosed": the tag runs to
// the end of the input, which a browser would swallow along with everything after it.
type TagResult = Tag | "text" | "unclosed";

function isSpace(c: string | undefined): boolean {
  return c === " " || c === "\t" || c === "\n" || c === "\r" || c === "\f";
}

function escapeText(value: string): string {
  return value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Reads the tag starting at s[start] ("<") the way a browser tokenizes it. */
function readTag(s: string, start: number): TagResult {
  let i = start + 1;
  const closing = s[i] === "/";
  if (closing) i++;
  if (!/[a-zA-Z]/.test(s[i] ?? "")) return "text";
  const nameStart = i;
  while (i < s.length && !isSpace(s[i]) && s[i] !== "/" && s[i] !== ">") i++;
  const name = s.slice(nameStart, i).toLowerCase();

  const attrs: [string, string][] = [];
  for (;;) {
    while (i < s.length && (isSpace(s[i]) || s[i] === "/")) i++;
    if (i >= s.length) return "unclosed";
    if (s[i] === ">") return { name, closing, attrs, end: i + 1 };

    // The first character always belongs to the name, even "=" or a quote.
    const attrStart = i++;
    while (i < s.length && !isSpace(s[i]) && s[i] !== "/" && s[i] !== ">" && s[i] !== "=") i++;
    const attrName = s.slice(attrStart, i).toLowerCase();

    let value = "";
    let j = i;
    while (j < s.length && isSpace(s[j])) j++;
    if (s[j] === "=") {
      j++;
      while (j < s.length && isSpace(s[j])) j++;
      const quote = s[j];
      if (quote === '"' || quote === "'") {
        const close = s.indexOf(quote, j + 1);
        if (close === -1) return "unclosed";
        value = s.slice(j + 1, close);
        i = close + 1;
      } else {
        const valueStart = j;
        while (j < s.length && !isSpace(s[j]) && s[j] !== ">") j++;
        value = s.slice(valueStart, j);
        i = j;
      }
    }
    attrs.push([attrName, value]);
  }
}

/** Index just past the closing tag of a raw-text element, or the end of input. */
function skipRawText(s: string, from: number, name: string): number {
  // name comes from DROP_WITH_CONTENT, so it is safe inside a RegExp.
  const closeTag = new RegExp(`</${name}(?=[\\s/>])`, "gi");
  closeTag.lastIndex = from;
  const m = closeTag.exec(s);
  if (!m) return s.length;
  const end = s.indexOf(">", m.index);
  return end === -1 ? s.length : end + 1;
}

function isControlOrSpace(code: number): boolean {
  return code <= 0x20;
}

/**
 * Returns the href to write, or null to drop it. Browsers strip tabs and
 * newlines anywhere in a URL and control characters or spaces at either end
 * ("java\tscript:" runs as "javascript:"), so the value is normalised the same
 * way before its scheme is checked, and the normalised value is what is kept.
 */
function safeUrl(raw: string): string | null {
  let value = raw.replace(/[\t\n\r]/g, "");
  let start = 0;
  let end = value.length;
  while (start < end && isControlOrSpace(value.charCodeAt(start))) start++;
  while (end > start && isControlOrSpace(value.charCodeAt(end - 1))) end--;
  value = value.slice(start, end);
  if (!value) return null;
  for (let k = 0; k < value.length; k++) {
    const code = value.charCodeAt(k);
    if (code < 0x20 || code === 0x7f) return null;
  }

  if (value.startsWith("/") || value.startsWith("#")) return value;
  // Checked before the scheme because "example.com:8080/x" parses as one.
  if (BARE_HOST.test(value)) return `https://${value}`;
  const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(value);
  return scheme && SAFE_SCHEMES.has(scheme[1].toLowerCase()) ? value : null;
}

function sanitizeAttrs(tag: string, attrs: [string, string][]): string {
  const allowed = ALLOWED_ATTRS_BY_TAG[tag];
  if (!allowed) return "";
  const seen = new Set<string>();
  const kept = new Map<string, string>();
  for (const [name, raw] of attrs) {
    // Browsers ignore repeats of an attribute, so only the first one counts.
    if (seen.has(name)) continue;
    seen.add(name);
    if (name.startsWith("on")) continue;
    if (!allowed.has(name)) continue;
    // Browsers decode entities in attribute values ("&#106;avascript:"), so the
    // decoded value is checked and then written back fully escaped: the value
    // checked here is exactly the value the browser sees.
    let value = decodeHtmlEntities(raw).trim();
    if (URL_ATTRS.has(name)) {
      const url = safeUrl(value);
      if (!url) continue;
      value = url;
    }
    kept.set(name, value);
  }
  if (tag === "a" && kept.get("target")?.toLowerCase() === "_blank" && !kept.has("rel")) {
    kept.set("rel", "noopener noreferrer");
  }
  const out = [...kept].map(([name, value]) => `${name}="${escapeAttr(value)}"`);
  return out.length ? " " + out.join(" ") : "";
}

export function sanitizeRichText(html: string | null | undefined): string {
  if (!html) return "";
  const s = String(html).replace(/&nbsp;|&#160;|&#xA0;|\u00a0/gi, " ");
  let out = "";
  // Allowed elements still open, so every one is closed in order and nothing
  // (an unclosed <a> or <strong>, say) leaks past the rich-text container.
  const open: string[] = [];
  const openCount = new Map<string, number>();
  let i = 0;

  while (i < s.length) {
    const lt = s.indexOf("<", i);
    if (lt === -1) {
      out += escapeText(s.slice(i));
      break;
    }
    out += escapeText(s.slice(i, lt));
    i = lt;

    // Comments, doctypes, CDATA and processing instructions are dropped whole.
    if (s[i + 1] === "!" || s[i + 1] === "?") {
      const isComment = s.startsWith("<!--", i);
      const close = isComment ? s.indexOf("-->", i + 2) : s.indexOf(">", i);
      if (close === -1) {
        // Never closed: keep the rest as visible text rather than rescanning it.
        out += escapeText(s.slice(i));
        break;
      }
      i = close + (isComment ? 3 : 1);
      continue;
    }

    const tag = readTag(s, i);
    if (tag === "text") {
      out += "&lt;";
      i++;
      continue;
    }
    if (tag === "unclosed") {
      out += escapeText(s.slice(i));
      break;
    }
    i = tag.end;

    if (DROP_WITH_CONTENT.has(tag.name)) {
      if (!tag.closing) i = skipRawText(s, i, tag.name);
      continue;
    }
    // Anything else not on the list loses its tag but keeps its inner text.
    if (!ALLOWED_TAGS.has(tag.name)) continue;

    if (tag.closing) {
      // A closing tag with nothing to close is dropped; one that skips over
      // open elements closes those first.
      if (!openCount.get(tag.name)) continue;
      let name = open.pop();
      while (name !== undefined) {
        openCount.set(name, (openCount.get(name) ?? 1) - 1);
        out += `</${name}>`;
        if (name === tag.name) break;
        name = open.pop();
      }
      continue;
    }
    out += `<${tag.name}${sanitizeAttrs(tag.name, tag.attrs)}>`;
    if (!VOID_TAGS.has(tag.name)) {
      open.push(tag.name);
      openCount.set(tag.name, (openCount.get(tag.name) ?? 0) + 1);
    }
  }

  while (open.length) out += `</${open.pop()}>`;
  return out;
}

const HTML_ENTITIES: Record<string, string> = {
  amp: "&",
  apos: "'",
  gt: ">",
  hellip: "...",
  laquo: "<<",
  ldquo: '"',
  lsquo: "'",
  lt: "<",
  mdash: "-",
  ndash: "-",
  nbsp: " ",
  quot: '"',
  raquo: ">>",
  rdquo: '"',
  rsquo: "'",
};

function fromCodePoint(code: number): string {
  // Out-of-range references decode to U+FFFD, as in browsers, instead of throwing.
  return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : "\ufffd";
}

function decodeHtmlEntities(value: string): string {
  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z][a-z0-9]+);/gi, (match, entity: string) => {
    const key = entity.toLowerCase();
    if (key.startsWith("#x")) return fromCodePoint(Number.parseInt(key.slice(2), 16));
    if (key.startsWith("#")) return fromCodePoint(Number.parseInt(key.slice(1), 10));
    return HTML_ENTITIES[key] ?? match;
  });
}

export function richTextToPlainText(html: string | null | undefined): string {
  if (!html) return "";
  let text = String(html);
  text = text.replace(COMMENTS, "");
  text = text.replace(DANGEROUS_BLOCKS, "");
  text = text.replace(DANGEROUS_TAGS, "");
  text = text.replace(/<\s*br\s*\/?>/gi, " ");
  text = text.replace(/<\s*\/\s*(p|h2|h3|li|blockquote|pre)\s*>/gi, " ");
  text = text.replace(/<[^>]*>/g, " ");
  text = decodeHtmlEntities(decodeHtmlEntities(text));
  return text.replace(/\s+/g, " ").trim();
}
