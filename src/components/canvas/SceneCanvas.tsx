"use client";

import { Canvas } from "@react-three/fiber";
import { GPGPUParticles } from "@/components/particles/GPGPUParticles";

export function SceneCanvas() {
  return (
    <div className="absolute inset-0 w-full h-full bg-[#060608]">
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 55, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <GPGPUParticles size={512} particleScale={1.0} />
      </Canvas>
    </div>
  );
}
