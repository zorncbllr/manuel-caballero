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
  distortionIntensity = 3.5,
  distortionRadius = 32,
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

    // Precompute static grid geometry: row y positions, column x positions,
    // and per-row color lookup tables.
    const rowKeys: number[] = [];
    const dotColumns: number[] = [];
    for (let x = 0; x < width; x += effectiveSpacing) {
      dotColumns.push(x);
    }
    for (let y = 0; y < height; y += effectiveSpacing) {
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

    // A flat per-dot wave field so we can displace samples cheaply.
    const freqF = frequency;
    const spacing = effectiveSpacing;
    const cols = dotColumns.length;
    const rows = rowKeys.length;
    const total = cols * rows;

    // Per-dot spatial trig flattened as [dot][wave].
    const waveSin = new Float32Array(total * WAVES.length);
    const waveCos = new Float32Array(total * WAVES.length);
    {
      let i = 0;
      for (let r = 0; r < rows; r++) {
        const nx = rowKeys[r] * freqF;
        for (let c = 0; c < cols; c++) {
          const ny = dotColumns[c] * freqF;
          for (let w = 0; w < WAVES.length; w++) {
            const ph = nx * WAVES[w].ay + ny * WAVES[w].ax;
            waveSin[i] = Math.sin(ph);
            waveCos[i] = Math.cos(ph);
            i++;
          }
        }
      }
    }

    // Per-dot current wave value, plus a tiny interactive fluid field.
    // `velX/velY` is a per-cell velocity field the cursor stirs with vortex
    // forces; `offX/offY` is how far (in cells) the dot's color sample is
    // warped from its home spot. The dots stay planted — it's the brightness
    // pattern that gets bent and swirled around the cursor like stirred smoke.
    const field = new Float32Array(total);
    const velX = new Float32Array(total);
    const velY = new Float32Array(total);
    const offX = new Float32Array(total);
    const offY = new Float32Array(total);
    const weights = WAVES.map((w) => w.weight);

    let animationFrameId: number;

    // Cursor state. `target` is the raw pointer position (in canvas
    // resolution); `cursor` is a smoothed approximation that trails behind so
    // the distortion follows the movement instead of snapping to it.
    let targetX: number | null = null;
    let targetY: number | null = null;
    let cursorX = -100000;
    let cursorY = -100000;
    let prevCursorX = cursorX;
    let prevCursorY = cursorY;
    let cursorStrength = 0;
    let hasMoved = false;

    const handleMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      targetX = (e.clientX - rect.left) * (width / rect.width);
      targetY = (e.clientY - rect.top) * (height / rect.height);
      cursorStrength = 1;
      // First interaction: snap the smoothed cursor to the pointer instead of
      // lerping from the off-canvas start position, otherwise the effect only
      // catches up ~a second later.
      if (!hasMoved) {
        hasMoved = true;
        cursorX = targetX;
        cursorY = targetY;
        prevCursorX = cursorX;
        prevCursorY = cursorY;
      }
    };

    const handleLeave = () => {
      targetX = null;
      targetY = null;
    };

    canvas.addEventListener("mousemove", handleMove);
    canvas.addEventListener("mouseleave", handleLeave);

    // Bilinear sample of a per-cell field at fractional grid coords, used for
    // self-advection of the velocity field (semi-Lagrangian trace-back).
    const bilinear = (
      arr: Float32Array,
      ix00: number,
      ix10: number,
      ix01: number,
      ix11: number,
      fx: number,
      fy: number,
    ) => {
      const wx = 1 - fx;
      const wy = 1 - fy;
      return (
        wx * wy * arr[ix00] +
        fx * wy * arr[ix10] +
        wx * fy * arr[ix01] +
        fx * fy * arr[ix11]
      );
    };

    // Separable (horizontal then vertical) box diffusion that smooths a field
    // in place — the key to keeping the warp fluid and coherent.
    const blurBuf = new Float32Array(total);
    const blurField = (src: Float32Array, tmp: Float32Array) => {
      for (let r = 0; r < rows; r++) {
        const rowBase = r * cols;
        for (let c = 0; c < cols; c++) {
          const i = rowBase + c;
          const l = c > 0 ? src[i - 1] : src[i];
          const rgt = c < cols - 1 ? src[i + 1] : src[i];
          tmp[i] = (src[i] * 2 + l + rgt) * 0.25;
        }
      }
      for (let r = 0; r < rows; r++) {
        const rowBase = r * cols;
        for (let c = 0; c < cols; c++) {
          const i = rowBase + c;
          const u = r > 0 ? tmp[i - cols] : tmp[i];
          const d = r < rows - 1 ? tmp[i + cols] : tmp[i];
          src[i] = (tmp[i] * 2 + u + d) * 0.25;
        }
      }
    };

    const animate = (time: number) => {
      // 0. Advance smoothed cursor toward the target, decay presence over time
      if (targetX !== null && targetY !== null) {
        cursorX += (targetX - cursorX) * 0.15;
        cursorY += (targetY - cursorY) * 0.15;
      }
      cursorStrength *= 0.96;

      // 1. Time-dependent trig — computed once per frame
      const waveSpeed = time * 0.001;
      const phases = WAVES.map((w) => {
        const t = waveSpeed * w.rate;
        return { s: Math.sin(t), c: Math.cos(t) };
      });
      const shimmerPhase = time * 0.004;

      // 2. Relax the fluid: sample offsets spring back slowly so the stir lingers,
      // velocity dissipates gently.
      for (let i = 0; i < total; i++) {
        offX[i] *= 0.97;
        offY[i] *= 0.97;
        velX[i] *= 0.99;
        velY[i] *= 0.99;
      }

      // 3. Stir: a tight vortex that clings to the cursor. Localized tangential
      // forces spin the sampling around the pointer while a direct jolt pushes
      // it immediately, so even a slow hover churns like rubbing silk.
      const dist = Math.hypot(cursorX - prevCursorX, cursorY - prevCursorY);
      const speed = Math.min(1, dist / 120);
      const dirX = dist > 1e-3 ? (cursorX - prevCursorX) / dist : 0;
      const dirY = dist > 1e-3 ? (cursorY - prevCursorY) / dist : 0;
      const locality = 32 / distortionRadius;
      const spinForce = (0.35 + 0.65 * speed) * distortionIntensity * cursorStrength * locality;
      const directForce = spinForce * 0.22;
      const wakeForce = speed * speed * distortionIntensity * cursorStrength * 1.2 * locality;
      const steps = Math.min(Math.max(1, Math.round(dist / (spacing * 0.5))), 32);
      const radiusCells = Math.max(1, Math.round(distortionRadius / spacing));
      const invRadiusSq = 1 / (distortionRadius * distortionRadius);
      if (cursorStrength > 0.02) {
        for (let s = 0; s <= steps; s++) {
          const px = prevCursorX + ((cursorX - prevCursorX) * s) / steps;
          const py = prevCursorY + ((cursorY - prevCursorY) * s) / steps;
          const cc = Math.round(px / spacing);
          const cr = Math.round(py / spacing);
          for (let dr = -radiusCells; dr <= radiusCells; dr++) {
            const prow = cr + dr;
            if (prow < 0 || prow >= rows) continue;
            const rowBase = prow * cols;
            for (let dc = -radiusCells; dc <= radiusCells; dc++) {
              const pcol = cc + dc;
              if (pcol < 0 || pcol >= cols) continue;
              const cellDx = dc * spacing;
              const cellDy = dr * spacing;
              const d2 = cellDx * cellDx + cellDy * cellDy;
              const env = Math.exp(-d2 * invRadiusSq);
              if (env < 0.005) continue;
              const idx = rowBase + pcol;
              // Tangential force → dots curl around the cursor. The spin
              // wobbles smoothly with distance so the vortex stays coherent.
              const invD = 1 / (Math.sqrt(d2) + 1e-6);
              const spin = Math.sin(shimmerPhase + Math.sqrt(d2) * 0.03);
              velX[idx] += -cellDy * invD * env * spinForce * (0.6 + spin * 0.4);
              velY[idx] += cellDx * invD * env * spinForce * (0.6 + spin * 0.4);
              // Direct churn: kick the sampling immediately so the response
              // feels instant, not laggy.
              offX[idx] -= cellDy * invD * env * directForce;
              offY[idx] += cellDx * invD * env * directForce;
              // Directional wake: pull samples against the motion so a fast
              // left→right pass drags a colored smear behind it.
              offX[idx] -= dirX * env * wakeForce;
              offY[idx] -= dirY * env * wakeForce;
            }
          }
        }
      }
      prevCursorX = cursorX;
      prevCursorY = cursorY;

      // 4. Advect the velocity field with itself (trace-back + bilinear
      // sample) so eddies keep swirling on their own after the cursor passes.
      for (let r = 0; r < rows; r++) {
        const rowBase = r * cols;
        for (let c = 0; c < cols; c++) {
          const idx = rowBase + c;
          const sx = c - velX[idx] * 0.12;
          const sy = r - velY[idx] * 0.12;
          const sc = sx < 0 ? 0 : sx > cols - 1 ? cols - 1 : sx;
          const sr = sy < 0 ? 0 : sy > rows - 1 ? rows - 1 : sy;
          const x0 = sc | 0;
          const y0 = sr | 0;
          const x1 = x0 + 1 < cols ? x0 + 1 : x0;
          const y1 = y0 + 1 < rows ? y0 + 1 : y0;
          const fx = sc - x0;
          const fy = sr - y0;
          const ix00 = y0 * cols + x0;
          const ix10 = y0 * cols + x1;
          const ix01 = y1 * cols + x0;
          const ix11 = y1 * cols + x1;
          velX[idx] = bilinear(velX, ix00, ix10, ix01, ix11, fx, fy);
          velY[idx] = bilinear(velY, ix00, ix10, ix01, ix11, fx, fy);
        }
      }

      // 5. Advect the sample offsets with the velocity, then diffuse them so the
      // warp field stays spatially smooth — this is what makes the stirring
      // read as fluid instead of flickery.
      const maxOffset = 5;
      for (let i = 0; i < total; i++) {
        let vx = velX[i] > 5 ? 5 : velX[i] < -5 ? -5 : velX[i];
        let vy = velY[i] > 5 ? 5 : velY[i] < -5 ? -5 : velY[i];
        let dx = offX[i] + vx * 0.35;
        let dy = offY[i] + vy * 0.35;
        dx = dx > maxOffset ? maxOffset : dx < -maxOffset ? -maxOffset : dx;
        dy = dy > maxOffset ? maxOffset : dy < -maxOffset ? -maxOffset : dy;
        offX[i] = dx;
        offY[i] = dy;
      }
      blurField(offX, blurBuf);
      blurField(offY, blurBuf);

      // 6. Clear background
      ctx.fillStyle = PALETTE.bg;
      ctx.fillRect(0, 0, width, height);

      // 7. Compute the undistorted per-dot wave value.
      {
        let i = 0;
        for (let r = 0; r < rows; r++) {
          const rowBase = r * cols;
          for (let c = 0; c < cols; c++, i += WAVES.length) {
            // sin(phase + t) = sin(phase)*cos(t) + cos(phase)*sin(t)
            let waveValue = 0;
            for (let w = 0; w < WAVES.length; w++) {
              const p = phases[w];
              waveValue += (waveSin[i + w] * p.c + waveCos[i + w] * p.s) * weights[w];
            }
            field[rowBase + c] = waveValue;
          }
        }
      }

      // 8. Draw dots at fixed positions, sampling the wave field at a slightly
      // warped location so the color pattern swirls and bends like smoke.
      const levelScale = LEVELS - 1;
      for (let r = 0; r < rows; r++) {
        const y = rowKeys[r];
        const rowBase = r * cols;
        const color = rowColors[r];
        for (let c = 0; c < cols; c++) {
          const idx = rowBase + c;
          const sfx = c + offX[idx];
          const sfy = r + offY[idx];
          const sc0 = sfx < 0 ? 0 : sfx > cols - 1 ? cols - 1 : sfx;
          const sr0 = sfy < 0 ? 0 : sfy > rows - 1 ? rows - 1 : sfy;
          const x0 = sc0 | 0;
          const y0 = sr0 | 0;
          const x1 = x0 + 1 < cols ? x0 + 1 : x0;
          const y1 = y0 + 1 < rows ? y0 + 1 : y0;
          const fx = sc0 - x0;
          const fy = sr0 - y0;
          const ix00 = y0 * cols + x0;
          const ix10 = y0 * cols + x1;
          const ix01 = y1 * cols + x0;
          const ix11 = y1 * cols + x1;
          const sampled = bilinear(field, ix00, ix10, ix01, ix11, fx, fy);
          let ca = sampled * (contrast * 0.5) + 0.5;
          ca = ca < 0 ? 0 : ca > 1 ? 1 : ca;
          const level = (ca * levelScale + 0.5) | 0;
          ctx.fillStyle = color[level];
          ctx.fillRect(dotColumns[c], y, rectSize, rectSize);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("mousemove", handleMove);
      canvas.removeEventListener("mouseleave", handleLeave);
    };
  }, [width, height, dotSpacing, dotSize, contrast, scale, distortionIntensity, distortionRadius]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "auto",
        aspectRatio: `${width} / ${height}`,
        display: "block",
        cursor: "crosshair",
      }}
    />
  );
};

export default MatrixAnimation;