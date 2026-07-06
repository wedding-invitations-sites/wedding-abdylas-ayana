import { useEffect } from "react";
import { useMotionValue, useSpring } from "framer-motion";

// Возвращает two motion values (mx, my) в диапазоне [-1..1] относительно центра viewport'а.
// Используется для мышь-параллакса на десктопе.
export function useMouseParallax(strength = 20) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 60, damping: 20, mass: 1 });
  const sy = useSpring(y, { stiffness: 60, damping: 20, mass: 1 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      x.set(nx * strength);
      y.set(ny * strength);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [strength, x, y]);

  return { x: sx, y: sy };
}
