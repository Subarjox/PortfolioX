"use client";

import React, { useEffect } from "react";
import { X, Award, Briefcase, CheckCircle2, TrendingUp, Layers } from "lucide-react";
import { WINNICODE_EXPERIENCE, type ExperienceItem } from "@/data/experienceData";

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: ExperienceItem;
}

export function ExperienceModal({
  isOpen,
  onClose,
  data = WINNICODE_EXPERIENCE,
}: ExperienceModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="experience-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-3xl bg-neutral-950/95 border border-white/15 text-neutral-100 p-6 sm:p-9 shadow-[0_30px_90px_rgba(0,0,0,0.7)] backdrop-blur-xl"
      >
        {/* Subtle Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup Detail Experience"
          className="absolute top-5 right-5 w-10 h-10 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Eyebrow / Category */}
        <div className="flex items-center gap-2 mb-2.5">
          <Award className="w-4 h-4 text-blue-500 shrink-0" />
          <span className="text-xs font-mono font-semibold tracking-widest uppercase text-blue-400">
            {data.type}
          </span>
        </div>

        {/* Title */}
        <h3
          id="experience-modal-title"
          className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2"
        >
          {data.company}
        </h3>

        {/* Meta Info */}
        <div className="text-xs sm:text-sm font-mono text-neutral-400 mb-6 pb-4 border-b border-white/10 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>{data.period}</span>
          <span>•</span>
          <span>{data.location}</span>
          <span>•</span>
          <span className="text-blue-400 font-semibold">Predikat: {data.predicate}</span>
        </div>

        {/* Role Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2 font-medium">
            <Briefcase className="w-3.5 h-3.5 text-neutral-400" />
            <span>Peran</span>
          </div>
          <p className="text-sm sm:text-base font-semibold text-white pl-5 border-l-2 border-blue-500/60">
            {data.role}
          </p>
        </div>

        {/* Responsibilities */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Yang Saya Kerjakan</span>
          </div>
          <ul className="space-y-2 text-sm text-neutral-300 pl-1">
            {data.responsibilities.map((task, idx) => (
              <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                <span>{task}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Impact */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2.5 font-medium">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Dampak & Pencapaian</span>
          </div>
          <ul className="space-y-2 text-sm text-neutral-300 pl-1">
            {data.impact.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tech Stack */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2.5 font-medium">
            <Layers className="w-3.5 h-3.5 text-neutral-400" />
            <span>Tech Stack</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.techStack.map((tech) => (
              <span
                key={tech}
                className="text-xs font-mono px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-neutral-200 font-medium hover:border-blue-500/40 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Documentation / Gallery */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-3 font-medium">
            Dokumentasi & Visual
          </h4>
          <div className="grid grid-cols-3 gap-3">
            {data.documentation.map((doc, idx) => (
              <div
                key={idx}
                className={`aspect-video rounded-xl shadow-inner border border-white/10 bg-gradient-to-br ${doc.gradient} relative overflow-hidden flex items-end p-2`}
              >
                <span className="text-[10px] font-mono font-medium text-black/80 bg-white/80 px-1.5 py-0.5 rounded backdrop-blur-sm">
                  {doc.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
