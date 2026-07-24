import { list } from "@vercel/blob";
import sharp from "sharp";
import uploadFiles from "../image-management/upload-files.json" with { type: "json" };
import type { ImageProps } from "./types";

let cached: ImageProps[] | null = null;

async function fetchBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} fetching ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function describe(blobUrl: string): Promise<{
  width: number;
  height: number;
  blurDataUrl: string;
}> {
  const buf = await fetchBuffer(blobUrl);
  const imgMeta = await sharp(buf).metadata();
  const placeholder = await sharp(buf)
    .resize(10)
    .jpeg({ quality: 70 })
    .toBuffer();
  return {
    width: imgMeta.width ?? 0,
    height: imgMeta.height ?? 0,
    blurDataUrl: `data:image/jpeg;base64,${placeholder.toString("base64")}`,
  };
}

function findMetadata(fileName: string) {
  const entry = uploadFiles.find((item) => item.fileName === fileName);
  return {
    title: entry?.metadata?.title ?? "",
    description: entry?.metadata?.description ?? "",
  };
}

export default async function getResults(): Promise<ImageProps[]> {
  if (cached) return cached;

  const { blobs } = await list();
  // Newest-first ordering by pathname (mirrors the original Cloudinary
  // `sort_by("public_id", "desc")` behaviour for filenames like
  // photo-001.jpg, photo-002.jpg, …).
  const sorted = blobs.sort((a, b) => (a.pathname < b.pathname ? 1 : -1));

  cached = await Promise.all(
    sorted.map(async (blob, id) => ({
      id,
      url: blob.url,
      ...findMetadata(blob.pathname),
      ...(await describe(blob.url)),
    })),
  );
  return cached;
}
