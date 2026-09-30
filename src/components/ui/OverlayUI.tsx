"use client";

import React from "react";

interface OverlayUIProps {
  currentText?: string;
  onTextChange?: (text: string) => void;
}

export function OverlayUI({
  currentText = "code",
  onTextChange,
}: OverlayUIProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-8 md:p-14 text-[#dedede] select-none">
      {/* Background Decorative Crosshairs matching partikle.png */}
      <div className="absolute top-1/4 left-1/5 text-white/20 text-xs font-mono select-none">+</div>
      <div className="absolute top-1/3 right-1/4 text-white/15 text-xs font-mono select-none">+</div>
      <div className="absolute bottom-1/3 left-1/3 text-white/15 text-xs font-mono select-none">+</div>
      <div className="absolute top-2/3 right-1/5 text-white/20 text-xs font-mono select-none">+</div>

      {/* Top Left: DIGITAL EXPERIENCES / ENGINEERING */}
      <header className="flex items-start justify-between">
        <div>
          <span className="text-[11px] md:text-xs font-mono tracking-[0.25em] text-[#a6a6aa] uppercase">
            AI Engineer / Software Engineer
          </span>
        </div>

        {/* Minimal Interactive Text Modifier */}
        <div className="pointer-events-auto flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-black/40 backdrop-blur-md">
            <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">PORTFOLIO</span>
            {/* <input
              type="text"
              value={currentText}
              onChange={(e) => onTextChange?.(e.target.value.toLowerCase())}
              className="bg-transparent text-xs font-mono tracking-wider text-[#e6c875] outline-none w-20 uppercase font-bold"
              placeholder="code"
            /> */}
          </div>
        </div>
      </header>

      {/* Subtle Horizontal Tech Separator Line matching partikle.png */}
      <div className="w-full flex flex-col gap-6">
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent border-t border-dashed border-white/20" />

        {/* Bottom Bar: Matching partikle.png exactly */}
        <footer className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          {/* Bottom Left Paragraph and Tags */}
          <div className="space-y-4 max-w-lg">
            <p className="text-xs md:text-sm font-normal tracking-[0.04em] text-zinc-300 leading-relaxed lowercase">
              digital experiences: premium websites, immersive WebGL, and<br className="hidden sm:inline" /> management tools.
            </p>
            <div className="pt-2 flex items-center gap-3 text-[10px] md:text-[11px] font-mono tracking-[0.22em] text-[#8e8e93] uppercase">
              <span>WEBGL</span>
              <span>/</span>
              <span>3D</span>
              <span className="px-2">/</span>
              <span>MANAGEMENT TOOLS</span>
            </div>
          </div>

          {/* Bottom Right: SCROLL */}
          <div className="self-end md:self-auto pointer-events-auto">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
                }
              }}
              className="text-[11px] md:text-xs font-mono tracking-[0.28em] text-[#9a9a9e] uppercase cursor-pointer hover:text-white transition-colors"
            >
              SCROLL
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
