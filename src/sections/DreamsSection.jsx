import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "../components/common/SectionWrapper";
import { LondonSkyline } from "../components/dreams/LondonSkyline";
import { AirTraffic } from "../components/dreams/AirTraffic";
import { BoardingPass } from "../components/dreams/BoardingPass";
import { GraduateWoman } from "../components/characters/Characters";
import { useInView } from "../hooks/useInView";
import { birthdayConfig } from "../data/birthdayConfig";
import { playJetFlyby } from "../utils/sound";
import "./DreamsSection.css";

export function DreamsSection() {
  const { dreams } = birthdayConfig;
  const canvasRef = useRef(null);
  const gapRef = useRef(null);
  const trafficRef = useRef(null);
  const [sectionRef, inView] = useInView({ threshold: 0.25, once: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    const traffic = new AirTraffic(canvas, {
      // Where the sky gap between the bridge towers is, in canvas pixels.
      getGap: () => {
        const gap = gapRef.current?.getBoundingClientRect();
        const box = canvas.getBoundingClientRect();
        if (!gap) return null;
        return { x: gap.left - box.left, y: gap.top - box.top, w: gap.width, h: gap.height };
      },
      onHeroLaunch: (duration, dir) => playJetFlyby(duration, dir),
    });
    trafficRef.current = traffic;
    return () => traffic.destroy();
  }, []);

  // Planes fly (and the scene animates) only while the section is on screen.
  useEffect(() => {
    const traffic = trafficRef.current;
    if (!traffic) return;
    if (inView && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) traffic.start();
    else traffic.stop();
  }, [inView]);

  return (
    <section ref={sectionRef} id="dreams" className={`dreams ${inView ? "" : "is-paused"}`}>
      <div className="dreams__head container">
        <SectionHeading eyebrow={dreams.eyebrow} title={dreams.title} lead={dreams.lead} />
      </div>

      <div className="dreams__scene">
        <div className="dreams__sky" aria-hidden="true">
          <div className="dreams__sun" />
          {Array.from({ length: 26 }).map((_, i) => (
            <span key={i} className="dreams__star" style={{ top: `${(i * 23) % 38}%`, left: `${(i * 41) % 100}%`, animationDelay: `${i * -0.37}s` }} />
          ))}
          <span className="dreams__cloud dreams__cloud--1" />
          <span className="dreams__cloud dreams__cloud--2" />
          <span className="dreams__cloud dreams__cloud--3" />
        </div>

        {/* Planes fly behind the skyline: towers hide them, gaps reveal them. */}
        <canvas ref={canvasRef} className="dreams__planes" aria-hidden="true" />

        <div className="dreams__city">
          <LondonSkyline gapRef={gapRef} />
        </div>

        <span className="dreams__cloud dreams__cloud--near" aria-hidden="true" />

        <div className="dreams__river" aria-hidden="true">
          <div className="dreams__reflection">
            <LondonSkyline reflection />
          </div>
          <span className="dreams__shimmer" />
        </div>

        <div className="dreams__grad">
          <motion.p
            className="dreams__bubble"
            initial={{ opacity: 0, scale: 0.6, y: 10 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.4 }}
          >
            {dreams.gradSays}
          </motion.p>
          <GraduateWoman />
        </div>
      </div>

      <div className="dreams__ticket container">
        <BoardingPass pass={dreams.pass} />
      </div>
    </section>
  );
}
