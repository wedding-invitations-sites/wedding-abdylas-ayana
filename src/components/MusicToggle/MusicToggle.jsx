import { AnimatePresence, motion as Motion } from "framer-motion";
import styles from "./MusicToggle.module.scss";

// Плавающая кнопка управления фоновой музыкой.
// Появляется после разблокировки Hero; показывает 3 палочки-эквалайзер во время воспроизведения.
export function MusicToggle({ audio, isPlaying, setIsPlaying, visible }) {
  const handleClick = () => {
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  return (
    <AnimatePresence>
      {visible && audio && (
        <Motion.button
          type="button"
          className={styles.wrapper}
          aria-label={isPlaying ? "Pause music" : "Play music"}
          aria-pressed={isPlaying}
          onClick={handleClick}
          initial={{ opacity: 0, scale: 0.7, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.disc}>
            <div className={styles.eq} data-playing={isPlaying}>
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
          {isPlaying && <div className={styles.pulse} />}
        </Motion.button>
      )}
    </AnimatePresence>
  );
}
