"use client";

import dynamic from "next/dynamic";
import { OverlayUI } from "@/components/ui/OverlayUI";

const SceneCanvas = dynamic(
  () => import("@/components/canvas/SceneCanvas").then((mod) => mod.SceneCanvas),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#060608]">
      <SceneCanvas />
      <OverlayUI />
    </main>
  );
}
