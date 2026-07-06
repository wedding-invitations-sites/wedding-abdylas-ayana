import { useRef } from "react";
import { Ornament } from "../../ui/Ornament";
import styles from "./Address.module.scss";
import {
  motion as Motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useLang } from "../../i18n";
import { weddingConfig } from "../../config/wedding.config";
import { reveal } from "../../hooks/useReveal";
import heart from "../../assets/images/svg/heart.svg";
import { TiltCard } from "../../ui/TiltCard";
import { MagneticButton } from "../../ui/MagneticButton";

const localeMap = { en: "en-US", ru: "ru-RU", kg: "ky-KG" };

function buildEmbedSrc({ lat, lng, provider, apiKey, lang }) {
  if (provider === "google" && apiKey) {
    return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${lng}&zoom=16&language=${lang}`;
  }
  if (provider === "yandex") {
    return `https://yandex.ru/map-widget/v1/?ll=${lng},${lat}&z=16&pt=${lng},${lat},pm2rdm&lang=${
      lang === "en" ? "en_US" : "ru_RU"
    }`;
  }
  const delta = 0.006;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - delta}%2C${lat - delta * 0.65}%2C${lng + delta}%2C${lat + delta * 0.65}&layer=mapnik&marker=${lat}%2C${lng}`;
}

// Анимированный маршрут — SVG-path, который рисуется по мере скролла
function AnimatedRoute() {
  return (
    <svg
      className={styles.route}
      viewBox="0 0 400 260"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="routeGold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,240,210,0.9)" />
          <stop offset="100%" stopColor="rgba(232,205,140,0.9)" />
        </linearGradient>
      </defs>
      <Motion.path
        d="M 40 220 Q 130 150, 200 165 T 360 60"
        fill="none"
        stroke="url(#routeGold)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="6 8"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
      />
      {/* Стартовая точка */}
      <Motion.circle
        cx="40" cy="220" r="6"
        fill="#fff"
        stroke="#99762c"
        strokeWidth="1.5"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      />
      {/* Конечная точка */}
      <Motion.circle
        cx="360" cy="60" r="8"
        fill="#99762c"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 1.9, type: "spring", stiffness: 200, damping: 12 }}
      />
    </svg>
  );
}

export function Address() {
  const { t, localize, lang } = useLang();
  const { venue, date } = weddingConfig;

  const dateObj = new Date(date);
  const dateFormatted = new Intl.DateTimeFormat(localeMap[lang] || "ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(dateObj);
  const timeFormatted = new Intl.DateTimeFormat(localeMap[lang] || "ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(dateObj);

  const { lat, lng } = venue.coords;
  const embedSrc = buildEmbedSrc({
    lat,
    lng,
    provider: venue.mapProvider || "osm",
    apiKey: venue.googleApiKey,
    lang,
  });
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  // Reveal-карты: расфокус → фокус по мере входа в viewport
  const mapRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: mapRef,
    offset: ["start 90%", "start 30%"],
  });
  const mapBlur = useTransform(scrollYProgress, [0, 1], ["16px", "0px"]);
  const mapGrayscale = useTransform(scrollYProgress, [0, 1], [1, 0.55]);
  const mapScale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);

  return (
    <div className={styles.wrapper}>
      <Motion.h2 {...reveal.fadeUp} className={styles.title}>
        {t("address.sectionTitle")}
      </Motion.h2>

      {/* Анимированный маршрут между секциями (только на десктопе) */}
      <div className={styles.routeLayer}>
        <AnimatedRoute />
      </div>

      <div className={styles.grid}>
        <Motion.div {...reveal.fadeUp} className={styles.infoWrap}>
          <TiltCard className={styles.tiltCard} maxTilt={7}>
            <div className={styles.info}>
              <div className={styles.markPin}>
                <img src={heart} alt="" />
              </div>
              <p className={styles.venueName}>{localize(venue.name)}</p>
              <p className={styles.desk}>{localize(venue.address)}</p>
              <div className={styles.whenRow}>
                <span className={styles.whenDate}>{dateFormatted}</span>
                <span className={styles.whenSep}>·</span>
                <span className={styles.whenTime}>{timeFormatted}</span>
              </div>

              <div className={styles.actions}>
                <MagneticButton
                  className={styles.primary}
                  onClick={() => window.open(directionsUrl, "_blank", "noopener")}
                  data-cursor="hover"
                >
                  <span className={styles.btnLabel}>{t("address.directions")}</span>
                  <span className={styles.btnArrow}>→</span>
                </MagneticButton>
                <MagneticButton
                  className={styles.ghost}
                  onClick={() => window.open(venue.externalMapUrl, "_blank", "noopener")}
                  data-cursor="hover"
                >
                  {t("address.viewOnMap")}
                </MagneticButton>
              </div>
            </div>
          </TiltCard>
        </Motion.div>

        <Motion.div
          ref={mapRef}
          {...reveal.scaleIn}
          className={styles.mapWrap}
        >
          <Motion.iframe
            className={styles.map}
            src={embedSrc}
            title="Wedding venue map"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            style={{
              filter: useTransform(
                [mapBlur, mapGrayscale],
                ([b, g]) =>
                  `blur(${b}) grayscale(${g}) sepia(0.2) hue-rotate(345deg) saturate(0.9) brightness(1.05)`
              ),
              scale: mapScale,
            }}
          />
          <div className={styles.mapTone} aria-hidden="true" />
          <div className={styles.mapCorners} aria-hidden="true">
            <span /><span /><span /><span />
          </div>
          <div className={styles.pin} aria-hidden="true">
            <div className={styles.pinPulse} />
            <div className={styles.pinPulse2} />
            <div className={styles.pinBody}>
              <img src={heart} alt="" />
            </div>
          </div>
        </Motion.div>
      </div>

      <Ornament />
    </div>
  );
}
