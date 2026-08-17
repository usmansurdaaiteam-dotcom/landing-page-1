"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import type { Asset } from "@/lib/types";

interface BeforeAfterProps {
  before: Asset;
  after: Asset;
  beforeLabel?: string;
  afterLabel?: string;
  aspect?: string;
  rounded?: string;
  className?: string;
}

/** Draggable reveal slider comparing a raw capture with its studio reconstruction. */
export default function BeforeAfter({
  before,
  after,
  beforeLabel = "Raw",
  afterLabel = "Studio",
  aspect = "aspect-[4/5]",
  rounded = "rounded-card",
  className,
}: BeforeAfterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(0.5);
  const dragging = useRef(false);

  const update = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos(Math.min(0.94, Math.max(0.06, (clientX - rect.left) / rect.width)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    update(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragging.current) update(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

  if (!before.web || !after.web) return null;

  return (
    <div
      ref={ref}
      className={`relative touch-pan-y select-none overflow-hidden ${aspect} ${rounded} ${className ?? ""}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      role="slider"
      aria-label="Compare raw capture with studio output"
      aria-valuenow={Math.round(pos * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* After (base layer) */}
      <Image
        src={after.web.src}
        alt={after.note || after.id}
        fill
        sizes="(max-width: 640px) 100vw, 480px"
        placeholder="blur"
        blurDataURL={after.web.blurDataURL}
        className="object-cover"
        draggable={false}
      />
      {/* Before (clipped layer) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - pos * 100}% 0 0)` }}
      >
        <Image
          src={before.web.src}
          alt={before.note || before.id}
          fill
          sizes="(max-width: 640px) 100vw, 480px"
          placeholder="blur"
          blurDataURL={before.web.blurDataURL}
          className="object-cover"
          draggable={false}
        />
      </div>

      {/* Divider + handle */}
      <div
        className="absolute inset-y-0 z-10 w-[2px] bg-white/90 shadow-[0_0_12px_rgba(0,0,0,0.35)]"
        style={{ left: `calc(${pos * 100}% - 1px)` }}
      >
        <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-black/35 backdrop-blur-sm">
          <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden>
            <path d="M5 1L1 6l4 5M13 1l4 5-4 5" stroke="#fff" strokeWidth="1.5" />
          </svg>
        </span>
      </div>

      <span className="absolute left-3 top-3 z-10 rounded-full bg-black/45 px-2.5 py-1 text-[10px] tracking-[0.14em] uppercase text-white/90 backdrop-blur-sm">
        {beforeLabel}
      </span>
      <span className="absolute right-3 top-3 z-10 rounded-full bg-white/70 px-2.5 py-1 text-[10px] tracking-[0.14em] uppercase text-text-ink backdrop-blur-sm">
        {afterLabel}
      </span>
    </div>
  );
}
