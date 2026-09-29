"use client";

import { Canvas } from "@react-three/fiber";
import { GPGPUParticles } from "@/components/particles/GPGPUParticles";
import { OrbitalRings } from "@/components/canvas/OrbitalRings";

interface SceneCanvasProps {
  text?: string;
  size?: number;
}

export function SceneCanvas({ text = "code", size = 48 }: SceneCanvasProps) {
  return (
    <div className="absolute inset-0 w-full h-full bg-[#090909]">
      <Canvas
        style={{ touchAction: "pan-y" }}
        camera={{ position: [0, 0, 4.2], fov: 50, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <OrbitalRings />
        <GPGPUParticles size={size} text={text} particleScale={1.0} />
      </Canvas>
    </div>
  );
}
