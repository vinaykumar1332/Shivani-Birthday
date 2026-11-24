import { Hero } from "./Hero";
import { GiftBox } from "./GiftBox";
import { GreetingCards } from "./GreetingCards";
import { BirthdayCake } from "./BirthdayCake";
import { FireworksShow } from "./FireworksShow";
import { CharityReveal } from "./CharityReveal";
import { DreamsSection } from "./DreamsSection";
import { FinalScreen } from "./FinalScreen";
import { AmbientBackground } from "../components/common/AmbientBackground";
import { MusicToggle } from "../components/common/MusicToggle";
import { ScrollProgress } from "../components/common/ScrollProgress";
import { SectionBridge } from "../components/common/SectionBridge";

export default function MainSite({ onRestart }) {
  const scrollToCake = () => {
    document.getElementById("cake")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <ScrollProgress />
      <AmbientBackground />
      <Hero onBegin={scrollToCake} />
      <SectionBridge from="#7A4A8C" via="#4A2C6A" toL="#2D1B4E" glow="rgba(242, 149, 110, 0.4)" overlap={50} />
      <BirthdayCake />
      <SectionBridge from="#1A1030" toL="#1D1529" glow="rgba(199, 125, 255, 0.28)" />
      <FireworksShow />
      <SectionBridge from="#1D1529" toL="#2D1B4E" glow="rgba(247, 37, 133, 0.25)" overlap={40} />
      <GiftBox />
      <SectionBridge from="#1A1030" toL="#2A1640" glow="rgba(255, 143, 177, 0.3)" />
      <GreetingCards />
      <SectionBridge from="#8E3F7E" via="#C2577A" toL="#E8B84B" toR="#F2956E" glow="rgba(255, 210, 122, 0.55)" />
      <CharityReveal />
      <SectionBridge from="#E9826C" via="#8E3F7E" toL="#1A1030" glow="rgba(247, 37, 133, 0.35)" />
      <DreamsSection />
      <SectionBridge from="#2D1B4E" toL="#3A1F5D" toR="#6A3290" glow="rgba(209, 71, 138, 0.35)" />
      <FinalScreen onRestart={onRestart} />
      <MusicToggle />
    </>
  );
}
