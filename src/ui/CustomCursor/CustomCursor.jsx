import { useEffect, useRef, useState } from "react";
import { motion as Motion, useMotionValue, useSpring } from "framer-motion";
import styles from "./CustomCursor.module.scss";

// Кастомный курсор — только для desktop / fine pointer.
// Внутренняя точка следует за курсором мгновенно, внешнее кольцо — с задержкой (spring).
// На интерактивных элементах (a, button, [data-cursor="hover"]) кольцо расширяется.
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 250, damping: 25, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 250, damping: 25, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);
    document.body.classList.add("has-custom-cursor");

    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const leave = () => setVisible(false);

    const onOver = (e) => {
      const target = e.target;
      if (!target?.closest) return;
      const isInteractive = target.closest(
        'a, button, [role="button"], input, textarea, select, [data-cursor="hover"]'
      );
      setHovering(!!isInteractive);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseleave", leave);
    window.addEventListener("mouseover", onOver);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", leave);
      window.removeEventListener("mouseover", onOver);
      document.body.classList.remove("has-custom-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <Motion.div
        className={styles.ring}
        style={{
          x: rx,
          y: ry,
          opacity: visible ? 1 : 0,
          scale: hovering ? 1.9 : 1,
        }}
      />
      <Motion.div
        className={styles.dot}
        style={{
          x,
          y,
          opacity: visible ? 1 : 0,
          scale: hovering ? 0 : 1,
        }}
      />
    </>
  );
}
