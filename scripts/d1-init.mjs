#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env.local
const envPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;
const token = process.env.CLOUDFLARE_API_TOKEN;

if (!accountId || !databaseId || !token) {
  console.error("Missing CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_D1_DATABASE_ID / CLOUDFLARE_API_TOKEN");
  process.exit(1);
}

const schemaPath = path.join(__dirname, "..", "db", "schema.sql");
const sql = fs.readFileSync(schemaPath, "utf8");

const statements = sql
  .split(/;\s*\n/)
  .map((s) => s.replace(/^\s*--.*$/gm, "").trim())
  .filter((s) => s.length > 0);

const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;

let ok = 0;
let fail = 0;

for (const stmt of statements) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sql: stmt }),
  });
  const json = await res.json();
  const summary = stmt.split("\n")[0].slice(0, 70);
  if (json.success) {
    ok++;
    console.log(`✓ ${summary}`);
  } else {
    fail++;
    console.log(`✗ ${summary}`);
    console.log("  ", JSON.stringify(json.errors ?? json));
  }
}

console.log(`\n${ok} OK, ${fail} failed`);
process.exit(fail ? 1 : 0);
