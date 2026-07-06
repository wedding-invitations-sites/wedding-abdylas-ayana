import { useEffect, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import styles from "./ScrollTop.module.scss";
import { useLang } from "../../i18n";

// Круговой прогресс скролла + кнопка «наверх».
// Появляется после того, как страница проскроллена на > 400px.
export function ScrollTop() {
  const { t } = useLang();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrolled = window.scrollY;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, scrolled / max) : 0;
      setProgress(p);
      setVisible(scrolled > 400);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const RADIUS = 22;
  const CIRC = 2 * Math.PI * RADIUS;
  const dashOffset = CIRC * (1 - progress);

  return (
    <AnimatePresence>
      {visible && (
        <Motion.button
          type="button"
          aria-label={t("common.scrollTop")}
          className={styles.wrapper}
          onClick={handleClick}
          initial={{ opacity: 0, scale: 0.7, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 10 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <svg
            className={styles.ring}
            viewBox="0 0 52 52"
            aria-hidden="true"
          >
            <circle
              cx="26"
              cy="26"
              r={RADIUS}
              className={styles.ringTrack}
            />
            <circle
              cx="26"
              cy="26"
              r={RADIUS}
              className={styles.ringFill}
              strokeDasharray={CIRC}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 26 26)"
            />
          </svg>
          <svg
            className={styles.arrow}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="M12 5 L12 19 M5 12 L12 5 L19 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Motion.button>
      )}
    </AnimatePresence>
  );
}
