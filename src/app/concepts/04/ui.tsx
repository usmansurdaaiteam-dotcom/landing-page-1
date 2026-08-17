"use client";

import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import AssetImage from "@/components/AssetImage";
import Lightbox from "@/components/Lightbox";
import Reveal from "@/components/Reveal";
import SwipeGallery from "@/components/SwipeGallery";
import VideoPlayer from "@/components/VideoPlayer";
import { getAsset, getWebAssets } from "@/lib/product";
import type { Asset, Product } from "@/lib/types";

/* ─── Concept 04 — Stage-Based Product Story (guided journey) ────────────────
   A living stepper spine tracks scroll through four stages; tapping a stage
   glides to it. Each stage carries its own gallery treatment, ending in a
   sticky "Start Your Project" CTA. */

const STAGE_COPY: Record<string, string> = {
  source: "Raw phone photos captured from every angle.",
  studio: "Clean, consistent packshots reconstructed in our studio.",
  lifestyle: "Curated scenes that bring the product to life.",
  campaign: "Short-form video to tell the full product story.",
};

const STAGE_LABEL: Record<string, string> = {
  source: "Source",
  studio: "Studio",
  lifestyle: "Lifestyle",
  campaign: "Video",
};

export default function Concept04Client({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const [lightbox, setLightbox] = useState<{ assets: Asset[]; index: number } | null>(null);

  const heroAsset = getAsset(product, product.heroes.packshot);

  const rawPicks = useMemo(() => getWebAssets(product, "raw").slice(0, 8), [product]);
  const studioPicks = useMemo(() => getWebAssets(product, "studio"), [product]);
  const lifestylePicks = useMemo(
    () =>
      ["scene-gallery-1", "campaign-1", "scene-veranda-1", "scene-wheat-1", "scene-dark-2", "scene-desert-1", "campaign-3"].map(
        (id) => getAsset(product, id)
      ),
    [product]
  );

  // Track which stage owns the viewport
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sectionRefs.current.forEach((el, i) => {
      if (!el) return;
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) setActive(i);
        },
        { rootMargin: "-42% 0px -50% 0px" }
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollToStage = (i: number) =>
    sectionRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" });

  const stages = [
    {
      key: "source",
      gallery: (
        <SwipeGallery slideClassName="w-[52%]" indicator="none" gap="0.875rem">
          {rawPicks.map((a, j) => (
            <motion.button
              key={a.id}
              aria-label={`View ${a.note}`}
              onClick={() => setLightbox({ assets: rawPicks, index: j })}
              className="relative block aspect-[4/5] w-full overflow-hidden rounded-[10px] bg-white p-1.5 shadow-soft"
              style={{ rotate: j % 2 === 0 ? "-1.2deg" : "1.2deg" }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="relative block h-full w-full overflow-hidden rounded-[6px]">
                <AssetImage asset={a} fill sizes="52vw" />
              </span>
            </motion.button>
          ))}
        </SwipeGallery>
      ),
    },
    {
      key: "studio",
      gallery: (
        <SwipeGallery slideClassName="w-[52%]" indicator="none" gap="0.875rem">
          {studioPicks.map((a, j) => (
            <motion.button
              key={a.id}
              aria-label={`View ${a.note}`}
              onClick={() => setLightbox({ assets: studioPicks, index: j })}
              className="relative block aspect-[4/5] w-full overflow-hidden rounded-[12px] bg-white shadow-soft ring-1 ring-hairline"
              whileTap={{ scale: 0.97 }}
            >
              <AssetImage asset={a} fill sizes="52vw" className="object-contain p-2" />
            </motion.button>
          ))}
        </SwipeGallery>
      ),
    },
    {
      key: "lifestyle",
      gallery: (
        <SwipeGallery slideClassName="w-[78%]" indicator="dots">
          {lifestylePicks.map((a, j) => (
            <motion.button
              key={a.id}
              aria-label={`View ${a.note}`}
              onClick={() => setLightbox({ assets: lifestylePicks, index: j })}
              className="relative block aspect-[4/5] w-full overflow-hidden rounded-[14px] shadow-lift"
              whileTap={{ scale: 0.98 }}
            >
              <AssetImage asset={a} fill sizes="78vw" />
            </motion.button>
          ))}
        </SwipeGallery>
      ),
    },
    {
      key: "campaign",
      gallery: (
        <VideoPlayer video={product.video} aspect="aspect-[4/5]" rounded="rounded-[14px]" className="shadow-lift" />
      ),
    },
  ];

  return (
    <div className="pb-24">
      {/* Hero */}
      <div className="px-5 pt-6">
        <Reveal>
          <div className="flex items-center justify-between">
            <span className="font-serif text-[19px] text-green-deep">Daffy Studio</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-hairline text-text-muted">
              <svg width="14" height="4" viewBox="0 0 14 4" fill="none" aria-hidden>
                <circle cx="2" cy="2" r="1.4" fill="currentColor" />
                <circle cx="7" cy="2" r="1.4" fill="currentColor" />
                <circle cx="12" cy="2" r="1.4" fill="currentColor" />
              </svg>
            </span>
          </div>
        </Reveal>

        <div className="mt-4 grid grid-cols-[1.1fr_1fr] items-center gap-2">
          <Reveal delay={0.06}>
            <h1 className="font-serif text-[32px] leading-[1.05] text-green-deep">
              From Raw to
              <br />
              Remarkable.
            </h1>
            <p className="mt-3 text-[12.5px] leading-relaxed text-text-muted">
              See how we transform a product into a complete visual story.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <motion.div
              animate={{ y: [0, -7, 0] }}
              transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut" }}
              className="relative aspect-square"
            >
              <AssetImage
                asset={heroAsset}
                fill
                sizes="45vw"
                className="object-contain drop-shadow-[0_18px_24px_rgba(46,70,50,0.25)]"
                priority
              />
            </motion.div>
          </Reveal>
        </div>
      </div>

      {/* Sticky stepper */}
      <div className="sticky top-[49px] z-30 mt-6 border-y border-hairline bg-sage-bg/90 px-5 py-3 backdrop-blur-md">
        <div className="flex items-center">
          {product.stages.map((s, i) => (
            <div key={s.key} className="flex flex-1 items-center last:flex-none">
              <button
                onClick={() => scrollToStage(i)}
                className="flex items-center gap-2"
                aria-label={`Go to stage ${i + 1}: ${STAGE_LABEL[s.key]}`}
                aria-current={active === i}
              >
                <motion.span
                  className="flex h-6 w-6 items-center justify-center rounded-full text-[10.5px] font-semibold"
                  animate={{
                    backgroundColor: active >= i ? "var(--green-deep)" : "rgba(46,70,50,0.10)",
                    color: active >= i ? "#f2efe7" : "var(--green-deep)",
                    scale: active === i ? 1.12 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {i + 1}
                </motion.span>
                <motion.span
                  className="text-[11px] font-medium"
                  animate={{ opacity: active === i ? 1 : 0.45 }}
                >
                  {STAGE_LABEL[s.key]}
                </motion.span>
              </button>
              {i < product.stages.length - 1 && (
                <span className="relative mx-2 h-px flex-1 overflow-hidden bg-green-deep/15">
                  <motion.span
                    className="absolute inset-y-0 left-0 w-full bg-green-deep"
                    animate={{ scaleX: active > i ? 1 : 0 }}
                    style={{ originX: 0 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                  />
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stages */}
      <div className="mt-2">
        {product.stages.map((s, i) => (
          <section
            key={s.key}
            ref={(el) => {
              sectionRefs.current[i] = el;
            }}
            className="scroll-mt-[118px] px-5 py-7"
          >
            <Reveal>
              <div className="mb-4 flex items-baseline gap-3">
                <span className="kicker text-text-faint">Stage {i + 1}</span>
                <h2 className="font-serif text-[22px] text-green-deep">{STAGE_LABEL[s.key]}</h2>
              </div>
              <p className="mb-4 max-w-[280px] text-[12.5px] leading-relaxed text-text-muted">
                {STAGE_COPY[s.key]}
              </p>
            </Reveal>
            <Reveal delay={0.08}>{stages[i].gallery}</Reveal>
          </section>
        ))}
      </div>

      {/* Sticky CTA */}
      <motion.div
        className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[480px] px-5 pb-[max(1rem,env(safe-area-inset-bottom))]"
        initial={{ y: 90 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 160, damping: 22 }}
      >
        <button className="flex w-full items-center justify-between rounded-full bg-green-deep px-6 py-4 text-[14px] font-medium text-cream shadow-lift transition-transform active:scale-[0.985]">
          Start Your Project
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden>
            <path d="M10 1l5 5-5 5M15 6H1" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </motion.div>

      <Lightbox
        assets={lightbox?.assets ?? []}
        openIndex={lightbox?.index ?? null}
        onClose={() => setLightbox(null)}
      />
    </div>
  );
}
