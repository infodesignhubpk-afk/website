import "server-only";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
  GetObjectCommand,
  type _Object,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const accountId = process.env.R2_ACCOUNT_ID ?? "";
const accessKeyId = process.env.R2_ACCESS_KEY_ID ?? "";
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY ?? "";
const bucket = process.env.R2_BUCKET ?? "";
const endpoint = process.env.R2_ENDPOINT ?? (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : "");
const publicBase = process.env.R2_PUBLIC_BASE_URL ?? "";

export const r2Configured = Boolean(
  accountId && accessKeyId && secretAccessKey && bucket && endpoint,
);

export const r2Bucket = bucket;
export const r2PublicBase = publicBase;

let _client: S3Client | null = null;
function client(): S3Client {
  if (_client) return _client;
  if (!r2Configured) {
    throw new Error(
      "R2 is not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET in your environment.",
    );
  }
  _client = new S3Client({
    region: "auto",
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
  });
  return _client;
}

export type R2Object = {
  key: string;
  size: number;
  lastModified: string;
  url: string;
};

function publicUrl(key: string): string {
  const base = (publicBase || "").replace(/\/$/, "");
  if (base) return `${base}/${encodeURI(key)}`;
  return `${endpoint.replace(/\/$/, "")}/${bucket}/${encodeURI(key)}`;
}

export async function listR2Objects(prefix?: string): Promise<R2Object[]> {
  const out = await client().send(
    new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix, MaxKeys: 1000 }),
  );
  const items = out.Contents ?? [];
  return items
    .filter((o): o is _Object & { Key: string } => Boolean(o.Key))
    .map((o) => ({
      key: o.Key,
      size: Number(o.Size ?? 0),
      lastModified: o.LastModified ? o.LastModified.toISOString() : new Date(0).toISOString(),
      url: publicUrl(o.Key),
    }))
    .sort((a, b) => b.lastModified.localeCompare(a.lastModified));
}

export async function uploadR2Object(args: {
  key: string;
  body: Buffer | Uint8Array;
  contentType: string;
  cacheControl?: string;
}): Promise<R2Object> {
  await client().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: args.key,
      Body: args.body,
      ContentType: args.contentType,
      CacheControl: args.cacheControl ?? "public, max-age=31536000, immutable",
    }),
  );
  return {
    key: args.key,
    size: args.body.byteLength,
    lastModified: new Date().toISOString(),
    url: publicUrl(args.key),
  };
}

export async function deleteR2Object(key: string): Promise<void> {
  await client().send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

export async function getR2ObjectText(key: string): Promise<string | null> {
  try {
    const out = await client().send(
      new GetObjectCommand({ Bucket: bucket, Key: key }),
    );
    const body = out.Body;
    if (!body) return null;
    return await (body as { transformToString: () => Promise<string> }).transformToString();
  } catch (err) {
    const name = (err as { name?: string; Code?: string })?.name ?? "";
    const code = (err as { Code?: string })?.Code ?? "";
    if (name === "NoSuchKey" || code === "NoSuchKey" || name === "NotFound") return null;
    throw err;
  }
}

export async function r2ObjectExists(key: string): Promise<boolean> {
  try {
    await client().send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return true;
  } catch {
    return false;
  }
}

export async function presignedGetUrl(key: string, expiresInSeconds = 3600): Promise<string> {
  return getSignedUrl(client(), new PutObjectCommand({ Bucket: bucket, Key: key }), {
    expiresIn: expiresInSeconds,
  });
}

export function buildKey(folder: string, originalName: string): string {
  const safeName = originalName
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  const ext = originalName.match(/\.([a-z0-9]+)$/i)?.[1]?.toLowerCase() ?? "bin";
  const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const cleanFolder = folder.replace(/^\/+|\/+$/g, "");
  return `${cleanFolder}/${stamp}-${safeName || "file"}.${ext}`;
}

export function getPublicUrl(key: string): string {
  return publicUrl(key);
}
