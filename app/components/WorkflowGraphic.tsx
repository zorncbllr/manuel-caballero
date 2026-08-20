"use client";

import { type RefObject, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import SectionHeader from "./SectionHeader";

const NODES = [
  { label: "Data Entry", short: "Same numbers, same sheets — by hand." },
  {
    label: "Invoicing & Billing",
    short: "Chased, re-sent, reconciled by hand.",
  },
  { label: "Email Triage", short: "Same inbox, same answers — typed again." },
  { label: "Reporting", short: "Rebuilt from scattered numbers." },
  { label: "Scheduling", short: "Every call coordinated by hand." },
  { label: "Follow-ups & Claims", short: "Loose ends chased every week." },
];

const SLOTS = [12, 26, 40, 54, 68, 82];
const DOT_X = 40;
const MERGE_X = 60;
const BUS_Y = 50;
const BUS_END = 90;

const SCATTER = [
  { x: 260, y: -110 },
  { x: -160, y: 120 },
  { x: 340, y: -70 },
  { x: 60, y: 140 },
  { x: 300, y: -130 },
  { x: 580, y: -32 },
];

function curveD(i: number) {
  const y = SLOTS[i];
  return `M ${DOT_X} ${y} C ${DOT_X + 8} ${y}, ${MERGE_X - 7} ${BUS_Y}, ${MERGE_X} ${BUS_Y}`;
}

function NodeItem({
  node,
  index,
  progress,
  lit,
}: {
  node: (typeof NODES)[number];
  index: number;
  progress: MotionValue<number>;
  lit: boolean;
}) {
  const start = 0.02 + index * 0.065;
  const enter = useTransform(progress, [start, start + 0.05], [0, 1]);
  const opacity = enter;
  const scale = useTransform(enter, [0, 1], [0.4, 1]);
  const { x: sx, y: sy } = SCATTER[index];

  const x = useTransform(progress, [0, 0.42, 0.52, 1], [sx, sx, 0, 0]);
  const y = useTransform(progress, [0, 0.42, 0.52, 1], [sy, sy, 0, 0]);

return (
    <>
      <motion.span
        style={{ opacity, scale, x, y, top: `${SLOTS[index]}%` }}
        className="absolute left-[40%] z-10 -ml-[7px] -mt-[7px] block size-3.5 rounded-full border border-white/30"
      >
        <span
          className={`block size-full rounded-full transition-all duration-500 ${
            lit
              ? "bg-white shadow-[0_0_16px_3px_rgba(255,255,255,0.55)]"
              : "bg-white/25"
          }`}
        />
      </motion.span>

      <div
        style={{ top: `${SLOTS[index]}%` }}
        className="absolute left-0 w-[36%] -translate-y-1/2"
      >
        <motion.div style={{ opacity, x, y }}>
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-xs text-white/30">0{index + 1}</span>
            <h3 className="text-xl font-medium tracking-tight">{node.label}</h3>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-white/45">{node.short}</p>
        </motion.div>
      </div>
    </>
  );
}

function NodeCurve({
  index,
  progress,
}: {
  index: number;
  progress: MotionValue<number>;
}) {
  const d = curveD(index);
  const start = 0.52 + index * 0.012;
  const reveal = useTransform(progress, [start, start + 0.012], [0, 1]);
  return (
    <>
      <path
        d={d}
        fill="none"
        stroke="rgba(255,255,255,0.10)"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
      <motion.path
        d={d}
        fill="none"
        stroke="#fff"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        style={{ pathLength: reveal }}
      />
    </>
  );
}

function StoryCinematic({
  target,
}: {
  target: RefObject<HTMLDivElement | null>;
}) {
  const progress = useScroll({
    target,
    offset: ["start start", "end end"],
  }).scrollYProgress;
  const p = useSpring(progress, { stiffness: 95, damping: 32, mass: 0.5 });

  const [phase, setPhase] = useState<
    "idle" | "nodes" | "connect" | "flow" | "merge"
  >("idle");
  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(p, "change", (v) => {
    if (v < 0.02) {
      setPhase("idle");
    } else if (v < 0.4) {
      setPhase("nodes");
      setActiveIndex(Math.min(5, Math.floor((v - 0.02) / 0.065)));
    } else if (v < 0.8) {
      setPhase("connect");
      setActiveIndex(6);
    } else {
      setPhase("merge");
      setActiveIndex(6);
    }
  });

  const curveGroupOpacity = useTransform(p, [0.52, 0.54], [0, 1]);
  const busReveal = useTransform(p, [0.6, 0.7], [0, 1]);
  const plasmaOpacity = useTransform(p, [0.64, 0.72], [0, 1]);
  const destOpacity = useTransform(p, [0.78, 0.86], [0, 1]);
  const destScale = useTransform(p, [0.78, 0.86], [0.4, 1]);

  return (
    <div className="sticky top-24 relative flex h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-x-0 top-0 z-20 pt-6">
        <SectionHeader index="01" label="The Problem" hint="6 tasks" />
      </div>

      <div className="relative w-full max-w-3xl h-[calc(100vh-13rem)] min-h-[26rem]">
        {/* curved connectors + horizontal merge line (behind nodes) */}
        <svg
          aria-hidden
          className="absolute inset-0 z-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="wfPlasma"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2="100"
              y2="0"
            >
              <stop offset="0" stopColor="rgba(255,255,255,0.9)" />
              <stop offset="0.5" stopColor="rgba(196,181,253,0.55)" />
              <stop offset="1" stopColor="rgba(255,255,255,0.9)" />
            </linearGradient>
            <filter id="wfSoft" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" />
            </filter>
          </defs>

          <motion.g style={{ opacity: curveGroupOpacity }}>
            {NODES.map((_, i) => (
              <NodeCurve key={i} index={i} progress={p} />
            ))}
          </motion.g>

          <motion.path
            d={`M ${MERGE_X} ${BUS_Y} H ${BUS_END}`}
            fill="none"
            stroke="#fff"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
            style={{ pathLength: busReveal }}
          />

          {/* plasma energy flows through the single merged line */}
          <motion.g style={{ opacity: plasmaOpacity }}>
            <g filter="url(#wfSoft)">
              <path
                d={`M ${MERGE_X} ${BUS_Y} H ${BUS_END}`}
                fill="none"
                stroke="url(#wfPlasma)"
                strokeWidth="7"
                vectorEffect="non-scaling-stroke"
                className="animate-plasma-drift"
              />
            </g>
            <path
              d={`M ${MERGE_X} ${BUS_Y} H ${BUS_END}`}
              fill="none"
              stroke="#fff"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              opacity="0.9"
            />
          </motion.g>
        </svg>

        {/* nodes, aligned left once the scatter settles */}
        {NODES.map((node, i) => (
          <NodeItem
            key={node.label}
            node={node}
            index={i}
            progress={p}
            lit={i <= activeIndex}
          />
        ))}

        {/* energy orbs travelling the merged horizontal line */}
        <motion.div
          style={{ opacity: plasmaOpacity }}
          aria-hidden
          className="absolute left-[60%] top-1/2 h-px w-[30%] -ml-1"
        >
          <span className="animate-orb-x absolute left-0 top-0 -mt-[3px] block size-1.5 rounded-full bg-white shadow-[0_0_12px_4px_rgba(255,255,255,0.8)]" />
          <span
            className="animate-orb-x absolute left-0 top-0 -mt-[3px] block size-1.5 rounded-full bg-white shadow-[0_0_12px_4px_rgba(255,255,255,0.8)]"
            style={{ animationDelay: "1.4s" }}
          />
        </motion.div>

        {/* merge point: where the 6 lines become one */}
        <motion.div
          style={{ opacity: plasmaOpacity }}
          aria-hidden
          className="absolute left-[60%] top-1/2 -ml-[6px] -mt-[6px] z-10"
        >
          <span className="animate-pulse-dot block size-3 rounded-full bg-white shadow-[0_0_16px_4px_rgba(255,255,255,0.6)]" />
        </motion.div>

        {/* destination: one workflow */}
        <motion.div
          style={{ opacity: destOpacity, scale: destScale }}
          className="absolute left-[90%] top-1/2 -ml-[18px] -mt-[18px] z-10"
        >
          <span className="relative block">
            <span className="animate-pulse-dot absolute inset-0 rounded-full bg-white/25 blur-md" />
            <span className="relative block size-7 rounded-full bg-white shadow-[0_0_26px_8px_rgba(255,255,255,0.5)]" />
          </span>
        </motion.div>
        <motion.div
          style={{ opacity: destOpacity }}
          className="absolute left-[90%] top-[58%] -translate-x-1/2 whitespace-nowrap"
        >
          <span className="font-mono text-xs text-white/30">
            {phase === "merge" ? "✓ " : ""}
          </span>
          <span className="text-base font-medium tracking-tight text-white">
            One Automated Workflow
          </span>
        </motion.div>
      </div>
    </div>
  );
}

function StoryList() {
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
  };

  const row = {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <motion.ol
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="flex flex-col border-y border-white/10"
    >
      {NODES.map((node, index) => (
        <motion.li
          variants={row}
          key={node.label}
          className="flex gap-6 border-b border-white/10 py-7"
        >
          <span className="font-mono text-xs text-white/25 pt-1">
            0{index + 1}
          </span>
          <div>
            <h3 className="text-xl font-medium tracking-tight">{node.label}</h3>
            <p className="mt-1 text-sm leading-relaxed text-white/45">
              {node.short}
            </p>
          </div>
        </motion.li>
      ))}
      <motion.li variants={row} className="flex gap-6 py-7">
        <span className="font-mono text-xs text-white/30 pt-1">→</span>
        <div>
          <h3 className="text-xl font-medium tracking-tight text-white">
            One Automated Workflow
          </h3>
        </div>
      </motion.li>
    </motion.ol>
  );
}

function WorkflowGraphic() {
  const reduced = useReducedMotion();
  const scrollerRef = useRef<HTMLDivElement>(null);

  if (reduced) {
    return (
      <section className="hidden flex-col gap-10 lg:flex">
        <SectionHeader index="01" label="The Problem" hint="6 tasks" />
        <StoryList />
      </section>
    );
  }

  return (
    <section>
      <div ref={scrollerRef} className="relative hidden h-[440vh] lg:block">
        <StoryCinematic target={scrollerRef} />
      </div>
      <div className="lg:hidden">
        <StoryList />
      </div>
    </section>
  );
}

export default WorkflowGraphic;
