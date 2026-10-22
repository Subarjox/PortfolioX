"use client";

import React from "react";
import { ExternalLink } from "lucide-react";

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

      {/* Top spacer (reserved for floating Navbar) */}
      <div className="h-12" />

      {/* Subtle Horizontal Tech Separator Line and Bottom Notice */}
      <div className="w-full flex flex-col gap-4">
        {/* Notice Banner: Website is on development */}
        <div className="pointer-events-auto flex items-center justify-start">
          <a
            href="https://resume-phi-smoky-95.vercel.app/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 backdrop-blur-md text-xs font-mono tracking-wide text-neutral-300 hover:text-white transition-all duration-300 shadow-sm shadow-white/5 cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse shrink-0" />
            <span className="font-semibold uppercase tracking-wider text-[11px] text-white">Notice:</span>
            <span className="text-neutral-200 group-hover:text-white transition-colors">
              Website is on development
            </span>
            <span className="text-neutral-400 group-hover:text-neutral-200 text-[11px] font-medium hidden sm:inline">
              • View live resume
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-300 group-hover:text-white transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent border-t border-dashed border-white/20" />

        {/* Bottom Bar: Matching partikle.png exactly */}
        <footer className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          {/* Bottom Left Paragraph and Tags */}
          <div className="space-y-4 max-w-lg">
            {/* <p className="text-xs md:text-sm font-normal tracking-[0.04em] text-zinc-300 leading-relaxed lowercase">
              Analyze, Design and Automate your workflows
            </p> */}
            <div className="pt-2 flex items-center gap-3 text-[10px] md:text-[11px] font-mono tracking-[0.22em] text-[#8e8e93] uppercase">
              <span>Building Apps</span>
              <span>And</span>
              <span>Automating Workflows</span>
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
