"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ProductVideo } from "@/lib/types";

interface VideoPlayerProps {
  video: ProductVideo;
  /** Poster aspect ratio class, e.g. "aspect-[3/4]". */
  aspect?: string;
  rounded?: string;
  className?: string;
  badge?: boolean;
}

function formatTime(s: number) {
  return `0:${String(Math.max(0, Math.floor(s))).padStart(2, "0")}`;
}

/**
 * Poster with play affordance → inline playback with a minimal progress bar.
 * Used for the derived P14 motion piece across all concepts.
 */
export default function VideoPlayer({
  video,
  aspect = "aspect-[3/4]",
  rounded = "rounded-card",
  className,
  badge = true,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const onTime = () => setProgress(el.duration ? el.currentTime / el.duration : 0);
    const onEnd = () => setPlaying(false);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("ended", onEnd);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("ended", onEnd);
    };
  }, [started]);

  const toggle = () => {
    const el = videoRef.current;
    if (!started) {
      setStarted(true);
      setPlaying(true);
      // play after the <video> mounts
      requestAnimationFrame(() => videoRef.current?.play().catch(() => setPlaying(false)));
      return;
    }
    if (!el) return;
    if (el.paused) {
      el.play().catch(() => undefined);
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? "Pause video" : "Play video"}
      className={`group relative block w-full overflow-hidden ${aspect} ${rounded} ${className ?? ""}`}
    >
      {started ? (
        <video
          ref={videoRef}
          src={video.src}
          poster={video.poster}
          playsInline
          muted
          loop
          autoPlay
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <Image
          src={video.poster}
          alt="P14 motion study poster"
          fill
          sizes="(max-width: 640px) 100vw, 480px"
          className="object-cover"
        />
      )}

      {/* Play affordance */}
      <AnimatePresence>
        {!playing && (
          <motion.span
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.15 }}
            transition={{ duration: 0.3 }}
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/70 bg-black/25 backdrop-blur-sm transition-transform duration-300 group-active:scale-90">
              <svg width="18" height="20" viewBox="0 0 18 20" fill="none" aria-hidden>
                <path d="M2 1.5v17l14-8.5L2 1.5z" fill="#fff" />
              </svg>
            </span>
          </motion.span>
        )}
      </AnimatePresence>

      {badge && !started && (
        <span className="absolute bottom-3 right-3 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white backdrop-blur-sm">
          0:{String(video.durationSeconds).padStart(2, "0")}
        </span>
      )}

      {/* Progress bar */}
      {started && (
        <span className="absolute inset-x-4 bottom-3 flex items-center gap-2">
          <span className="text-[10px] font-medium text-white/90 tabular-nums">
            {formatTime(progress * video.durationSeconds)}
          </span>
          <span className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-white/30">
            <span
              className="absolute inset-y-0 left-0 rounded-full bg-white"
              style={{ width: `${progress * 100}%` }}
            />
          </span>
          <span className="text-[10px] font-medium text-white/90 tabular-nums">
            {formatTime(video.durationSeconds)}
          </span>
        </span>
      )}

      {video.derived && !playing && (
        <span className="absolute left-3 top-3 rounded-full bg-black/40 px-2.5 py-1 text-[10px] tracking-[0.12em] uppercase text-white/85 backdrop-blur-sm">
          Motion study
        </span>
      )}
    </button>
  );
}
