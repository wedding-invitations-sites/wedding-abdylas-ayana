import { useState, useRef, useEffect } from "react";
import styles from "./Hero.module.scss";
import cn from "classnames";
import chevron from "../../assets/images/svg/chevron.svg";
import { useLang } from "../../i18n";
import { weddingConfig } from "../../config/wedding.config";
import {
  motion as Motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { HeroPetals } from "./HeroPetals";
import { useMouseParallax } from "../../hooks/useMagneticParallax";

// Каждая буква имени появляется с blur + y stagger'ом
const letterVariants = {
  hidden: { opacity: 0, y: 28, filter: "blur(14px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

function AnimatedName({ text, delay = 0 }) {
  return (
    <Motion.span
      className={styles.name}
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.06, delayChildren: 0.4 + delay }}
      aria-label={text}
    >
      {Array.from(text).map((ch, i) => (
        <Motion.span
          key={i}
          className={styles.letter}
          variants={letterVariants}
          aria-hidden="true"
        >
          {ch === " " ? " " : ch}
        </Motion.span>
      ))}
    </Motion.span>
  );
}

export function Hero({
  isLocked,
  setIsLocked,
  audio,
  setAudio,
  isPlaying,
  setIsPlaying,
}) {
  const { t, lang } = useLang();
  const { couple, audio: audioCfg } = weddingConfig;

  const wrapperRef = useRef(null);
  const { scrollY } = useScroll();
  // 3-слойный parallax: фон едет медленно, средний слой быстрее, контент чуть уплывает вверх.
  const bgY = useTransform(scrollY, [0, 800], ["0%", "22%"]);
  const bgScale = useTransform(scrollY, [0, 800], [1.05, 1.15]);
  const midY = useTransform(scrollY, [0, 800], ["0%", "-8%"]);
  const contentY = useTransform(scrollY, [0, 600], [0, -60]);
  const contentOpacity = useTransform(scrollY, [0, 500], [1, 0.15]);
  // Cinematic blur — при скролле hero немного расфокусируется, "отступает"
  const bgBlur = useTransform(scrollY, [0, 700], ["0px", "8px"]);

  // Мышь-параллакс для десктопа
  const { x: mx, y: my } = useMouseParallax(24);

  // Cinematic in — стартуем с сильного blur+zoom, за 1.8с приходим к идеалу
  const [cinematicDone, setCinematicDone] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setCinematicDone(true), 60);
    return () => clearTimeout(id);
  }, []);

  const [sliderPosition, setSliderPosition] = useState(0);
  const [progress, setProgress] = useState(0);
  const sliderRef = useRef(null);
  const containerRef = useRef(null);
  const startClientX = useRef(0);
  const initialSliderPosition = useRef(0);
  const isDragging = useRef(false);
  const currentSliderPositionRef = useRef(0);

  // Audio + WebAudio analyser (для audio-reactive лепестков)
  const analyserRef = useRef(null);
  const audioCtxRef = useRef(null);
  const hasSetupAudioRef = useRef(false);

  const setupAudio = () => {
    if (hasSetupAudioRef.current) return audio;
    hasSetupAudioRef.current = true;
    const a = new Audio(audioCfg.src);
    a.loop = true;
    a.crossOrigin = "anonymous";
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) {
        const ctx = new Ctx();
        const src = ctx.createMediaElementSource(a);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 128;
        src.connect(analyser);
        analyser.connect(ctx.destination);
        audioCtxRef.current = ctx;
        analyserRef.current = analyser;
      }
    } catch {
      // если аудио-контекст недоступен — просто без визуализации
    }
    setAudio(a);
    return a;
  };

  const getMaxTranslateX = () => {
    if (containerRef.current && sliderRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const sliderWidth = sliderRef.current.offsetWidth;
      const cs = window.getComputedStyle(containerRef.current);
      const bl = parseFloat(cs.borderLeftWidth) || 0;
      const br = parseFloat(cs.borderRightWidth) || 0;
      return containerWidth - sliderWidth - bl - br;
    }
    return 0;
  };

  const handleMouseDown = (e) => {
    if (isLocked) return;
    isDragging.current = true;
    startClientX.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    initialSliderPosition.current = sliderPosition;
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current || isLocked) return;
    const currentX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const deltaX = currentX - startClientX.current;
    let newPosition = initialSliderPosition.current + deltaX;
    const maxTranslateX = getMaxTranslateX();
    newPosition = Math.max(0, Math.min(newPosition, maxTranslateX));
    setSliderPosition(newPosition);
    setProgress(maxTranslateX > 0 ? newPosition / maxTranslateX : 0);
    currentSliderPositionRef.current = newPosition;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
    window.removeEventListener("touchmove", handleTouchMove);
    window.removeEventListener("touchend", handleTouchEnd);
    const maxTranslateX = getMaxTranslateX();
    const lockThreshold = maxTranslateX * 0.7;
    if (currentSliderPositionRef.current >= lockThreshold) {
      // Стартуем аудио прямо в user-gesture (важно для iOS/Safari autoplay-policy)
      const a = setupAudio();
      if (audioCtxRef.current?.state === "suspended") {
        audioCtxRef.current.resume().catch(() => {});
      }
      a.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
      setSliderPosition(maxTranslateX);
      setProgress(1);
      setIsLocked(true);
    } else {
      setSliderPosition(0);
      setProgress(0);
      setIsLocked(false);
    }
  };

  const handleTouchStart = (e) => handleMouseDown(e);
  const handleTouchMove = (e) => handleMouseMove(e);
  const handleTouchEnd = () => handleMouseUp();

  useEffect(() => {
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Пауза при скрытии вкладки — не отбирает батарею
  useEffect(() => {
    const onVis = () => {
      if (!audio) return;
      if (document.hidden) {
        audio.pause();
      } else if (isPlaying) {
        audio.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [audio, isPlaying]);

  const groomName = (couple.groom.name[lang] || couple.groom.name.en).toUpperCase();
  const brideName = (couple.bride.name[lang] || couple.bride.name.en).toUpperCase();

  const glowIntensity = Math.min(1, Math.max(0, (progress - 0.4) / 0.6));

  return (
    <div
      ref={wrapperRef}
      className={styles.wrapper}
      style={{ "--height": `100${!isLocked ? "dvh" : "vh"}` }}
    >
      {/* Слой 1: фон с параллаксом + cinematic reveal */}
      <Motion.div
        className={styles.bg}
        style={{ y: bgY, scale: bgScale, filter: bgBlur }}
        initial={{ scale: 1.35, filter: "blur(24px)", opacity: 0 }}
        animate={{
          scale: cinematicDone ? 1.05 : 1.35,
          filter: "blur(0px)",
          opacity: 1,
        }}
        transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
      />

      {/* Слой 2: тонированный градиент, чуть быстрее фона */}
      <Motion.div
        className={styles.overlay}
        style={{ y: midY }}
        aria-hidden="true"
      />

      {/* Слой 3: виньетка */}
      <div className={styles.vignette} aria-hidden="true" />

      {/* Слой 4: canvas-лепестки, audio-reactive когда играет музыка */}
      <HeroPetals analyser={isPlaying ? analyserRef.current : null} />

      {/* Слой 5: мышь-параллакс для декоративных звёзд */}
      <Motion.div
        className={styles.sparks}
        style={{ x: mx, y: my }}
        aria-hidden="true"
      >
        <span className={styles.spark} data-i="1" />
        <span className={styles.spark} data-i="2" />
        <span className={styles.spark} data-i="3" />
        <span className={styles.spark} data-i="4" />
        <span className={styles.spark} data-i="5" />
      </Motion.div>

      <Motion.div
        className={styles.content}
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <h1 className={styles.heading}>
          <AnimatedName text={groomName} />
          <Motion.span
            className={styles.amp}
            initial={{ opacity: 0, scale: 0.4, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            &amp;
          </Motion.span>
          <AnimatedName text={brideName} delay={0.35} />
        </h1>

        <Motion.div
          className={styles.smallOrnament}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 1.6, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <svg viewBox="0 0 200 12" preserveAspectRatio="xMidYMid meet">
            <line x1="0" y1="6" x2="90" y2="6" stroke="rgba(255,240,210,0.8)" strokeWidth="0.8" />
            <line x1="110" y1="6" x2="200" y2="6" stroke="rgba(255,240,210,0.8)" strokeWidth="0.8" />
            <circle cx="100" cy="6" r="2.4" fill="rgba(255,240,210,0.95)" />
          </svg>
        </Motion.div>
      </Motion.div>

      <div className={cn(styles.bottom, { [styles.isHidden]: isLocked })}>
        <Motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.9, duration: 0.7 }}
        >
          {t("hero.subtitle")}
        </Motion.h2>
        <Motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.05, duration: 0.7 }}
        >
          {t("hero.swipeToOpen")}
        </Motion.p>
        <Motion.div
          ref={containerRef}
          className={styles.container}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.7 }}
        >
          <div className={cn(styles.circle, styles.startCircle)} />
          <div className={styles.track} />
          <div
            className={cn(styles.circle, styles.endCircle)}
            style={{
              boxShadow: `0 0 ${glowIntensity * 34}px rgba(255,240,210,${glowIntensity * 0.9})`,
              background: `rgba(255,240,210,${glowIntensity * 0.35})`,
            }}
          />
          <div
            ref={sliderRef}
            className={cn(styles.slider, { [styles.locked]: isLocked })}
            style={{
              transform: `translateX(${sliderPosition}px)`,
              boxShadow: `0 0 ${12 + glowIntensity * 34}px rgba(255,240,210,${0.35 + glowIntensity * 0.65})`,
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            <img src={chevron} alt="" />
          </div>
        </Motion.div>
      </div>

      {/* Индикатор скролла */}
      {!isLocked && (
        <Motion.div
          className={styles.scrollHint}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 2.4, duration: 0.8 }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
