"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { OverlayUI } from "@/components/ui/OverlayUI";

const SceneCanvas = dynamic(
  () => import("@/components/canvas/SceneCanvas").then((mod) => mod.SceneCanvas),
  { ssr: false }
);

export default function Home() {
  const [text, setText] = useState("fahreza");

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#050507]">
      <SceneCanvas key={text} text={text} size={128} />
      <OverlayUI currentText={text} onTextChange={setText} />
    </main>
  );
}
