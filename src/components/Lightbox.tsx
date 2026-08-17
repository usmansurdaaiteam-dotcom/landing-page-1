"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { Asset } from "@/lib/types";

interface LightboxProps {
  assets: Asset[];
  /** Index into assets, or null when closed. */
  openIndex: number | null;
  onClose: () => void;
}

const CATEGORY_LABEL: Record<string, string> = {
  raw: "Raw Capture",
  studio: "Studio Output",
  lifestyle: "Lifestyle World",
  campaign: "Campaign",
  video: "Motion",
};

/** Full-screen swipeable image viewer shared across concepts. */
export default function Lightbox({ assets, openIndex, onClose }: LightboxProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (openIndex !== null) setIndex(openIndex);
  }, [openIndex]);

  const open = openIndex !== null;
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + assets.length) % assets.length),
    [assets.length]
  );
  const next = useCallback(() => setIndex((i) => (i + 1) % assets.length), [assets.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, prev, next]);

  const asset = assets[index];

  return (
    <AnimatePresence>
      {open && asset?.web && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col bg-ink/95 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <div className="flex items-center justify-between px-5 pt-[max(1rem,env(safe-area-inset-top))]">
            <span className="kicker text-text-cream-muted">
              {CATEGORY_LABEL[asset.category]} · {String(index + 1).padStart(2, "0")}/
              {String(assets.length).padStart(2, "0")}
            </span>
            <button
              aria-label="Close viewer"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline-dark text-text-cream"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </div>

          <div
            className="relative flex-1 select-none px-4 py-4"
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={asset.id}
                className="relative h-full w-full"
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) next();
                  else if (info.offset.x > 60) prev();
                }}
              >
                <Image
                  src={asset.web.src}
                  alt={asset.note || asset.id}
                  fill
                  sizes="100vw"
                  quality={85}
                  placeholder="blur"
                  blurDataURL={asset.web.blurDataURL}
                  className="object-contain"
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div
            className="flex items-center justify-between px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Previous image"
              onClick={prev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline-dark text-text-cream"
            >
              <svg width="14" height="12" viewBox="0 0 14 12" fill="none" aria-hidden>
                <path d="M6 1L1 6l5 5M1 6h12" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
            <p className="mx-4 flex-1 truncate text-center text-xs text-text-cream-muted">
              {asset.note}
            </p>
            <button
              aria-label="Next image"
              onClick={next}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline-dark text-text-cream"
            >
              <svg width="14" height="12" viewBox="0 0 14 12" fill="none" aria-hidden>
                <path d="M8 1l5 5-5 5M13 6H1" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
