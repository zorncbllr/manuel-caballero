"use client";

import React, { useRef, useEffect } from "react";

const PALETTE = {
  bg: "#000000",
  black: "#07070B",
  charcoal: "#0F0F15",
  darkBrown: "#1E181A",
  darkGray: "#373638",
  mediumGray: "#69696C",
  silver: "#9FA4A6",
  lightGray: "#B7B6B5",
  cream: "#ECE2D7",
  offWhite: "#FCF7F5",
  cyan: "#5F96AD",
};

const hexToRgb = (hex: string) => ({
  r: parseInt(hex.slice(1, 3), 16),
  g: parseInt(hex.slice(3, 5), 16),
  b: parseInt(hex.slice(5, 7), 16),
});

const GradientStops = [
  hexToRgb(PALETTE.cream), // top
  hexToRgb(PALETTE.lightGray), // middle
  hexToRgb(PALETTE.cyan), // bottom
];

const Charcoal = hexToRgb(PALETTE.charcoal);
const OffWhite = hexToRgb(PALETTE.offWhite);

// Wave terms: (spatial-x scale, spatial-y scale, phase-rate, weight)
const WAVES = [
  { ax: 1, ay: 1, rate: 1, weight: 0.35 },
  { ax: 2.3, ay: -1.3, rate: 1.7, weight: 0.25 },
  { ax: 0.7, ay: 1.8, rate: 0.5, weight: 0.2 },
  { ax: 3.1, ay: -2.7, rate: -1.1, weight: 0.2 },
];

// Quantized brightness levels for the per-row color lookup table.
const LEVELS = 24;

const MatrixAnimation = ({
  width = 1920,
  height = 1080,
  dotSpacing = 8,
  dotSize = 2,
  contrast = 1.8,
  scale = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set internal resolution to avoid blur
    canvas.width = width;
    canvas.height = height;

    const frequency = 0.006;
    const effectiveSpacing = dotSpacing * scale;
    const rectSize = dotSize * scale;

    // Precompute static per-dot data: spatial wave trig + color row index.
    // sin(a + t) = sin(a)cos(t) + cos(a)sin(t), so sin/cos of the spatial
    // phase never needs recomputing — only 8 trig calls per frame.
    const rowMap = new Map<number, number>();
    const rowKeys = [];
    const dotColumns: number[] = [];
    for (let x = 0; x < width; x += effectiveSpacing) {
      dotColumns.push(x);
    }
    for (let y = 0; y < height; y += effectiveSpacing) {
      rowMap.set(y, rowKeys.length);
      rowKeys.push(y);
    }

    // Build per-row color lookup tables.
    // Level `l` represents contrastAdjusted = l / (LEVELS - 1).
    const rowColors = rowKeys.map((y) => {
      const mixRatio = y / height;
      const pos = mixRatio * 2;
      const segment = Math.min(Math.floor(pos), GradientStops.length - 2);
      const t = pos - segment;
      const a = GradientStops[segment];
      const b = GradientStops[segment + 1];
      const baseR = a.r + (b.r - a.r) * t;
      const baseG = a.g + (b.g - a.g) * t;
      const baseB = a.b + (b.b - a.b) * t;
      const table = new Array(LEVELS);
      for (let l = 0; l < LEVELS; l++) {
        const ca = l / (LEVELS - 1);
        const alpha = ca > 0.5 ? Math.max(0.25, ca) : Math.min(0.4, ca);
        const dimT = 1 - ca;
        const s1r = Charcoal.r + (baseR - Charcoal.r) * (1 - dimT * dimT);
        const s1g = Charcoal.g + (baseG - Charcoal.g) * (1 - dimT * dimT);
        const s1b = Charcoal.b + (baseB - Charcoal.b) * (1 - dimT * dimT);
        const brightT = Math.max(0, ca * 1.2 - 0.2);
        const r = Math.max(0, Math.min(255, Math.round(OffWhite.r + (s1r - OffWhite.r) * (1 - brightT))));
        const g = Math.max(0, Math.min(255, Math.round(OffWhite.g + (s1g - OffWhite.g) * (1 - brightT))));
        const b2 = Math.max(0, Math.min(255, Math.round(OffWhite.b + (s1b - OffWhite.b) * (1 - brightT))));
        table[l] = `rgba(${r},${g},${b2},${alpha.toFixed(2)})`;
      }
      return table;
    });

    const dotRows = rowKeys.map((y) => {
      const rowIdx = rowMap.get(y)!;
      const nx = y * frequency;
      return dotColumns.map((x) => {
        const ny = x * frequency;
        const wave = WAVES.map((w) => ({
          s: Math.sin(nx * w.ay + ny * w.ax),
          c: Math.cos(nx * w.ay + ny * w.ax),
          weight: w.weight,
        }));
        return { x, y, rowIdx, wave, color: rowColors[rowIdx] };
      });
    });

    let animationFrameId: number;

    const animate = (time: number) => {
      // 1. Clear background
      ctx.fillStyle = PALETTE.bg;
      ctx.fillRect(0, 0, width, height);

      // 2. Time-dependent trig — computed once per frame
      const waveSpeed = time * 0.001;
      const phases = WAVES.map((w) => {
        const t = waveSpeed * w.rate;
        return { s: Math.sin(t), c: Math.cos(t) };
      });

      const levelScale = LEVELS - 1;

      // 3. Draw and animate dots
      for (const row of dotRows) {
        for (const dot of row) {
          // sin(phase + t) = sin(phase)*cos(t) + cos(phase)*sin(t)
          let waveValue = 0;
          for (let i = 0; i < WAVES.length; i++) {
            const w = dot.wave[i];
            const p = phases[i];
            waveValue += (w.s * p.c + w.c * p.s) * w.weight;
          }
          // contrastAdjusted = clamp(waveValue * contrast / 2 + 0.5)
          let ca = waveValue * (contrast * 0.5) + 0.5;
          ca = ca < 0 ? 0 : ca > 1 ? 1 : ca;
          const level = (ca * levelScale + 0.5) | 0;
          ctx.fillStyle = dot.color[level];
          ctx.fillRect(dot.x, dot.y, rectSize, rectSize);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [width, height, dotSpacing, dotSize, contrast, scale]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "auto",
        aspectRatio: `${width} / ${height}`,
        display: "block",
      }}
    />
  );
};

export default MatrixAnimation;