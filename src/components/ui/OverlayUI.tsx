"use client";

import React, { useState } from "react";
import { Sparkles, ChevronDown, Activity, Sliders } from "lucide-react";

export function OverlayUI() {
  const [activeTab, setActiveTab] = useState("SIMULATION");

  return (
    <div className="pointer-events-none fixed inset-0 z-10 flex flex-col justify-between p-6 md:p-12 text-[#e5e5e7]">
      {/* Top Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-[#e6c875] animate-pulse" />
          <span className="text-xs font-mono tracking-[0.25em] text-[#a1a1aa] uppercase">
            BARJOX ARCHITECTURE // GPGPU FLUIDS
          </span>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-[#e6c875]" />
            <span className="text-[11px] font-mono tracking-wider text-zinc-300">
              262,144 PARTICLES
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
            <Activity className="h-3 w-3 text-emerald-400" />
            <span className="text-[11px] font-mono tracking-wider text-zinc-300">
              60 FPS / GPU COMPUTE
            </span>
          </div>
        </div>
      </header>

      {/* Center Subtle Interaction Cue */}
      <div className="flex justify-center">
        <div className="px-4 py-1.5 rounded-full border border-white/5 bg-black/30 backdrop-blur-sm">
          <span className="text-[10px] md:text-xs font-mono tracking-[0.3em] text-white/40 uppercase select-none">
            MOVE CURSOR TO INTERACT WITH FLUID FIELD
          </span>
        </div>
      </div>

      {/* Bottom Bar Content */}
      <footer className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
        {/* Bottom Left: HIGH-END DIGITAL EXPERIENCES... */}
        <div className="max-w-md space-y-2">
          <p className="text-xs md:text-sm font-light tracking-[0.18em] text-zinc-200 leading-relaxed uppercase">
            HIGH-END DIGITAL EXPERIENCES POWERED BY LOW-LEVEL COMPUTE & ARCHITECTURAL SHADERS
          </p>
          <div className="h-[1px] w-20 bg-[#e6c875]/60" />
        </div>

        {/* Bottom Right: SCROLL TO EXPLORE */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <span className="text-xs font-mono tracking-[0.25em] text-zinc-400 uppercase">
            SCROLL TO EXPLORE
          </span>
          <ChevronDown className="h-4 w-4 text-[#e6c875] animate-bounce" />
        </div>
      </footer>
    </div>
  );
}
