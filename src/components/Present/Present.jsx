import { useState } from "react";
import styles from "./Present.module.scss";
import { Ornament } from "../../ui/Ornament";
import { motion as Motion } from "framer-motion";
import { useLang } from "../../i18n";
import { weddingConfig } from "../../config/wedding.config";
import { reveal, stagger, staggerChild } from "../../hooks/useReveal";
import { Envelope } from "./Envelope";

export function Present() {
  const { localize } = useLang();
  const { greeting, couple } = weddingConfig;
  const [envelopeOpened, setEnvelopeOpened] = useState(false);

  return (
    <div className={styles.container}>
      {/* Раздел 1: cinematic envelope с сургучной печатью */}
      <div className={styles.envelopeSection}>
        <Envelope onOpened={() => setEnvelopeOpened(true)} />
      </div>

      {/* Раздел 2: приветственный текст — появляется поле открытия конверта */}
      <Motion.div
        id="presentTextWrapper"
        className={styles.textWrapper}
        initial={{ opacity: 0, y: 40 }}
        animate={
          envelopeOpened
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 40 }
        }
        transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <Motion.div className={styles.inner} {...stagger(0.1, 0.14)}>
          <Motion.p className={styles.firstText} {...staggerChild}>
            {localize(greeting.title)}
          </Motion.p>

          <Motion.div
            className={styles.divider}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
          />

          <Motion.p className={styles.secondText} {...staggerChild}>
            {localize(greeting.intro)}
          </Motion.p>

          {/* Каллиграфия имён — рисуется сама, потом заливается цветом */}
          <CalligraphyNames text={localize(couple.display)} />

          <Motion.p className={styles.fourthText} {...reveal.fadeUp}>
            {localize(greeting.body)}
          </Motion.p>
        </Motion.div>
      </Motion.div>

      <Ornament />
    </div>
  );
}

// SVG-текст, рисующийся stroke → потом заливается цветом.
// Работает для любых языков — просто анимируется прозрачность fill.
function CalligraphyNames({ text }) {
  return (
    <Motion.div
      className={styles.calligraphy}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.4 }}
    >
      <svg viewBox="0 0 600 130" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="callGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c6024" />
            <stop offset="50%" stopColor="#c69b47" />
            <stop offset="100%" stopColor="#7c6024" />
          </linearGradient>
        </defs>
        <Motion.text
          x="300"
          y="85"
          textAnchor="middle"
          fontFamily="var(--savoye-let)"
          fontSize="110"
          fill="url(#callGold)"
          stroke="url(#callGold)"
          strokeWidth="0.5"
          initial={{ pathLength: 0, fillOpacity: 0 }}
          whileInView={{ pathLength: 1, fillOpacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            pathLength: { duration: 2.4, ease: [0.22, 1, 0.36, 1] },
            fillOpacity: { duration: 1.2, delay: 1.6 },
          }}
        >
          {text}
        </Motion.text>
      </svg>
    </Motion.div>
  );
}
