"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import AssetImage from "@/components/AssetImage";
import Lightbox from "@/components/Lightbox";
import Reveal from "@/components/Reveal";
import VideoPlayer from "@/components/VideoPlayer";
import { getAsset, getWebAssets } from "@/lib/product";
import type { Asset, Product } from "@/lib/types";

/* ─── Concept 05 — Category Explorer (accordion library) ─────────────────────
   Source / Studio / Lifestyle / Video as layout-animated accordions. Each opens
   to a featured editorial card + browsable grid; Lifestyle adds scene filters.
   Framed as a production library that scales to many products. */

interface Section {
  key: string;
  label: string;
  meta: string;
  icon: React.ReactNode;
  featured: {
    kicker: string;
    title: string;
    copy: string;
    chips: string[];
    assetId: string;
  };
}

export default function Concept05Client({ product }: { product: Product }) {
  const [open, setOpen] = useState<string | null>("studio");
  const [scene, setScene] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ assets: Asset[]; index: number } | null>(null);
  const [expandedGrid, setExpandedGrid] = useState<Record<string, boolean>>({});

  const rawAssets = useMemo(() => getWebAssets(product, "raw"), [product]);
  const studioAssets = useMemo(() => getWebAssets(product, "studio"), [product]);
  const lifestyleAssets = useMemo(
    () => [...getWebAssets(product, "lifestyle"), ...getWebAssets(product, "campaign")],
    [product]
  );
  const lifestyleFiltered = useMemo(
    () => (scene ? lifestyleAssets.filter((a) => a.scene === scene) : lifestyleAssets),
    [lifestyleAssets, scene]
  );

  const sections: Section[] = [
    {
      key: "source",
      label: "Source",
      meta: `${product.counts.raw} images`,
      icon: <ChairIcon />,
      featured: {
        kicker: "Warehouse · Day 01",
        title: "Every angle. No styling.",
        copy: "The honest starting point — phone captures of frame, fabric and form against a plain sheet.",
        chips: [`${product.counts.raw} captures`, "1 afternoon"],
        assetId: "raw-1330",
      },
    },
    {
      key: "studio",
      label: "Studio",
      meta: `${product.counts.studio} images`,
      icon: <SparkIcon />,
      featured: {
        kicker: "P14 Lounge Chair",
        title: "Suede. Structure. Stillness.",
        copy: "Curated studio imagery with refined lighting and natural shadow for timeless appeal.",
        chips: [`${product.counts.studio} images`, "2 studio sets"],
        assetId: "studio-white-1",
      },
    },
    {
      key: "lifestyle",
      label: "Lifestyle",
      meta: `${product.counts.lifestyle + product.counts.campaign} images`,
      icon: <LeafIcon />,
      featured: {
        kicker: "Curated Worlds",
        title: "The spaces it belongs.",
        copy: "Six built worlds — from gallery stillness to open wheat fields — plus editorial campaign heroes.",
        chips: [`${product.sceneFamilies.length} worlds`, `${product.counts.campaign} campaign heroes`],
        assetId: "scene-veranda-1",
      },
    },
    {
      key: "video",
      label: "Video",
      meta: "1 clip",
      icon: <PlayIcon />,
      featured: {
        kicker: "Motion Study",
        title: "The story in motion.",
        copy: "A short cinematic pass through the P14's worlds, derived from the campaign set.",
        chips: [`0:${product.video.durationSeconds}`, "9:16 vertical"],
        assetId: "campaign-3",
      },
    },
  ];

  const assetsFor = (key: string) =>
    key === "source" ? rawAssets : key === "studio" ? studioAssets : lifestyleFiltered;

  return (
    <div className="px-5 pb-10 pt-6">
      {/* Masthead */}
      <Reveal>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-[24px] text-green-deep">Daffy Studio</h1>
            <p className="kicker mt-1 text-text-faint">Visuals that sell</p>
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-text-muted">
            <svg width="15" height="16" viewBox="0 0 15 16" fill="none" aria-hidden>
              <circle cx="7.5" cy="4.5" r="3" stroke="currentColor" strokeWidth="1.2" />
              <path d="M1.5 15c.7-3.2 3.1-5 6-5s5.3 1.8 6 5" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </span>
        </div>
      </Reveal>

      {/* Accordions */}
      <div className="space-y-3">
        {sections.map((section, i) => {
          const isOpen = open === section.key;
          const sectionAssets = assetsFor(section.key);
          const gridExpanded = expandedGrid[section.key];
          const gridAssets = gridExpanded ? sectionAssets : sectionAssets.slice(0, 6);
          const featured = getAsset(product, section.featured.assetId);

          return (
            <Reveal key={section.key} delay={0.04 * i}>
              <motion.section
                layout
                transition={{ layout: { duration: 0.45, ease: [0.22, 0.61, 0.36, 1] } }}
                className={`overflow-hidden rounded-card ring-1 transition-shadow ${
                  isOpen ? "bg-cream-soft shadow-lift ring-hairline" : "bg-cream-soft/60 shadow-soft ring-hairline"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : section.key)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-4 px-4 py-4 text-left"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-green-deep ring-1 ring-hairline">
                    {section.icon}
                  </span>
                  <span className="flex-1">
                    <span className="block font-serif text-[19px]">{section.label}</span>
                    <span className="mt-0.5 block text-[11.5px] text-text-muted">{section.meta}</span>
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0, backgroundColor: isOpen ? "var(--green-deep)" : "rgba(0,0,0,0)" }}
                    transition={{ duration: 0.3 }}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                      isOpen ? "border-transparent text-cream" : "border-hairline text-text-muted"
                    }`}
                  >
                    <svg width="11" height="7" viewBox="0 0 11 7" fill="none" aria-hidden>
                      <path d="M1 1l4.5 4.5L10 1" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
                    >
                      <div className="px-4 pb-5">
                        {/* Featured editorial card */}
                        {section.key === "video" ? (
                          <VideoPlayer video={product.video} aspect="aspect-[3/4]" rounded="rounded-[14px]" />
                        ) : (
                          <button
                            aria-label={`View ${featured.note}`}
                            onClick={() =>
                              setLightbox({
                                assets: sectionAssets,
                                index: Math.max(0, sectionAssets.indexOf(featured)),
                              })
                            }
                            className="relative block aspect-[4/5] w-full overflow-hidden rounded-[14px]"
                          >
                            <AssetImage asset={featured} fill sizes="88vw" />
                          </button>
                        )}

                        <div className="mt-4">
                          <p className="kicker text-gold">{section.featured.kicker}</p>
                          <h3 className="mt-1.5 font-serif text-[21px]">{section.featured.title}</h3>
                          <p className="mt-2 text-[12.5px] leading-relaxed text-text-muted">
                            {section.featured.copy}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {section.featured.chips.map((chip) => (
                              <span
                                key={chip}
                                className="rounded-full border border-hairline px-2.5 py-1 text-[10.5px] text-text-muted"
                              >
                                {chip}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Scene filters (lifestyle only) */}
                        {section.key === "lifestyle" && (
                          <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1">
                            <FilterChip active={scene === null} onClick={() => setScene(null)}>
                              All
                            </FilterChip>
                            {product.sceneFamilies.map((f) => (
                              <FilterChip key={f.key} active={scene === f.key} onClick={() => setScene(scene === f.key ? null : f.key)}>
                                {f.label}
                              </FilterChip>
                            ))}
                            <FilterChip active={scene === "editorial"} onClick={() => setScene(scene === "editorial" ? null : "editorial")}>
                              Campaign
                            </FilterChip>
                          </div>
                        )}

                        {/* Grid */}
                        {section.key !== "video" && (
                          <>
                            <motion.div layout className="mt-4 grid grid-cols-3 gap-[5px]">
                              <AnimatePresence mode="popLayout">
                                {gridAssets.map((a, j) => (
                                  <motion.button
                                    key={a.id}
                                    layout
                                    aria-label={`View ${a.note}`}
                                    initial={{ opacity: 0, scale: 0.94 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.94 }}
                                    transition={{ duration: 0.3, delay: 0.02 * (j % 6) }}
                                    onClick={() => setLightbox({ assets: gridAssets, index: j })}
                                    className="relative aspect-square overflow-hidden rounded-[8px]"
                                  >
                                    <AssetImage asset={a} fill sizes="30vw" />
                                  </motion.button>
                                ))}
                              </AnimatePresence>
                            </motion.div>
                            {sectionAssets.length > 6 && (
                              <button
                                onClick={() =>
                                  setExpandedGrid((prev) => ({ ...prev, [section.key]: !gridExpanded }))
                                }
                                className="mt-3 w-full rounded-full border border-hairline py-2.5 text-[11px] font-medium tracking-[0.14em] uppercase text-text-muted transition-colors hover:text-text-ink"
                              >
                                {gridExpanded ? "Show less" : `View all ${sectionAssets.length}`}
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.section>
            </Reveal>
          );
        })}
      </div>

      {/* Footer CTA */}
      <Reveal>
        <div className="mt-6 flex items-center justify-between border-t border-hairline pt-5">
          <span className="text-[12.5px] text-text-muted">Ready to elevate your product?</span>
          <button className="flex items-center gap-1.5 text-[13px] font-medium text-green-deep">
            Create Project
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden>
              <path d="M9 1l4 4-4 4M13 5H1" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </button>
        </div>
      </Reveal>

      <Lightbox
        assets={lightbox?.assets ?? []}
        openIndex={lightbox?.index ?? null}
        onClose={() => setLightbox(null)}
      />
    </div>
  );
}

function FilterChip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-3.5 py-1.5 text-[11.5px] font-medium transition-colors ${
        active ? "bg-green-deep text-cream" : "border border-hairline text-text-muted"
      }`}
    >
      {children}
    </button>
  );
}

function ChairIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M4 8V3.5A1.5 1.5 0 015.5 2h7A1.5 1.5 0 0114 3.5V8" stroke="currentColor" strokeWidth="1.2" />
      <path d="M3 16v-4.5A1.5 1.5 0 014.5 10h9a1.5 1.5 0 011.5 1.5V16M3 13.5h12" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M9 2l1.6 4.4L15 8l-4.4 1.6L9 14l-1.6-4.4L3 8l4.4-1.6L9 2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M14.5 12.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8z" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M15 3C8 3 3.5 7 3.5 13.5c0 .5 0 1 .1 1.5C10.5 15 15 10.5 15 3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M3.5 15C6 11 9 8 13 5.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <circle cx="9" cy="9" r="7.25" stroke="currentColor" strokeWidth="1.2" />
      <path d="M7.2 6.2v5.6L12 9 7.2 6.2z" fill="currentColor" />
    </svg>
  );
}
