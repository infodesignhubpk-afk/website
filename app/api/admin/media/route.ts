import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { deleteR2Object, listR2Objects, r2Configured } from "@/lib/r2";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!r2Configured) {
    return NextResponse.json({ error: "R2 not configured" }, { status: 503 });
  }
  const { searchParams } = new URL(req.url);
  const prefix = searchParams.get("prefix") ?? undefined;
  const items = await listR2Objects(prefix);
  return NextResponse.json({ items });
}

export async function DELETE(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!r2Configured) {
    return NextResponse.json({ error: "R2 not configured" }, { status: 503 });
  }
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const key = typeof payload === "object" && payload !== null && "key" in payload ? String((payload as { key: unknown }).key) : "";
  if (!key) {
    return NextResponse.json({ error: "Missing key" }, { status: 400 });
  }
  await deleteR2Object(key);
  return NextResponse.json({ ok: true });
}
