import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { buildKey, r2Configured, uploadR2Object } from "@/lib/r2";

export const runtime = "nodejs";

const MAX_BYTES = 12 * 1024 * 1024; // 12 MB

export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!r2Configured) {
    return NextResponse.json({ error: "R2 is not configured." }, { status: 503 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  const folder = String(formData.get("folder") ?? "uploads");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "File is empty" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 12 MB)" }, { status: 413 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const key = buildKey(folder, file.name || "file");
  try {
    const obj = await uploadR2Object({
      key,
      body: buffer,
      contentType: file.type || "application/octet-stream",
    });
    return NextResponse.json(obj);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    const name = (err as { name?: string })?.name ?? "";
    if (name === "NoSuchBucket" || /NoSuchBucket/i.test(message)) {
      return NextResponse.json(
        {
          error:
            `R2 bucket "${process.env.R2_BUCKET}" does not exist. Create it in Cloudflare R2 (or change R2_BUCKET in .env.local to match an existing bucket), then enable Public access and restart the dev server.`,
        },
        { status: 502 },
      );
    }
    if (/AccessDenied|InvalidAccessKeyId|SignatureDoesNotMatch/i.test(message) || ["AccessDenied", "InvalidAccessKeyId", "SignatureDoesNotMatch"].includes(name)) {
      return NextResponse.json(
        {
          error:
            "R2 credentials are invalid or lack write access to this bucket. Re-issue an Object Read & Write API token in Cloudflare R2.",
        },
        { status: 502 },
      );
    }
    return NextResponse.json({ error: `R2 upload failed: ${message}` }, { status: 502 });
  }
}
