"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { ArrowRight, ExternalLink, Sparkles, Award } from "lucide-react";
import { ExperienceModal } from "./ExperienceModal";
import { WINNICODE_EXPERIENCE, TIMELINE_STOPS } from "@/data/experienceData";

export function ExperienceSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const [activeDotIndex, setActiveDotIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const calculatePanelFractions = useCallback(() => {
    if (!trackRef.current) return [0, 0.33, 0.66, 1];
    const vw = window.innerWidth;
    const travel = Math.max(1, trackRef.current.offsetWidth - vw);

    return TIMELINE_STOPS.map((stop) => {
      const el = document.getElementById(stop.targetId);
      if (!el) return 0;
      return Math.min(1, Math.max(0, (el.offsetLeft + el.offsetWidth / 2 - vw / 2) / travel));
    });
  }, []);

  const update = useCallback(() => {
    if (!containerRef.current || !trackRef.current || !fillRef.current) return;
    const vw = window.innerWidth;
    const trackWidth = trackRef.current.offsetWidth;
    const travel = Math.max(1, trackWidth - vw);
    const rect = containerRef.current.getBoundingClientRect();
    const scrolled = -rect.top;
    const p = Math.max(0, Math.min(1, scrolled / travel));
    const cur = p * travel;

    trackRef.current.style.transform = `translate3d(${-cur}px, 0, 0)`;
    fillRef.current.style.width = `${p * 100}%`;

    const floatEls = trackRef.current.querySelectorAll<HTMLElement>("[data-k]");
    floatEls.forEach((f) => {
      const c = (f as unknown as { _c?: number })._c ?? 0;
      const k = parseFloat(f.dataset.k || "0");
      f.style.transform = `translate3d(${-(c - cur) * k}px, 0, 0)`;
    });

    const fractions = calculatePanelFractions();
    let closest = 0;
    let minDiff = 999;
    fractions.forEach((frac, i) => {
      const diff = Math.abs(frac - p);
      if (diff < minDiff) {
        minDiff = diff;
        closest = i;
      }
    });

    setActiveDotIndex(closest);
  }, [calculatePanelFractions]);

  const layout = useCallback(() => {
    if (!containerRef.current || !trackRef.current) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const trackWidth = trackRef.current.offsetWidth;
    const travel = Math.max(1, trackWidth - vw);
    containerRef.current.style.height = `${travel + vh}px`;

    const floatEls = trackRef.current.querySelectorAll<HTMLElement>("[data-k]");
    floatEls.forEach((f) => {
      const pn = f.closest<HTMLElement>(".panel-slide");
      if (pn) {
        (f as unknown as { _c?: number })._c = pn.offsetLeft + pn.offsetWidth / 2 - vw / 2;
      }
    });

    update();
  }, [update]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          update();
          ticking = false;
        });
      }
    };

    const handleResize = () => {
      layout();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    const timer = setTimeout(layout, 150);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, [layout, update]);

  const handleDotClick = (index: number) => {
    if (!containerRef.current || !trackRef.current) return;
    const vw = window.innerWidth;
    const travel = Math.max(1, trackRef.current.offsetWidth - vw);
    const rect = containerRef.current.getBoundingClientRect();
    const top = rect.top + window.scrollY;

    const fractions = calculatePanelFractions();
    const targetScroll = top + fractions[index] * travel;

    window.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
  };

  const scrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    const projEl = document.getElementById("projects");
    if (projEl) {
      projEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="experience"
      ref={containerRef}
      className="relative w-full bg-[#090909] text-white selection:bg-neutral-800"
      aria-label="Experience Showcase"
    >
      {/* Viewport Locked Sticky Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between select-none">
        {/* Top Header Clearance & Brand Link */}
        <div className="absolute top-6 inset-x-6 md:inset-x-12 z-20 flex items-center justify-between pointer-events-none">
          <div className="text-xs md:text-sm font-mono tracking-wider text-neutral-400">
          </div>

          <a
            href="#projects"
            onClick={scrollToProjects}
            className="pointer-events-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/90 hover:bg-white/100 border border-white/15 text-xs font-mono tracking-wide text-black transition-all backdrop-blur-md cursor-pointer hover:scale-105"
          >
            <span>Skip To Projects</span>
            <span className="text-sm">↓</span>
          </a>
        </div>

        {/* Horizontal Track */}
        <div
          id="experience-track"
          ref={trackRef}
          className="flex items-center h-full w-max will-change-transform"
        >
          {/* PANEL 1: INTRO */}
          <div
            id="exp-intro"
            className="panel-slide w-screen shrink-0 h-full flex flex-col items-center justify-center relative px-6 text-center"
          >
            {/* Background SVG Doodles */}
            <svg
              className="absolute pointer-events-none inset-0 w-full h-full opacity-60"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M 20 60 C 35 55, 65 62, 85 50"
                stroke="#ffd23f"
                strokeWidth="0.6"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 75 25 C 85 18, 88 32, 78 36 S 68 38, 76 28"
                stroke="#2f6bff"
                strokeWidth="0.6"
                fill="none"
                strokeLinecap="round"
              />
            </svg>

            <div className="relative z-10 max-w-3xl flex flex-col items-center space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
                Career & Milestones
              </span>

              <h2 className="text-6xl sm:text-8xl md:text-9xl font-black uppercase tracking-tight text-white">
                Experience
              </h2>

              <p className="text-sm sm:text-lg md:text-xl text-neutral-400 max-w-xl font-normal leading-relaxed">
                Perjalanan saya sebagai builder, developer, dan engineer mengembangkan solusi digital
                modern.
              </p>

              <div className="pt-6 flex items-center gap-2 text-xs sm:text-sm font-mono text-neutral-400 animate-pulse">
                <span>Scroll untuk menjelajah timeline</span>
                <ArrowRight className="w-4 h-4 text-blue-400" />
              </div>
            </div>
          </div>

          {/* PANEL 2: WINNICODE */}
          <div
            id="exp-win"
            className="panel-slide w-[130vw] sm:w-[120vw] md:w-[1500px] shrink-0 h-full relative flex items-center justify-center px-8"
          >
            {/* Background SVG Accents */}
            <svg
              className="absolute pointer-events-none inset-0 w-full h-full opacity-40"
              viewBox="0 0 1500 800"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M 400 200 C 350 80, 500 60, 490 160 C 480 240, 360 230, 390 150"
                stroke="#2f6bff"
                strokeWidth="2.5"
                fill="none"
              />
              <path
                d="M 380 260 C 580 240, 850 250, 1100 230"
                stroke="#ffd23f"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M 1050 140 C 1150 50, 1180 190, 1100 230 S 980 270, 1070 170"
                stroke="#ff6a2b"
                strokeWidth="2"
                fill="none"
              />
            </svg>

            {/* Main Center Content */}
            <div className="relative z-10 flex flex-col items-center text-center max-w-xl">
              <h2 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tight text-white mb-3">
                {WINNICODE_EXPERIENCE.company.replace("PT ", "").replace(" Teknologi", "")}
              </h2>

              <div className="space-y-1 mb-8">
                <p className="text-base sm:text-lg font-semibold text-white">
                  {WINNICODE_EXPERIENCE.company}
                </p>
                <p className="text-xs sm:text-sm font-mono text-neutral-400">
                  {WINNICODE_EXPERIENCE.tagline}
                </p>
              </div>

              {/* Interactive Certificate Card */}
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                aria-haspopup="dialog"
                aria-label="Buka detail pengalaman di Winnicode"
                className="group relative flex w-72 sm:w-80 md:w-96 rounded-2xl bg-white text-neutral-950 text-left overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-neutral-200/40 transition-all duration-300 hover:scale-105 hover:-rotate-1 ring-2 ring-blue-500/30 hover:ring-blue-500 cursor-pointer"
              >
                {/* Decorative Side Strip */}
                <div className="w-10 sm:w-12 bg-neutral-950 flex flex-col items-center justify-around py-3 shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                </div>

                {/* Certificate Card Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-center space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-semibold">
                      Sertifikat Resmi
                    </span>
                    <Award className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <strong className="text-sm sm:text-base font-bold text-neutral-950 tracking-tight block">
                    {WINNICODE_EXPERIENCE.recipient}
                  </strong>
                  <span className="text-xs text-neutral-600 leading-snug block">
                    {WINNICODE_EXPERIENCE.type}
                    <br />
                    <span className="font-semibold text-blue-700">
                      Predikat: {WINNICODE_EXPERIENCE.predicate}
                    </span>
                  </span>
                </div>
              </button>

              {/* Glowing Pulse Hint */}
              <div className="mt-4 flex items-center justify-center gap-2 text-xs font-mono text-neutral-400">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
                </span>
                <span>Klik sertifikat untuk membuka detail</span>
              </div>
            </div>

            {/* Parallax Floating Mockup Cards */}
            {/* Card 1: Code / IDE Preview */}
            <div
              data-k="0.10"
              className="absolute left-[8%] top-[12%] w-52 sm:w-64 rounded-xl bg-white text-neutral-900 p-3 shadow-2xl border border-white/20 hidden md:block rotate-[-4deg] pointer-events-none transition-transform duration-100 ease-out"
            >
              <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-neutral-100">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-mono text-neutral-400 ml-1">experience.tsx</span>
              </div>
              <div className="space-y-1.5 font-mono text-[10px]">
                <div className="h-2 w-3/4 bg-neutral-200 rounded" />
                <div className="h-2 w-1/2 bg-blue-300 rounded" />
                <div className="h-2 w-5/6 bg-neutral-200 rounded" />
                <div className="h-2 w-2/3 bg-emerald-300 rounded" />
              </div>
            </div>

            {/* Card 2: Feature Matrix */}
            <div
              data-k="-0.08"
              className="absolute right-[10%] top-[14%] w-56 sm:w-72 rounded-xl bg-white text-neutral-900 p-4 shadow-2xl border border-white/20 hidden md:block rotate-[3deg] pointer-events-none transition-transform duration-100 ease-out"
            >
              <div className="grid grid-cols-4 gap-2 mb-3">
                <div className="h-6 rounded bg-orange-400/80" />
                <div className="h-6 rounded bg-sky-400/80" />
                <div className="h-6 rounded bg-emerald-400/80" />
                <div className="h-6 rounded bg-rose-400/80" />
              </div>
              <div className="space-y-1">
                <div className="h-2 w-full bg-neutral-200 rounded" />
                <div className="h-2 w-4/5 bg-neutral-200 rounded" />
              </div>
            </div>

            {/* Card 3: UI Architecture Hero */}
            <div
              data-k="-0.12"
              className="absolute left-[14%] bottom-[16%] w-60 sm:w-72 rounded-xl bg-white text-neutral-900 p-3 shadow-2xl border border-white/20 hidden md:block rotate-[2deg] pointer-events-none transition-transform duration-100 ease-out"
            >
              <div className="h-16 rounded-lg bg-gradient-to-r from-amber-200 to-teal-300 mb-2 shadow-inner" />
              <div className="flex gap-2">
                <div className="h-4 flex-1 bg-neutral-200 rounded" />
                <div className="h-4 flex-1 bg-neutral-200 rounded" />
                <div className="h-4 flex-1 bg-neutral-200 rounded" />
              </div>
            </div>

            {/* Card 4: Documentation Badge */}
            <div
              data-k="0.07"
              className="absolute right-[14%] bottom-[18%] w-56 sm:w-64 rounded-xl bg-white text-neutral-900 p-3 shadow-2xl border border-white/20 hidden md:block rotate-[-3deg] pointer-events-none transition-transform duration-100 ease-out"
            >
              <div className="h-20 rounded-lg bg-gradient-to-tr from-rose-500 via-amber-400 to-sky-500 mb-2 shadow-inner" />
              <div className="h-2 w-3/4 bg-neutral-200 rounded" />
            </div>

            {/* Card 5 & 6: Pill Tags */}
            <div
              data-k="-0.2"
              className="absolute left-[30%] bottom-[8%] px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-400 text-white font-mono text-xs font-semibold shadow-lg hidden lg:block rotate-[-6deg] pointer-events-none transition-transform duration-100 ease-out"
            >
              Frontend & API Architecture
            </div>

            <div
              data-k="0.18"
              className="absolute right-[30%] bottom-[10%] px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-mono text-xs font-semibold shadow-lg hidden lg:block rotate-[5deg] pointer-events-none transition-transform duration-100 ease-out"
            >
              Production Engineering
            </div>
          </div>

          {/* PANEL 3: UPCOMING */}
          <div
            id="exp-next"
            className="panel-slide w-[100vw] sm:w-[90vw] md:w-[1100px] shrink-0 h-full relative flex flex-col items-center justify-center px-8 text-center"
          >
            <div className="max-w-xl space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                Next Chapter
              </span>
              <h2 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-neutral-400">
                [Perusahaan]
              </h2>
              <p className="text-sm sm:text-base font-mono text-neutral-500">
                <b>[Peran]</b> · [Periode Mendatang]
              </p>

              <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                <div className="p-5 rounded-2xl border-2 border-dashed border-neutral-800 bg-white/[0.02] text-xs font-mono text-neutral-500 flex items-center justify-center">
                  Tambah pengalaman berikutnya di sini
                </div>
                <div className="p-5 rounded-2xl border-2 border-dashed border-neutral-800 bg-white/[0.02] text-xs font-mono text-neutral-500 flex items-center justify-center">
                  Sertifikat / dokumentasi baru
                </div>
              </div>
            </div>
          </div>

          {/* PANEL 4: TRANSITION TO PROJECTS */}
          <div
            id="exp-end"
            className="panel-slide w-[80vw] sm:w-[70vw] md:w-[900px] shrink-0 h-full relative flex flex-col items-center justify-center px-8 text-center"
          >
            <div className="max-w-md space-y-6">
              <Sparkles className="w-8 h-8 text-blue-500 mx-auto animate-spin" />
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white">
                Lihat Hasil Kerja
              </h2>
              <p className="text-sm font-mono text-neutral-400">
                Lanjutkan untuk melihat ragam karya proyek rekayasa perangkat lunak dan sistem AI.
              </p>
              <div className="pt-2">
                <a
                  href="#projects"
                  onClick={scrollToProjects}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-neutral-950 font-semibold text-sm hover:bg-neutral-200 transition-all cursor-pointer shadow-lg shadow-white/10 hover:scale-105"
                >
                  <span>Explore Projects</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BLUE TIMELINE BAR */}
        <div
          className="absolute bottom-6 sm:bottom-8 md:bottom-10 inset-x-8 sm:inset-x-14 md:inset-x-28 z-30"
          aria-label="Timeline Navigasi Pengalaman"
        >
          {/* Base Track Line */}
          <div className="relative w-full h-[3px] bg-neutral-800 rounded-full">
            {/* Blue Progress Bar */}
            <div
              id="experience-timeline-fill"
              ref={fillRef}
              className="absolute left-0 top-0 h-full bg-blue-600 rounded-full shadow-[0_0_14px_rgba(37,99,235,0.85)] transition-all duration-75"
              style={{ width: "0%" }}
            />

            {/* Interactive Timeline Dots */}
            {TIMELINE_STOPS.map((stop, idx) => {
              const isActive = idx === activeDotIndex;
              const positions = ["0%", "36%", "70%", "100%"];

              return (
                <button
                  key={stop.id}
                  type="button"
                  onClick={() => handleDotClick(idx)}
                  aria-label={`Loncat ke ${stop.label}`}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 group cursor-pointer focus:outline-none"
                  style={{ left: positions[idx] }}
                >
                  {/* Dot Circle */}
                  <span
                    className={`block w-3.5 h-3.5 rounded-full border-2 transition-all duration-200 ${isActive
                      ? "border-blue-400 bg-blue-500 scale-125 shadow-[0_0_12px_rgba(59,130,246,0.9)]"
                      : "border-neutral-700 bg-neutral-950 group-hover:border-neutral-400"
                      }`}
                  />

                  {/* Label */}
                  <span
                    className={`absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-mono transition-colors duration-200 ${isActive
                      ? "text-white font-semibold"
                      : "text-neutral-500 group-hover:text-neutral-300"
                      }`}
                  >
                    {stop.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Experience Detail Modal */}
      <ExperienceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={WINNICODE_EXPERIENCE}
      />
    </section>
  );
}
