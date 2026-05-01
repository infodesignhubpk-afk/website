import "server-only";
import { promises as fs } from "fs";
import path from "path";

export const STORE_DIR = path.join(process.cwd(), "data-store");

async function ensureDir() {
  await fs.mkdir(STORE_DIR, { recursive: true });
}

export async function readJson<T>(file: string, fallback: T): Promise<T> {
  await ensureDir();
  const filePath = path.join(STORE_DIR, file);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch (err) {
    const e = err as NodeJS.ErrnoException;
    if (e.code === "ENOENT") return fallback;
    throw err;
  }
}

export async function writeJson<T>(file: string, value: T): Promise<void> {
  await ensureDir();
  const filePath = path.join(STORE_DIR, file);
  const tmpPath = `${filePath}.tmp`;
  await fs.writeFile(tmpPath, JSON.stringify(value, null, 2), "utf8");
  await fs.rename(tmpPath, filePath);
}

export function newId(prefix = "id"): string {
  const stamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${stamp}${rand}`;
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}
