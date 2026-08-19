"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 50, suffix: "+", decimals: 0, label: "Workflows Automated" },
  { value: 30, suffix: "+", decimals: 0, label: "Production Agents" },
  { value: 99.9, suffix: "%", decimals: 1, label: "System Uptime" },
  { value: 6, suffix: "+", decimals: 0, label: "Years Experience" },
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
      { threshold: 0.35 },
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
      className="relative text-center transition-all duration-700 ease-out"
      style={{
        transitionDelay: `${index * 110}ms`,
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(24px)",
      }}
    >
      <div>
        <div className="text-4xl font-medium tabular-nums leading-none text-white">
          {value.toFixed(stat.decimals)}
          {stat.suffix}
        </div>
        <div className="mt-5 text-[10px] font-medium uppercase tracking-[0.3em] text-white">
          {stat.label.split(" ").map((label) => (
            <p key={label}>{label}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatsCards() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef);

  return (
    <section ref={sectionRef} className="flex flex-col items-center w-fit">
      <div className="grid grid-cols-4 gap-12">
        {STATS.map((stat, index) => (
          <StatCell
            key={stat.label}
            stat={stat}
            index={index}
            inView={inView}
          />
        ))}
      </div>
    </section>
  );
}

export default StatsCards;
