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
        className="font-mono text-xl text-white/30"
      >
        {index}
      </motion.span>

      <motion.span
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{
          duration: 0.5,
          ease: [0.16, 1, 0.3, 1] as const,
          delay: 0.05,
        }}
        className="text-6xl font-medium capitalize text-white"
      >
        {label}
      </motion.span>
    </div>
  );
}

export default SectionHeader;
