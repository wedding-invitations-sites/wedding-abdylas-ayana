import { useRef } from "react";
import styles from "./Timeline.module.scss";
import {
  motion as Motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Ornament } from "../../ui/Ornament";
import { useLang } from "../../i18n";
import { weddingConfig } from "../../config/wedding.config";
import { reveal } from "../../hooks/useReveal";
import { useIsDesktop } from "../../hooks/useMediaQuery";

// Один шаг timeline — с параллаксом внутри карточки.
function TimelineStep({ item, index, total, isLeft, localize }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "end 30%"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 22 });
  // Число "01" — большое, полупрозрачное, параллаксит внутри карточки
  const numY = useTransform(smooth, [0, 1], [40, -40]);
  const numOpacity = useTransform(smooth, [0, 0.3, 1], [0, 0.16, 0.24]);
  const cardY = useTransform(smooth, [0, 1], [30, -20]);

  return (
    <Motion.div
      ref={ref}
      className={`${styles.step} ${isLeft ? styles.stepLeft : styles.stepRight}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.9, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={styles.stepInner}>
        {/* Большая цифра как фон карточки */}
        <Motion.span
          className={styles.stepNumber}
          style={{ y: numY, opacity: numOpacity }}
          aria-hidden="true"
        >
          {String(index + 1).padStart(2, "0")}
        </Motion.span>

        <Motion.div className={styles.stepCard} style={{ y: cardY }}>
          <span className={styles.stepTime}>{item.time}</span>
          <span className={styles.stepTitle}>{localize(item.title)}</span>
          <div className={styles.stepLine} />
          <span className={styles.stepMeta}>
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </Motion.div>

        {/* Точка на рельсе + пульсирующий glow */}
        <div className={styles.stepDot}>
          <Motion.span
            className={styles.stepDotCore}
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ type: "spring", stiffness: 240, damping: 14, delay: index * 0.08 + 0.2 }}
          />
          <span className={styles.stepDotGlow} />
        </div>
      </div>
    </Motion.div>
  );
}

export function Timeline() {
  const { t, localize } = useLang();
  const isDesktop = useIsDesktop();
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "end 40%"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
  });
  const lineHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  const items = weddingConfig.timeline;

  return (
    <div ref={sectionRef} className={styles.container}>
      {/* Декоративная звёздная пыль на фоне */}
      <div className={styles.dust} aria-hidden="true">
        {[...Array(20)].map((_, i) => (
          <span key={i} data-i={i % 5} />
        ))}
      </div>

      <Motion.h2 {...reveal.fadeUp} className={styles.title}>
        {t("timeline.sectionTitle")}
      </Motion.h2>

      <div className={styles.list}>
        {/* Основная рельса + заполнение по scroll-прогрессу */}
        <div className={styles.rail}>
          <Motion.div className={styles.railFill} style={{ height: lineHeight }} />
          <Motion.div
            className={styles.railGlow}
            style={{ top: lineHeight }}
          />
        </div>

        {items.map((it, idx) => (
          <TimelineStep
            key={idx}
            item={it}
            index={idx}
            total={items.length}
            isLeft={isDesktop && idx % 2 === 1}
            localize={localize}
          />
        ))}
      </div>

      <Ornament />
    </div>
  );
}
