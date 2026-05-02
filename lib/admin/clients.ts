import "server-only";
import { d1All, d1Exec, d1Configured, nowMs } from "@/lib/db";
import { newId } from "@/lib/store";
import type { AdminClient } from "@/types/admin";

type ClientRow = {
  id: string;
  data: string;
  sort_order: number;
};

function rowToClient(row: ClientRow): AdminClient {
  const parsed = JSON.parse(row.data) as AdminClient;
  return { ...parsed, id: row.id, order: row.sort_order };
}

export async function listClients(): Promise<AdminClient[]> {
  if (!d1Configured) return [];
  try {
    const rows = await d1All<ClientRow>(
      "SELECT id, data, sort_order FROM clients ORDER BY sort_order ASC, id ASC",
    );
    return rows.map(rowToClient);
  } catch (err) {
    console.warn("[clients] list failed:", err);
    return [];
  }
}

export async function getClientById(id: string): Promise<AdminClient | null> {
  if (!d1Configured) return null;
  const rows = await d1All<ClientRow>(
    "SELECT id, data, sort_order FROM clients WHERE id = ?",
    [id],
  );
  return rows[0] ? rowToClient(rows[0]) : null;
}

export async function createClient(
  input: Omit<AdminClient, "id">,
): Promise<AdminClient> {
  const id = newId("cli");
  const client: AdminClient = { ...input, id };
  const now = nowMs();
  await d1Exec(
    `INSERT INTO clients (id, data, sort_order, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?)`,
    [id, JSON.stringify(client), client.order, now, now],
  );
  return client;
}

export async function updateClient(
  id: string,
  input: Partial<Omit<AdminClient, "id">>,
): Promise<AdminClient | null> {
  const current = await getClientById(id);
  if (!current) return null;
  const next: AdminClient = { ...current, ...input, id };
  await d1Exec(
    `UPDATE clients SET data = ?, sort_order = ?, updated_at = ? WHERE id = ?`,
    [JSON.stringify(next), next.order, nowMs(), id],
  );
  return next;
}

export async function deleteClient(id: string): Promise<boolean> {
  const current = await getClientById(id);
  if (!current) return false;
  await d1Exec("DELETE FROM clients WHERE id = ?", [id]);
  return true;
}
