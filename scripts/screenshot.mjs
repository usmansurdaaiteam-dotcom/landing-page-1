/**
 * QA screenshot harness. Captures every route at mobile-first viewports,
 * records console errors and failed requests.
 *
 * Usage: node scripts/screenshot.mjs [outDir] [--full] [--viewport=390x844]
 */
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const outDir = process.argv[2] || "/tmp/daffy-shots";
const ROUTES = ["/", "/concepts", "/concepts/01", "/concepts/02", "/concepts/03", "/concepts/04", "/concepts/05", "/compare"];

const vpArg = process.argv.find((a) => a.startsWith("--viewport="));
const [vw, vh] = vpArg ? vpArg.split("=")[1].split("x").map(Number) : [390, 844];

await fs.mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: vw, height: vh },
  deviceScaleFactor: 2,
  isMobile: vw < 500,
  hasTouch: vw < 500,
});

const problems = [];

for (const route of ROUTES) {
  const page = await context.newPage();
  page.on("console", (msg) => {
    if (msg.type() === "error") problems.push(`[console] ${route}: ${msg.text()}`);
  });
  page.on("pageerror", (err) => problems.push(`[pageerror] ${route}: ${err.message}`));
  page.on("requestfailed", (req) =>
    problems.push(`[requestfailed] ${route}: ${req.url()} — ${req.failure()?.errorText}`)
  );
  page.on("response", (res) => {
    if (res.status() >= 400) problems.push(`[http ${res.status()}] ${route}: ${res.url()}`);
  });

  await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);

  const slug = route === "/" ? "hub" : route.replace(/\//g, "-").replace(/^-/, "");
  // Above-the-fold shot
  await page.screenshot({ path: path.join(outDir, `${slug}@${vw}-fold.png`) });
  // Full page (scroll first so in-view animations fire)
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.7;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 130));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(outDir, `${slug}@${vw}-full.png`), fullPage: true });

  await page.close();
}

await browser.close();

if (problems.length) {
  console.log("PROBLEMS FOUND:");
  for (const p of problems) console.log("  " + p);
  process.exitCode = 1;
} else {
  console.log("No console errors, page errors, failed requests or 4xx/5xx responses.");
}
console.log(`Screenshots written to ${outDir}`);
