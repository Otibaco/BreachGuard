"use client";

import { useEffect, useRef } from "react";

/**
 * Fires a short, tasteful confetti burst using canvas-confetti when a
 * "clean" result renders. Colors are read from our CSS custom properties
 * so the effect always matches the current palette.
 */
export default function CelebrationPetals({ trigger }) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (!trigger || firedRef.current) return;
    firedRef.current = true;

    let cancelled = false;

    import("canvas-confetti").then(({ default: confetti }) => {
      if (cancelled) return;

      const styles = getComputedStyle(document.documentElement);
      const colors = [
        styles.getPropertyValue("--color-clean").trim() || "#10b981",
        styles.getPropertyValue("--color-clean-light").trim() || "#34d399",
        styles.getPropertyValue("--color-brand-cyan").trim() || "#38bdf8",
        styles.getPropertyValue("--color-celebration-pink").trim() || "#f472b6",
      ];

      const duration = 1400;
      const end = Date.now() + duration;

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors,
          gravity: 0.9,
          scalar: 0.8,
          ticks: 200,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors,
          gravity: 0.9,
          scalar: 0.8,
          ticks: 200,
        });

        if (Date.now() < end && !cancelled) {
          requestAnimationFrame(frame);
        }
      })();
    });

    return () => {
      cancelled = true;
    };
  }, [trigger]);

  useEffect(() => {
    if (!trigger) firedRef.current = false;
  }, [trigger]);

  return null;
}
