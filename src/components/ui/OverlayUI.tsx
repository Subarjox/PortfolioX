"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface OverlayUIProps {
  currentText?: string;
  onTextChange?: (text: string) => void;
}

export function OverlayUI({
  currentText = "code",
  onTextChange,
}: OverlayUIProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-6 sm:p-8 md:p-14 text-[#dedede] select-none overflow-hidden">
      {/* ===== AMBIENT DECORATIVE OBJECTS (DESIGN BRIDGE WITH ABOUT & EXPERIENCE) ===== */}

      {/* Background Decorative Crosshairs matching partikle.png */}
      <div className="absolute top-1/4 left-1/5 text-white/20 text-xs font-mono select-none pointer-events-none">+</div>
      <div className="absolute bottom-1/3 right-1/4 text-white/20 text-xs font-mono select-none pointer-events-none">+</div>
      <div className="absolute top-1/2 right-12 text-white/10 text-xs font-mono select-none pointer-events-none">+</div>
      <div className="absolute top-1/3 left-10 text-white/15 text-xs font-mono select-none pointer-events-none">+</div>

      {/* Background Geometric Doodles matching About & Experience */}
      {/* Doodle 1: Subtle Circular Orbit Outline */}
      <svg
        className="absolute top-1/4 right-8 sm:right-24 w-32 sm:w-48 h-32 sm:h-48 opacity-40 pointer-events-none animate-spin-ultra-slow"
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="50"
          cy="50"
          r="46"
          stroke="#3b82f6"
          strokeWidth="1.2"
          strokeDasharray="4 8"
          strokeLinecap="round"
        />
        <circle cx="50" cy="4" r="2.5" fill="#3b82f6" />
      </svg>

      {/* Doodle 2: Hand-drawn Swirl Knot */}
      <svg
        className="absolute top-1/2 left-6 sm:left-14 w-28 sm:w-36 h-28 sm:h-36 opacity-60 pointer-events-none -translate-y-1/2 animate-float"
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M 30 65 C 10 50, 15 20, 42 18 C 68 16, 78 46, 68 70 C 60 90, 32 92, 24 74 C 16 56, 54 40, 74 52"
          stroke="#ff6a2b"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>

      {/* Star Accents matching About & Experience */}
      <span className="absolute top-28 sm:top-36 right-1/4 text-2xl sm:text-3xl text-[#7c5cff] font-mono pointer-events-none select-none animate-float-slow opacity-85">
        ✱
      </span>
      <span className="absolute bottom-40 left-12 sm:left-24 text-xl sm:text-2xl text-[#ffd23f] font-mono pointer-events-none select-none animate-float opacity-75">
        ✱
      </span>

      {/* Floating Micro-Chips matching About & Experience */}
      {/* Chip 1: Top-Right */}
      <div className="absolute top-36 sm:top-44 right-10 sm:right-28 rotate-3 pointer-events-none animate-float hidden sm:block">
        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-neutral-300 backdrop-blur-sm shadow-sm flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_6px_#3b82f6]" />
          Large Language Model &amp; Machine Learning
        </span>
      </div>

      {/* Chip 2: Mid-Left */}
      <div className="absolute top-1/3 left-8 sm:left-20 -rotate-4 pointer-events-none animate-float-delayed hidden sm:block">
        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-neutral-300 backdrop-blur-sm shadow-sm flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_6px_#f97316]" />
          Fullstack Developer
        </span>
      </div>

      {/* Chip 3: Bottom-Right Above Footer */}
      <div className="absolute bottom-36 sm:bottom-44 right-8 sm:right-20 rotate-2 pointer-events-none animate-float-slow hidden md:block">
        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-neutral-300 backdrop-blur-sm shadow-sm flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_6px_#a855f7]" />
          Autonomous Agents
        </span>
      </div>

      {/* Top Header Clearance & Technical Coordinates */}
      <div className="flex items-center justify-between pt-16 sm:pt-14">
        {/* Technical Coordinates Badge */}
        <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] text-neutral-500 tracking-widest uppercase">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
          <span className="hidden xs:inline">CIMAHI, ID //</span>
          <span>06°53&apos;S 107°32&apos;E</span>
        </div>
      </div>

      {/* Subtle Horizontal Tech Separator Line and Bottom Footer */}
      <div className="w-full flex flex-col gap-4">
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent border-t border-dashed border-white/20" />

        {/* Bottom Bar */}
        <footer className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          {/* Bottom Left Paragraph and Tags */}
          <div className="space-y-4 max-w-lg">
            <div className="pt-2 flex items-center gap-3 text-[10px] md:text-[11px] font-mono tracking-[0.22em] text-[#8e8e93] uppercase">
              <span>Building Apps</span>
              <span>•</span>
              <span>Automating Workflows</span>
            </div>
          </div>

          {/* Bottom Right: SCROLL */}
          <div className="self-end md:self-auto pointer-events-auto">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  const aboutEl = document.getElementById("about");
                  if (aboutEl) {
                    aboutEl.scrollIntoView({ behavior: "smooth" });
                  } else {
                    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
                  }
                }
              }}
              className="text-[11px] md:text-xs font-mono tracking-[0.28em] text-[#9a9a9e] uppercase cursor-pointer hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>SCROLL</span>
              <span className="text-xs animate-bounce">↓</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
