import styles from "./LangSwitcher.module.scss";
import { useLang } from "../../i18n";
import { motion as Motion } from "framer-motion";
import cn from "classnames";

const labels = { en: "EN", ru: "RU", kg: "KG" };

export function LangSwitcher() {
  const { lang, setLang, locales } = useLang();

  return (
    <div className={styles.wrapper} role="group" aria-label="Language">
      {locales.map((code) => (
        <button
          key={code}
          type="button"
          className={cn(styles.item, { [styles.active]: lang === code })}
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          data-cursor="hover"
        >
          {lang === code && (
            <Motion.span
              layoutId="langPill"
              className={styles.activeBg}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          <span className={styles.label}>{labels[code] ?? code.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
}
