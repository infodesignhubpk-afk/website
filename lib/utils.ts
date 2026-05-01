type ClassValue = string | number | null | undefined | false | Record<string, boolean> | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];
  const walk = (v: ClassValue) => {
    if (!v) return;
    if (typeof v === "string" || typeof v === "number") {
      out.push(String(v));
      return;
    }
    if (Array.isArray(v)) {
      v.forEach(walk);
      return;
    }
    if (typeof v === "object") {
      for (const [k, val] of Object.entries(v)) {
        if (val) out.push(k);
      }
    }
  };
  inputs.forEach(walk);
  return out.join(" ");
}

export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("92")) {
    return `+${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`.trim();
  }
  if (digits.startsWith("0")) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`.trim();
  }
  return raw;
}

export function whatsappLink(number: string | undefined | null, message?: string): string {
  const digits = (number ?? "").replace(/\D/g, "");
  const base = digits ? `https://wa.me/${digits}` : `https://wa.me/`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function absoluteUrl(siteUrl: string, path: string): string {
  if (path.startsWith("http")) return path;
  const trimmedBase = siteUrl.replace(/\/$/, "");
  const trimmedPath = path.startsWith("/") ? path : `/${path}`;
  return `${trimmedBase}${trimmedPath}`;
}
