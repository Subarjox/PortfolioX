"use client";

import React, { useState, useEffect } from "react";
import { ProjectItem } from "@/data/projectsData";
import { X, ChevronLeft, ChevronRight, ExternalLink, Cpu, GitBranch, Layers } from "lucide-react";

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  isMobile: boolean;
}

export function ProjectDetailModal({
  project,
  onClose,
  isMobile,
}: ProjectDetailModalProps) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Reset active screenshot whenever project changes
  useEffect(() => {
    setActiveImageIdx(0);
  }, [project]);

  // Lock body scroll and handle ESC key
  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const screenshots = project.screenshots && project.screenshots.length > 0
    ? project.screenshots
    : [project.image];

  const currentImage = screenshots[activeImageIdx] || screenshots[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIdx((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIdx((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1));
  };

  const workflowSteps = project.workflow ? project.workflow.split("→").map((s) => s.trim()) : [];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-neutral-950/70 backdrop-blur-md transition-all duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[88vh] sm:max-h-[85vh] bg-white border border-neutral-200/90 rounded-2xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-neutral-900 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-4 sm:p-6 border-b border-neutral-100 bg-white sticky top-0 z-10">
          <div className="flex items-start gap-3 sm:gap-4 pr-3">
            <span
              className="px-2.5 py-1 text-xs sm:text-sm font-mono font-bold rounded-lg border text-white shadow-sm shrink-0"
              style={{
                backgroundColor: project.accentColor,
                borderColor: project.accentColor,
              }}
            >
              {project.id}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-neutral-900">
                  {project.title}
                </h3>
                {project.status && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                    {project.status}
                  </span>
                )}
              </div>
              <p className="font-mono text-xs sm:text-sm text-neutral-500 mt-0.5">
                {project.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Tutup modal"
            className="p-2 -mr-1 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
          {/* Screenshot Showcase */}
          <div className="space-y-2">
            <div className="relative aspect-[16/9] w-full max-h-[380px] bg-neutral-950 rounded-xl overflow-hidden border border-neutral-200 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentImage}
                alt={`${project.title} screenshot ${activeImageIdx + 1}`}
                className="w-full h-full object-contain"
              />

              {screenshots.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    aria-label="Previous screenshot"
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 rounded-full bg-neutral-900/60 hover:bg-neutral-900/90 text-white backdrop-blur-sm transition-all"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Next screenshot"
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 rounded-full bg-neutral-900/60 hover:bg-neutral-900/90 text-white backdrop-blur-sm transition-all"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <div className="absolute bottom-2 right-3 px-2 py-0.5 rounded-md bg-black/60 text-white font-mono text-[11px] backdrop-blur-sm">
                    {activeImageIdx + 1} / {screenshots.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {screenshots.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto py-1 px-0.5 no-scrollbar">
                {screenshots.map((shot, idx) => (
                  <button
                    key={shot + idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative shrink-0 w-16 sm:w-20 aspect-[16/9] rounded-lg overflow-hidden border-2 transition-all ${
                      idx === activeImageIdx
                        ? "border-blue-600 ring-2 ring-blue-600/30 scale-105"
                        : "border-neutral-200 opacity-60 hover:opacity-100"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={shot}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Project Details Description */}
          <div className="space-y-2">
            <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-neutral-900">
              <Layers className="w-4 h-4 text-neutral-500" />
              <span>Deskripsi Proyek</span>
            </h4>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-normal whitespace-pre-line">
              {project.details || project.description}
            </p>
          </div>

          {/* Architecture / Workflow */}
          {workflowSteps.length > 0 && (
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-neutral-900">
                <GitBranch className="w-4 h-4 text-neutral-500" />
                <span>Alur Kerja & Pipeline</span>
              </h4>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {workflowSteps.map((step, idx) => (
                  <React.Fragment key={step + idx}>
                    <div className="px-3 py-1.5 rounded-lg bg-neutral-100 border border-neutral-200 text-xs sm:text-sm text-neutral-800 font-medium shadow-2xs">
                      <span className="font-mono text-neutral-400 mr-1.5 font-bold">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      {step}
                    </div>
                    {idx < workflowSteps.length - 1 && (
                      <span className="text-neutral-400 font-bold text-sm">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {/* Tech Stack Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="space-y-2">
              <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-neutral-900">
                <Cpu className="w-4 h-4 text-neutral-500" />
                <span>Teknologi & Tools</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-neutral-100 text-xs font-mono text-neutral-700 border border-neutral-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Optional Action Link */}
          {project.href && project.href !== "#" && (
            <div className="pt-2">
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 text-white text-xs sm:text-sm font-semibold hover:bg-neutral-800 transition-colors shadow-sm"
              >
                <span>Lihat Tautan Proyek</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
