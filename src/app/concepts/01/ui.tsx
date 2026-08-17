"use client";

import { motion } from "motion/react";
import { useMemo, useState } from "react";
import AssetImage from "@/components/AssetImage";
import CountUp from "@/components/CountUp";
import Lightbox from "@/components/Lightbox";
import Reveal from "@/components/Reveal";
import VideoPlayer from "@/components/VideoPlayer";
import { getAsset, getTotalDeliverables, getWebAssets } from "@/lib/product";
import type { Asset, Product } from "@/lib/types";

/* ─── Concept 01 — Transformation Pipeline (dark block system) ───────────────
   Stacked "station" blocks: Raw Inputs → Studio Outputs → Lifestyle Worlds →
   Transformation Index. Mosaics open a lightbox; the index animates the flow. */

function Pill({ children, invert = false }: { children: React.ReactNode; invert?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-medium tracking-wide ${
        invert ? "bg-ink/85 text-cream" : "bg-cream/12 text-cream/90 backdrop-blur-sm"
      }`}
    >
      {children}
    </span>
  );
}

function FlowArrow({ className }: { className?: string }) {
  return (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className={className} aria-hidden>
      <path d="M8.5 1L13 5l-4.5 4M13 5H1" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export default function Concept01Client({ product }: { product: Product }) {
  const rawAssets = useMemo(() => getWebAssets(product, "raw"), [product]);
  const studioAssets = useMemo(() => getWebAssets(product, "studio"), [product]);
  const lifestyleAssets = useMemo(
    () => [...getWebAssets(product, "lifestyle"), ...getWebAssets(product, "campaign")],
    [product]
  );
  const total = getTotalDeliverables(product);

  // One shared lightbox across all blocks
  const [lightbox, setLightbox] = useState<{ assets: Asset[]; index: number } | null>(null);

  const rawMosaic = rawAssets.slice(0, 8);
  const studioGrid = useMemo(
    () => studioAssets.filter((a) => a.scene === "studio-white").concat(studioAssets.filter((a) => a.scene === "studio-grey")).slice(0, 6),
    [studioAssets]
  );
  const worldPicks = useMemo(
    () => ["scene-gallery-1", "campaign-3", "scene-veranda-1", "scene-wheat-1", "scene-dark-2", "campaign-1"].map((id) => getAsset(product, id)),
    [product]
  );

  const openLightbox = (assets: Asset[], index: number) => setLightbox({ assets, index });

  return (
    <div className="px-4 pb-10 pt-6 text-text-cream">
      {/* Masthead */}
      <Reveal>
        <div className="mb-6 flex items-end justify-between px-1">
          <h1 className="font-serif text-[28px] leading-none tracking-[0.08em]">
            DAFFY <span className="text-[13px] tracking-[0.3em] text-text-cream-muted align-[0.35em]">STUDIO</span>
          </h1>
          <span className="kicker text-text-cream-muted">{product.title}</span>
        </div>
      </Reveal>

      <div className="space-y-4">
        {/* ── Block: Raw Inputs ── */}
        <Reveal>
          <section className="overflow-hidden rounded-card bg-ink-soft ring-1 ring-hairline-dark">
            <div className="flex items-start justify-between px-5 pb-4 pt-5">
              <div>
                <h2 className="font-serif text-xl">Raw Inputs</h2>
                <p className="mt-0.5 text-xs text-text-cream-muted">Warehouse Captures</p>
              </div>
              <Pill>
                <CountUp to={product.counts.raw} duration={1.1} /> <span className="opacity-70">inputs</span>
              </Pill>
            </div>
            <div className="grid grid-cols-4 gap-[3px] px-[3px] pb-[3px]">
              {rawMosaic.map((asset, i) => (
                <motion.button
                  key={asset.id}
                  aria-label={`View ${asset.note}`}
                  onClick={() => openLightbox(rawAssets, i)}
                  className="relative aspect-square overflow-hidden rounded-[6px]"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.06 * i, duration: 0.5 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <AssetImage asset={asset} fill sizes="25vw" className="brightness-[0.94]" />
                </motion.button>
              ))}
            </div>
            <button
              onClick={() => openLightbox(rawAssets, 0)}
              className="block w-full px-5 py-3.5 text-left text-[11px] tracking-[0.16em] uppercase text-text-cream-muted transition-colors hover:text-cream"
            >
              Browse the source set →
            </button>
          </section>
        </Reveal>

        {/* ── Block: Studio Outputs (inverted) ── */}
        <Reveal>
          <section className="overflow-hidden rounded-card bg-cream-soft text-text-ink shadow-lift">
            <div className="flex items-start justify-between px-5 pb-4 pt-5">
              <div>
                <h2 className="font-serif text-xl">Studio Outputs</h2>
                <p className="mt-0.5 text-xs text-text-muted">Clean Packshots</p>
              </div>
              <Pill invert>
                {product.counts.raw} <span className="opacity-60">in</span>
                <FlowArrow className="mx-0.5" />
                <CountUp to={product.counts.studio} duration={1.1} /> <span className="opacity-60">out</span>
              </Pill>
            </div>
            <div className="grid grid-cols-3 gap-[3px] px-[3px] pb-[3px]">
              {studioGrid.map((asset, i) => (
                <motion.button
                  key={asset.id}
                  aria-label={`View ${asset.note}`}
                  onClick={() => openLightbox(studioAssets, studioAssets.indexOf(asset))}
                  className="relative aspect-[5/6] overflow-hidden rounded-[6px] bg-white"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.07 * i, duration: 0.5 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <AssetImage asset={asset} fill sizes="33vw" />
                </motion.button>
              ))}
            </div>
            <div className="px-5 py-3.5 text-[11px] tracking-[0.16em] uppercase text-text-muted">
              Reconstructed in our studio
            </div>
          </section>
        </Reveal>

        {/* ── Block: Lifestyle Worlds ── */}
        <Reveal>
          <section className="overflow-hidden rounded-card bg-ink-soft ring-1 ring-hairline-dark">
            <div className="flex items-start justify-between px-5 pb-4 pt-5">
              <div>
                <h2 className="font-serif text-xl">Lifestyle Worlds</h2>
                <p className="mt-0.5 text-xs text-text-cream-muted">Curated Environments</p>
              </div>
              <Pill>
                {product.counts.studio} <span className="opacity-70">in</span>
                <FlowArrow className="mx-0.5" />
                <CountUp to={product.counts.lifestyle + product.counts.campaign} duration={1.1} />{" "}
                <span className="opacity-70">worlds</span>
              </Pill>
            </div>
            {/* asymmetric mosaic: 1 tall + 2 stacked, then 3 across */}
            <div className="grid grid-cols-3 gap-[3px] px-[3px]">
              <motion.button
                aria-label={`View ${worldPicks[0].note}`}
                onClick={() => openLightbox(lifestyleAssets, lifestyleAssets.indexOf(worldPicks[0]))}
                className="relative col-span-2 row-span-2 aspect-auto overflow-hidden rounded-[6px]"
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <AssetImage asset={worldPicks[0]} fill sizes="66vw" />
              </motion.button>
              {worldPicks.slice(1, 3).map((asset, i) => (
                <motion.button
                  key={asset.id}
                  aria-label={`View ${asset.note}`}
                  onClick={() => openLightbox(lifestyleAssets, lifestyleAssets.indexOf(asset))}
                  className="relative aspect-[4/5] overflow-hidden rounded-[6px]"
                  whileTap={{ scale: 0.96 }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.08 + i * 0.08, duration: 0.6 }}
                >
                  <AssetImage asset={asset} fill sizes="33vw" />
                </motion.button>
              ))}
            </div>
            <div className="mt-[3px] grid grid-cols-3 gap-[3px] px-[3px] pb-[3px]">
              {worldPicks.slice(3, 6).map((asset, i) => (
                <motion.button
                  key={asset.id}
                  aria-label={`View ${asset.note}`}
                  onClick={() => openLightbox(lifestyleAssets, lifestyleAssets.indexOf(asset))}
                  className="relative aspect-[4/5] overflow-hidden rounded-[6px]"
                  whileTap={{ scale: 0.96 }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.06 * i, duration: 0.6 }}
                >
                  <AssetImage asset={asset} fill sizes="33vw" />
                </motion.button>
              ))}
            </div>
            <button
              onClick={() => openLightbox(lifestyleAssets, 0)}
              className="block w-full px-5 py-3.5 text-left text-[11px] tracking-[0.16em] uppercase text-text-cream-muted transition-colors hover:text-cream"
            >
              Enter the worlds →
            </button>
          </section>
        </Reveal>

        {/* ── Block: Motion ── */}
        <Reveal>
          <section className="overflow-hidden rounded-card bg-ink-soft ring-1 ring-hairline-dark">
            <div className="flex items-start justify-between px-5 pb-4 pt-5">
              <div>
                <h2 className="font-serif text-xl">Motion</h2>
                <p className="mt-0.5 text-xs text-text-cream-muted">The story in 19 seconds</p>
              </div>
              <Pill>1 film</Pill>
            </div>
            <div className="px-[3px] pb-[3px]">
              <VideoPlayer video={product.video} aspect="aspect-[9/13]" rounded="rounded-[6px]" />
            </div>
          </section>
        </Reveal>

        {/* ── Block: Transformation Index ── */}
        <Reveal>
          <section className="overflow-hidden rounded-card bg-olive-dark ring-1 ring-hairline-dark">
            <div className="flex items-start justify-between px-5 pb-4 pt-5">
              <div>
                <h2 className="font-serif text-xl text-cream">Transformation Index</h2>
                <p className="mt-0.5 text-xs text-cream/60">Complete Workflow</p>
              </div>
            </div>

            {/* Flow strip: raw → studio → worlds */}
            <div className="flex items-center gap-2 px-5">
              <div className="grid flex-1 grid-cols-2 gap-[3px]">
                {rawAssets.slice(8, 12).map((a) => (
                  <div key={a.id} className="relative aspect-square overflow-hidden rounded-[5px]">
                    <AssetImage asset={a} fill sizes="15vw" className="brightness-90" />
                  </div>
                ))}
              </div>
              <motion.span
                className="text-cream/70"
                animate={{ x: [0, 4, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              >
                <FlowArrow />
              </motion.span>
              <div className="grid flex-1 grid-cols-2 gap-[3px] rounded-[7px] bg-cream-soft p-[3px]">
                {studioGrid.slice(0, 4).map((a) => (
                  <div key={a.id} className="relative aspect-square overflow-hidden rounded-[5px]">
                    <AssetImage asset={a} fill sizes="15vw" />
                  </div>
                ))}
              </div>
              <motion.span
                className="text-cream/70"
                animate={{ x: [0, 4, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut", delay: 0.7 }}
              >
                <FlowArrow />
              </motion.span>
              <div className="grid flex-1 grid-cols-2 gap-[3px]">
                {worldPicks.slice(0, 4).map((a) => (
                  <div key={a.id} className="relative aspect-square overflow-hidden rounded-[5px]">
                    <AssetImage asset={a} fill sizes="15vw" />
                  </div>
                ))}
              </div>
            </div>

            {/* Metrics */}
            <div className="mt-5 grid grid-cols-3 divide-x divide-cream/10 border-t border-cream/10">
              {[
                { n: product.counts.raw, label: "raw inputs" },
                { n: total, label: "final assets" },
                { n: product.sceneFamilies.length, label: "worlds built" },
              ].map((m) => (
                <div key={m.label} className="px-4 py-4 text-center">
                  <CountUp to={m.n} className="font-serif text-2xl text-cream" />
                  <p className="mt-1 text-[10px] tracking-[0.14em] uppercase text-cream/55">{m.label}</p>
                </div>
              ))}
            </div>

            <div className="px-5 pb-5">
              <Pill>
                {product.counts.raw} inputs <FlowArrow className="mx-1" /> {total} campaign-ready assets
              </Pill>
            </div>
          </section>
        </Reveal>
      </div>

      <Lightbox
        assets={lightbox?.assets ?? []}
        openIndex={lightbox?.index ?? null}
        onClose={() => setLightbox(null)}
      />
    </div>
  );
}
