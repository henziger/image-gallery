import { config } from "dotenv";

import { put } from "@vercel/blob";
import fs from "fs";
import path from "path";

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

async function uploadAllImages() {
  for (const item of uploadFiles) {
    try {
      const filePath = path.join(IMAGES_FOLDER, item.fileName);
      const fileBuffer = fs.readFileSync(filePath);

      console.log(`Uploading ${item.fileName}...`);

      const blob = await put(item.fileName, fileBuffer, {
        access: "public",
      });

      console.log(`✓ Uploaded: ${blob.url}`);
    } catch (error) {
      console.error(`✗ Failed ${item.fileName}: ${error.message}\n`);
    }
  }
  console.log("Upload complete!");
}

uploadAllImages().catch(console.error);
