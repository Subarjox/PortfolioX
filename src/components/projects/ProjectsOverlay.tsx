"use client";

import React from "react";
import { PROJECTS_DATA } from "@/data/projectsData";

interface ProjectsOverlayProps {
  activeNumber: string;
  activeIndex: number;
  totalCount?: number;
  isMobile: boolean;
}

export function ProjectsOverlay({
  activeNumber,
  activeIndex,
  totalCount = 6,
  isMobile,
}: ProjectsOverlayProps) {
  const currentProject = PROJECTS_DATA[activeIndex] || PROJECTS_DATA[0];
  const totalFormatted = String(totalCount).padStart(2, "0");

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-6 md:p-12 select-none text-neutral-900">
      {/* Top Header */}
      <header className="flex items-center justify-between">
        <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-neutral-900">
          Featured
        </h2>

        <a
          href="#projects"
          className="pointer-events-auto flex items-center gap-1.5 font-mono text-xs md:text-sm tracking-wider text-neutral-600 hover:text-neutral-950 transition-colors"
        >
          <span>Beyond The Projects</span>
          <span className="text-sm font-sans">↘</span>
        </a>
      </header>

      {/* Center Background Floating Decorative Title on Desktop */}
      {!isMobile && (
        <div className="absolute bottom-20 left-8 md:left-14 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="font-mono text-base font-semibold tracking-wider text-neutral-900">
              {activeNumber}
            </span>
            <span className="w-8 h-[2px] bg-neutral-800" />
            <span className="font-mono text-xs tracking-wider text-neutral-400">
              {totalFormatted}
            </span>
          </div>

          <h3 className="mt-2 text-2xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-neutral-600/90 -rotate-2 origin-left transition-all duration-300">
            {currentProject.title}
            <span className="inline-block ml-2 text-xl font-normal text-neutral-400">↗</span>
          </h3>
        </div>
      )}

      {/* Bottom Center Indicator on Desktop */}
      {!isMobile && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 font-mono text-xs tracking-wider text-neutral-600">
          <span>Scroll to see the projects</span>
          <span className="animate-bounce">↓</span>
        </div>
      )}

      {/* Mobile Bottom Layout Matching phoneprojeclist.png */}
      {isMobile && (
        <div className="w-full flex flex-col mt-auto pt-6">
          {/* Mobile Counter 02 — 06 */}
          <div className="flex items-center gap-3 px-2">
            <span className="font-mono text-2xl font-semibold text-neutral-900 tracking-tight">
              {activeNumber}
            </span>
            <div className="flex items-center w-12 h-[2px] bg-neutral-200">
              <div
                className="h-full bg-neutral-900 transition-all duration-300"
                style={{
                  width: `${((activeIndex + 1) / totalCount) * 100}%`,
                }}
              />
            </div>
            <span className="font-mono text-xs text-neutral-400">
              {totalFormatted}
            </span>
          </div>

          {/* Thin Horizontal Divider */}
          <div className="w-full h-[1px] bg-neutral-200/90 my-3" />

          {/* Bottom Prompt & Arrow Matching phoneprojeclist.png */}
          <div className="flex items-center justify-between px-2 font-mono text-[11px] text-neutral-600 tracking-wider">
            <span>Scroll to see the projects</span>
            <span className="text-sm text-neutral-800 animate-bounce">↓</span>
          </div>
        </div>
      )}
    </div>
  );
}
