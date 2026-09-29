"use client";

import React, { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useProjectsScroll } from "@/hooks/useProjectsScroll";
import { ProjectsOverlay } from "./ProjectsOverlay";
import { PROJECTS_DATA } from "@/data/projectsData";

const ProjectsCanvas = dynamic(
  () => import("./ProjectsCanvas").then((mod) => mod.ProjectsCanvas),
  { ssr: false }
);

export function FeaturedProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const { currentProgress, activeIndex, activeProjectNumber } = useProjectsScroll(
    containerRef,
    PROJECTS_DATA.length
  );

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative w-full h-[350vh] bg-white"
    >
      {/* Viewport locked sticky frame */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-white">
        <ProjectsCanvas
          progress={currentProgress}
          activeIndex={activeIndex}
          isMobile={isMobile}
        />

        <ProjectsOverlay
          activeNumber={activeProjectNumber}
          activeIndex={activeIndex}
          totalCount={PROJECTS_DATA.length}
          isMobile={isMobile}
        />
      </div>
    </section>
  );
}
