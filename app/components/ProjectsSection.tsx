"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { MouseEvent, ReactNode } from "react";
import SectionHeader from "./SectionHeader";

// ── Placeholder data — swap in your real projects ──────────────────────────
const FEATURED = {
  name: "Agentic Support Desk",
  category: "AI Agent · SaaS",
  year: "2026",
  tagline:
    "An autonomous support agent that resolves tickets end-to-end from your knowledge base.",
  stack: ["n8n", "OpenAI", "RAG", "Postgres"],
  href: "#",
};

const PROJECTS = [
  {
    id: "market",
    name: "Market Intel Agent",
    category: "AI Research",
    year: "2025",
    graphic: "radar" as const,
    href: "#",
  },
  {
    id: "ops",
    name: "Ops Dashboard",
    category: "Full-Stack Platform",
    year: "2024",
    graphic: "equalizer" as const,
    href: "#",
  },
  {
    id: "invoice",
    name: "Invoice Automator",
    category: "Workflow Automation",
    year: "2025",
    graphic: "receipt" as const,
    href: "#",
  },
];
// ────────────────────────────────────────────────────────────────────────────

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const row = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

function trackSpotlight(e: MouseEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
}

function SpotlightOverlay() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      style={{
        background:
          "radial-gradient(480px circle at var(--mx, 50%) var(--my, 50%), rgb(255 255 255 / 0.05), transparent 70%)",
      }}
    />
  );
}

const FEATURE_NODES = [
  { x: 84, y: 58 },
  { x: 84, y: 202 },
  { x: 292, y: 36 },
  { x: 292, y: 224 },
  { x: 500, y: 58 },
  { x: 500, y: 202 },
];

function PipelineGraph({ hover }: { hover: boolean }) {
  const hub = { x: 292, y: 130 };
  return (
    <svg viewBox="0 0 584 260" className="h-full w-full">
      <defs>
        <radialGradient id="pipeline-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5F96AD" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#5F96AD" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx={hub.x} cy={hub.y} r="120" fill="url(#pipeline-glow)" />

      {FEATURE_NODES.map((node, i) => (
        <line
          key={`e${i}`}
          x1={hub.x}
          y1={hub.y}
          x2={node.x}
          y2={node.y}
          className="animate-flow"
          stroke="rgb(255 255 255 / 0.25)"
          strokeWidth="1"
          strokeDasharray="5 7"
        />
      ))}

      {FEATURE_NODES.map((node, i) => (
        <rect
          key={i}
          x={node.x - 4}
          y={node.y - 4}
          width="8"
          height="8"
          transform={`rotate(45 ${node.x} ${node.y})`}
          fill="#000"
          stroke="rgb(255 255 255 / 0.55)"
          strokeWidth="1"
        />
      ))}

      <circle cx={hub.x} cy={hub.y} r="5" fill="#5F96AD" className="animate-pulse-dot" />
    </svg>
  );
}

function RadarGraphic() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[75%]">
      {[100, 72, 46, 18].map((r) => (
        <span
          key={r}
          className="absolute rounded-full border border-white/12"
          style={{ inset: `${(100 - r) / 2}%` }}
        />
      ))}
      <span
        aria-hidden
        className="animate-radar absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, rgb(95 150 173 / 0.3), transparent 60deg)",
        }}
      />
      {[
        { top: "28%", left: "64%", d: 0 },
        { top: "58%", left: "38%", d: 0.3 },
        { top: "68%", left: "70%", d: 0.6 },
      ].map((blip, i) => (
        <span
          key={i}
          className="animate-pulse-dot absolute size-1.5 rounded-full bg-[#5F96AD]"
          style={{ top: blip.top, left: blip.left, animationDelay: `${blip.d}s` }}
        />
      ))}
      <span className="absolute left-[2px] top-1/2 h-px w-1/2 -translate-y-1/2 bg-white/30" />
    </div>
  );
}

function EqualizerGraphic() {
  const bars = [0.4, 0.95, 0.6, 1, 0.7, 0.85, 0.5, 0.95, 0.62, 0.78, 0.45, 0.9];
  return (
    <div className="flex h-full items-end justify-center gap-1.5">
      {bars.map((b, i) => (
        <span
          key={i}
          className="animate-eq w-1.5 origin-bottom rounded-full bg-white/70"
          style={{ height: `${b * 88}%`, animationDelay: `${i * 0.08}s` }}
        />
      ))}
    </div>
  );
}

const RECEIPT_LINES = [
  "INVOICE #1042",
  "ACME CORP",
  "AUTOPAY .................... ON",
  "TOTAL ................... $4,200",
  "STATUS .................. PAID",
];

function ReceiptGraphic() {
  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden"
      style={{ fontFamily: "var(--font-mono), monospace" }}
    >
      <div className="animate-receipt-scroll flex flex-col gap-2 py-2 opacity-70">
        {[...RECEIPT_LINES, ...RECEIPT_LINES].map((line, i) => (
          <span key={i} className="whitespace-nowrap text-xs text-white/70">
            {line}
          </span>
        ))}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-5 bg-gradient-to-r from-black to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-5 bg-gradient-to-l from-black to-transparent"
      />
    </div>
  );
}

function Cell({
  children,
  className = "",
  href,
  label,
  name,
  arrow = true,
}: {
  children: ReactNode;
  className?: string;
  href: string;
  label: string;
  name: string;
  arrow?: boolean;
}) {
  return (
    <Link
      href={href}
      onMouseMove={trackSpotlight}
      className={`group relative flex flex-col overflow-hidden rounded-lg border border-white/10 transition-colors duration-500 hover:border-white/25 ${className}`}
    >
      <SpotlightOverlay />
      {children}

      <div className="relative flex items-center justify-between border-t border-white/10 px-6 py-5">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 transition-colors duration-300 group-hover:text-white/70">
            {label}
          </span>
          <h4 className="mt-1 flex items-center gap-3 text-xl font-medium tracking-tight md:text-2xl">
            {name}
          </h4>
        </div>
        {arrow ? (
          <ArrowUpRight className="size-6 -translate-x-2 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
        ) : null}
      </div>
    </Link>
  );
}

function FeaturedCell() {
  return (
    <Link
      href={FEATURED.href}
      onMouseMove={trackSpotlight}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-white/10 transition-colors duration-500 hover:border-white/25"
    >
      <SpotlightOverlay />

      <div className="relative flex h-full min-h-64 flex-1 flex-col justify-center overflow-hidden px-8 py-10">
        <div className="mr-[-12px]">
          <PipelineGraph hover />
        </div>
        <span className="absolute left-6 top-5 font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">
          Fig. 01 — live pipeline
        </span>
        <span className="absolute right-6 top-5 font-mono text-xs text-white/30">
          {FEATURED.year}
        </span>
      </div>

      <div className="relative border-t border-white/10 px-8 py-7">
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 transition-colors duration-300 group-hover:text-white/70">
          {FEATURED.category}
        </span>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
          <h3 className="flex items-center gap-3 text-3xl font-medium tracking-tight md:text-4xl">
            {FEATURED.name}
            <ArrowUpRight className="size-6 -translate-x-3 -translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
          </h3>
        </div>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/45">
          {FEATURED.tagline}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {FEATURED.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-white/40"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

function ProjectGraphic({ type }: { type: "radar" | "equalizer" | "receipt" }) {
  if (type === "radar") return <RadarGraphic />;
  if (type === "equalizer") return <EqualizerGraphic />;
  return <ReceiptGraphic />;
}

function ProjectsSection() {
  return (
    <section id="work" className="flex flex-col gap-10">
      <SectionHeader index="05" label="Selected Work" hint="04 projects" />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 gap-6 md:grid-cols-12 md:grid-rows-[repeat(2,minmax(0,22rem))]"
      >
        <motion.div variants={row} className="md:col-span-7 md:row-span-2">
          <FeaturedCell />
        </motion.div>

        <motion.div variants={row} className="md:col-span-5">
          <Cell
            href="#"
            label="AI Research · 2025"
            name="Market Intel Agent"
            className="h-full"
          >
            <div
              className="flex h-full items-center justify-center overflow-hidden px-6 py-8"
              aria-hidden
            >
              <RadarGraphic />
            </div>
          </Cell>
        </motion.div>

        <motion.div variants={row} className="md:col-span-5">
          <Cell
            href="#"
            label="Full-Stack Platform · 2024"
            name="Ops Dashboard"
            className="h-full"
          >
            <div
              className="flex h-full items-center overflow-hidden px-8 pt-6"
              aria-hidden
            >
              <EqualizerGraphic />
            </div>
          </Cell>
        </motion.div>

        <motion.div variants={row} className="md:col-span-12">
          <Cell
            href="#"
            label="Workflow Automation · 2025"
            name="Invoice Automator"
            className="h-full md:flex-row"
          >
            <div
              className="relative h-32 w-full shrink-0 overflow-hidden border-b border-white/10 md:h-auto md:w-64 md:border-b-0 md:border-r"
              aria-hidden
            >
              <ReceiptGraphic />
            </div>
            <p className="hidden flex-1 items-center px-8 text-sm leading-relaxed text-white/45 md:flex">
              Pays &amp; files invoices automatically from incoming emails —
              with line-item extraction and error fallbacks.
            </p>
          </Cell>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default ProjectsSection;