import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { buildKey, r2Configured, uploadR2Object } from "@/lib/r2";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_BYTES = 12 * 1024 * 1024; // 12 MB
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
]);
const ALLOWED_FOLDERS = new Set([
  "uploads",
  "portfolio",
  "products",
  "categories",
  "blog",
  "clients",
  "site",
  "general",
]);

export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!r2Configured) {
    return NextResponse.json({ error: "Upload service unavailable" }, { status: 503 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  const rawFolder = String(formData.get("folder") ?? "uploads");
  const folder = ALLOWED_FOLDERS.has(rawFolder) ? rawFolder : "uploads";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "File is empty" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 12 MB)" }, { status: 413 });
  }
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Unsupported file type. Allowed: JPG, PNG, WEBP, GIF, SVG, AVIF" },
      { status: 415 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const key = buildKey(folder, file.name || "file");
  try {
    const obj = await uploadR2Object({
      key,
      body: buffer,
      contentType: file.type,
    });
    return NextResponse.json(obj);
  } catch (err) {
    console.error("[upload] R2 upload failed", err);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 502 });
  }
}
