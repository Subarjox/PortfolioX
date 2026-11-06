"use client";

import React, { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useProjectsScroll } from "@/hooks/useProjectsScroll";
import { ProjectsOverlay } from "./ProjectsOverlay";
import { ProjectDetailModal } from "./ProjectDetailModal";
import { PROJECTS_DATA, ProjectItem } from "@/data/projectsData";

const ProjectsCanvas = dynamic(
  () => import("./ProjectsCanvas").then((mod) => mod.ProjectsCanvas),
  { ssr: false }
);

export function FeaturedProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  // 4 projects + 1 GitHub End Slide = 5 stops
  const TOTAL_STOPS = PROJECTS_DATA.length + 1;

  const { currentProgress, activeIndex, activeProjectNumber } = useProjectsScroll(
    containerRef,
    TOTAL_STOPS
  );

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: "300px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Background smoothly darkens from #ffffff to #090909 as it transitions to the GitHub End Slide
  const endProgress = Math.max(0, Math.min(1, (currentProgress - 0.72) / 0.22));
  const bgR = Math.round(255 - endProgress * (255 - 9));
  const bgG = Math.round(255 - endProgress * (255 - 9));
  const bgB = Math.round(255 - endProgress * (255 - 9));
  const dynamicBg = `rgb(${bgR}, ${bgG}, ${bgB})`;

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative w-full h-[400vh] transition-colors duration-75"
      style={{ backgroundColor: dynamicBg }}
    >
      {/* Viewport locked sticky frame */}
      <div
        className="sticky top-0 h-screen w-full overflow-hidden transition-colors duration-75"
        style={{ backgroundColor: dynamicBg }}
      >
        <ProjectsCanvas
          progress={currentProgress}
          activeIndex={activeIndex}
          totalStops={TOTAL_STOPS}
          isMobile={isMobile}
          isVisible={isVisible}
          onHover={(idx) => setHoveredIndex(idx)}
          onClickCard={(proj) => setSelectedProject(proj)}
        />

        <ProjectsOverlay
          activeNumber={activeProjectNumber}
          activeIndex={activeIndex}
          progress={currentProgress}
          totalCount={PROJECTS_DATA.length}
          totalStops={TOTAL_STOPS}
          isMobile={isMobile}
          isCardHovered={hoveredIndex === activeIndex}
          onSelectProject={(proj) => setSelectedProject(proj)}
        />
      </div>

      {/* Project Detail Modal with Screenshots */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        isMobile={isMobile}
      />
    </section>
  );
}
