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
  totalCount = 4,
  isMobile,
}: ProjectsOverlayProps) {
  const currentProject = PROJECTS_DATA[activeIndex] || PROJECTS_DATA[0];
  const totalFormatted = String(totalCount).padStart(2, "0");

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-6 md:p-12 select-none text-neutral-900">
      {/* Top Header */}
      <header className="flex items-center justify-between">
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-neutral-900">
          Featured Projects
        </h2>

        <a
          href="#others"
          className="pointer-events-auto flex items-center gap-1.5 font-mono text-xs md:text-sm tracking-wider text-neutral-600 hover:text-neutral-950 transition-colors"
        >
          <span>Beyond The Projects</span>
          <span className="text-sm">↓</span>
        </a>
      </header>

      {/* Center Background Floating Info on Desktop */}
      {!isMobile && (
        <div className="absolute bottom-16 left-8 md:left-14 max-w-xl">
          <div className="flex items-center gap-3">
            <span className="font-mono text-base font-semibold tracking-wider text-neutral-900">
              {activeNumber}
            </span>
            <span className="w-8 h-[2px] bg-neutral-800" />
            <span className="font-mono text-xs tracking-wider text-neutral-400">
              {totalFormatted}
            </span>
          </div>

          <a
            href={currentProject.href || "#"}
            target={currentProject.href && currentProject.href !== "#" ? "_blank" : undefined}
            rel={currentProject.href && currentProject.href !== "#" ? "noopener noreferrer" : undefined}
            className="pointer-events-auto group block mt-2"
          >
            <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-900 group-hover:text-blue-600 transition-colors duration-200">
              {currentProject.title}
              <span className="inline-block ml-2 text-2xl font-normal text-neutral-400 group-hover:text-blue-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                ↗
              </span>
            </h3>
          </a>

          <p className="mt-1 font-mono text-xs text-neutral-600 font-medium">
            {currentProject.subtitle}
          </p>

          <p className="mt-2 text-xs md:text-sm text-neutral-600 leading-relaxed line-clamp-2">
            {currentProject.description}
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
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 font-mono text-xs tracking-wider text-neutral-600">
          <span>Scroll to see the projects</span>
          <span className="animate-bounce">↓</span>
        </div>
      )}

      {/* Mobile Bottom Layout */}
      {isMobile && (
        <div className="w-full flex flex-col mt-auto pt-6">
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

          <a
            href={currentProject.href || "#"}
            className="pointer-events-auto px-2 mt-2"
          >
            <h3 className="text-xl font-bold tracking-tight text-neutral-900">
              {currentProject.title} ↗
            </h3>
            <p className="text-xs text-neutral-600 font-mono mt-0.5">
              {currentProject.subtitle}
            </p>
          </a>

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
