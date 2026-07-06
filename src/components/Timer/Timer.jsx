import { useEffect, useState } from "react";
import styles from "./Timer.module.scss";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { useLang } from "../../i18n";
import { weddingConfig } from "../../config/wedding.config";
import { reveal } from "../../hooks/useReveal";

const targetDate = new Date(weddingConfig.date);

const getTimeRemaining = (end) => {
  const total = end.getTime() - new Date().getTime();
  if (total <= 0) return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return { total, days, hours, minutes, seconds };
};

// Кольцо-прогресс вокруг ячейки — заполняется от 0 до 1 в зависимости от юнита
function ProgressRing({ value, max }) {
  const R = 46;
  const C = 2 * Math.PI * R;
  const progress = max ? Math.min(1, value / max) : 0;
  return (
    <svg viewBox="0 0 100 100" className={styles.ring} aria-hidden="true">
      <circle
        cx="50" cy="50" r={R}
        stroke="rgba(255,245,220,0.15)"
        strokeWidth="1.5"
        fill="none"
      />
      <circle
        cx="50" cy="50" r={R}
        stroke="url(#ringGold)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        strokeDasharray={C}
        strokeDashoffset={C * (1 - progress)}
        transform="rotate(-90 50 50)"
        style={{ transition: "stroke-dashoffset 0.9s cubic-bezier(0.22,1,0.36,1)" }}
      />
      <defs>
        <linearGradient id="ringGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f4e2b5" />
          <stop offset="100%" stopColor="#c69b47" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Одна ячейка — стеклянный медальон с кольцом-прогрессом и flip-цифрой
function FlipCell({ value, label, max }) {
  const formatted = String(value).padStart(2, "0");
  return (
    <div className={styles.cell}>
      <div className={styles.cellDisc}>
        <ProgressRing value={value} max={max} />
        <div className={styles.numWrap}>
          <AnimatePresence mode="popLayout" initial={false}>
            <Motion.span
              key={formatted}
              className={styles.num}
              initial={{ y: "110%", opacity: 0, filter: "blur(6px)" }}
              animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
              exit={{ y: "-110%", opacity: 0, filter: "blur(6px)" }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              {formatted}
            </Motion.span>
          </AnimatePresence>
        </div>
      </div>
      <span className={styles.unit}>{label}</span>
    </div>
  );
}

export const Timer = () => {
  const { t } = useLang();
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getTimeRemaining(targetDate);
      if (remaining.total <= 0) clearInterval(interval);
      setTimeLeft(remaining);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const units = t("timer.units");
  const finished = timeLeft.total <= 0;

  return (
    <div className={styles.container}>
      {/* Ambient glow — золотистые "тёплые" пятна на фоне */}
      <div className={styles.ambient} aria-hidden="true">
        <span className={styles.ambientA} />
        <span className={styles.ambientB} />
        <span className={styles.ambientC} />
      </div>

      <Motion.p {...reveal.fadeUp} className={styles.title}>
        {finished ? t("timer.finished") : t("timer.label")}
      </Motion.p>

      {!finished && (
        <Motion.div {...reveal.fadeUp} className={styles.timer}>
          <FlipCell value={timeLeft.days} label={units.days} max={365} />
          <FlipCell value={timeLeft.hours} label={units.hours} max={24} />
          <FlipCell value={timeLeft.minutes} label={units.minutes} max={60} />
          <FlipCell value={timeLeft.seconds} label={units.seconds} max={60} />
        </Motion.div>
      )}
    </div>
  );
};
