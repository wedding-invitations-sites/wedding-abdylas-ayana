import styles from "./Ornament.module.scss";

// Декоративный SVG-разделитель: тонкая золотая линия с центральным ромбом-звездой.
// Заменяет обычный <Line /> для премиум-секций.
export function Ornament({ variant = "default" }) {
  return (
    <div className={styles.wrapper} data-variant={variant} aria-hidden="true">
      <svg
        viewBox="0 0 400 40"
        preserveAspectRatio="xMidYMid meet"
        className={styles.svg}
      >
        <defs>
          <linearGradient id="ornGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(153,118,44,0)" />
            <stop offset="25%" stopColor="#99762c" />
            <stop offset="50%" stopColor="#e8cd8c" />
            <stop offset="75%" stopColor="#99762c" />
            <stop offset="100%" stopColor="rgba(153,118,44,0)" />
          </linearGradient>
        </defs>

        {/* Тонкая горизонтальная линия */}
        <line x1="0" y1="20" x2="170" y2="20" stroke="url(#ornGold)" strokeWidth="1" />
        <line x1="230" y1="20" x2="400" y2="20" stroke="url(#ornGold)" strokeWidth="1" />

        {/* Центральная звезда-ромб */}
        <g transform="translate(200, 20)">
          <path
            d="M 0 -12 L 3 -3 L 12 0 L 3 3 L 0 12 L -3 3 L -12 0 L -3 -3 Z"
            fill="url(#ornGold)"
            opacity="0.9"
          />
          <circle cx="0" cy="0" r="1.8" fill="#e8cd8c" />
        </g>

        {/* Мелкие точки по бокам */}
        <circle cx="180" cy="20" r="1.2" fill="#99762c" opacity="0.7" />
        <circle cx="220" cy="20" r="1.2" fill="#99762c" opacity="0.7" />
      </svg>
    </div>
  );
}
