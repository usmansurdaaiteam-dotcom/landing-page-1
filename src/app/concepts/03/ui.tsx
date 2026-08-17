"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import AssetImage from "@/components/AssetImage";
import BeforeAfter from "@/components/BeforeAfter";
import Reveal from "@/components/Reveal";
import VideoPlayer from "@/components/VideoPlayer";
import { getAsset, getBeforeAfterPairs, getWebAssets } from "@/lib/product";
import type { Asset, Product } from "@/lib/types";

/* ─── Concept 03 — From Source to Story (editorial timeline) ─────────────────
   Four numbered chapters on a vertical timeline. A scroll-linked progress line
   fills as you read; each chapter's large image crossfades through its set. */

function ChapterImage({ assets, sizes = "88vw" }: { assets: Asset[]; sizes?: string }) {
  const [index, setIndex] = useState(0);
  const ref = useRef<HTMLButtonElement>(null);
  const [inView, setInView] = useState(false);

  // Auto-advance gently while the chapter is on screen; tap also advances.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || assets.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % assets.length), 3800);
    return () => clearInterval(t);
  }, [inView, assets.length]);

  const asset = assets[index];

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => setIndex((i) => (i + 1) % assets.length)}
      aria-label="Advance to next image"
      className="relative block w-full overflow-hidden rounded-[14px] shadow-soft"
      style={{ aspectRatio: "4 / 5" }}
    >
      <AnimatePresence mode="popLayout">
        <motion.div
          key={asset.id}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <AssetImage asset={asset} fill sizes={sizes} />
        </motion.div>
      </AnimatePresence>
      {assets.length > 1 && (
        <span className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {assets.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === index ? "w-4 bg-white/95" : "w-1 bg-white/45"
              }`}
            />
          ))}
        </span>
      )}
    </button>
  );
}

export default function Concept03Client({ product }: { product: Product }) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 0.55", "end 0.7"],
  });
  const lineScale = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.6 });

  const rawPicks = useMemo(
    () => ["raw-1330", "raw-1285", "raw-1322", "raw-1369"].map((id) => getAsset(product, id)),
    [product]
  );
  const studioPicks = useMemo(
    () => getWebAssets(product, "studio").filter((a) => a.tier !== "thumb").slice(0, 5),
    [product]
  );
  const worldPicks = useMemo(
    () =>
      ["campaign-3", "scene-gallery-1", "scene-veranda-1", "scene-wheat-1", "scene-desert-1", "campaign-6"].map(
        (id) => getAsset(product, id)
      ),
    [product]
  );
  const pair = getBeforeAfterPairs(product)[0];

  const chapters = [
    {
      num: "01",
      title: "Source",
      copy: "Raw references & real-world captures",
      meta: `${product.counts.raw} images`,
      body: <ChapterImage assets={rawPicks} />,
    },
    {
      num: "02",
      title: "Studio Reconstruction",
      copy: "Rebuilt with precision in our studio",
      meta: `${product.counts.studio} images`,
      body: (
        <div className="space-y-3">
          <BeforeAfter
            before={pair.before}
            after={pair.after}
            aspect="aspect-[4/5]"
            rounded="rounded-[14px]"
            className="shadow-soft"
          />
          <ChapterImage assets={studioPicks} />
        </div>
      ),
    },
    {
      num: "03",
      title: "Lifestyle Worlds",
      copy: "Placed in the spaces it belongs",
      meta: `${product.counts.lifestyle + product.counts.campaign} images`,
      body: <ChapterImage assets={worldPicks} />,
    },
    {
      num: "04",
      title: "Video",
      copy: "See the chair in motion",
      meta: "1 video",
      body: (
        <VideoPlayer
          video={product.video}
          aspect="aspect-[4/5]"
          rounded="rounded-[14px]"
          className="shadow-soft"
        />
      ),
    },
  ];

  return (
    <div className="px-5 pb-12 pt-7">
      {/* Masthead */}
      <Reveal>
        <div className="mb-8 flex items-center justify-between">
          <span className="font-serif text-[15px] tracking-[0.22em]">DAFFY STUDIO</span>
          <span className="flex items-center gap-1.5 text-[11px] text-text-muted">
            Case Study <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold" />
          </span>
        </div>
      </Reveal>

      {/* Headline */}
      <Reveal>
        <div className="mb-10 grid grid-cols-[1.5fr_1fr] items-end gap-4">
          <h1 className="font-serif text-[40px] leading-[1.02]">
            From Source
            <br />
            <em className="font-light italic text-green-deep">to Story</em>
          </h1>
          <p className="pb-1 text-[12px] leading-relaxed text-text-muted">
            The journey of a lounge chair — from raw references to refined worlds.
          </p>
        </div>
      </Reveal>

      {/* Timeline */}
      <div ref={timelineRef} className="relative">
        {/* rail */}
        <div className="absolute bottom-10 left-[12.5px] top-2 w-[2px] rounded-full bg-text-ink/10" aria-hidden />
        <motion.div
          className="absolute left-[12.5px] top-2 w-[2px] origin-top rounded-full bg-green-mid"
          style={{ scaleY: lineScale, height: "calc(100% - 3rem)" }}
          aria-hidden
        />

        <div className="space-y-14">
          {chapters.map((ch, i) => (
            <div key={ch.num} className="relative pl-12">
              {/* node */}
              <motion.span
                className="absolute left-0 top-1 flex h-[27px] w-[27px] items-center justify-center rounded-full border border-text-ink/20 bg-paper"
                initial={{ scale: 0.6, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-20% 0px" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.span
                  className="h-[13px] w-[13px] rounded-full bg-green-deep"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: "-20% 0px" }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 18 }}
                />
              </motion.span>

              <Reveal delay={0.05}>
                <p className="font-serif text-[15px] text-green-deep">{ch.num}</p>
                <h2 className="kicker mt-1 !text-[12px] text-text-ink">{ch.title}</h2>
                <span className="mt-2 block h-px w-6 bg-text-ink/25" aria-hidden />
                <p className="mt-3 max-w-[220px] text-[13px] leading-relaxed text-text-muted">{ch.copy}</p>
                <p className="mt-2 text-[10px] font-medium tracking-[0.2em] uppercase text-gold">{ch.meta}</p>
              </Reveal>

              <Reveal delay={0.12} className="mt-4">
                {ch.body}
              </Reveal>

              {i < chapters.length - 1 && <span className="sr-only">Next chapter</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Footer line */}
      <Reveal>
        <div className="mt-14 flex items-center justify-center gap-3 border-t border-hairline pt-6 text-[10px] tracking-[0.24em] uppercase text-text-muted">
          <span>Design. Craft. Storytelling.</span>
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden>
            <path d="M5.5 0v11M0 5.5h11" stroke="currentColor" strokeWidth="1" />
          </svg>
          <span>Daffy Studio</span>
        </div>
      </Reveal>
    </div>
  );
}
