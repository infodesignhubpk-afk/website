import "server-only";

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID ?? "";
const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID ?? "";
const apiToken = process.env.CLOUDFLARE_API_TOKEN ?? "";

export const d1Configured = Boolean(accountId && databaseId && apiToken);

const endpoint = () =>
  `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;

type D1QueryResult<T> = {
  results: T[];
  success: boolean;
  meta: {
    duration?: number;
    rows_read?: number;
    rows_written?: number;
    last_row_id?: number;
    changes?: number;
  };
};

type D1Response<T> = {
  result?: D1QueryResult<T>[];
  success: boolean;
  errors?: Array<{ code: number; message: string }>;
  messages?: Array<{ code: number; message: string }>;
};

function ensureConfigured() {
  if (!d1Configured) {
    throw new Error(
      "D1 is not configured. Set CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_D1_DATABASE_ID and CLOUDFLARE_API_TOKEN.",
    );
  }
}

export async function d1Query<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = [],
): Promise<D1QueryResult<T>> {
  ensureConfigured();
  const res = await fetch(endpoint(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sql, params }),
    cache: "no-store",
  });
  const json = (await res.json()) as D1Response<T>;
  if (!res.ok || !json.success) {
    const message = json.errors?.[0]?.message ?? `D1 request failed (${res.status})`;
    throw new Error(message);
  }
  const first = json.result?.[0];
  if (!first || !first.success) {
    throw new Error("D1 query failed");
  }
  return first;
}

export async function d1All<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = [],
): Promise<T[]> {
  const r = await d1Query<T>(sql, params);
  return r.results;
}

export async function d1First<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = [],
): Promise<T | null> {
  const rows = await d1All<T>(sql, params);
  return rows[0] ?? null;
}

export async function d1Exec(sql: string, params: unknown[] = []): Promise<void> {
  await d1Query(sql, params);
}

export function nowMs(): number {
  return Date.now();
}
