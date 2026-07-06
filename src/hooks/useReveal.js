// Общие пресеты framer-motion для reveal-анимаций секций.
// Единая точка правды — чтобы не копипастить variants по компонентам.

const spring = { type: "spring", stiffness: 90, damping: 18, mass: 0.6 };
const smooth = { duration: 0.7, ease: [0.22, 1, 0.36, 1] };

export const reveal = {
  // Плавное появление снизу
  fadeUp: {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: smooth,
  },
  // Появление с блюром — премиальный «мягкий» ин
  blurIn: {
    initial: { opacity: 0, filter: "blur(12px)", y: 20 },
    whileInView: { opacity: 1, filter: "blur(0px)", y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: smooth,
  },
  // Появление с масштабом (для эмблем/иконок)
  scaleIn: {
    initial: { opacity: 0, scale: 0.85 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true, amount: 0.4 },
    transition: spring,
  },
  // Слева
  slideLeft: {
    initial: { opacity: 0, x: -40 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: smooth,
  },
  // Справа
  slideRight: {
    initial: { opacity: 0, x: 40 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: smooth,
  },
};

// Родительский контейнер для stagger-эффекта
export const stagger = (delayChildren = 0.1, staggerChildren = 0.08) => ({
  initial: {},
  whileInView: {
    transition: { delayChildren, staggerChildren },
  },
  viewport: { once: true, amount: 0.2 },
});

// Дочерний элемент для stagger-контейнера
export const staggerChild = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: smooth,
};
