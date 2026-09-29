"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { OverlayUI } from "@/components/ui/OverlayUI";
import { FeaturedProjectsSection } from "@/components/projects/FeaturedProjectsSection";

const SceneCanvas = dynamic(
  () => import("@/components/canvas/SceneCanvas").then((mod) => mod.SceneCanvas),
  { ssr: false }
);

export default function Home() {
  const [text, setText] = useState("AI ENGINEER");

  return (
    <main className="relative min-h-screen w-full bg-[#090909] text-white selection:bg-neutral-800">
      {/* Hero Section: 3D Particle Simulation */}
      <section className="relative h-screen w-full overflow-hidden bg-[#090909]">
        <SceneCanvas key={text} text={text} size={48} />
        <OverlayUI currentText={text} onTextChange={setText} />
      </section>

      {/* Featured Projects Section: Pinned 3D Curved Showcase */}
      <FeaturedProjectsSection />
    </main>
  );
}
