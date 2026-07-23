import fs from "fs";
import path from "path";

const SOURCE_FOLDER = "./images";
const OUTPUT_FILE = "./upload-files.json";

if (!fs.existsSync(SOURCE_FOLDER)) {
  console.error(`Error: Folder '${SOURCE_FOLDER}' not found!`);
  process.exit(1);
}

const imageFiles = fs
  .readdirSync(SOURCE_FOLDER)
  .map((file) => path.basename(file));

if (imageFiles.length === 0) {
  console.log("No image files found.");
  process.exit(0);
}

const data = imageFiles.map((fileName) => ({
  fileName,
  metadata: {
    title: "TITLE",
    description: "DESCRIPTION",
  },
}));

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));

console.log(`Found ${imageFiles.length} image(s):\n`);
imageFiles.forEach((f) => console.log(`  - ${f}`));
console.log(`\n✓ Wrote ${OUTPUT_FILE}`);
console.log("\nNext steps:");
console.log(`1. Edit ${OUTPUT_FILE} with titles and descriptions`);
console.log("2. Run: node upload-files-to-vercel.mjs");
