import fs from "fs";
import path from "path";
import sharp from "sharp";

const SOURCE_FOLDER = "./images";
const OPTIMIZED_FOLDER = "./images-optimized";
const OUTPUT_FILE = "./upload-files.json";

// Vercel's image optimizer downloads the *whole* original from Blob every time
// it generates a variant it hasn't cached yet, so the size of what we upload is
// what drives Blob data transfer. Nothing in the gallery is ever rendered above
// 2048px, so anything larger is bytes we pay for and never show.
const MAX_EDGE = 2048;
const JPEG_QUALITY = 80;

if (!fs.existsSync(SOURCE_FOLDER)) {
  console.error(`Error: Folder '${SOURCE_FOLDER}' not found!`);
  process.exit(1);
}

fs.mkdirSync(OPTIMIZED_FOLDER, { recursive: true });

const imageFiles = fs
  .readdirSync(SOURCE_FOLDER)
  .map((file) => path.basename(file));

if (imageFiles.length === 0) {
  console.log("No image files found.");
  process.exit(0);
}

// Writes the downscaled, re-encoded copy that actually gets uploaded, and
// describes *that* file — the dimensions and placeholder have to match what the
// browser will load, not the untouched source.
async function optimize(fileName) {
  const source = fs.readFileSync(path.join(SOURCE_FOLDER, fileName));
  const optimized = await sharp(source)
    // Bakes in EXIF orientation so width/height below match what browsers show.
    .rotate()
    .resize({
      width: MAX_EDGE,
      height: MAX_EDGE,
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toBuffer();
  fs.writeFileSync(path.join(OPTIMIZED_FOLDER, fileName), optimized);

  const imgMeta = await sharp(optimized).metadata();
  const placeholder = await sharp(optimized)
    .resize(10)
    .jpeg({ quality: 70 })
    .toBuffer();
  return {
    bytes: { source: source.length, optimized: optimized.length },
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
let sourceBytes = 0;
let optimizedBytes = 0;
for (const fileName of imageFiles) {
  const prior = existingByFileName.get(fileName);
  console.log(`Processing ${fileName}...`);
  const { bytes, ...dims } = await optimize(fileName);
  sourceBytes += bytes.source;
  optimizedBytes += bytes.optimized;
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

const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)}MB`;
const saved = Math.round((1 - optimizedBytes / sourceBytes) * 100);

console.log(
  `\nOptimized ${imageFiles.length} image(s) into ${OPTIMIZED_FOLDER}`,
);
console.log(
  `  ${mb(sourceBytes)} -> ${mb(optimizedBytes)} (${saved}% smaller)`,
);
console.log(`✓ Wrote ${OUTPUT_FILE}`);
console.log("\nNext steps:");
console.log(`1. Edit ${OUTPUT_FILE} with titles and descriptions`);
console.log("2. Run: node upload-files-to-vercel.mjs");
