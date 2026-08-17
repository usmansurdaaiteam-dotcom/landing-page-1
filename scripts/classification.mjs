/**
 * Human-curated visual classification of the P14 (Lusso) asset library.
 *
 * Every entry was reviewed on labeled contact sheets (see /internal/contact-sheets)
 * and, where ambiguous, as an individual file. This module is the single source
 * of truth consumed by scripts/build-assets.mjs to produce web derivatives and
 * /data/product-manifest.json. Original files are never modified.
 *
 * Fields:
 *  - id:        stable slug used for derivative filenames + UI keys
 *  - original:  path relative to product-assets/source/lusso-green-sofa
 *  - category:  raw | studio | lifestyle | campaign  (video is derived separately)
 *  - scene:     visual family (warehouse, studio-grey, studio-white, beach, desert,
 *               wheat, veranda, dark, gallery, editorial)
 *  - setting:   studio | indoor | outdoor | warehouse
 *  - crop:      full | close | macro
 *  - tier:      hero  -> strong enough for full-screen hero usage
 *               large -> strong for large cards
 *               thumb -> best used small (dense grids, mosaics)
 *  - curated:   raws only; true = exported as a web derivative for the UI.
 *               Non-curated raws are still inventoried + counted.
 *  - note:      short human description
 */

const raw = (num, { crop = "full", tier = "thumb", curated = false, note = "" } = {}) => ({
  id: `raw-${num}`,
  original: `raw/IMG_${num}.JPG`,
  category: "raw",
  scene: "warehouse",
  setting: "warehouse",
  crop,
  tier,
  curated,
  note,
});

// 93 warehouse captures, IMG_1285–IMG_1377. Grouped by what the camera saw.
// Curated picks give the UI a representative spread: back, side, front,
// three-quarter, frame details and fabric macros.
const RAW_RANGES = [
  // [from, to, crop, note]
  [1285, 1295, "full", "back view against white sheet backdrop"],
  [1296, 1300, "full", "side / leaning angle"],
  [1301, 1306, "close", "backrest and frame edge close-up"],
  [1307, 1319, "full", "side profile and frame angle"],
  [1320, 1330, "full", "front view"],
  [1331, 1345, "full", "three-quarter view with hard shadow"],
  [1346, 1352, "full", "full frontal"],
  [1353, 1358, "full", "tilted frame angle"],
  [1359, 1368, "close", "cushion and armrest close-up"],
  [1369, 1377, "macro", "fabric texture macro"],
];

const RAW_CURATED = {
  1285: "back view — strongest 'before' back shot",
  1290: "back view, straight-on",
  1296: "leaning side angle",
  1300: "side profile",
  1307: "frame angle, legs visible",
  1313: "side profile, full frame",
  1318: "low side angle",
  1322: "front view — key 'before' candidate",
  1326: "front view, slight angle",
  1330: "full frontal — best raw 'before'",
  1335: "three-quarter with shadow",
  1341: "three-quarter, wider",
  1346: "full frontal, centered",
  1350: "full frontal alt",
  1355: "tilted frame study",
  1359: "cushion close-up",
  1363: "armrest and seat close-up",
  1369: "fabric macro, tufting",
  1374: "fabric macro, weave",
  1377: "fabric macro, cushion seam",
};

export const RAW_ASSETS = RAW_RANGES.flatMap(([from, to, crop, note]) => {
  const list = [];
  for (let n = from; n <= to; n++) {
    const curated = n in RAW_CURATED;
    list.push(
      raw(n, {
        crop,
        tier: "thumb",
        curated,
        note: curated ? RAW_CURATED[n] : note,
      })
    );
  }
  return list;
});

export const FINAL_ASSETS = [
  // ---- Studio: grey sweep set (soft light, portrait 768x1376) ----
  { id: "studio-grey-1", original: "Studio  (1).jpeg", category: "studio", scene: "studio-grey", setting: "studio", crop: "full",  tier: "large", note: "three-quarter packshot, grey sweep" },
  { id: "studio-grey-2", original: "Studio  (2).jpeg", category: "studio", scene: "studio-grey", setting: "studio", crop: "macro", tier: "large", note: "armrest joinery macro" },
  { id: "studio-grey-3", original: "Studio  (3).jpeg", category: "studio", scene: "studio-grey", setting: "studio", crop: "macro", tier: "large", note: "backrest tufting macro" },
  { id: "studio-grey-4", original: "Studio  (4).jpeg", category: "studio", scene: "studio-grey", setting: "studio", crop: "full",  tier: "large", note: "high three-quarter packshot" },
  { id: "studio-grey-5", original: "Studio  (5).jpeg", category: "studio", scene: "studio-grey", setting: "studio", crop: "full",  tier: "large", note: "frontal packshot, grey sweep" },

  // ---- Studio: clean white set (square 1254x1254 PNG) ----
  { id: "studio-white-1", original: "p14new1.png", category: "studio", scene: "studio-white", setting: "studio", crop: "full",  tier: "hero",  note: "three-quarter clean packshot — strongest packshot hero" },
  { id: "studio-white-2", original: "p14new2.png", category: "studio", scene: "studio-white", setting: "studio", crop: "full",  tier: "large", note: "side profile clean packshot" },
  { id: "studio-white-3", original: "p14new3.png", category: "studio", scene: "studio-white", setting: "studio", crop: "full",  tier: "large", note: "three-quarter alt clean packshot" },
  { id: "studio-white-4", original: "p14new4.png", category: "studio", scene: "studio-white", setting: "studio", crop: "macro", tier: "large", note: "armrest + fabric macro on white" },
  { id: "studio-white-5", original: "p14new5.png", category: "studio", scene: "studio-white", setting: "studio", crop: "full",  tier: "hero",  note: "frontal clean packshot — best 'after' vs raw front" },

  // ---- Lifestyle worlds (896x1200 portrait) ----
  { id: "scene-beach-1",   original: "p14beach1.jpeg",   category: "lifestyle", scene: "beach",   setting: "outdoor", crop: "full",  tier: "hero",  note: "chair on shoreline sand" },
  { id: "scene-beach-2",   original: "p14beach2.jpeg",   category: "lifestyle", scene: "beach",   setting: "outdoor", crop: "close", tier: "large", note: "backrest close-up against surf" },
  { id: "scene-beach-3",   original: "p14beach3.jpeg",   category: "lifestyle", scene: "beach",   setting: "outdoor", crop: "close", tier: "large", note: "armrest close-up, shells in sand" },
  { id: "scene-dark-1",    original: "p14dark1.jpeg",    category: "lifestyle", scene: "dark",    setting: "indoor",  crop: "close", tier: "large", note: "moody slatted-light close-up" },
  { id: "scene-dark-2",    original: "p14dark2.jpeg",    category: "lifestyle", scene: "dark",    setting: "indoor",  crop: "full",  tier: "hero",  note: "moody interior, hard window light" },
  { id: "scene-desert-1",  original: "p14desert.jpeg",   category: "lifestyle", scene: "desert",  setting: "outdoor", crop: "full",  tier: "hero",  note: "chair in desert rockscape, storm sky" },
  { id: "scene-desert-2",  original: "p14desert2.jpeg",  category: "lifestyle", scene: "desert",  setting: "outdoor", crop: "macro", tier: "large", note: "armrest macro against canyon wall" },
  { id: "scene-desert-3",  original: "p14desert3.jpeg",  category: "lifestyle", scene: "desert",  setting: "outdoor", crop: "close", tier: "large", note: "seat close-up in desert light" },
  { id: "scene-gallery-1", original: "p14gallery.jpeg",  category: "lifestyle", scene: "gallery", setting: "indoor",  crop: "full",  tier: "hero",  note: "light interior with dried-branch vase — strongest indoor scene" },
  { id: "scene-gallery-2", original: "p14gallery2.jpeg", category: "lifestyle", scene: "gallery", setting: "indoor",  crop: "close", tier: "large", note: "three-quarter close with pillow" },
  { id: "scene-gallery-3", original: "p14gallery3.jpeg", category: "lifestyle", scene: "gallery", setting: "indoor",  crop: "full",  tier: "large", note: "three-quarter with pillow, wide" },
  { id: "scene-veranda-1", original: "p14veranda1.jpeg", category: "lifestyle", scene: "veranda", setting: "outdoor", crop: "full",  tier: "hero",  note: "warm stucco veranda, raking sun" },
  { id: "scene-veranda-2", original: "p14veranda2.jpeg", category: "lifestyle", scene: "veranda", setting: "outdoor", crop: "close", tier: "large", note: "dappled shadow close-up" },
  { id: "scene-veranda-3", original: "p14veranda3.jpeg", category: "lifestyle", scene: "veranda", setting: "outdoor", crop: "macro", tier: "large", note: "armrest macro in sunlight" },
  { id: "scene-wheat-1",   original: "P14WHEAT.jpeg",    category: "lifestyle", scene: "wheat",   setting: "outdoor", crop: "full",  tier: "hero",  note: "chair in wheat field, evening sky" },
  { id: "scene-wheat-2",   original: "p14wheat2.jpeg",   category: "lifestyle", scene: "wheat",   setting: "outdoor", crop: "close", tier: "large", note: "armrest through wheat stalks" },
  { id: "scene-wheat-3",   original: "p14wheat3.jpeg",   category: "lifestyle", scene: "wheat",   setting: "outdoor", crop: "close", tier: "large", note: "seat front close in field" },
  { id: "scene-wheat-4",   original: "p14wheat4.jpeg",   category: "lifestyle", scene: "wheat",   setting: "outdoor", crop: "full",  tier: "large", note: "three-quarter against open sky" },

  // ---- Campaign / editorial (768x1376 portrait, (4)(5) landscape 1376x768) ----
  { id: "campaign-1", original: "Lifestyle  (1).jpeg", category: "campaign", scene: "editorial", setting: "indoor", crop: "full", tier: "hero",  note: "dark gallery with human figure — hero for dark concepts" },
  { id: "campaign-2", original: "Lifestyle  (2).jpeg", category: "campaign", scene: "editorial", setting: "indoor", crop: "full", tier: "hero",  note: "warm beige interior, curtain light" },
  { id: "campaign-3", original: "Lifestyle  (3).jpeg", category: "campaign", scene: "editorial", setting: "indoor", crop: "full", tier: "hero",  note: "stone arches with floor lamp — strongest single hero" },
  { id: "campaign-4", original: "Lifestyle  (4).jpeg", category: "campaign", scene: "editorial", setting: "indoor", crop: "full", tier: "large", note: "travertine hall, landscape orientation" },
  { id: "campaign-5", original: "Lifestyle  (5).jpeg", category: "campaign", scene: "editorial", setting: "indoor", crop: "full", tier: "large", note: "travertine hall alt, landscape orientation" },
  { id: "campaign-6", original: "Lifestyle  (6).jpeg", category: "campaign", scene: "editorial", setting: "indoor", crop: "full", tier: "hero",  note: "white sheer curtain, sunlit — light and airy hero" },
  { id: "campaign-7", original: "Lifestyle  (7).jpeg", category: "campaign", scene: "editorial", setting: "indoor", crop: "full", tier: "large", note: "dark room, distant figure" },
];

/** Stills used to derive the motion piece (in sequence). */
export const VIDEO_SEQUENCE = [
  "campaign-3",
  "scene-gallery-1",
  "scene-veranda-1",
  "scene-wheat-1",
  "campaign-1",
];

export const ALL_ASSETS = [...RAW_ASSETS, ...FINAL_ASSETS];
