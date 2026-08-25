import styles from "./AuthorContacts.module.scss";
import { motion as Motion } from "framer-motion";
import { useLang } from "../../i18n";
import { reveal } from "../../hooks/useReveal";

export const AuthorContacts = () => {
  const { t } = useLang();

  return (
    <div className={styles.container}>
      <Motion.p {...reveal.fadeUp} className={styles.title}>
        {t("authorContacts.title")}
      </Motion.p>

      <Motion.div {...reveal.fadeUp} className={styles.links}>
        <a
          href="https://www.instagram.com/t.invitations.kg?utm_source=qr"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className={styles.iconLink}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="4.2" />
            <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
          </svg>
        </a>
        <a
          href="https://wa.me/996709240722"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className={styles.iconLink}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 11.5a8.5 8.5 0 01-12.7 7.4L3 21l2.2-5.2A8.5 8.5 0 1121 11.5z" />
            <path d="M8.5 9.5c0 3.5 2.5 6 6 6 .5 0 1-.1 1.4-.3l1.6-.6-1-1.8c-.2-.4-.6-.6-1-.5l-1 .3c-1-.2-2-.8-2.7-1.7l.5-.9c.2-.3.2-.7 0-1L11.4 7.7c-.2-.3-.6-.4-.9-.3-1.1.3-2 1.3-2 2.1z" />
          </svg>
        </a>
      </Motion.div>

      <Motion.p {...reveal.fadeUp} className={styles.domain}>
        t.invitations.kg
      </Motion.p>
    </div>
  );
};
