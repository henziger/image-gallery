import { config } from "dotenv";

import { list, put } from "@vercel/blob";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import readline from "readline/promises";

config({ path: ".env.local" });

const JSON_FILE = "./image-management/upload-files.json";
const IMAGES_FOLDER = "./image-management/images";

if (!fs.existsSync(JSON_FILE)) {
  console.error(
    `Error: ${JSON_FILE} not found. Run generate-upload-metadata.mjs first.`,
  );
  process.exit(1);
}

const uploadFiles = JSON.parse(fs.readFileSync(JSON_FILE, "utf-8"));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function listExistingBlobs() {
  const blobs = new Map();
  let cursor;
  do {
    const result = await list({ cursor });
    for (const blob of result.blobs) blobs.set(blob.pathname, blob);
    cursor = result.hasMore ? result.cursor : undefined;
  } while (cursor);
  return blobs;
}

// The etag of a blob is the MD5 hash of its contents, quoted.
function isUnchanged(blob, fileBuffer) {
  const hash = crypto.createHash("md5").update(fileBuffer).digest("hex");
  return blob.etag.replaceAll('"', "") === hash;
}

async function confirmOverwrite(fileName) {
  const answer = await rl.question(
    `${fileName} already exists with different contents. Overwrite? [y/N] `,
  );
  return answer.trim().toLowerCase() === "y";
}

async function uploadAllImages() {
  const existingBlobs = await listExistingBlobs();

  for (const item of uploadFiles) {
    try {
      const filePath = path.join(IMAGES_FOLDER, item.fileName);
      const fileBuffer = fs.readFileSync(filePath);

      const existing = existingBlobs.get(item.fileName);
      if (existing) {
        if (isUnchanged(existing, fileBuffer)) {
          console.log(`- Skipped ${item.fileName} (unchanged)`);
          continue;
        }
        if (!(await confirmOverwrite(item.fileName))) {
          console.log(`- Skipped ${item.fileName}`);
          continue;
        }
      }

      console.log(`Uploading ${item.fileName}...`);

      const blob = await put(item.fileName, fileBuffer, {
        access: "public",
        allowOverwrite: Boolean(existing),
      });

      console.log(`✓ Uploaded: ${blob.url}`);
    } catch (error) {
      console.error(`✗ Failed ${item.fileName}: ${error.message}\n`);
    }
  }
  console.log("Upload complete!");
}

uploadAllImages()
  .catch(console.error)
  .finally(() => rl.close());
