"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SectionHeader from "./SectionHeader";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const STEPS = [
  {
    name: "Discover",
    text: "I map the workflow you actually run today — every manual step, every tool, every hidden time-sink.",
  },
  {
    name: "Design",
    text: "We sketch the automated flow on paper first: inputs, handoffs, fallbacks, and where humans stay in the loop.",
  },
  {
    name: "Automate",
    text: "Agents and integrations take over the repetitive work — with logs, retries, and guardrails from day one.",
  },
  {
    name: "Scale",
    text: "The system absorbs more volume without more effort — and grows the way your business does.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const step = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

function ProcessSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom 60%",
          scrub: true,
        },
      });

      if (lineRef.current) {
        tl.fromTo(
          lineRef.current,
          { strokeDashoffset: 800 },
          { strokeDashoffset: 0, ease: "none" }
        );
      }

      const nodes = gsap.utils.toArray<HTMLElement>("[data-process-node]");
      nodes.forEach((node, i) => {
        tl.fromTo(
          node,
          { backgroundColor: "#000", borderColor: "rgb(255 255 255 / 0.4)" },
          {
            backgroundColor: "#fff",
            borderColor: "#fff",
            duration: 0.12,
            ease: "none",
          },
          i * 0.18
        );
      });
    },
    { scope: mobileRef }
  );

  return (
    <section ref={mobileRef} className="flex flex-col gap-10">
      <SectionHeader index="04" label="How I Work" hint="4 steps" />

      <motion.div
        ref={sectionRef}
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="relative hidden grid-cols-4 gap-10 lg:grid"
      >
        <span className="absolute left-0 right-0 top-[7px] h-px bg-white/10" />

        <svg
          aria-hidden
          className="absolute left-[12.5%] right-[12.5%] top-0 w-[75%]"
          height="15"
          viewBox="0 0 100 15"
          preserveAspectRatio="none"
        >
          <line
            x1="0"
            y1="7.5"
            x2="100"
            y2="7.5"
            stroke="rgb(255 255 255 / 0.35)"
            strokeWidth="1.5"
            strokeDasharray="12 6"
            strokeDashoffset="800"
            vectorEffect="non-scaling-stroke"
          />
          <line
            ref={lineRef}
            x1="0"
            y1="7.5"
            x2="100"
            y2="7.5"
            stroke="#fff"
            strokeWidth="1.5"
            strokeDasharray="12 6"
            strokeDashoffset="800"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {STEPS.map((stepItem, index) => (
          <motion.div key={stepItem.name} variants={step} className="group">
            <span
              data-process-node
              className="block size-3.5 rotate-45 rounded-[2px] border border-white/40 bg-black transition-colors duration-300 group-hover:bg-white"
            />

            <div className="mt-10">
              <span className="font-mono text-xs text-white/25">
                0{index + 1}
              </span>
              <h3 className="mt-2 text-2xl font-medium tracking-tight">
                {stepItem.name}
              </h3>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/45">
                {stepItem.text}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.ol
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="flex flex-col gap-0 border-t border-white/10 lg:hidden"
      >
        {STEPS.map((stepItem, index) => (
          <motion.li
            key={stepItem.name}
            variants={step}
            className="flex gap-6 border-b border-white/10 py-8"
          >
            <span className="font-mono text-xs text-white/25 pt-1">
              0{index + 1}
            </span>
            <div>
              <h3 className="text-xl font-medium tracking-tight">
                {stepItem.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/45">
                {stepItem.text}
              </p>
            </div>
          </motion.li>
        ))}
      </motion.ol>
    </section>
  );
}

export default ProcessSection;