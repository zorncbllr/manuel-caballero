"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import MatrixAnimation from "./MatrixAnimation";
import DecryptedText from "@/components/DecryptedText";
import TextType from "@/components/TextType";
import ClickSpark from "@/components/ClickSpark";
import StarBorder from "@/components/StarBorder";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const OUTPUT_LINES = [
  { label: "status", value: "available" },
  { label: "response", value: "< 24 h" },
  { label: "slot", value: "onboarding now" },
];

function CTASection() {
  const terminalRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const lines = gsap.utils.toArray<HTMLElement>("[data-output-line]");
      if (lines.length === 0) return;

      gsap.fromTo(
        lines,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          ease: "power2.out",
          delay: 0.6,
          scrollTrigger: {
            trigger: terminalRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    },
    { scope: terminalRef }
  );

  return (
    <section
      id="contact"
      className="relative -mx-40 flex min-h-[46rem] flex-col items-center justify-center gap-14 overflow-hidden px-40 py-32"
    >
      {/* living matrix background */}
      <div aria-hidden className="absolute inset-0 z-0">
        <MatrixAnimation width={1920} height={560} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-black/60 to-black" />
      </div>

      {/* content */}
      <div className="pointer-events-none relative z-10 flex flex-col items-center gap-14 text-center">
        <DecryptedText
          text="LET'S BUILD SOMETHING THAT RUNS ITSELF."
          animateOn="view"
          sequential
          revealDirection="start"
          speed={32}
          className="text-5xl font-medium tracking-tight text-white md:text-7xl"
          parentClassName="pointer-events-auto"
        />

        {/* terminal card */}
        <div
          ref={terminalRef}
          className="pointer-events-auto w-full max-w-2xl overflow-hidden rounded-xl border border-white/15 bg-black/70 text-left shadow-[0_40px_100px_rgba(0,0,0,0.7)] backdrop-blur-xl"
          style={{ fontFamily: "var(--font-mono), monospace" }}
        >
          {/* chrome bar */}
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
            <span className="size-3 rounded-full bg-white/20" />
            <span className="size-3 rounded-full bg-white/10" />
            <span className="size-3 rounded-full bg-[#5F96AD]/70" />
            <span className="ml-3 text-xs text-white/40">
              manuel@portfolio: ~
            </span>
          </div>

          <div className="flex flex-col gap-3 px-6 py-8 text-sm md:text-base">
            <div className="flex items-baseline gap-2 text-white/80">
              <span className="text-[#5F96AD]">$</span>
              <TextType
                text="$ manuel --contact"
                loop={false}
                startOnVisible
                typingSpeed={42}
                showCursor
                cursorClassName="text-[#5F96AD]"
                textColors={["inherit"]}
              />
            </div>

            <div className="mt-2 flex flex-col gap-2 text-white/60">
              {OUTPUT_LINES.map((line, i) => (
                <div key={line.label} data-output-line className="flex gap-3">
                  <span className="text-white/30">&gt;</span>
                  <span className="w-24 text-white/40">{line.label}</span>
                  <span className="text-[#5F96AD]">{line.value}</span>
                  <span className="hidden flex-1 border-b border-dotted border-white/15 md:block" />
                  <span className="ml-auto hidden text-white/25 md:block">
                    0{i + 1}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <span className="relative inline-block">
                <ClickSpark sparkColor="#5F96AD" sparkCount={12} sparkRadius={26}>
                  <Link
                    href="/contact"
                    className="group/btn relative flex items-center gap-2 rounded-full border border-white/90 bg-white/95 px-8 py-4 text-sm font-medium text-zinc-950 shadow-[0_12px_40px_rgba(255,255,255,0.08)] transition-all duration-500 hover:bg-white"
                  >
                    Initiate Contact
                    <ArrowUpRight className="transition-transform duration-500 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                  </Link>
                </ClickSpark>
              </span>

              <StarBorder
                as={Link}
                href="#work"
                color="#5F96AD"
                speed="8s"
                className="text-sm"
              >
                Browse Projects
              </StarBorder>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;