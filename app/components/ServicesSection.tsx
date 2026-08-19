"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import type { MouseEvent } from "react";
import SectionHeader from "./SectionHeader";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const SERVICES = [
  {
    title: "AI Solutions",
    blurb:
      "Custom LLM agents, retrieval pipelines, and AI features embedded straight into your product — from prototype to production.",
    tags: ["LLM Agents", "RAG Pipelines", "Fine-tuning"],
  },
  {
    title: "Workflow Automations",
    blurb:
      "End-to-end n8n workflows that connect your tools and quietly eliminate the manual busywork between them.",
    tags: ["n8n", "Integrations", "Webhooks"],
  },
  {
    title: "Scalable Software Systems",
    blurb:
      "Full-stack platforms and APIs engineered to stay fast, observable, and dependable as you grow.",
    tags: ["Next.js", "TypeScript", "Postgres"],
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const row = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

function trackSpotlight(e: MouseEvent<HTMLDivElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
}

function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const spineFillRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        spineFillRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top center",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "bottom 70%",
            scrub: true,
          },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section id="services" className="flex flex-col gap-10">
      <SectionHeader index="02" label="What I Do" hint="3 capabilities" />

      <div ref={sectionRef} className="relative">
        {/* scroll progress spine */}
        <div className="absolute left-0 top-0 h-full w-px bg-white/10" />
        <div
          ref={spineFillRef}
          className="absolute left-0 top-0 h-full w-px bg-white/60"
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="ml-10 divide-y divide-white/10 border-y border-white/10"
        >
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.title}
              variants={row}
              onMouseMove={trackSpotlight}
              className="group relative grid grid-cols-12 items-center gap-x-8 gap-y-4 px-6 py-14 transition-colors duration-500"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(560px circle at var(--mx, 50%) var(--my, 50%), rgb(255 255 255 / 0.04), transparent 70%)",
                }}
              />

              <span className="col-span-1 font-mono text-xs text-white/30">
                0{index + 1}
              </span>

              <h3 className="col-span-6 flex items-center gap-5 text-4xl font-medium tracking-tight transition-transform duration-500 group-hover:translate-x-2 md:text-5xl">
                {service.title}
                <ArrowUpRight className="size-7 -translate-x-3 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
              </h3>

              <div className="col-span-5 flex flex-col items-start gap-6">
                <p className="max-w-md text-sm leading-relaxed text-white/45">
                  {service.blurb}
                </p>

                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-white/40 transition-colors duration-300 group-hover:text-white/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default ServicesSection;
