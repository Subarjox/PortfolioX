"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { GPGPUParticles } from "@/components/particles/GPGPUParticles";

interface SceneCanvasProps {
  text?: string;
  size?: number;
}

export function SceneCanvas({ text = "fahreza", size = 110 }: SceneCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full bg-[#090909]">
      <Canvas
        frameloop={isVisible ? "always" : "never"}
        style={{ touchAction: "pan-y" }}
        camera={{ position: [0, 0, 4.2], fov: 50, near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <GPGPUParticles size={size} text={text} particleScale={1.0} isVisible={isVisible} />
      </Canvas>
    </div>
  );
}
