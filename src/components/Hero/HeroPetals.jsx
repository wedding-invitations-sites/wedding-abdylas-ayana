import { useEffect, useRef } from "react";

// Canvas-слой: медленно падающие полупрозрачные лепестки-искры.
// Уважает prefers-reduced-motion.
// Если передан audioAnalyser (AnalyserNode), лепестки пульсируют по амплитуде.

const PETAL_COUNT = 22;

function createPetal(width, height) {
  return {
    x: Math.random() * width,
    y: Math.random() * height - height,
    size: 5 + Math.random() * 9,
    speedY: 0.2 + Math.random() * 0.55,
    swayAmp: 12 + Math.random() * 30,
    swaySpeed: 0.0006 + Math.random() * 0.0016,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.012,
    alpha: 0.2 + Math.random() * 0.4,
    phase: Math.random() * Math.PI * 2,
  };
}

export function HeroPetals({ analyser }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let dpr = Math.max(1, window.devicePixelRatio || 1);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const petals = Array.from({ length: PETAL_COUNT }, () => createPetal(width, height));
    const freqData = analyser
      ? new Uint8Array(analyser.frequencyBinCount)
      : null;
    let smoothedAmp = 0;

    let raf;
    const render = (time) => {
      ctx.clearRect(0, 0, width, height);

      // Считываем амплитуду аудио (0..1) с сглаживанием
      let amp = 0;
      if (analyser && freqData) {
        analyser.getByteFrequencyData(freqData);
        let sum = 0;
        for (let i = 0; i < freqData.length; i++) sum += freqData[i];
        amp = sum / freqData.length / 255;
      }
      smoothedAmp = smoothedAmp * 0.9 + amp * 0.1;
      const pulse = 1 + smoothedAmp * 0.9;

      for (const p of petals) {
        p.y += p.speedY * (1 + smoothedAmp * 0.6);
        p.rotation += p.rotSpeed;
        const sway = Math.sin(time * p.swaySpeed + p.phase) * p.swayAmp;
        const drawX = p.x + sway;

        if (p.y - p.size > height) {
          p.y = -p.size;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(drawX, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.min(1, p.alpha * (1 + smoothedAmp * 0.9));
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * pulse);
        grad.addColorStop(0, "rgba(255, 240, 210, 0.98)");
        grad.addColorStop(0.55, "rgba(232, 205, 140, 0.55)");
        grad.addColorStop(1, "rgba(153, 118, 44, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.55 * pulse, p.size * pulse, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    const onResize = () => {
      dpr = Math.max(1, window.devicePixelRatio || 1);
      resize();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [analyser]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}
