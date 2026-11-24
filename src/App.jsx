import { useRef, useState } from "react";
import { Loader } from "./sections/Loader";
import { WishOpening } from "./sections/WishOpening";
import { Hero } from "./sections/Hero";
import { GiftBox } from "./sections/GiftBox";
import { BirthdayCake } from "./sections/BirthdayCake";
import { CharityReveal } from "./sections/CharityReveal";
import { FinalScreen } from "./sections/FinalScreen";
import { LumiChat } from "./components/assistant/LumiChat";
import { AmbientBackground } from "./components/common/AmbientBackground";
import { FallingDecor } from "./components/common/FallingDecor";
import { WaveDivider } from "./components/common/WaveDivider";
import { useLenis } from "./hooks/useLenis";

const STAGE = { LOADING: "loading", WISH: "wish", SITE: "site" };

export default function App() {
  const [stage, setStage] = useState(STAGE.LOADING);
  const heroRef = useRef(null);

  useLenis();

  const scrollToStory = () => {
    document.getElementById("cake")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <FallingDecor />
      {stage === STAGE.LOADING && <Loader onDone={() => setStage(STAGE.WISH)} />}
      {stage === STAGE.WISH && <WishOpening onContinue={() => setStage(STAGE.SITE)} />}
      {stage === STAGE.SITE && (
        <>
          <AmbientBackground />
          <div ref={heroRef}>
            <Hero onBegin={scrollToStory} />
          </div>
          <WaveDivider color="var(--color-plum)" />
          <BirthdayCake />
          <GiftBox />
          <WaveDivider flip color="#E8B84B" />
          <CharityReveal />
          <FinalScreen />
          <LumiChat />
        </>
      )}
    </>
  );
}
