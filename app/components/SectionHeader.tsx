"use client";

import { motion } from "motion/react";

function SectionHeader({
  index,
  label,
  hint,
}: {
  index: string;
  label: string;
  hint?: string;
}) {
  return (
    <div className="flex items-center gap-6">
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
        className="font-mono text-xs text-white/30"
      >
        {index}
      </motion.span>

      <motion.span
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const, delay: 0.05 }}
        className="text-xs font-medium uppercase tracking-[0.3em] text-white/40"
      >
        {label}
      </motion.span>

      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const, delay: 0.1 }}
        className="h-px flex-1 origin-left bg-white/10"
      />

      {hint ? (
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-mono text-xs text-white/25"
        >
          {hint}
        </motion.span>
      ) : null}
    </div>
  );
}

export default SectionHeader;