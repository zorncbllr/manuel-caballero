"use client";

import { type RefObject, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
  useMotionTemplate,
  type MotionValue,
} from "motion/react";
import SectionHeader from "./SectionHeader";

const NODES = [
  {
    label: "Architecture",
    short: "I take requirements and design the right system.",
  },
  {
    label: "Development",
    short: "I take ideas and turn them into working products.",
  },
  {
    label: "Integrations",
    short: "I take systems and make them work together.",
  },
  {
    label: "Automation",
    short: "I take manual work and turn it into workflows.",
  },
  {
    label: "AI Solutions",
    short: "I take AI and turn it into useful features.",
  },
  {
    label: "Optimization",
    short: "I take working systems and make them better.",
  },
];

const SLOTS = [12, 26, 40, 54, 68, 82];
const DOT_X = 40;
const MERGE_X = 60;
const BUS_Y = 50;
const BUS_END = 90;

const SCATTER = [
  { x: 170, y: 0 },
  { x: -150, y: 0 },
  { x: 210, y: 0 },
  { x: -180, y: 0 },
  { x: 190, y: 0 },
  { x: -230, y: 0 },
];

const GATHER = [
  { x: 260, y: 0 },
  { x: -240, y: 0 },
  { x: 320, y: 0 },
  { x: -280, y: 0 },
  { x: 300, y: 0 },
  { x: -360, y: 0 },
];

const NODE_STEP = 0.10;
const NODE_START = 0.02;
const NODE_FADE = 0.026;
const NODE_END = NODE_START + NODES.length * NODE_STEP;
const MERGE_START = NODE_END;
const MERGE_SETTLE = MERGE_START + 0.06;
const LAST_NODE_START = NODE_START + (NODES.length - 1) * NODE_STEP;
const STAGE_OFFSET = 96;

const CAM_X_KEYS = [0, NODE_START, NODE_END, 0.72, 0.9, 0.97, 1];
const CAM_X_VALS = [0.5, DOT_X / 100, DOT_X / 100, 0.5, 0.5, 0.9, 0.9];

const CAM_SCALE_KEYS = [
  0,
  NODE_START,
  NODE_START + 0.04,
  LAST_NODE_START,
  LAST_NODE_START + 0.04,
  NODE_END,
  0.72,
  0.9,
  0.97,
  1,
];
const CAM_SCALE_VALS = [1, 1, 1.8, 1.8, 2.2, 2.2, 1, 1, 2, 2];

const CAM_Y_KEYS: number[] = [0, NODE_START];
const CAM_Y_VALS: number[] = [0.5, SLOTS[0] / 100];
for (let i = 0; i < NODES.length; i++) {
  const winStart = NODE_START + i * NODE_STEP;
  CAM_Y_KEYS.push(winStart + NODE_STEP - NODE_FADE, winStart + NODE_STEP);
  CAM_Y_VALS.push(
    SLOTS[i] / 100,
    SLOTS[Math.min(i + 1, NODES.length - 1)] / 100,
  );
}
CAM_Y_KEYS.push(0.72, 0.9, 0.97, 1);
CAM_Y_VALS.push(0.5, 0.5, 0.525, 0.525);

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
  const winStart = NODE_START + index * NODE_STEP;
  const fadeIn = useTransform(progress, [winStart, winStart + NODE_FADE], [0, 1]);
  const fadeOut = useTransform(
    progress,
    [winStart + NODE_STEP - NODE_FADE, winStart + NODE_STEP],
    [0, 1],
  );
  const revive = useTransform(
    progress,
    [MERGE_START, MERGE_SETTLE],
    [0, 1],
  );
  const env = useTransform(
    [fadeIn, fadeOut],
    ([a, b]: number[]) => a * (1 - b),
  );
  const opacity = useTransform(
    [env, revive],
    ([e, r]: number[]) => e + r - e * r,
  );
  const scale = useTransform(
    progress,
    [winStart, winStart + NODE_FADE],
    [0.6, 1],
  );

  const { x: sx, y: sy } = SCATTER[index];
  const xEntry = useTransform(progress, [winStart, winStart + 0.036], [sx, 0]);
  const yEntry = useTransform(progress, [winStart, winStart + 0.036], [sy, 0]);

  const { x: gx, y: gy } = GATHER[index];
  const xGather = useTransform(
    progress,
    [0, MERGE_START, MERGE_START + 0.01, MERGE_SETTLE + 0.08],
    [0, 0, gx, 0],
  );
  const yGather = useTransform(
    progress,
    [0, MERGE_START, MERGE_START + 0.01, MERGE_SETTLE + 0.08],
    [0, 0, gy, 0],
  );

  const x = useTransform(
    [xEntry, xGather],
    ([a, b]: number[]) => a + b,
  );
  const y = useTransform(
    [yEntry, yGather],
    ([a, b]: number[]) => a + b,
  );

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
            <span className="font-mono text-xs text-white/30">
              0{index + 1}
            </span>
            <h3 className="text-xl font-medium tracking-tight">{node.label}</h3>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-white/45">
            {node.short}
          </p>
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
  const start = MERGE_SETTLE + 0.1 + index * 0.018;
  const reveal = useTransform(progress, [start, start + 0.018], [0, 1]);
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
  const p = useSpring(progress, { stiffness: 170, damping: 24, mass: 0.35 });

  const [, setPhase] = useState<
    "idle" | "nodes" | "connect" | "flow" | "merge"
  >("idle");
  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(p, "change", (v) => {
    if (v < 0.02) {
      setPhase("idle");
    } else if (v < NODE_END) {
      setPhase("nodes");
      setActiveIndex(
        Math.min(5, Math.floor((v - NODE_START) / NODE_STEP)),
      );
    } else if (v < 0.8) {
      setPhase("connect");
      setActiveIndex(6);
    } else {
      setPhase("merge");
      setActiveIndex(6);
    }
  });

  const curveGroupOpacity = useTransform(p, [0.78, 0.8], [0, 1]);
  const busReveal = useTransform(p, [0.82, 0.9], [0, 1]);
  const plasmaOpacity = useTransform(p, [0.86, 0.94], [0, 1]);
  const destOpacity = useTransform(p, [0.9, 0.98], [0, 1]);
  const destScale = useTransform(p, [0.9, 0.98], [0.4, 1]);

  const camScale = useTransform(p, CAM_SCALE_KEYS, CAM_SCALE_VALS);
  const camX = useTransform(p, CAM_X_KEYS, CAM_X_VALS);
  const camY = useTransform(p, CAM_Y_KEYS, CAM_Y_VALS);

  const camTx = useTransform(camX, (v) => `${((0.5 - v) * 100).toFixed(2)}%`);
  const camTyPct = useTransform(camY, (v) => ((0.5 - v) * 100).toFixed(2));
  const camDrop = useTransform(
    camScale,
    (s) =>
      (
        (STAGE_OFFSET * Math.min(1, Math.max(0, (s - 1) / 0.8))) /
        s
      ).toFixed(2),
  );
  const cam = useMotionTemplate`scale(${camScale}) translate(${camTx}, calc(${camTyPct}% - ${camDrop}px))`;

  return (
    <div className="sticky top-24 relative -mx-40 flex h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-x-0 top-0 z-20 px-40 pt-6">
        <SectionHeader index="01" label="What I Do" hint="6 tasks" />
      </div>

      <div className="relative w-full max-w-3xl h-[calc(100vh-13rem)] min-h-[26rem]">
        <motion.div
          style={{ transform: cam, transformOrigin: "50% 50%", willChange: "transform" }}
          className="absolute inset-0"
        >
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
          className="absolute flex flex-col left-[92%] top-[55%] -translate-x-1/2 whitespace-nowrap"
        >
          <span className="text-center font-medium tracking-tight text-white">
            Reliable, intelligent software
          </span>
          <span className="text-center font-medium tracking-tight text-white">
            that solves real business problems.
          </span>
        </motion.div>
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
    </motion.ol>
  );
}

function WorkflowGraphic() {
  const reduced = useReducedMotion();
  const scrollerRef = useRef<HTMLDivElement>(null);

  if (reduced) {
    return (
      <section className="hidden flex-col gap-10 lg:flex">
        <SectionHeader index="01" label="What I Do" hint="6 tasks" />
        <StoryList />
      </section>
    );
  }

  return (
    <section>
      <div ref={scrollerRef} className="relative hidden h-[700vh] lg:block">
        <StoryCinematic target={scrollerRef} />
      </div>
      <div className="lg:hidden">
        <StoryList />
      </div>
    </section>
  );
}

export default WorkflowGraphic;
