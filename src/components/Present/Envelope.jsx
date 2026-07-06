import { useEffect, useRef, useState } from "react";
import { motion as Motion, AnimatePresence, useInView } from "framer-motion";
import styles from "./Envelope.module.scss";
import { useLang } from "../../i18n";
import { weddingConfig } from "../../config/wedding.config";

// Премиальная сцена: закрытый золотой конверт с сургучной печатью-монограммой.
// Тап по печати → печать "срывается" (rotate+fall+splash), клапан 3D-открывается,
// внутри — письмо-приглашение с каллиграфией имён, которая рисует сама себя.

export function Envelope({ onOpened }) {
  const { localize } = useLang();
  const { couple, greeting } = weddingConfig;

  const [opened, setOpened] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const wrapRef = useRef(null);
  const inView = useInView(wrapRef, { amount: 0.5, once: true });

  // Показать подсказку "нажмите на печать" через 800мс после появления
  useEffect(() => {
    if (!inView) return;
    const id = setTimeout(() => setHintVisible(true), 900);
    return () => clearTimeout(id);
  }, [inView]);

  const handleOpen = () => {
    if (opened) return;
    setOpened(true);
    setHintVisible(false);
    onOpened?.();
  };

  const groomInitial = couple.groom.initial;
  const brideInitial = couple.bride.initial;
  const displayName = localize(couple.display);

  return (
    <div ref={wrapRef} className={styles.stage}>
      <div className={styles.perspective}>
        <Motion.div
          className={styles.envelope}
          initial={{ opacity: 0, y: 40, rotateX: 12 }}
          animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Задняя стенка */}
          <div className={styles.back} />

          {/* Письмо внутри — поднимается после открытия */}
          <Motion.div
            className={styles.letter}
            initial={{ y: 0, opacity: 0 }}
            animate={
              opened
                ? { y: "-32%", opacity: 1 }
                : { y: 0, opacity: 0 }
            }
            transition={{
              duration: 1.2,
              delay: opened ? 0.85 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className={styles.letterInner}>
              <p className={styles.title}>{localize(greeting.title)}</p>
              <div className={styles.divider}>
                <svg viewBox="0 0 120 8">
                  <line x1="0" y1="4" x2="52" y2="4" stroke="#99762c" strokeWidth="0.5" />
                  <line x1="68" y1="4" x2="120" y2="4" stroke="#99762c" strokeWidth="0.5" />
                  <circle cx="60" cy="4" r="1.4" fill="#99762c" />
                </svg>
              </div>
              <p className={styles.names}>{displayName}</p>
            </div>
          </Motion.div>

          {/* Клапан — 3D-открытие */}
          <Motion.div
            className={styles.flap}
            initial={{ rotateX: 0 }}
            animate={opened ? { rotateX: -175 } : { rotateX: 0 }}
            transition={{
              duration: 1,
              delay: opened ? 0.35 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className={styles.flapInner} />
          </Motion.div>

          {/* Передняя стенка — с орнаментальной рамкой */}
          <div className={styles.front}>
            <svg viewBox="0 0 320 200" className={styles.frontFrame} preserveAspectRatio="none">
              <rect
                x="6" y="6" width="308" height="188"
                fill="none"
                stroke="rgba(255,245,220,0.4)"
                strokeWidth="0.6"
              />
              <rect
                x="12" y="12" width="296" height="176"
                fill="none"
                stroke="rgba(255,245,220,0.25)"
                strokeWidth="0.4"
              />
            </svg>
          </div>

          {/* Сургучная печать поверх — точка входа для клика */}
          <AnimatePresence>
            {!opened && (
              <Motion.button
                type="button"
                className={styles.seal}
                onClick={handleOpen}
                aria-label="Open invitation"
                initial={{ scale: 0, rotate: -25, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{
                  scale: 1.3,
                  rotate: 45,
                  opacity: 0,
                  y: 80,
                  transition: { duration: 0.55, ease: [0.4, 0, 0.6, 1] },
                }}
                transition={{
                  delay: 0.6,
                  duration: 0.9,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.94 }}
                data-cursor="hover"
              >
                <svg viewBox="0 0 100 100" className={styles.sealSvg}>
                  <defs>
                    <radialGradient id="waxGrad" cx="35%" cy="30%">
                      <stop offset="0%" stopColor="#e08a5f" />
                      <stop offset="45%" stopColor="#a63a25" />
                      <stop offset="100%" stopColor="#5a1a10" />
                    </radialGradient>
                    <radialGradient id="waxHighlight" cx="35%" cy="30%">
                      <stop offset="0%" stopColor="rgba(255,220,190,0.75)" />
                      <stop offset="40%" stopColor="rgba(255,220,190,0)" />
                    </radialGradient>
                  </defs>
                  {/* Неровная "капля" воска */}
                  <path
                    d="M 50 8
                       C 68 6, 88 18, 92 40
                       C 96 62, 86 88, 60 92
                       C 40 96, 14 88, 8 62
                       C 4 40, 22 12, 50 8 Z"
                    fill="url(#waxGrad)"
                    stroke="#3a0f08"
                    strokeWidth="0.5"
                  />
                  {/* Блик */}
                  <ellipse cx="38" cy="30" rx="20" ry="14" fill="url(#waxHighlight)" />
                  {/* Монограмма внутри */}
                  <text
                    x="50" y="50"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontFamily="var(--savoye-let)"
                    fontSize="42"
                    fill="rgba(255,220,190,0.92)"
                    style={{ letterSpacing: "-3px" }}
                  >
                    {groomInitial}&{brideInitial}
                  </text>
                </svg>

                {/* Splash - разлетающиеся кусочки воска */}
              </Motion.button>
            )}
          </AnimatePresence>

          {/* Splash-осколки воска после клика */}
          <AnimatePresence>
            {opened && (
              <div className={styles.splashLayer} aria-hidden="true">
                {[...Array(8)].map((_, i) => {
                  const angle = (i / 8) * Math.PI * 2;
                  const dist = 60 + Math.random() * 40;
                  const dx = Math.cos(angle) * dist;
                  const dy = Math.sin(angle) * dist;
                  return (
                    <Motion.span
                      key={i}
                      className={styles.chip}
                      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                      animate={{
                        x: dx,
                        y: dy + 40,
                        opacity: 0,
                        scale: 0.5,
                        rotate: Math.random() * 360,
                      }}
                      transition={{ duration: 0.9, ease: [0.4, 0, 0.6, 1] }}
                    />
                  );
                })}
              </div>
            )}
          </AnimatePresence>

          {/* Подсказка */}
          <AnimatePresence>
            {hintVisible && !opened && (
              <Motion.div
                className={styles.hint}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.5 }}
                aria-hidden="true"
              >
                <span className={styles.hintDot} />
              </Motion.div>
            )}
          </AnimatePresence>
        </Motion.div>
      </div>
    </div>
  );
}
