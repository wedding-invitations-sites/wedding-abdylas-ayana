import { useEffect, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import styles from "./Preloader.module.scss";
import { weddingConfig } from "../../config/wedding.config";

// Прелоадер держится минимум minDuration + ждёт fonts.ready.
// Не ждёт window.load, чтобы content-visibility не растягивал ожидание.
export function Preloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const start = performance.now();
    const minDuration = 1600;

    const done = () => {
      const elapsed = performance.now() - start;
      const wait = Math.max(0, minDuration - elapsed);
      setTimeout(() => setVisible(false), wait);
    };

    const fontsReady =
      document.fonts && document.fonts.ready
        ? document.fonts.ready
        : Promise.resolve();

    fontsReady.then(() => requestAnimationFrame(done));
  }, []);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [visible]);

  const { groom, bride } = weddingConfig.couple;

  return (
    <AnimatePresence>
      {visible && (
        <Motion.div
          className={styles.wrapper}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          role="status"
          aria-busy="true"
        >
          {/* Ambient glow — тёплые пятна */}
          <div className={styles.ambient} aria-hidden="true">
            <span /><span />
          </div>

          <Motion.div
            className={styles.mark}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <Motion.span
              className={styles.letter}
              initial={{ opacity: 0, x: -30, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.15, duration: 0.85 }}
            >
              {groom.initial}
            </Motion.span>
            <Motion.span
              className={styles.amp}
              initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
            >
              &amp;
            </Motion.span>
            <Motion.span
              className={styles.letter}
              initial={{ opacity: 0, x: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.15, duration: 0.85 }}
            >
              {bride.initial}
            </Motion.span>
          </Motion.div>

          {/* Тонкая золотая линия-progress */}
          <div className={styles.lineTrack}>
            <Motion.div
              className={styles.lineFill}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 1.1, ease: "easeInOut" }}
            />
          </div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}
