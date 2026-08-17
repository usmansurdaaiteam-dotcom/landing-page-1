/**
 * Asset pipeline for the Daffy Studio prototype.
 *
 * Reads scripts/classification.mjs, then:
 *   1. Inventories every original file (dimensions, aspect, bytes) — originals untouched.
 *   2. Exports web derivatives to /public/assets/p14/<id>.jpg
 *      (EXIF auto-rotated, max edge 1600, quality 80) + tiny blur placeholders.
 *   3. Writes /data/product-manifest.json — the single data source for the UI.
 *
 * Run: node scripts/build-assets.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { ALL_ASSETS, VIDEO_SEQUENCE } from "./classification.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "product-assets/source/lusso-green-sofa");
const OUT = path.join(ROOT, "public/assets/p14");
const DATA = path.join(ROOT, "data");

const MAX_EDGE = 1600;
const QUALITY = 80;

async function inventoryEntry(asset) {
  const abs = path.join(SRC, asset.original);
  const [meta, stat] = await Promise.all([sharp(abs).rotate().metadata(), fs.stat(abs)]);
  // sharp().rotate().metadata() reports pre-rotation w/h; compute oriented dims.
  const swapped = meta.orientation >= 5;
  const width = swapped ? meta.height : meta.width;
  const height = swapped ? meta.width : meta.height;
  return {
    width,
    height,
    aspect: +(width / height).toFixed(4),
    orientation: width >= height ? (width === height ? "square" : "landscape") : "portrait",
    bytes: stat.size,
  };
}

async function buildDerivative(asset) {
  const abs = path.join(SRC, asset.original);
  const outFile = path.join(OUT, `${asset.id}.jpg`);
  const img = sharp(abs).rotate(); // EXIF auto-orientation (raws are rotated!)
  await img
    .clone()
    .resize(MAX_EDGE, MAX_EDGE, { fit: "inside", withoutEnlargement: true })
    .flatten({ background: "#ffffff" })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(outFile);
  const outMeta = await sharp(outFile).metadata();
  const blurBuf = await sharp(outFile).resize(20).webp({ quality: 30 }).toBuffer();
  return {
    src: `/assets/p14/${asset.id}.jpg`,
    width: outMeta.width,
    height: outMeta.height,
    blurDataURL: `data:image/webp;base64,${blurBuf.toString("base64")}`,
  };
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  await fs.mkdir(DATA, { recursive: true });

  const assets = [];
  for (const asset of ALL_ASSETS) {
    const original = await inventoryEntry(asset);
    const entry = {
      ...asset,
      original: `product-assets/source/lusso-green-sofa/${asset.original}`,
      originalMeta: original,
      web: null,
    };
    const exported = asset.category !== "raw" || asset.curated;
    if (exported) {
      entry.web = await buildDerivative(asset);
      process.stdout.write(`✓ ${asset.id}\n`);
    }
    assets.push(entry);
  }

  const byCategory = (cat) => assets.filter((a) => a.category === cat);
  const counts = {
    raw: byCategory("raw").length,
    studio: byCategory("studio").length,
    lifestyle: byCategory("lifestyle").length,
    campaign: byCategory("campaign").length,
    video: 1,
  };

  const manifest = {
    generatedAt: new Date().toISOString(),
    products: [
      {
        slug: "p14",
        name: "P14 Lounge Chair",
        collection: "Lusso",
        title: "Lounge Chair P14",
        subtitle: "Sage-green tufted upholstery on a dark ash frame.",
        materialLine: "Suede-touch weave · solid ash · hand-tufted cushions",
        story:
          "A complete visual production — from raw warehouse captures to a campaign-ready asset system.",
        heroes: {
          primary: "campaign-3",
          packshot: "studio-white-1",
          dark: "campaign-1",
          light: "campaign-6",
          indoor: "scene-gallery-1",
          outdoor: "scene-veranda-1",
          field: "scene-wheat-1",
          rawBefore: "raw-1330",
        },
        beforeAfter: [
          { before: "raw-1330", after: "studio-white-5", label: "Frontal" },
          { before: "raw-1322", after: "studio-white-1", label: "Three-quarter" },
          { before: "raw-1369", after: "studio-white-4", label: "Material" },
          { before: "raw-1285", after: "studio-grey-1", label: "Studio light" },
        ],
        counts,
        video: {
          id: "video-story",
          src: "/assets/p14/video/p14-story.mp4",
          poster: "/assets/p14/video/p14-story-poster.jpg",
          durationSeconds: 19,
          derived: true,
          derivedFrom: VIDEO_SEQUENCE,
          note: "Motion study derived from campaign stills.",
        },
        stages: [
          {
            key: "source",
            index: 1,
            label: "Source",
            heading: "Raw captures",
            copy: "93 phone photos taken in the warehouse — every angle, joint and fabric detail, shot against a plain sheet.",
            categories: ["raw"],
          },
          {
            key: "studio",
            index: 2,
            label: "Studio",
            heading: "Studio reconstruction",
            copy: "The chair rebuilt in our studio — clean, consistent packshots and material macros on white and grey sweeps.",
            categories: ["studio"],
          },
          {
            key: "lifestyle",
            index: 3,
            label: "Lifestyle",
            heading: "Lifestyle worlds",
            copy: "Placed in the spaces it belongs — six curated worlds from gallery interiors to open wheat fields.",
            categories: ["lifestyle"],
          },
          {
            key: "campaign",
            index: 4,
            label: "Campaign",
            heading: "Campaign & motion",
            copy: "Editorial hero compositions and a short motion piece for storytelling and brand usage.",
            categories: ["campaign", "video"],
          },
        ],
        deliverables: [
          {
            key: "packshots",
            index: 1,
            label: "Clean Packshots",
            copy: "Crisp, consistent packshots from every angle.",
            filter: { category: "studio", crop: ["full"] },
          },
          {
            key: "details",
            index: 2,
            label: "Material Close-Ups",
            copy: "Detailed captures of fabric, wood grain and craftsmanship.",
            filter: { category: "studio", crop: ["close", "macro"] },
          },
          {
            key: "lifestyle",
            index: 3,
            label: "Lifestyle Images",
            copy: "Designed to inspire with authentic, curated scenes.",
            filter: { category: "lifestyle" },
          },
          {
            key: "campaign",
            index: 4,
            label: "Campaign Worlds",
            copy: "Hero compositions for storytelling & brand usage.",
            filter: { category: "campaign" },
          },
          {
            key: "video",
            index: 5,
            label: "Short Video",
            copy: "Cinematic product motion for digital campaigns.",
            filter: { category: "video" },
          },
        ],
        sceneFamilies: [
          { key: "gallery", label: "Gallery", setting: "indoor" },
          { key: "dark", label: "Dark Room", setting: "indoor" },
          { key: "veranda", label: "Veranda", setting: "outdoor" },
          { key: "beach", label: "Beach", setting: "outdoor" },
          { key: "desert", label: "Desert", setting: "outdoor" },
          { key: "wheat", label: "Wheat Field", setting: "outdoor" },
        ],
        assets,
      },
    ],
  };

  await fs.writeFile(
    path.join(DATA, "product-manifest.json"),
    JSON.stringify(manifest, null, 2)
  );

  const exported = assets.filter((a) => a.web).length;
  console.log(
    `\nManifest written. ${assets.length} assets inventoried, ${exported} web derivatives exported.`
  );
  console.log("Counts:", counts);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
