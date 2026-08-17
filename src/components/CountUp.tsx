"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

interface CountUpProps {
  to: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

/** Animated integer counter that ticks up when scrolled into view. */
export default function CountUp({
  to,
  duration = 1.4,
  className,
  prefix = "",
  suffix = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!inView || !ref.current) return;
    const node = ref.current;
    if (reduced) {
      node.textContent = `${prefix}${to}${suffix}`;
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: [0.22, 0.61, 0.36, 1],
      onUpdate: (v) => {
        node.textContent = `${prefix}${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, to, duration, prefix, suffix, reduced]);

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}
