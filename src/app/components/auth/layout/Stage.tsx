"use client";

import { useEffect, useState, type ReactNode } from "react";

/* ============================================================
   STAGE

   The Figma frames are 1512 x 982. Stage lays its children out in
   that coordinate space and scales the whole thing to fit the
   viewport, so every pixel value copied from Figma stays correct.
============================================================ */

export const STAGE_WIDTH = 1512;
export const STAGE_HEIGHT = 982;

export default function Stage({ children }: { children: ReactNode }) {
  const [scale, setScale] = useState<number | null>(null);

  useEffect(() => {
    const update = () =>
      setScale(
        Math.min(
          window.innerWidth / STAGE_WIDTH,
          window.innerHeight / STAGE_HEIGHT,
        ),
      );

    update();
    window.addEventListener("resize", update);

    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div
      className="pointer-events-none absolute overflow-hidden"
      style={{
        left: "50%",
        top: "50%",
        width: STAGE_WIDTH,
        height: STAGE_HEIGHT,
        transform: `translate(-50%, -50%) scale(${scale ?? 1})`,
        /* Hidden until the first measurement so it never flashes at 1x. */
        opacity: scale === null ? 0 : 1,
      }}
    >
      {children}
    </div>
  );
}
