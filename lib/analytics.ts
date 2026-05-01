declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function pageview(url: string): void {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  if (!id || typeof window === "undefined" || !window.gtag) return;
  window.gtag("config", id, { page_path: url });
}

export function event(name: string, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, params);
}
