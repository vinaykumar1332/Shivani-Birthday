import { Hero } from "./Hero";
import { GiftBox } from "./GiftBox";
import { BirthdayCake } from "./BirthdayCake";
import { FireworksShow } from "./FireworksShow";
import { CharityReveal } from "./CharityReveal";
import { DreamsSection } from "./DreamsSection";
import { FinalScreen } from "./FinalScreen";
import { AmbientBackground } from "../components/common/AmbientBackground";
import { MusicToggle } from "../components/common/MusicToggle";
import { ScrollProgress } from "../components/common/ScrollProgress";
import { WaveDivider } from "../components/common/WaveDivider";

export default function MainSite({ onRestart }) {
  const scrollToCake = () => {
    document.getElementById("cake")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
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
      <FinalScreen onRestart={onRestart} />
      <MusicToggle />
    </>
  );
}
