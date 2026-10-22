"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, ExternalLink, X } from "lucide-react";

interface DevelopmentModalProps {
  resumeUrl?: string;
}

export function DevelopmentModal({
  resumeUrl = "https://resume-phi-smoky-95.vercel.app/index.html",
}: DevelopmentModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if dismissed in this session
    const dismissed = sessionStorage.getItem("dismissed_dev_notice_modal");
    if (!dismissed) {
      // Short delay for smooth entrance after page load
      const timer = setTimeout(() => setIsOpen(true), 400);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("dismissed_dev_notice_modal", "true");
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dev-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-300 select-none animate-in fade-in"
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-black/90 border border-white/20 p-6 sm:p-8 shadow-[0_0_60px_rgba(255,255,255,0.08)] backdrop-blur-xl transition-all">
        {/* Top ambient highlight */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Tutup Peringatan"
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Notice Icon Badge */}
        <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center mb-4 shadow-inner">
          <AlertTriangle className="w-6 h-6 stroke-[2]" />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-300 font-semibold">
              SYSTEM NOTICE • UNDER DEVELOPMENT
            </span>
          </div>

          <h2
            id="dev-modal-title"
            className="text-xl sm:text-2xl font-bold text-white tracking-tight"
          >
            Website Sedang Dalam Tahap Pembangunan
          </h2>

          <p className="text-sm text-neutral-300 leading-relaxed pt-1">
            Website portofolio interaktif ini masih dalam proses pengembangan aktif. Beberapa fitur dan detail karya sedang disempurnakan.
          </p>

          <p className="text-sm text-neutral-300 leading-relaxed">
            Untuk melihat informasi profil, pengalaman kerja, keahlian, dan riwayat proyek resmi yang sudah lengkap, silakan kunjungi halaman Resume berikut:
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-3">
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-sm transition-all duration-200 group cursor-pointer shadow-lg shadow-white/10"
          >
            <span>Kunjungi Resume Lengkap</span>
            <ExternalLink className="w-4 h-4 stroke-[2.5] text-black transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          <button
            type="button"
            onClick={handleClose}
            className="w-full text-center py-2 text-xs font-mono tracking-wider text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            [ Tetap Lanjutkan Eksplorasi Web 3D ]
          </button>
        </div>
      </div>
    </div>
  );
}
