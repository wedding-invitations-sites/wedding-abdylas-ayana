import { useEffect, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { Address } from "./components/Address";
import { Calendar } from "./components/Calendar";
import { Hero } from "./components/Hero";
import { Ouners } from "./components/Ouners";
import { Present } from "./components/Present";
import { RSVP } from "./components/RSVP";
import { Timeline } from "./components/Timeline";
import { Timer } from "./components/Timer";
import { LangSwitcher } from "./components/LangSwitcher";
import { Preloader } from "./components/Preloader";
import { ScrollTop } from "./components/ScrollTop";
import { MusicToggle } from "./components/MusicToggle";
import { CustomCursor } from "./ui/CustomCursor";
import { LangProvider } from "./i18n";
import { useLenis } from "./hooks/useLenis";
import "./styles/global.scss";

function AppInner() {
  const [isLocked, setIsLocked] = useState(false);
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  useLenis();

  // После разблокировки — плавный автоскролл к следующей секции.
  useEffect(() => {
    if (!isLocked) return;
    const id = setTimeout(() => {
      const el = document.getElementById("after-hero");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 650);
    return () => clearTimeout(id);
  }, [isLocked]);

  return (
    <>
      <Preloader />
      <CustomCursor />
      <LangSwitcher />
      <ScrollTop />
      <MusicToggle
        audio={audio}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        visible={isLocked}
      />
      <main>
        <Hero
          isLocked={isLocked}
          setIsLocked={setIsLocked}
          audio={audio}
          setAudio={setAudio}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
        />
        <AnimatePresence>
          {isLocked && (
            <Motion.div
              id="after-hero"
              initial={{ opacity: 0, y: 60, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Present />
              <Calendar />
              <Address />
              <Timeline />
              <Ouners />
              <RSVP />
              <Timer />
            </Motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}

function App() {
  return (
    <LangProvider>
      <AppInner />
    </LangProvider>
  );
}

export default App;
