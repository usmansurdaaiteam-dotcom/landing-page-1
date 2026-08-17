# Daffy Studio — P14 Prototype

A mobile-first prototype for **Daffy Studio**, a furniture visual-production studio. Five distinct
concept pages tell one true story: how 93 raw warehouse captures of the **P14 Lounge Chair** become
36 campaign-ready assets — clean packshots, material close-ups, lifestyle worlds, campaign heroes
and a short motion piece.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

## Routes

| Route | What it is |
| --- | --- |
| `/` | Review hub — pipeline summary + links to every concept |
| `/concepts` | Compact concept switcher |
| `/concepts/01` | **Transformation Pipeline** — dark modular block system, mosaics + lightbox, animated flow index |
| `/concepts/02` | **Deliverables Breakdown** — client-facing summary, expanding rows, live counters, video modal |
| `/concepts/03` | **From Source to Story** — editorial timeline, scroll-linked progress line, before/after slider |
| `/concepts/04` | **Stage-Based Story** — guided journey with a living stepper, swipeable stage galleries, sticky CTA |
| `/concepts/05` | **Category Explorer** — layout-animated accordions, scene filter chips, browsable grids |
| `/compare` | Side-by-side comparison sheet of all five directions |

Concepts are designed at 390 px and center into a 480 px column on larger screens. The hub and
compare pages are fully responsive.

## Architecture

The system is **data-driven and built for many products**, even though it ships with one:

```
product-assets/source/       original delivered files — never modified, never served
internal/contact-sheets/     labeled visual contact sheets used for classification
scripts/classification.mjs   human-curated classification of every asset (source of truth)
scripts/build-assets.mjs     → web derivatives (public/assets/p14) + data/product-manifest.json
scripts/build-video.sh       → derived Ken Burns motion piece (the library has no real video)
data/product-manifest.json   the single content source consumed by the UI
docs/asset-audit.md          full audit: counts, heroes, before/after pairs, gaps
src/lib/product.ts           typed selectors over the manifest (stages, deliverables, heroes…)
src/lib/concepts.ts          concept registry driving hub / switcher / compare
src/components/              shared primitives: AssetImage, SwipeGallery, Lightbox,
                             VideoPlayer, BeforeAfter, CountUp, Reveal, ConceptShell
```

**Adding a product later:** drop originals under `product-assets/source/<product>/`, extend the
classification, re-run the two build scripts, and add the product entry — every concept page reads
exclusively through `src/lib/product.ts`, so no page rebuilds are needed.

## Asset pipeline

```bash
node scripts/build-assets.mjs   # EXIF-rotated web derivatives + manifest (needs sharp, ships as devDep)
./scripts/build-video.sh        # derived motion study + poster (needs ffmpeg)
```

## QA

```bash
npm run build                          # clean production build, all routes static
node scripts/screenshot.mjs out/      # screenshots every route at 390×844, fails on console
                                       # errors / failed requests / 4xx-5xx (needs playwright)
```

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Motion (Framer Motion) · Embla Carousel ·
Fraunces + Inter via `next/font` · sharp + ffmpeg for the asset pipeline.
