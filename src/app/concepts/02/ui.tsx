"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import AssetImage from "@/components/AssetImage";
import CountUp from "@/components/CountUp";
import Lightbox from "@/components/Lightbox";
import Reveal from "@/components/Reveal";
import SwipeGallery from "@/components/SwipeGallery";
import VideoPlayer from "@/components/VideoPlayer";
import { getAsset, getDeliverables, getTotalDeliverables } from "@/lib/product";
import type { Asset, Product } from "@/lib/types";

/* ─── Concept 02 — Deliverables Breakdown (client-facing summary) ────────────
   Hero card → numbered deliverable rows with live counts that expand in place
   into swipeable strips → grand total → assurance badges. */

export default function Concept02Client({ product }: { product: Product }) {
  const deliverables = useMemo(() => getDeliverables(product), [product]);
  const total = getTotalDeliverables(product);
  const hero = getAsset(product, product.heroes.indoor);

  const [openKey, setOpenKey] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ assets: Asset[]; index: number } | null>(null);

  return (
    <div className="px-5 pb-10 pt-6">
      {/* Masthead */}
      <Reveal>
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LogoMark />
            <span className="font-serif text-lg">Daffy Studio</span>
          </div>
          <span className="rounded-full border border-hairline px-3 py-1.5 text-[11px] font-medium text-text-muted">
            Project Overview →
          </span>
        </div>
      </Reveal>

      {/* Hero card */}
      <Reveal>
        <section className="overflow-hidden rounded-card bg-cream-soft shadow-soft ring-1 ring-hairline">
          <div className="grid grid-cols-[47%_53%]">
            <div className="relative min-h-[230px]">
              <AssetImage asset={hero} fill sizes="50vw" priority />
            </div>
            <div className="flex flex-col justify-center px-5 py-6">
              <span className="kicker text-gold">Completed Project</span>
              <h1 className="mt-2 font-serif text-[26px] leading-[1.08]">
                Lounge Chair <span className="italic">P14</span>
              </h1>
              <p className="mt-3 text-[12.5px] leading-relaxed text-text-muted">
                A complete visual production from raw capture to campaign-ready assets.
              </p>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Section heading */}
      <Reveal>
        <div className="mb-4 mt-8 flex items-end justify-between">
          <h2 className="font-serif text-[22px]">Deliverables Breakdown</h2>
          <span className="text-[10.5px] tracking-[0.08em] text-text-faint">
            Systematic. Complete. On-brand.
          </span>
        </div>
      </Reveal>

      {/* Deliverable rows */}
      <div className="space-y-3">
        {deliverables.map((d, i) => {
          const open = openKey === d.key;
          const rowThumbs = d.isVideo ? [] : d.assets.slice(0, 3);
          return (
            <Reveal key={d.key} delay={0.05 * i}>
              <motion.section
                layout
                className="overflow-hidden rounded-card bg-cream-soft shadow-soft ring-1 ring-hairline"
              >
                <button
                  onClick={() => setOpenKey(open ? null : d.key)}
                  className="flex w-full items-center gap-4 px-4 py-4 text-left"
                  aria-expanded={open}
                >
                  {/* thumbnails / poster */}
                  {d.isVideo ? (
                    <div className="relative h-[68px] w-[104px] shrink-0 overflow-hidden rounded-[10px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.video.poster}
                        alt="Video poster"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/40 backdrop-blur-[2px]">
                          <svg width="9" height="10" viewBox="0 0 9 10" fill="none" aria-hidden>
                            <path d="M1 .8v8.4L8 5 1 .8z" fill="#fff" />
                          </svg>
                        </span>
                      </span>
                      <span className="absolute bottom-1 right-1 rounded bg-black/50 px-1 py-0.5 text-[9px] font-medium text-white">
                        0:{product.video.durationSeconds}
                      </span>
                    </div>
                  ) : (
                    <div className="flex shrink-0 gap-[3px]">
                      {rowThumbs.map((a) => (
                        <div key={a.id} className="relative h-[68px] w-[40px] overflow-hidden rounded-[7px]">
                          <AssetImage asset={a} fill sizes="80px" />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-medium">
                      <span className="mr-1.5 font-serif italic text-text-faint">
                        {String(d.index).padStart(2, "0")}
                      </span>
                      {d.label}
                    </p>
                    <p className="mt-1 line-clamp-2 text-[11.5px] leading-snug text-text-muted">{d.copy}</p>
                  </div>

                  <div className="shrink-0 text-right">
                    <CountUp to={d.count} className="font-serif text-[24px] leading-none" />
                    <p className="mt-0.5 text-[9px] tracking-[0.18em] uppercase text-text-faint">
                      {d.count === 1 ? "asset" : "assets"}
                    </p>
                  </div>
                </button>

                {/* Expanded strip */}
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.38, ease: [0.22, 0.61, 0.36, 1] }}
                    >
                      <div className="border-t border-hairline px-4 pb-4 pt-4">
                        {d.isVideo ? (
                          <VideoPlayer video={product.video} aspect="aspect-[3/4]" rounded="rounded-[12px]" />
                        ) : (
                          <SwipeGallery slideClassName="w-[46%]" indicator="counter">
                            {d.assets.map((a, j) => (
                              <button
                                key={a.id}
                                aria-label={`View ${a.note}`}
                                onClick={() => setLightbox({ assets: d.assets, index: j })}
                                className="relative block aspect-[4/5] w-full overflow-hidden rounded-[12px]"
                              >
                                <AssetImage asset={a} fill sizes="46vw" />
                              </button>
                            ))}
                          </SwipeGallery>
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

      {/* Total */}
      <Reveal>
        <section className="mt-6 flex items-center gap-4 rounded-card bg-green-deep px-5 py-5 text-cream shadow-lift">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream/12">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path
                d="M10 1.5l7.5 4.3v8.4L10 18.5l-7.5-4.3V5.8L10 1.5zM10 10l7.5-4.2M10 10v8.5M10 10L2.5 5.8"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>
          </span>
          <div className="flex-1">
            <p className="text-[13.5px] font-medium">Total Final Assets</p>
            <p className="mt-0.5 text-[11.5px] text-cream/65">Ready for download and activation.</p>
          </div>
          <div className="text-right">
            <CountUp to={total} className="font-serif text-[34px] leading-none" duration={1.8} />
            <p className="mt-1 text-[9px] tracking-[0.18em] uppercase text-cream/60">final assets</p>
          </div>
        </section>
      </Reveal>

      {/* Assurance badges */}
      <Reveal>
        <div className="mt-6 grid grid-cols-3 gap-2 border-t border-hairline pt-5 text-center">
          {[
            ["Captured by experts", CameraIcon],
            ["Systematic workflow", GridIcon],
            ["Campaign ready", FlagIcon],
          ].map(([label, Icon]) => (
            <div key={label as string} className="flex flex-col items-center gap-2 text-text-muted">
              {(Icon as typeof CameraIcon)({})}
              <span className="text-[10px] tracking-[0.06em]">{label as string}</span>
            </div>
          ))}
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

function LogoMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <path
        d="M11 2c3 3.5 6 5 6 9a6 6 0 11-12 0c0-4 3-5.5 6-9z"
        stroke="var(--green-deep)"
        strokeWidth="1.4"
      />
      <path d="M11 7c1.4 1.6 2.8 2.4 2.8 4.2a2.8 2.8 0 11-5.6 0C8.2 9.4 9.6 8.6 11 7z" fill="var(--green-deep)" opacity="0.35" />
    </svg>
  );
}

function CameraIcon({}: object) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <rect x="1.5" y="4.5" width="15" height="11" rx="2" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="9" cy="10" r="3" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6 4.5L7.2 2.5h3.6L12 4.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function GridIcon({}: object) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <rect x="2" y="2" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="10.5" y="2" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="2" y="10.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="10.5" y="10.5" width="5.5" height="5.5" rx="2.75" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function FlagIcon({}: object) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M4 16V2.5m0 .5h9.5L11 6l2.5 3H4" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}
