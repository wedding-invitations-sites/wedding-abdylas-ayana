import { useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import confetti from "canvas-confetti";
import styles from "./RSVP.module.scss";
import { useLang } from "../../i18n";
import { weddingConfig } from "../../config/wedding.config";
import { reveal } from "../../hooks/useReveal";
import cn from "classnames";

const initialForm = {
  name: "",
  attendance: "",
  guests: 1,
  wishes: "",
};

function fireConfetti() {
  const colors = ["#99762c", "#c69b47", "#f4e2b5", "#ffffff", "#e08a5f"];
  const base = { origin: { y: 0.7 }, colors, ticks: 220, scalar: 1.1 };
  confetti({ ...base, particleCount: 80, spread: 75, startVelocity: 48 });
  setTimeout(() => confetti({ ...base, particleCount: 50, spread: 100, startVelocity: 35, origin: { x: 0.15, y: 0.7 } }), 180);
  setTimeout(() => confetti({ ...base, particleCount: 50, spread: 100, startVelocity: 35, origin: { x: 0.85, y: 0.7 } }), 360);
}

// Steps: name → attendance → guests (only if attending) → wishes → review
const stepsBase = ["name", "attendance", "wishes"];

export function RSVP() {
  const { t } = useLang();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [stepIndex, setStepIndex] = useState(0);

  const isAttending = form.attendance === "yes";
  const steps = isAttending
    ? ["name", "attendance", "guests", "wishes"]
    : stepsBase;
  const currentStep = steps[stepIndex];
  const isLastStep = stepIndex >= steps.length - 1;

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const canProceed = () => {
    if (currentStep === "name") return form.name.trim().length > 0;
    if (currentStep === "attendance") return !!form.attendance;
    return true;
  };

  const next = () => {
    if (!canProceed()) {
      setErrors({ [currentStep]: t("rsvp.required") });
      return;
    }
    setErrors({});
    if (isLastStep) {
      submit();
      return;
    }
    setStepIndex((v) => v + 1);
  };

  const prev = () => {
    if (stepIndex > 0) setStepIndex((v) => v - 1);
  };

  const submit = async () => {
    setStatus("submitting");
    const { formspreeId } = weddingConfig.rsvp;
    const isConfigured = formspreeId && formspreeId !== "YOUR_FORMSPREE_ID";
    if (!isConfigured) {
      console.warn("[RSVP] Formspree ID not set. Running in demo mode.");
    }

    try {
      if (isConfigured) {
        const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            attendance: form.attendance,
            guests: form.attendance === "yes" ? form.guests : 0,
            wishes: form.wishes,
          }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      } else {
        await new Promise((r) => setTimeout(r, 900));
      }
      setStatus("success");
      fireConfetti();
    } catch (err) {
      console.error("RSVP submit failed:", err);
      setStatus("error");
    }
  };

  const isSubmitting = status === "submitting";
  const isSuccess = status === "success";
  const progress = (stepIndex + 1) / steps.length;

  return (
    <div className={styles.wrapper}>
      <Motion.h2 {...reveal.fadeUp} className={styles.title}>
        {t("rsvp.sectionTitle")}
      </Motion.h2>
      <Motion.p {...reveal.fadeUp} className={styles.subtitle}>
        {t("rsvp.subtitle")}
      </Motion.p>

      <div className={styles.card}>
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <SuccessScene key="success" text={t("rsvp.success")} />
          ) : (
            <Motion.div
              key="wizard"
              className={styles.wizard}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Прогресс */}
              <div className={styles.progressWrap}>
                <div className={styles.progressTrack}>
                  <Motion.div
                    className={styles.progressFill}
                    initial={false}
                    animate={{ scaleX: progress }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
                <span className={styles.progressText}>
                  {stepIndex + 1} / {steps.length}
                </span>
              </div>

              {/* Слайд-переход между шагами */}
              <div className={styles.stepBody}>
                <AnimatePresence mode="wait">
                  <Motion.div
                    key={currentStep}
                    className={styles.step}
                    initial={{ opacity: 0, x: 40, filter: "blur(6px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: -40, filter: "blur(6px)" }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {currentStep === "name" && (
                      <div className={styles.field}>
                        <label className={styles.label} htmlFor="rsvp-name">
                          {t("rsvp.name")}
                        </label>
                        <input
                          id="rsvp-name"
                          type="text"
                          className={cn(styles.input, {
                            [styles.hasError]: errors.name,
                          })}
                          value={form.name}
                          onChange={(e) => update("name", e.target.value)}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") next();
                          }}
                          disabled={isSubmitting}
                        />
                        {errors.name && (
                          <span className={styles.errorMsg}>{errors.name}</span>
                        )}
                      </div>
                    )}

                    {currentStep === "attendance" && (
                      <div className={styles.field}>
                        <span className={styles.label}>
                          {t("rsvp.subtitle")}
                        </span>
                        <div className={styles.attendance}>
                          <button
                            type="button"
                            className={cn(styles.pill, {
                              [styles.pillActiveYes]:
                                form.attendance === "yes",
                            })}
                            onClick={() => {
                              update("attendance", "yes");
                              setTimeout(next, 380);
                            }}
                            disabled={isSubmitting}
                            data-cursor="hover"
                          >
                            <span>{t("rsvp.willAttend")}</span>
                          </button>
                          <button
                            type="button"
                            className={cn(styles.pill, {
                              [styles.pillActiveNo]:
                                form.attendance === "no",
                            })}
                            onClick={() => {
                              update("attendance", "no");
                              setTimeout(next, 380);
                            }}
                            disabled={isSubmitting}
                            data-cursor="hover"
                          >
                            <span>{t("rsvp.willNotAttend")}</span>
                          </button>
                        </div>
                        {errors.attendance && (
                          <span className={styles.errorMsg}>
                            {errors.attendance}
                          </span>
                        )}
                      </div>
                    )}

                    {currentStep === "guests" && (
                      <div className={styles.field}>
                        <label className={styles.label} htmlFor="rsvp-guests">
                          {t("rsvp.guests")}
                        </label>
                        <div className={styles.stepper}>
                          <button
                            type="button"
                            className={styles.stepBtn}
                            onClick={() =>
                              update("guests", Math.max(1, form.guests - 1))
                            }
                            disabled={isSubmitting || form.guests <= 1}
                            aria-label="-"
                          >
                            −
                          </button>
                          <span className={styles.stepValue}>{form.guests}</span>
                          <button
                            type="button"
                            className={styles.stepBtn}
                            onClick={() =>
                              update("guests", Math.min(10, form.guests + 1))
                            }
                            disabled={isSubmitting || form.guests >= 10}
                            aria-label="+"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}

                    {currentStep === "wishes" && (
                      <div className={styles.field}>
                        <label className={styles.label} htmlFor="rsvp-wishes">
                          {t("rsvp.wishes")}
                        </label>
                        <textarea
                          id="rsvp-wishes"
                          className={styles.textarea}
                          rows={4}
                          value={form.wishes}
                          onChange={(e) => update("wishes", e.target.value)}
                          disabled={isSubmitting}
                        />
                      </div>
                    )}
                  </Motion.div>
                </AnimatePresence>
              </div>

              <div className={styles.navRow}>
                {stepIndex > 0 && (
                  <button
                    type="button"
                    className={styles.back}
                    onClick={prev}
                    disabled={isSubmitting}
                    data-cursor="hover"
                  >
                    ← {t("rsvp.back") || "Back"}
                  </button>
                )}
                <button
                  type="button"
                  className={styles.submit}
                  onClick={next}
                  disabled={isSubmitting}
                  data-cursor="hover"
                >
                  {isSubmitting
                    ? t("rsvp.submitting")
                    : isLastStep
                    ? t("rsvp.submit")
                    : t("rsvp.next") || "Next"}
                </button>
              </div>

              {status === "error" && (
                <p className={styles.errorBanner}>{t("rsvp.error")}</p>
              )}
            </Motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Сцена успеха — падающая сургучная печать вместо галочки
function SuccessScene({ text }) {
  return (
    <Motion.div
      key="success"
      className={styles.success}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.sealStage}>
        <Motion.div
          className={styles.sealSuccess}
          initial={{ y: -220, scale: 0.6, rotate: -20, opacity: 0 }}
          animate={{ y: 0, scale: 1, rotate: 0, opacity: 1 }}
          transition={{
            duration: 0.9,
            ease: [0.34, 1.56, 0.64, 1],
          }}
        >
          <svg viewBox="0 0 100 100">
            <defs>
              <radialGradient id="successWax" cx="35%" cy="30%">
                <stop offset="0%" stopColor="#e08a5f" />
                <stop offset="45%" stopColor="#a63a25" />
                <stop offset="100%" stopColor="#5a1a10" />
              </radialGradient>
            </defs>
            <path
              d="M 50 8 C 68 6, 88 18, 92 40 C 96 62, 86 88, 60 92 C 40 96, 14 88, 8 62 C 4 40, 22 12, 50 8 Z"
              fill="url(#successWax)"
            />
            <ellipse cx="38" cy="30" rx="18" ry="12" fill="rgba(255,220,190,0.55)" />
            <Motion.path
              d="M 30 50 L 45 65 L 72 35"
              fill="none"
              stroke="rgba(255,220,190,0.95)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.7, delay: 0.65, ease: "easeOut" }}
            />
          </svg>
        </Motion.div>
        {/* Splash-осколки при падении */}
        {[...Array(10)].map((_, i) => {
          const angle = (i / 10) * Math.PI * 2;
          const dist = 50 + Math.random() * 40;
          return (
            <Motion.span
              key={i}
              className={styles.successChip}
              initial={{ x: 0, y: 0, opacity: 0, scale: 1 }}
              animate={{
                x: Math.cos(angle) * dist,
                y: Math.sin(angle) * dist,
                opacity: [0, 1, 0],
                scale: [1, 0.6, 0.4],
              }}
              transition={{ duration: 0.8, delay: 0.85 }}
            />
          );
        })}
      </div>

      <Motion.p
        className={styles.successText}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.6 }}
      >
        {text}
      </Motion.p>
    </Motion.div>
  );
}
