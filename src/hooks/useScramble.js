import { useEffect, useRef, useState } from "react";

const CHARS = "АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЭЮЯABCDEFGHIJKLMNOPQRSTUVWXYZ&";

// Хук text-scramble: даёт значение, которое анимируется от старого к новому
// через промежуточные "случайные" символы. Идеально для смены языка.
export function useScramble(text, { speed = 30, chunkSize = 3 } = {}) {
  const [output, setOutput] = useState(text);
  const rafRef = useRef(null);
  const timerRef = useRef(null);
  const prevRef = useRef(text);

  useEffect(() => {
    const from = prevRef.current || "";
    const to = text || "";
    prevRef.current = to;

    if (from === to) {
      setOutput(to);
      return;
    }

    const maxLen = Math.max(from.length, to.length);
    // "queue" описывает для каждого символа: from -> to и в какой момент начать/закончить перекатывание
    const queue = Array.from({ length: maxLen }, (_, i) => {
      const start = Math.floor(Math.random() * 20);
      const end = start + 10 + Math.floor(Math.random() * 20);
      return {
        from: from[i] || "",
        to: to[i] || "",
        start,
        end,
        char: "",
      };
    });

    let frame = 0;
    const tick = () => {
      let done = 0;
      const out = queue
        .map((q) => {
          if (frame >= q.end) {
            done++;
            return q.to;
          }
          if (frame >= q.start) {
            if (!q.char || Math.random() < 0.28) {
              q.char = CHARS[Math.floor(Math.random() * CHARS.length)];
            }
            return q.char;
          }
          return q.from;
        })
        .join("");
      setOutput(out);
      if (done < queue.length) {
        frame += chunkSize;
        timerRef.current = setTimeout(() => {
          rafRef.current = requestAnimationFrame(tick);
        }, speed);
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [text, speed, chunkSize]);

  return output;
}
