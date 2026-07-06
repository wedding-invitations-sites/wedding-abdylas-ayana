import styles from "./Ouners.module.scss";
import { Ornament } from "../../ui/Ornament";
import { motion as Motion } from "framer-motion";
import { useLang } from "../../i18n";
import { weddingConfig } from "../../config/wedding.config";
import { reveal } from "../../hooks/useReveal";

export function Ouners() {
  const { t, localize } = useLang();
  const { parents } = weddingConfig;
  const groomHosts = localize(parents.groom);
  const brideHosts = parents.bride ? localize(parents.bride) : null;

  if (!groomHosts && !brideHosts) return null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.frame}>
        <Motion.p {...reveal.fadeUp} className={styles.desk}>
          {t("owners.label")}
        </Motion.p>

        <div className={styles.namesRow}>
          {groomHosts && (
            <Motion.h2 {...reveal.scaleIn} className={styles.names}>
              {groomHosts}
            </Motion.h2>
          )}
          {brideHosts && (
            <>
              <Motion.span
                {...reveal.fadeUp}
                className={styles.namesSep}
                aria-hidden="true"
              >
                &amp;
              </Motion.span>
              <Motion.h2 {...reveal.scaleIn} className={styles.names}>
                {brideHosts}
              </Motion.h2>
            </>
          )}
        </div>

        <Motion.div
          {...reveal.fadeUp}
          className={styles.signature}
        >
          <svg viewBox="0 0 200 40" preserveAspectRatio="xMidYMid meet">
            <Motion.path
              d="M 20 30 Q 40 8, 70 22 T 130 20 T 180 12"
              fill="none"
              stroke="url(#sigGold)"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
            />
            <defs>
              <linearGradient id="sigGold" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7c6024" />
                <stop offset="50%" stopColor="#c69b47" />
                <stop offset="100%" stopColor="#7c6024" />
              </linearGradient>
            </defs>
          </svg>
        </Motion.div>
      </div>

      <Ornament />
    </div>
  );
}
