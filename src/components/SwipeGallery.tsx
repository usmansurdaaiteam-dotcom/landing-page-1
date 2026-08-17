"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";

interface SwipeGalleryProps {
  children: ReactNode[];
  /** Tailwind width class for each slide, e.g. "w-[72%]". */
  slideClassName?: string;
  gap?: string;
  /** Show the position indicator. */
  indicator?: "dots" | "counter" | "none";
  dark?: boolean;
  className?: string;
  onSelect?: (index: number) => void;
}

/** Touch-friendly Embla carousel used by every concept's horizontal galleries. */
export default function SwipeGallery({
  children,
  slideClassName = "w-[72%]",
  gap = "0.75rem",
  indicator = "dots",
  dark = false,
  className,
  onSelect,
}: SwipeGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
  });
  const [selected, setSelected] = useState(0);

  const handleSelect = useCallback(() => {
    if (!emblaApi) return;
    const idx = emblaApi.selectedScrollSnap();
    setSelected(idx);
    onSelect?.(idx);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", handleSelect);
    return () => {
      emblaApi.off("select", handleSelect);
    };
  }, [emblaApi, handleSelect]);

  const count = children.length;

  return (
    <div className={className}>
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex touch-pan-y" style={{ gap }}>
          {children.map((child, i) => (
            <div key={i} className={`${slideClassName} shrink-0 min-w-0`}>
              {child}
            </div>
          ))}
        </div>
      </div>

      {indicator === "dots" && count > 1 && (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === selected
                  ? `w-5 ${dark ? "bg-cream/90" : "bg-green-deep"}`
                  : `w-1.5 ${dark ? "bg-cream/30" : "bg-text-ink/20"}`
              }`}
            />
          ))}
        </div>
      )}

      {indicator === "counter" && count > 1 && (
        <div
          className={`mt-3 text-center text-[11px] tracking-[0.18em] ${
            dark ? "text-text-cream-muted" : "text-text-faint"
          }`}
        >
          {String(selected + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </div>
      )}
    </div>
  );
}
