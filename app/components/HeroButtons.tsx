"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpRight, Tv2 } from "lucide-react";
import type { MouseEvent } from "react";

function trackSpotlight(e: MouseEvent<HTMLButtonElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
}

const MATRIX_SPOTLIGHT =
  "radial-gradient(200px circle at var(--mx, 50%) var(--my, 50%), rgb(236 226 215 / 0.55), rgb(183 182 181 / 0.35), rgb(95 150 173 / 0.28) 60%, transparent 75%)";

function SpotlightGlow({ inverted = false }: { inverted?: boolean }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      style={{
        background: inverted
          ? MATRIX_SPOTLIGHT
          : "radial-gradient(200px circle at var(--mx, 50%) var(--my, 50%), rgb(255 255 255 / 0.16), transparent 60%)",
      }}
    />
  );
}

function HeroButtons() {
  return (
    <div className="flex items-center gap-4">
      <div className="group animate-hero-in-btn [animation-delay:450ms] relative transition-transform duration-300 ease-out hover:-translate-y-0.5 active:scale-[0.98]">
        <Button
          onMouseMove={trackSpotlight}
          variant="outline"
          className="
            group/btn relative overflow-hidden
            px-18 py-6
            rounded-full
            border border-white/90
            bg-white/95
            text-zinc-950
            shadow-[inset_0_-2px_4px_rgba(0,0,0,0.06),0_12px_40px_rgba(255,255,255,0.08)]
            transition-all duration-500 ease-out
            hover:bg-white
            hover:border-white
            hover:text-zinc-950
            hover:shadow-[inset_0_-2px_4px_rgba(0,0,0,0.04),0_20px_48px_rgba(0,0,0,0.22)]

            before:absolute
            before:inset-x-4
            before:top-0
            before:h-px
            before:bg-black/20
            before:opacity-40
            before:content-['']
          "
        >
          <span
            aria-hidden
            className="pointer-events-none absolute -inset-[1.5px] rounded-full opacity-0 transition-opacity duration-500 group-hover/btn:opacity-100"
            style={{
              boxShadow:
                "0 0 0 1px rgb(99 102 241 / 0.45), 0 0 28px rgb(99 102 241 / 0.3)",
            }}
          />
          <SpotlightGlow inverted />
          <span
            aria-hidden
            className="animate-morph pointer-events-none absolute inset-0 opacity-90 transition-opacity duration-500 group-hover/btn:opacity-100"
          />
          <span className="relative transition-all duration-700 ease-out group-hover:tracking-wide">
            Get Started
          </span>
          <ArrowUpRight />
        </Button>
      </div>

      <div className="group animate-hero-in-btn [animation-delay:550ms] relative transition-transform duration-300 ease-out hover:scale-[1.02] active:scale-[0.98]">
        <Button
          onMouseMove={trackSpotlight}
          variant="outline"
          style={{ background: "rgba(255, 255, 255, 0.03)" }}
          className="
            group/btn relative overflow-hidden
            px-18 py-6
            rounded-full
            border border-white/30
            backdrop-blur-2xl backdrop-saturate-200
            shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),inset_0_-2px_4px_rgba(255,255,255,0.08),0_12px_40px_rgba(0,0,0,0.2)]
            text-white
            transition-all duration-300
            hover:border-white/40

            before:absolute
            before:inset-x-4
            before:top-0
            before:h-px
            before:bg-white/70
            before:opacity-60
            before:content-['']
          "
        >
          <SpotlightGlow />
          <span
            aria-hidden
            className="animate-morph pointer-events-none absolute inset-0 opacity-90 transition-opacity duration-500 group-hover/btn:opacity-100"
          />
          <span className="relative transition-all duration-300 group-hover:tracking-wide">
            Browse Projects
          </span>
        </Button>
      </div>
    </div>
  );
}

export default HeroButtons;
