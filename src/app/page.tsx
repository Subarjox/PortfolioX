"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { OverlayUI } from "@/components/ui/OverlayUI";
import { Navbar } from "@/components/ui/Navbar";
import { DevelopmentModal } from "@/components/ui/DevelopmentModal";
import { AboutSection } from "@/components/about/AboutSection";
import { ExperienceSection } from "@/components/experience/ExperienceSection";
import { FeaturedProjectsSection } from "@/components/projects/FeaturedProjectsSection";
import { OthersSection } from "@/components/others/OthersSection";
import { StickyNotesSection } from "@/components/stickynotes/StickyNotesSection";
import { ContactSection } from "@/components/contact/ContactSection";
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
      <DevelopmentModal />
      <Navbar />

      {/* Hero Section: 3D Particle Simulation */}
      <section id="home" className="relative h-screen w-full overflow-hidden bg-[#090909]">
        <SceneCanvas text={currentText} size={110} />
        <OverlayUI currentText={currentText} />
      </section>

      {/* About Section: Profile, Roles & Tech Stacks */}
      <AboutSection />

      {/* Experience Section: Pinned Horizontal Timeline Showcase */}
      <ExperienceSection />

      {/* Featured Projects Section: Pinned 3D Curved Showcase */}
      <FeaturedProjectsSection />

      {/* Others Section: Certifications, Publications, Honor & Awards */}
      <OthersSection />

      {/* Sticky Notes Community Board */}
      <StickyNotesSection />

      {/* Contact Section: Let's Connect & Work Together */}
      <ContactSection />

    </main>
  );
}
