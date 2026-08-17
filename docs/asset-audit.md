# P14 (Lusso) Asset Audit

**Source:** `product-assets/source/lusso-green-sofa/` — 128 original files, preserved untouched.
Delivered as a ZIP via Google Drive; extracted verbatim. Despite the folder name ("Lusso green
sofa"), the product is a **lounge armchair**: sage-green hand-tufted upholstery on a dark ash frame.
We refer to it as the **P14 Lounge Chair**.

**Method:** every file was enumerated (dimensions, aspect, size — recorded per-asset in
`data/product-manifest.json` under `assets[].originalMeta`), rendered on labeled contact sheets
(`internal/contact-sheets/`, EXIF auto-oriented), and visually classified. Classification is encoded
in `scripts/classification.mjs`; `scripts/build-assets.mjs` turns it into web derivatives +
`data/product-manifest.json`. The UI consumes only the manifest — never raw filenames.

## Inventory summary

| Category | Count | Files | Notes |
| --- | --- | --- | --- |
| Raw warehouse source | 93 | `raw/IMG_1285–1377.JPG` (4032×3024, 2–4 MB) | iPhone captures against a white sheet backdrop. **All carry EXIF rotation** — derivatives are auto-oriented. 20 curated for the UI; all 93 counted. |
| Studio / clean packshot | 10 | `Studio  (1–5).jpeg` (768×1376) + `p14new1–5.png` (1254×1254) | Grey-sweep set + white clean set. 7 full packshots, 3 material macros. |
| Lifestyle worlds | 18 | `p14beach* / dark* / desert* / gallery* / veranda* / wheat*` (896×1200) | Six scene families — indoor: gallery, dark room; outdoor: beach, desert, veranda, wheat field. |
| Campaign / editorial | 7 | `Lifestyle  (1–7).jpeg` (768×1376; (4),(5) are 1376×768 landscape) | Editorial hero compositions: dark gallery w/ figure, arched interiors, travertine halls, sheer curtain. |
| Video / motion | 0 real → 1 derived | `public/assets/p14/video/p14-story.mp4` | **No video existed in the library.** A ~19 s Ken Burns motion study was derived from the five strongest campaign/lifestyle stills (`scripts/build-video.sh`), flagged `derived: true` in the manifest. |

Total final deliverables surfaced by the prototype: **7 packshots + 3 material close-ups +
18 lifestyle + 7 campaign + 1 video = 36 assets** (from 93 raw inputs).

## Raw set structure (IMG_1285–1377)

| Range | Content |
| --- | --- |
| 1285–1295 | back views |
| 1296–1300 | side / leaning angles |
| 1301–1306 | backrest & frame-edge close-ups |
| 1307–1319 | side profiles / frame angles |
| 1320–1330 | front views |
| 1331–1345 | three-quarter views w/ hard shadow |
| 1346–1352 | full frontals |
| 1353–1358 | tilted frame angles |
| 1359–1368 | cushion / armrest close-ups |
| 1369–1377 | fabric texture macros |

Many neighbouring frames are near-duplicates (burst-style capture); that is expected for raw source
and is presented honestly as "93 captures" while the UI shows a 20-image curated spread
(back / side / front / three-quarter / detail / macro — see `RAW_CURATED` in
`scripts/classification.mjs`).

## Strongest assets

- **Overall hero:** `Lifestyle  (3).jpeg` (`campaign-3`) — stone arches + floor lamp.
- **Packshot hero:** `p14new1.png` (`studio-white-1`); best frontal after: `p14new5.png`.
- **Dark hero:** `Lifestyle  (1).jpeg` (`campaign-1`) — gallery with human figure.
- **Light hero:** `Lifestyle  (6).jpeg` (`campaign-6`) — sheer curtain, sunlit.
- **Indoor scene hero:** `p14gallery.jpeg`; **outdoor:** `p14veranda1.jpeg`, `P14WHEAT.jpeg`, `p14desert.jpeg`.
- **Best raw "before":** `IMG_1330` (frontal), `IMG_1322` (three-quarter), `IMG_1369` (fabric macro).

## Before → after relationships (encoded in manifest)

| Before (raw) | After (studio) | Story |
| --- | --- | --- |
| IMG_1330 | p14new5 | frontal reconstruction |
| IMG_1322 | p14new1 | three-quarter reconstruction |
| IMG_1369 | p14new4 | material macro |
| IMG_1285 | Studio (1) | studio light treatment |

## Weaknesses / gaps

- No real product video → derived motion piece (documented above, labeled in UI as a motion study).
- Landscape imagery is scarce (only `Lifestyle (4)/(5)`) — mobile-first portrait layouts suit the library.
- Raw set has heavy near-duplication; handled via curation, nothing deleted.
- No human-scale lifestyle shots with people *using* the chair; the two figure shots are distant/artistic.

## Reproducing the pipeline

```bash
node scripts/build-assets.mjs   # derivatives + data/product-manifest.json
./scripts/build-video.sh        # derived motion piece + poster
```
