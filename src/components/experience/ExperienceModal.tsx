"use client";

import React, { useEffect, useState } from "react";
import { X, Award, Briefcase, CheckCircle2, TrendingUp, Layers, FileText, ExternalLink, Users, Image as ImageIcon } from "lucide-react";
import { WINNICODE_EXPERIENCE, type ExperienceItem, type ExperienceAsset } from "@/data/experienceData";

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
  const [activePreviewImage, setActivePreviewImage] = useState<ExperienceAsset | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setActivePreviewImage(null);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (activePreviewImage) {
          setActivePreviewImage(null);
        } else {
          onClose();
        }
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, activePreviewImage]);

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
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-neutral-950/95 border border-white/15 text-neutral-100 p-6 sm:p-9 shadow-[0_30px_90px_rgba(0,0,0,0.8)] backdrop-blur-xl"
      >
        {/* Subtle Ambient Top Glow */}
        <div
          className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/80 to-transparent"
          style={{
            backgroundImage: `linear-gradient(to right, transparent, ${data.accentColor}, transparent)`
          }}
        />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup Detail Experience"
          className="absolute top-5 right-5 w-10 h-10 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Category Header */}
        <div className="flex items-center gap-2 mb-2.5">
          <Award className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="text-xs font-mono font-semibold tracking-widest uppercase text-blue-400">
            {data.type}
          </span>
        </div>

        {/* Company Title */}
        <h3
          id="experience-modal-title"
          className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2"
        >
          {data.company}
        </h3>

        {/* Meta Info */}
        <div className="text-xs sm:text-sm font-mono text-neutral-400 mb-6 pb-4 border-b border-white/10 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span>{data.period}</span>
          <span>•</span>
          <span>{data.location}</span>
          <span>•</span>
          <span className="text-blue-400 font-semibold">Predikat: {data.predicate}</span>
        </div>

        {/* Official Certificate / Transcript Action Button */}
        {data.certificatePdf && (
          <div className="mb-6 p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-white">
                  Dokumen Resmi & Sertifikat
                </p>
                <p className="text-[11px] font-mono text-neutral-400">
                  {data.recipient} · {data.predicate}
                </p>
              </div>
            </div>

            <a
              href={data.certificatePdf}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold transition-colors cursor-pointer shadow-lg shadow-blue-600/20"
            >
              <span>Buka Dokumen PDF</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

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

        {/* Summary */}
        <div className="mb-6 text-xs sm:text-sm text-neutral-300 leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/5">
          {data.summary}
        </div>

        {/* Responsibilities */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Yang Saya Kerjakan</span>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-neutral-300 pl-1">
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
          <ul className="space-y-2 text-xs sm:text-sm text-neutral-300 pl-1">
            {data.impact.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tech Stack */}
        <div className="mb-8">
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

        {/* Team & People Photos (If Available) */}
        {data.teamPhotos && data.teamPhotos.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400 mb-3 font-medium">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Tim & Kolaborasi Kantor ({data.teamPhotos.length} Foto)</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {data.teamPhotos.map((photo, idx) => (
                <div
                  key={idx}
                  onClick={() => setActivePreviewImage(photo)}
                  className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-white/15 bg-neutral-900 cursor-pointer shadow-md hover:border-emerald-400/60 transition-all"
                >
                  <img
                    src={photo.image}
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-2.5">
                    <p className="text-[11px] font-semibold text-white leading-tight">
                      {photo.title}
                    </p>
                    {photo.description && (
                      <p className="text-[9px] text-neutral-300 line-clamp-1 mt-0.5">
                        {photo.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Real Screenshots Gallery */}
        {data.screenshots && data.screenshots.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400 mb-3 font-medium">
              <ImageIcon className="w-4 h-4 text-blue-400" />
              <span>Screenshot Sistem & Antarmuka</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {data.screenshots.map((shot, idx) => (
                <div
                  key={idx}
                  onClick={() => setActivePreviewImage(shot)}
                  className="group relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-neutral-900 cursor-pointer shadow-sm hover:border-blue-400/60 transition-all"
                >
                  <img
                    src={shot.image}
                    alt={shot.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2 opacity-90 group-hover:opacity-100 transition-opacity">
                    <span className="text-[9px] font-mono text-white/90 line-clamp-1">
                      {shot.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Expanded Single Image Modal Preview */}
      {activePreviewImage && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setActivePreviewImage(null);
          }}
          className="fixed inset-0 z-[110] bg-black/95 flex flex-col items-center justify-center p-4 sm:p-8 animate-in fade-in"
        >
          <button
            type="button"
            onClick={() => setActivePreviewImage(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={activePreviewImage.image}
            alt={activePreviewImage.title}
            className="max-w-2xl max-h-[75vh] w-auto h-auto rounded-2xl object-contain border border-white/20 shadow-2xl"
          />
          <div className="mt-4 text-center max-w-xl">
            <h4 className="text-sm sm:text-base font-bold text-white">
              {activePreviewImage.title}
            </h4>
            {activePreviewImage.description && (
              <p className="text-xs text-neutral-400 mt-1">
                {activePreviewImage.description}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
