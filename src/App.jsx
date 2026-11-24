import { useEffect, useState } from "react";
import { Loader } from "./sections/Loader";
import { WishOpening } from "./sections/WishOpening";
import { Hero } from "./sections/Hero";
import { GiftBox } from "./sections/GiftBox";
import { BirthdayCake } from "./sections/BirthdayCake";
import { FireworksShow } from "./sections/FireworksShow";
import { CharityReveal } from "./sections/CharityReveal";
import { DreamsSection } from "./sections/DreamsSection";
import { FinalScreen } from "./sections/FinalScreen";
import { AmbientBackground } from "./components/common/AmbientBackground";
import { AmbientCanvas } from "./components/common/AmbientCanvas";
import { MusicToggle } from "./components/common/MusicToggle";
import { ScrollProgress } from "./components/common/ScrollProgress";
import { WaveDivider } from "./components/common/WaveDivider";
import { useLenis } from "./hooks/useLenis";
import { isMusicEnabled, startMusic, stopMusicLoop } from "./utils/backgroundMusic";

const STAGE = { LOADING: "loading", WISH: "wish", SITE: "site" };

export default function App() {
  const [stage, setStage] = useState(STAGE.LOADING);

  useLenis();

  // Background music plays on the main page only, so the wish screen's
  // birthday song always sounds clean. Audio is already unlocked by then
  // (she tapped "Open My Birthday Wish").
  useEffect(() => {
    if (stage !== STAGE.SITE) return;
    if (isMusicEnabled()) startMusic();
    return stopMusicLoop;
  }, [stage]);

  const scrollToCake = () => {
    document.getElementById("cake")?.scrollIntoView({ behavior: "smooth" });
  };

  const restart = () => {
    window.scrollTo(0, 0);
    setStage(STAGE.WISH);
  };

  return (
    <>
      <AmbientCanvas />
      {stage === STAGE.LOADING && <Loader onDone={() => setStage(STAGE.WISH)} />}
      {stage === STAGE.WISH && <WishOpening onContinue={() => setStage(STAGE.SITE)} />}
      {stage === STAGE.SITE && (
        <>
          <ScrollProgress />
          <AmbientBackground />
          <Hero onBegin={scrollToCake} />
          <WaveDivider color="var(--color-plum)" />
          <BirthdayCake />
          <FireworksShow />
          <GiftBox />
          <WaveDivider flip color="#E8B84B" />
          <CharityReveal />
          <DreamsSection />
          <FinalScreen onRestart={restart} />
          <MusicToggle />
        </>
      )}
    </>
  );
}
