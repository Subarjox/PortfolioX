"use client";

import React from "react";
import { PROJECTS_DATA, ProjectItem } from "@/data/projectsData";
import { CurvedProjectCard } from "./CurvedProjectCard";
import { DecorativeArc } from "./DecorativeArc";

interface ProjectsGalleryProps {
  progress: number;
  activeIndex: number;
  totalStops?: number;
  isMobile: boolean;
  onHover?: (index: number | null) => void;
  onClickCard?: (project: ProjectItem) => void;
}

export function ProjectsGallery({
  progress,
  activeIndex,
  totalStops = PROJECTS_DATA.length + 1,
  isMobile,
  onHover,
  onClickCard,
}: ProjectsGalleryProps) {
  return (
    <group position={[0, 0, 0]}>
      <ambientLight intensity={1.0} />
      <directionalLight position={[5, 10, 7]} intensity={1.2} />

      {PROJECTS_DATA.map((project, idx) => (
        <CurvedProjectCard
          key={project.id}
          project={project}
          index={idx}
          progress={progress}
          totalCards={totalStops}
          isMobile={isMobile}
          onHover={onHover}
          onClickCard={onClickCard}
        />
      ))}

      <DecorativeArc progress={progress} isMobile={isMobile} />
    </group>
  );
}
