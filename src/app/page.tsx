"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { OverlayUI } from "@/components/ui/OverlayUI";
import { FeaturedProjectsSection } from "@/components/projects/FeaturedProjectsSection";
import { ROTATING_WORDS } from "@/constants/textSequence";

const SceneCanvas = dynamic(
  () => import("@/components/canvas/SceneCanvas").then((mod) => mod.SceneCanvas),
  { ssr: false }
);

export default function Home() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 7000);

    return () => clearInterval(timer);
  }, []);

  const currentText = ROTATING_WORDS[wordIndex];

  return (
    <main className="relative min-h-screen w-full bg-[#090909] text-white selection:bg-neutral-800">
      {/* Hero Section: 3D Particle Simulation */}
      <section className="relative h-screen w-full overflow-hidden bg-[#090909]">
        <SceneCanvas text={currentText} size={48} />
        <OverlayUI currentText={currentText} />
      </section>

      {/* Featured Projects Section: Pinned 3D Curved Showcase */}
      <FeaturedProjectsSection />

    </main>
  );
}
