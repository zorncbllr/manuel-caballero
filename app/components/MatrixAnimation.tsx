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

    const generateDots = () => {
      const dotsArr = [];
      const effectiveSpacing = dotSpacing * scale;
      for (let x = 0; x < width; x += effectiveSpacing) {
        for (let y = 0; y < height; y += effectiveSpacing) {
          dotsArr.push({ x, y });
        }
      }
      return dotsArr;
    };

    const dots = generateDots();
    let animationFrameId: number;

    const animate = (time: number) => {
      // 1. Clear background
      ctx.fillStyle = PALETTE.bg;
      ctx.fillRect(0, 0, width, height);

      // 2. Define wave parameters
      const frequency = 0.006;
      const waveSpeed = time * 0.001;

      // 3. Draw and animate dots
      dots.forEach((dot) => {
        const nx = dot.x * frequency;
        const ny = dot.y * frequency;

        // Combined-wave intensity for shimmering light
        const waveValue =
          Math.sin(nx + ny + waveSpeed) * 0.35 +
          Math.sin(nx * 2.3 - ny * 1.3 + waveSpeed * 1.7) * 0.25 +
          Math.sin(nx * 0.7 + ny * 1.8 + waveSpeed * 0.5) * 0.2 +
          Math.sin(nx * 3.1 - ny * 2.7 - waveSpeed * 1.1) * 0.2;
        const intensity = (waveValue + 1) / 2; // Normalize to 0-1
        // Push toward the extremes for higher contrast
        const contrastAdjusted = Math.max(
          0,
          Math.min(1, (intensity - 0.5) * contrast + 0.5),
        );
        const alpha =
          contrastAdjusted > 0.5
            ? Math.max(0.25, contrastAdjusted)
            : Math.min(0.4, contrastAdjusted);

        // Base color from 3-stop vertical gradient (cream -> light gray -> cyan)
        const mixRatio = dot.y / height;
        const pos = mixRatio * 2;
        const segment = Math.floor(pos);
        const t = pos - segment;
        const a = GradientStops[Math.min(segment, GradientStops.length - 2)];
        const b =
          GradientStops[Math.min(segment + 1, GradientStops.length - 1)];
        const base = {
          r: a.r + (b.r - a.r) * t,
          g: a.g + (b.g - a.g) * t,
          b: a.b + (b.b - a.b) * t,
        };

        // Brightness pulls dim dots to charcoal, bright dots toward off-white
        const dimT = 1 - contrastAdjusted;
        const step1 = {
          r: Charcoal.r + (base.r - Charcoal.r) * (1 - dimT * dimT),
          g: Charcoal.g + (base.g - Charcoal.g) * (1 - dimT * dimT),
          b: Charcoal.b + (base.b - Charcoal.b) * (1 - dimT * dimT),
        };
        const brightT = Math.max(0, contrastAdjusted * 1.2 - 0.2);
        const red = Math.round(
          OffWhite.r + (step1.r - OffWhite.r) * (1 - brightT),
        );
        const green = Math.round(
          OffWhite.g + (step1.g - OffWhite.g) * (1 - brightT),
        );
        const blue = Math.round(
          OffWhite.b + (step1.b - OffWhite.b) * (1 - brightT),
        );

        ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
        ctx.fillRect(dot.x, dot.y, dotSize * scale, dotSize * scale);
      });

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
