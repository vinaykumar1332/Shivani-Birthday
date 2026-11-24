import { lazy, Suspense, useEffect, useState } from "react";
import { Loader } from "./sections/Loader";
import { WishOpening } from "./sections/WishOpening";
import { Countdown } from "./sections/Countdown";
import { AmbientCanvas } from "./components/common/AmbientCanvas";
import { useLenis } from "./hooks/useLenis";
import { isMusicEnabled, startMusic, stopMusicLoop } from "./utils/backgroundMusic";
import { isLocked, timeSynced } from "./utils/serverTime";

// The main site downloads in the background (started right away) while the
// loader, countdown and wish screen play, so the first paint stays light.
const loadMainSite = () => import("./sections/MainSite");
const MainSite = lazy(loadMainSite);
loadMainSite();

const STAGE = { LOADING: "loading", COUNTDOWN: "countdown", WISH: "wish", SITE: "site" };

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

  const afterLoading = () => {
    timeSynced.then(() => setStage(isLocked() ? STAGE.COUNTDOWN : STAGE.WISH));
  };

  const restart = () => {
    window.scrollTo(0, 0);
    setStage(STAGE.WISH);
  };

  return (
    <>
      <AmbientCanvas />
      {stage === STAGE.LOADING && <Loader onDone={afterLoading} />}
      {stage === STAGE.COUNTDOWN && <Countdown onUnlock={() => setStage(STAGE.WISH)} />}
      {stage === STAGE.WISH && <WishOpening onContinue={() => setStage(STAGE.SITE)} />}
      {stage === STAGE.SITE && (
        <Suspense fallback={null}>
          <MainSite onRestart={restart} />
        </Suspense>
      )}
    </>
  );
}
