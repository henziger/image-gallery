import { list } from "@vercel/blob";
import uploadFiles from "../image-management/upload-files.json" with { type: "json" };
import type { ImageProps } from "./types";

let cached: ImageProps[] | null = null;

function findMetadata(fileName: string) {
  const entry = uploadFiles.find((item) => item.fileName === fileName);
  return {
    title: entry?.metadata?.title ?? "",
    description: entry?.metadata?.description ?? "",
    width: entry?.width ?? 0,
    height: entry?.height ?? 0,
    blurDataUrl: entry?.blurDataUrl ?? "",
  };
}

export default async function getResults(): Promise<ImageProps[]> {
  if (cached) return cached;

  const { blobs } = await list();

  cached = blobs.map((blob, id) => ({
    id,
    url: blob.url,
    ...findMetadata(blob.pathname),
  }));
  return cached;
}
