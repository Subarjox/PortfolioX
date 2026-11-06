"use client";

import React from "react";
import { PROJECTS_DATA, ProjectItem } from "@/data/projectsData";
import { Sparkles, ExternalLink } from "lucide-react";

interface ProjectsOverlayProps {
  activeNumber: string;
  activeIndex: number;
  progress: number;
  totalCount?: number;
  totalStops?: number;
  isMobile: boolean;
  isCardHovered?: boolean;
  onSelectProject?: (project: ProjectItem) => void;
}

export function ProjectsOverlay({
  activeNumber,
  activeIndex,
  progress,
  totalCount = 4,
  totalStops = 5,
  isMobile,
  isCardHovered = false,
  onSelectProject,
}: ProjectsOverlayProps) {
  // Clamp project index within range for project data
  const safeProjectIndex = Math.min(activeIndex, totalCount - 1);
  const currentProject = PROJECTS_DATA[safeProjectIndex] || PROJECTS_DATA[0];
  const totalFormatted = String(totalCount).padStart(2, "0");

  // Smooth transition factor for the 5th stop (GitHub End Slide)
  // Starts fading in after the 4th project (progress > 0.72) and reaches full opacity by progress ~0.94
  const endT = Math.max(0, Math.min(1, (progress - 0.72) / 0.22));
  const isDarkPhase = endT > 0.5;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-6 md:p-12 select-none">
      {/* Top Header */}
      <header className="flex items-center justify-between transition-colors duration-300">
        <h2
          className={`text-4xl md:text-5xl font-black tracking-tight transition-colors duration-300 ${
            isDarkPhase ? "text-white" : "text-neutral-900"
          }`}
        >
          Featured Projects
        </h2>

        <a
          href="#others"
          className={`pointer-events-auto flex items-center gap-1.5 font-mono text-xs md:text-sm tracking-wider transition-colors duration-300 ${
            isDarkPhase
              ? "text-neutral-400 hover:text-white"
              : "text-neutral-600 hover:text-neutral-950"
          }`}
        >
          <span>Beyond The Projects</span>
          <span className="text-sm">↓</span>
        </a>
      </header>

      {/* CENTER END PANEL: GITHUB TRANSITION SLIDE MATCHING experience.png */}
      <div
        className="absolute inset-0 flex items-center justify-center p-6 sm:p-12 transition-all duration-300"
        style={{
          opacity: endT,
          pointerEvents: endT > 0.6 ? "auto" : "none",
          transform: `translateY(${(1 - endT) * 16}px)`,
        }}
      >
        <div className="max-w-xl mx-auto flex flex-col items-center justify-center text-center space-y-5 sm:space-y-6">
          <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-sky-400 mx-auto animate-pulse" />

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white leading-[1.1]">
            Ingin melihat daftar projek lengkap saya ?
          </h2>

          <p className="text-sm sm:text-base font-mono text-neutral-400 max-w-md">
            Silahkan kunjungi github.
          </p>

          <div className="pt-2">
            <a
              href="https://github.com/Subarjox"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-white text-neutral-950 font-bold text-sm sm:text-base hover:bg-neutral-200 transition-all shadow-2xl hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Kunjungi GitHub</span>
              <ExternalLink className="w-4 h-4 text-neutral-800" />
            </a>
          </div>
        </div>
      </div>

      {/* Center Background Floating Info on Desktop (Cards 1-4) */}
      {!isMobile && (
        <div
          className="absolute bottom-16 left-8 md:left-14 max-w-xl transition-opacity duration-300"
          style={{
            opacity: 1 - endT,
            pointerEvents: endT > 0.4 ? "none" : "auto",
          }}
        >
          <div className="flex items-center gap-3">
            <span className="font-mono text-base font-semibold tracking-wider text-neutral-900">
              {activeNumber}
            </span>
            <span className="w-8 h-[2px] bg-neutral-800" />
            <span className="font-mono text-xs tracking-wider text-neutral-400">
              {totalFormatted}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onSelectProject?.(currentProject)}
            className="pointer-events-auto group block mt-2 text-left cursor-pointer focus:outline-none"
          >
            <h3
              className={`text-3xl md:text-5xl font-bold tracking-tight transition-colors duration-200 ${
                isCardHovered
                  ? "text-blue-600"
                  : "text-neutral-900 group-hover:text-blue-600"
              }`}
            >
              {currentProject.title}
              <span
                className={`inline-block ml-2 text-2xl font-normal transition-all duration-200 ${
                  isCardHovered
                    ? "text-blue-600 translate-x-1.5 -translate-y-1.5"
                    : "text-neutral-400 group-hover:text-blue-600 group-hover:translate-x-1.5 group-hover:-translate-y-1.5"
                }`}
              >
                ↗
              </span>
            </h3>
          </button>

          <p className="mt-1 font-mono text-xs text-neutral-600 font-medium">
            {currentProject.subtitle}
          </p>

          {currentProject.tags && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {currentProject.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-full bg-neutral-100 text-[11px] font-mono text-neutral-600 border border-neutral-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bottom Center Indicator on Desktop */}
      {!isMobile && (
        <div
          className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 font-mono text-xs tracking-wider transition-colors duration-300 ${
            isDarkPhase ? "text-neutral-400" : "text-neutral-600"
          }`}
        >
          {isDarkPhase ? (
            <span>Scroll to continue to Beyond The Projects ↓</span>
          ) : (
            <>
              <span>Scroll to see the projects</span>
              <span className="animate-bounce">↓</span>
            </>
          )}
        </div>
      )}

      {/* Mobile Bottom Layout (Cards 1-4) */}
      {isMobile && (
        <div
          className="w-full flex flex-col mt-auto pt-6 transition-opacity duration-300"
          style={{
            opacity: 1 - endT,
            pointerEvents: endT > 0.4 ? "none" : "auto",
          }}
        >
          <div className="flex items-center gap-3 px-2">
            <span className="font-mono text-2xl font-semibold text-neutral-900 tracking-tight">
              {activeNumber}
            </span>
            <div className="flex items-center w-12 h-[2px] bg-neutral-200">
              <div
                className="h-full bg-neutral-900 transition-all duration-300"
                style={{
                  width: `${((safeProjectIndex + 1) / totalCount) * 100}%`,
                }}
              />
            </div>
            <span className="font-mono text-xs text-neutral-400">
              {totalFormatted}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onSelectProject?.(currentProject)}
            className="pointer-events-auto px-2 mt-2 text-left cursor-pointer focus:outline-none"
          >
            <h3
              className={`text-xl font-bold tracking-tight transition-colors duration-200 ${
                isCardHovered ? "text-blue-600" : "text-neutral-900"
              }`}
            >
              {currentProject.title} ↗
            </h3>
            <p className="text-xs text-neutral-600 font-mono mt-0.5">
              {currentProject.subtitle}
            </p>
          </button>

          <div className="w-full h-[1px] bg-neutral-200/90 my-3" />

          <div className="flex items-center justify-between px-2 font-mono text-[11px] text-neutral-600 tracking-wider">
            <span>Scroll to see the projects</span>
            <span className="text-sm text-neutral-800 animate-bounce">↓</span>
          </div>
        </div>
      )}
    </div>
  );
}
