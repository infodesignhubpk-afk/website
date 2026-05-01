import "server-only";
import { promises as fs } from "fs";
import path from "path";
import {
  getR2ObjectText,
  r2Configured,
  uploadR2Object,
} from "@/lib/r2";

export const STORE_DIR = path.join(process.cwd(), "data-store");
const R2_PREFIX = "data-store";

function r2Key(file: string): string {
  return `${R2_PREFIX}/${file.replace(/^\/+/, "")}`;
}

export async function readJson<T>(file: string, fallback: T): Promise<T> {
  if (r2Configured) {
    try {
      const text = await getR2ObjectText(r2Key(file));
      if (text === null) return fallback;
      return JSON.parse(text) as T;
    } catch (err) {
      console.warn(`[store] R2 read failed for ${file}:`, err);
      return fallback;
    }
  }
  const filePath = path.join(STORE_DIR, file);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch (err) {
    const e = err as NodeJS.ErrnoException;
    if (e.code === "ENOENT" || e.code === "EROFS" || e.code === "EACCES") {
      return fallback;
    }
    console.warn(`[store] fs read failed for ${file}:`, err);
    return fallback;
  }
}

export async function writeJson<T>(file: string, value: T): Promise<void> {
  const json = JSON.stringify(value, null, 2);
  if (r2Configured) {
    await uploadR2Object({
      key: r2Key(file),
      body: Buffer.from(json, "utf8"),
      contentType: "application/json; charset=utf-8",
      cacheControl: "no-store, max-age=0",
    });
    return;
  }
  await fs.mkdir(STORE_DIR, { recursive: true });
  const filePath = path.join(STORE_DIR, file);
  const tmpPath = `${filePath}.tmp`;
  await fs.writeFile(tmpPath, json, "utf8");
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
