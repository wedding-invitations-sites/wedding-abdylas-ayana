import { useRef } from "react";
import { motion as Motion, useMotionValue, useSpring } from "framer-motion";

// Кнопка, притягивающая курсор. На мобильных эффект отключён.
// Оборачиваем через forwardRef-free API — просто дочерний контент передаётся children.
export function MagneticButton({
  as: Component = "button",
  strength = 0.35,
  className,
  children,
  ...rest
}) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.5 });

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * strength);
    y.set(relY * strength);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  // На touch-устройствах не подключаем listeners
  const isTouch =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;

  return (
    <Motion.div
      ref={ref}
      onMouseMove={isTouch ? undefined : onMove}
      onMouseLeave={isTouch ? undefined : onLeave}
      style={{ x: sx, y: sy, display: "inline-block" }}
    >
      <Component className={className} {...rest}>
        {children}
      </Component>
    </Motion.div>
  );
}
