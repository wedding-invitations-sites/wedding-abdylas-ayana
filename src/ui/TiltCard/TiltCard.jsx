import { useRef } from "react";
import { motion as Motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import styles from "./TiltCard.module.scss";

// Карточка с 3D-tilt по движению мыши + glare (белый блик, следующий за курсором).
// На тач-устройствах эффект отключён.
export function TiltCard({ children, className, maxTilt = 10, glare = true }) {
  const ref = useRef(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const smx = useSpring(mx, { stiffness: 200, damping: 22, mass: 0.6 });
  const smy = useSpring(my, { stiffness: 200, damping: 22, mass: 0.6 });

  const rotateX = useTransform(smy, [0, 1], [maxTilt, -maxTilt]);
  const rotateY = useTransform(smx, [0, 1], [-maxTilt, maxTilt]);

  const glareX = useTransform(smx, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(smy, [0, 1], ["0%", "100%"]);

  const isTouch =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;

  const onMove = (e) => {
    if (isTouch) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };
  const onLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <Motion.div
      ref={ref}
      className={`${styles.wrapper} ${className || ""}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX: isTouch ? 0 : rotateX,
        rotateY: isTouch ? 0 : rotateY,
        transformStyle: "preserve-3d",
      }}
    >
      <div className={styles.inner}>{children}</div>
      {glare && !isTouch && (
        <Motion.div
          className={styles.glare}
          style={{
            background: useTransform(
              [glareX, glareY],
              ([gx, gy]) =>
                `radial-gradient(circle at ${gx} ${gy}, rgba(255,245,220,0.35), rgba(255,255,255,0) 55%)`
            ),
          }}
        />
      )}
    </Motion.div>
  );
}
