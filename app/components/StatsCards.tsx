"use client";

import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";

const STATS = [
  { value: 50, suffix: "+", decimals: 0, label: "Workflows Automated" },
  { value: 30, suffix: "+", decimals: 0, label: "AI Agents in Production" },
  { value: 99.9, suffix: "%", decimals: 1, label: "System Uptime" },
  { value: 6, suffix: "+", decimals: 0, label: "Years of Experience" },
];

function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const raf = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(raf);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return inView;
}

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const raf = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(raf);
    }

    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setValue(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);

  return value;
}

function trackSpotlight(e: MouseEvent<HTMLDivElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
}

function StatCell({
  stat,
  index,
  inView,
}: {
  stat: (typeof STATS)[number];
  index: number;
  inView: boolean;
}) {
  const value = useCountUp(stat.value, inView);

  return (
    <div
      onMouseMove={trackSpotlight}
      className="group relative px-14 py-16 transition-all duration-700 ease-out"
      style={{
        transitionDelay: `${index * 110}ms`,
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(24px)",
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(320px circle at var(--mx, 50%) var(--my, 50%), rgb(255 255 255 / 0.06), transparent 70%)",
        }}
      />

      <div className="relative">
        <div className="text-8xl font-medium tabular-nums leading-none text-white">
          {value.toFixed(stat.decimals)}
          {stat.suffix}
        </div>
        <div className="mt-5 text-xs font-medium uppercase tracking-[0.3em] text-white/40 transition-colors duration-300 group-hover:text-white/70">
          {stat.label}
        </div>
      </div>
    </div>
  );
}

function StatsCards() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef);

  return (
    <section ref={sectionRef} className="flex flex-col gap-10">
      <div className="flex items-center gap-4">
        <span className="text-xs font-medium uppercase tracking-[0.3em] text-white/40">
          Impact, quantified
        </span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <div className="grid grid-cols-4 divide-x divide-white/10 border-y border-white/10">
        {STATS.map((stat, index) => (
          <StatCell key={stat.label} stat={stat} index={index} inView={inView} />
        ))}
      </div>
    </section>
  );
}

export default StatsCards;