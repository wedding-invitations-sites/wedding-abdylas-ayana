import { useEffect, useMemo, useState } from "react";
import styles from "./Calendar.module.scss";
import firstBg from "../../assets/images/png/IMG_6860.webp";
import secondBg from "../../assets/images/png/image.webp";
import thirdBg from "../../assets/images/png/Frame 2087328555.webp";
import { Ornament } from "../../ui/Ornament";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useLang } from "../../i18n";
import { weddingConfig } from "../../config/wedding.config";
import { reveal } from "../../hooks/useReveal";

const localeMap = { en: "en-US", ru: "ru-RU", kg: "ky-KG" };

// Строим полный месячный calendar-grid: 6 недель по 7 дней, начиная с понедельника.
function buildMonthGrid(dateStr) {
  const target = new Date(dateStr);
  const year = target.getFullYear();
  const month = target.getMonth();
  const first = new Date(year, month, 1);
  const dow = (first.getDay() + 6) % 7; // 0 = понедельник
  const start = new Date(first);
  start.setDate(first.getDate() - dow);

  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return {
      date: d,
      inMonth: d.getMonth() === month,
      isWedding:
        d.getDate() === target.getDate() &&
        d.getMonth() === target.getMonth() &&
        d.getFullYear() === target.getFullYear(),
      isWeekend: (d.getDay() + 6) % 7 >= 5,
    };
  });
}

function HeartShape() {
  return (
    <svg viewBox="0 0 32 30" preserveAspectRatio="xMidYMid meet" aria-hidden="true" className={styles.heartShape}>
      <defs>
        <linearGradient id="heartGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4a94a" />
          <stop offset="55%" stopColor="#99762c" />
          <stop offset="100%" stopColor="#7c6024" />
        </linearGradient>
      </defs>
      <path
        d="M16 28 C8 22, 1.5 16.5, 1.5 9.5 C1.5 5.4, 4.9 2, 9 2 C12.1 2, 14.7 3.8, 16 6.3 C17.3 3.8, 19.9 2, 23 2 C27.1 2, 30.5 5.4, 30.5 9.5 C30.5 16.5, 24 22, 16 28 Z"
        fill="url(#heartGold)"
      />
    </svg>
  );
}

// Draggable gallery: тянем горизонтально с magnetic-snap.
function DraggableGallery({ slides }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = (i) => setIndex(((i % slides.length) + slides.length) % slides.length);

  useEffect(() => {
    const id = setInterval(() => {
      if (!paused) setIndex((v) => (v + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [paused, slides.length]);

  return (
    <div
      className={styles.gallery}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={styles.frame}>
        <AnimatePresence initial={false} mode="popLayout">
          <Motion.div
            key={index}
            className={styles.slide}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.28}
            dragTransition={{ bounceStiffness: 300, bounceDamping: 24 }}
            onDragEnd={(_, info) => {
              if (info.offset.x > 60 || info.velocity.x > 400) goTo(index - 1);
              else if (info.offset.x < -60 || info.velocity.x < -400) goTo(index + 1);
            }}
            style={{ backgroundImage: `url(${slides[index]})` }}
          >
            {/* Ken Burns — медленный zoom+pan через CSS */}
            <div className={styles.kenBurns} />
            <div className={styles.slideOverlay} />
          </Motion.div>
        </AnimatePresence>

        {/* Стрелки — только desktop */}
        <button
          type="button"
          className={`${styles.navArrow} ${styles.navLeft}`}
          onClick={() => goTo(index - 1)}
          aria-label="Prev"
          data-cursor="hover"
        >
          <svg viewBox="0 0 20 20"><path d="M13 4 L6 10 L13 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button
          type="button"
          className={`${styles.navArrow} ${styles.navRight}`}
          onClick={() => goTo(index + 1)}
          aria-label="Next"
          data-cursor="hover"
        >
          <svg viewBox="0 0 20 20"><path d="M7 4 L14 10 L7 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>

      {/* Кастомная пагинация — золотые пилюли */}
      <div className={styles.dots}>
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export function Calendar() {
  const { t, lang } = useLang();

  const target = new Date(weddingConfig.date);
  const grid = useMemo(() => buildMonthGrid(weddingConfig.date), []);

  const monthName = new Intl.DateTimeFormat(localeMap[lang] || "ru-RU", {
    month: "long",
  })
    .format(target)
    .toUpperCase();

  const weekdayLabels = t("calendar.weekdays");
  const slides = [firstBg, secondBg, thirdBg];

  return (
    <div className={styles.container}>
      <div className={styles.mainWrapper}>
        <Motion.h2 {...reveal.fadeUp} className={styles.title}>
          {t("calendar.sectionTitle")}
        </Motion.h2>
        <Motion.h3 {...reveal.fadeUp} className={styles.month}>
          <span>{monthName}</span>
          <span className={styles.year}>{target.getFullYear()}</span>
        </Motion.h3>

        {/* Полная сетка месяца */}
        <Motion.div {...reveal.fadeUp} className={styles.calendar}>
          <div className={styles.weekHeader}>
            {weekdayLabels.map((label, i) => (
              <span
                key={i}
                className={`${styles.wLabel} ${i >= 5 ? styles.wLabelWknd : ""}`}
              >
                {label}
              </span>
            ))}
          </div>

          <div className={styles.grid}>
            {grid.map((cell, i) => (
              <Motion.div
                key={i}
                className={[
                  styles.cell,
                  !cell.inMonth ? styles.cellDim : "",
                  cell.isWeekend ? styles.cellWeekend : "",
                  cell.isWedding ? styles.cellWedding : "",
                ].join(" ")}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.012, duration: 0.4 }}
              >
                {cell.isWedding ? (
                  <span className={styles.weddingWrap}>
                    <Motion.span
                      className={styles.weddingHeart}
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <HeartShape />
                    </Motion.span>
                    <span className={styles.weddingNum}>{cell.date.getDate()}</span>
                  </span>
                ) : (
                  <span className={styles.dayNum}>{cell.date.getDate()}</span>
                )}
              </Motion.div>
            ))}
          </div>
        </Motion.div>

        <Motion.div {...reveal.fadeUp} className={styles.galleryWrap}>
          <DraggableGallery slides={slides} />
        </Motion.div>

        <Motion.p {...reveal.blurIn} className={styles.desk}>
          {weddingConfig.poem[lang] || weddingConfig.poem.kg}
        </Motion.p>
      </div>
      <Ornament />
    </div>
  );
}
