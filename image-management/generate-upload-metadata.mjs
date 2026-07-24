import fs from "fs";
import path from "path";
import sharp from "sharp";

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

async function describe(filePath) {
  const buf = fs.readFileSync(filePath);
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

const existing = fs.existsSync(OUTPUT_FILE)
  ? JSON.parse(fs.readFileSync(OUTPUT_FILE, "utf-8"))
  : [];
const existingByFileName = new Map(
  existing.map((item) => [item.fileName, item]),
);

const data = [];
for (const fileName of imageFiles) {
  const prior = existingByFileName.get(fileName);
  console.log(`Processing ${fileName}...`);
  const dims = await describe(path.join(SOURCE_FOLDER, fileName));
  data.push({
    fileName,
    metadata: prior?.metadata ?? {
      title: "TITLE",
      description: "DESCRIPTION",
    },
    ...dims,
  });
}

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));

console.log(`Found ${imageFiles.length} image(s):\n`);
imageFiles.forEach((f) => console.log(`  - ${f}`));
console.log(`\n✓ Wrote ${OUTPUT_FILE}`);
console.log("\nNext steps:");
console.log(`1. Edit ${OUTPUT_FILE} with titles and descriptions`);
console.log("2. Run: node upload-files-to-vercel.mjs");
