"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SectionHeader from "./SectionHeader";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const LINE_ITEMS = [
  { label: "Data entry & syncing", value: "+12 h / wk" },
  { label: "Lead follow-ups", value: "+6 h / wk" },
  { label: "Reporting & filing", value: "+4 h / wk" },
  { label: "Manual QA checks", value: "+3 h / wk" },
];

function Barcode() {
  return (
    <div className="flex h-10 items-end justify-between gap-1 overflow-hidden">
      {Array.from({ length: 40 }).map((_, i) => (
        <span
          key={i}
          className="bg-white/80"
          style={{
            width: i % 7 === 3 ? 2 : 1,
            height: `${28 - ((i * 7) % 12)}px`,
          }}
        />
      ))}
    </div>
  );
}

function OutcomesSection() {
  const panelRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const rows = gsap.utils.toArray<HTMLElement>("[data-receipt-row]");
      gsap.fromTo(
        rows,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.06,
          ease: "none",
          scrollTrigger: {
            trigger: panelRef.current,
            start: "top 75%",
            end: "top 35%",
            scrub: true,
          },
        }
      );
    },
    { scope: panelRef }
  );

  return (
    <section className="flex flex-col gap-10">
      <SectionHeader
        index="03"
        label="What This Means For Your Business"
        hint="the so-what"
      />

      <div
        ref={panelRef}
        className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-xl border border-white/15 bg-[#0b0b0b] shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
        style={{ fontFamily: "var(--font-mono), monospace" }}
      >
        {/* tear-off perforations */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-3 z-10 flex justify-between px-6 opacity-40"
        >
          {Array.from({ length: 18 }).map((_, i) => (
            <span key={i} className="h-3 w-px bg-white/40" />
          ))}
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex justify-between px-6 opacity-40"
        >
          {Array.from({ length: 18 }).map((_, i) => (
            <span key={i} className="h-3 w-px bg-white/40" />
          ))}
        </div>

        <div className="px-10 py-12">
          {/* header */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/40">
                Automation Audit
              </p>
              <h3 className="mt-1 text-2xl font-medium tracking-tight">
                Receipt of reclaimed time
              </h3>
            </div>
            <p className="font-mono text-xs text-[#5F96AD]">#001 · 2026</p>
          </div>

          {/* line items */}
          <div className="mt-10 flex flex-col gap-4" data-receipt-body>
            {LINE_ITEMS.map((item, index) => (
              <div
                key={item.label}
                data-receipt-row
                className="flex items-baseline gap-2 text-sm"
              >
                <span className="mr-2 font-mono text-xs text-white/30">
                  0{index + 1}
                </span>
                <span className="text-white/80">{item.label}</span>
                <span className="flex-1 border-b border-dashed border-white/20" />
                <span className="font-mono text-white">{item.value}</span>
              </div>
            ))}
          </div>

          {/* total */}
          <div className="mt-8 border-t-2 border-dashed border-white/25 pt-5">
            <div className="flex items-baseline justify-between">
              <span className="text-xs uppercase tracking-[0.3em] text-white/50">
                Total reclaimed / wk
              </span>
              <span className="text-2xl font-medium tracking-tight">
                25 h/wk
              </span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-white/40">
              back to your team — for the work that actually moves the
              business.
            </p>
          </div>

          {/* barcode */}
          <div className="mt-10 border-t border-dashed border-white/15 pt-6">
            <Barcode />
            <p className="mt-3 text-center font-mono text-[10px] tracking-[0.4em] text-white/30">
              M C · 0 0 1
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OutcomesSection;