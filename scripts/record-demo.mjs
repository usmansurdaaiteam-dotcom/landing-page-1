/**
 * Records a scripted mobile walkthrough of the prototype as a video using
 * Playwright's context recording. QA/demo tool — not part of the app build.
 *
 * Usage: node scripts/record-demo.mjs [outDir]
 */
import path from "node:path";
import fs from "node:fs/promises";
import { chromium } from "playwright";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const outDir = process.argv[2] || "/tmp/daffy-demo";
await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  recordVideo: { dir: outDir, size: { width: 390, height: 844 } },
});
const page = await context.newPage();

const wait = (ms) => page.waitForTimeout(ms);

async function slowScroll(toFraction = 1, step = 420, pause = 420) {
  await page.evaluate(
    async ({ toFraction, step, pause }) => {
      const target = (document.body.scrollHeight - window.innerHeight) * toFraction;
      let y = window.scrollY;
      while (y < target) {
        y = Math.min(y + step, target);
        window.scrollTo({ top: y, behavior: "smooth" });
        await new Promise((r) => setTimeout(r, pause));
      }
    },
    { toFraction, step, pause }
  );
}

// ── 1. Hub ──
await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
await wait(1600);
await slowScroll(1);
await wait(800);

// ── 2. Concept 01: dark pipeline + lightbox ──
await page.goto(`${BASE}/concepts/01`, { waitUntil: "networkidle" });
await wait(1400);
await slowScroll(0.22);
await wait(600);
// open lightbox from raw mosaic
await page.locator('button[aria-label*="View"]').first().click();
await wait(1300);
await page.locator('button[aria-label="Next image"]').click();
await wait(1000);
await page.locator('button[aria-label="Next image"]').click();
await wait(1000);
await page.locator('button[aria-label="Close viewer"]').click();
await wait(800);
await slowScroll(1);
await wait(1200);

// ── 3. Concept 02: expanding rows + video ──
await page.goto(`${BASE}/concepts/02`, { waitUntil: "networkidle" });
await wait(1400);
await slowScroll(0.35);
await wait(500);
await page.getByText("Clean Packshots").click();
await wait(1700);
await slowScroll(0.72);
await page.getByText("Short Video").click();
await wait(1300);
await page.locator('button[aria-label="Play video"]').click();
await wait(4500);
await slowScroll(1);
await wait(800);

// ── 4. Concept 03: timeline + before/after drag ──
await page.goto(`${BASE}/concepts/03`, { waitUntil: "networkidle" });
await wait(1400);
await slowScroll(0.3, 320, 480);
// drag before/after handle
const slider = page.locator('[role="slider"]');
await slider.scrollIntoViewIfNeeded();
await wait(900);
const box = await slider.boundingBox();
if (box) {
  const midY = box.y + box.height / 2;
  await page.mouse.move(box.x + box.width * 0.5, midY);
  await page.mouse.down();
  for (let f = 0.5; f <= 0.86; f += 0.045) {
    await page.mouse.move(box.x + box.width * f, midY);
    await wait(60);
  }
  for (let f = 0.86; f >= 0.16; f -= 0.045) {
    await page.mouse.move(box.x + box.width * f, midY);
    await wait(60);
  }
  await page.mouse.up();
}
await wait(700);
await slowScroll(1, 340, 460);
await wait(900);

// ── 5. Concept 04: stages + stepper jump ──
await page.goto(`${BASE}/concepts/04`, { waitUntil: "networkidle" });
await wait(1400);
await slowScroll(0.55, 380, 440);
await wait(600);
await page.locator('button[aria-label="Go to stage 4: Video"]').click();
await wait(2200);
await wait(800);

// ── 6. Concept 05: accordions + filters ──
await page.goto(`${BASE}/concepts/05`, { waitUntil: "networkidle" });
await wait(1500);
await page.getByRole("button", { name: /Lifestyle/ }).first().click();
await wait(1600);
await slowScroll(0.5);
await page.getByRole("button", { name: "Wheat Field" }).click();
await wait(1600);
await page.getByRole("button", { name: "All", exact: true }).click();
await wait(1200);
await page.getByRole("button", { name: /View all/ }).click();
await wait(1600);
await slowScroll(0.85);
await wait(800);

// ── 7. Compare ──
await page.goto(`${BASE}/compare`, { waitUntil: "networkidle" });
await wait(1400);
await slowScroll(1, 380, 420);
await wait(1000);

await context.close();
await browser.close();
console.log(`Demo video written to ${outDir}`);
