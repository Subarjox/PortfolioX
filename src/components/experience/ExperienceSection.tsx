"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { ArrowRight, ExternalLink, Sparkles, Award, Users, FileText } from "lucide-react";
import { ExperienceModal } from "./ExperienceModal";
import {
  WINNICODE_EXPERIENCE,
  IROSTECH_EXPERIENCE,
  TIMELINE_STOPS,
  type ExperienceItem,
} from "@/data/experienceData";

interface CachedFloatElement {
  el: HTMLElement;
  c: number;
  k: number;
}

export function ExperienceSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const [activeDotIndex, setActiveDotIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<ExperienceItem>(WINNICODE_EXPERIENCE);

  // Performance & layout cache refs
  const panelFractionsRef = useRef<number[]>([0, 0.33, 0.66, 1]);
  const floatElsRef = useRef<CachedFloatElement[]>([]);
  const travelRef = useRef<number>(1);
  const activeDotRef = useRef<number>(0);

  // Smooth inertial damping state (eliminates stepped/jittery mouse wheel notches)
  const targetCurRef = useRef<number>(0);
  const currentCurRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Frame renderer: translates track, progress bar and parallax items via GPU transforms
  const renderFrame = useCallback((cur: number, travel: number) => {
    if (!trackRef.current || !fillRef.current) return;

    const p = travel > 0 ? Math.max(0, Math.min(1, cur / travel)) : 0;

    // GPU-accelerated horizontal track translation
    trackRef.current.style.transform = `translate3d(${-cur}px, 0, 0)`;

    // GPU-accelerated timeline progress bar
    fillRef.current.style.transform = `scaleX(${p})`;

    // Move pre-cached parallax float elements with zero DOM lookups
    const floats = floatElsRef.current;
    for (let i = 0; i < floats.length; i++) {
      const item = floats[i];
      item.el.style.transform = `translate3d(${-(item.c - cur) * item.k}px, 0, 0)`;
    }

    // Determine closest stop using pre-calculated panel fractions
    const fractions = panelFractionsRef.current;
    let closest = 0;
    let minDiff = 999;
    for (let i = 0; i < fractions.length; i++) {
      const diff = Math.abs(fractions[i] - p);
      if (diff < minDiff) {
        minDiff = diff;
        closest = i;
      }
    }

    // Only trigger React state update when active index changes
    if (closest !== activeDotRef.current) {
      activeDotRef.current = closest;
      setActiveDotIndex(closest);
    }
  }, []);

  // Critically damped animation loop (ease-out inertia between mouse-wheel steps)
  const animate = useCallback((now: number) => {
    const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
    lastTimeRef.current = now;

    const target = targetCurRef.current;
    const current = currentCurRef.current;
    const travel = travelRef.current;

    // Responsive yet buttery-smooth damping constant (lambda = 8.5)
    const lambda = 8.5;
    const next = current + (target - current) * (1 - Math.exp(-lambda * dt));
    currentCurRef.current = next;

    renderFrame(next, travel);

    // Continue running until settled within sub-pixel threshold
    if (Math.abs(target - next) > 0.15) {
      rafIdRef.current = requestAnimationFrame(animate);
    } else {
      currentCurRef.current = target;
      renderFrame(target, travel);
      rafIdRef.current = null;
    }
  }, [renderFrame]);

  // Read scroll position and wake up the smooth RAF loop
  const onScroll = useCallback(() => {
    if (!containerRef.current) return;
    const travel = travelRef.current;
    const rect = containerRef.current.getBoundingClientRect();
    const scrolled = -rect.top;
    const clampedTarget = Math.max(0, Math.min(travel, scrolled));

    targetCurRef.current = clampedTarget;

    if (rafIdRef.current === null) {
      lastTimeRef.current = performance.now();
      rafIdRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  const layout = useCallback(() => {
    if (!containerRef.current || !trackRef.current) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const trackWidth = trackRef.current.offsetWidth;
    const travel = Math.max(1, trackWidth - vw);
    travelRef.current = travel;
    containerRef.current.style.height = `${travel + vh}px`;

    // Cache float element centers once during layout
    const floatNodes = trackRef.current.querySelectorAll<HTMLElement>("[data-k]");
    const cachedList: CachedFloatElement[] = [];
    floatNodes.forEach((f) => {
      const pn = f.closest<HTMLElement>(".panel-slide");
      const c = pn ? pn.offsetLeft + pn.offsetWidth / 2 - vw / 2 : 0;
      const k = parseFloat(f.dataset.k || "0");
      cachedList.push({ el: f, c, k });
    });
    floatElsRef.current = cachedList;

    // Cache timeline panel fractions once during layout
    panelFractionsRef.current = TIMELINE_STOPS.map((stop) => {
      const el = document.getElementById(stop.targetId);
      if (!el) return 0;
      return Math.min(1, Math.max(0, (el.offsetLeft + el.offsetWidth / 2 - vw / 2) / travel));
    });

    // Synchronize position immediately
    const rect = containerRef.current.getBoundingClientRect();
    const scrolled = -rect.top;
    const clampedTarget = Math.max(0, Math.min(travel, scrolled));
    targetCurRef.current = clampedTarget;
    currentCurRef.current = clampedTarget;
    renderFrame(clampedTarget, travel);
  }, [renderFrame]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", layout);

    const timer = setTimeout(layout, 150);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", layout);
      clearTimeout(timer);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [layout, onScroll]);

  const handleDotClick = (index: number) => {
    if (!containerRef.current) return;
    const travel = travelRef.current;
    const rect = containerRef.current.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const fractions = panelFractionsRef.current;
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

  const openExperienceModal = (exp: ExperienceItem) => {
    setSelectedExperience(exp);
    setIsModalOpen(true);
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
            Professional Experience
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
                Perjalanan nyata saya sebagai builder dan engineer mengembangkan arsitektur perangkat lunak, sistem AI terintegrasi, dan platform berskala nyata.
              </p>

              <div className="pt-6 flex items-center gap-2 text-xs sm:text-sm font-mono text-neutral-400 animate-pulse">
                <span>Scroll untuk menjelajah timeline</span>
                <ArrowRight className="w-4 h-4 text-blue-400" />
              </div>
            </div>
          </div>

          {/* PANEL 2: WINNICODE (REAL WEB SCREENSHOTS & REAL CERTIFICATE) */}
          <div
            id="exp-win"
            className="panel-slide w-[135vw] sm:w-[125vw] md:w-[1600px] shrink-0 h-full relative flex items-center justify-center px-8"
          >
            {/* Background SVG Accents */}
            <svg
              className="absolute pointer-events-none inset-0 w-full h-full opacity-30"
              viewBox="0 0 1600 800"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M 400 200 C 350 80, 500 60, 490 160 C 480 240, 360 230, 390 150"
                stroke="#2563eb"
                strokeWidth="2.5"
                fill="none"
              />
              <path
                d="M 380 260 C 580 240, 850 250, 1100 230"
                stroke="#ffd23f"
                strokeWidth="2"
                fill="none"
              />
            </svg>

            {/* Main Center Content */}
            <div className="relative z-10 flex flex-col items-center text-center max-w-xl">
              <span className="text-xs font-mono font-semibold tracking-widest uppercase text-blue-400 mb-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                {WINNICODE_EXPERIENCE.role}
              </span>

              <h2 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tight text-white mb-2">
                {WINNICODE_EXPERIENCE.shortName}
              </h2>

              <div className="space-y-1 mb-8">
                <p className="text-base sm:text-lg font-semibold text-white">
                  {WINNICODE_EXPERIENCE.company}
                </p>
                <p className="text-xs sm:text-sm font-mono text-neutral-400">
                  {WINNICODE_EXPERIENCE.tagline}
                </p>
              </div>

              {/* Interactive Certificate Card (Real Certificate Opener) */}
              <button
                type="button"
                onClick={() => openExperienceModal(WINNICODE_EXPERIENCE)}
                aria-haspopup="dialog"
                aria-label="Buka sertifikat resmi dan detail pengalaman di Winnicode"
                className="group relative flex w-80 sm:w-96 rounded-2xl bg-white text-neutral-950 text-left overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-neutral-200/40 transition-all duration-300 hover:scale-105 hover:-rotate-1 ring-2 ring-blue-500/30 hover:ring-blue-500 cursor-pointer"
              >
                <div className="w-12 bg-neutral-950 flex flex-col items-center justify-around py-3 shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                </div>

                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-center space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-semibold flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      Sertifikat Asli & Evaluasi
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

              <div className="mt-4 flex items-center justify-center gap-2 text-xs font-mono text-neutral-400">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
                </span>
                <span>Klik sertifikat untuk membuka detail & screenshot asli</span>
              </div>
            </div>

            {/* Parallax Floating Real Web Screenshots */}
            {/* Card 1: Real CMS News Table Screenshot */}
            <div
              data-k="0.10"
              className="absolute left-[6%] top-[10%] hidden md:block will-change-transform"
            >
              <div
                onClick={() => openExperienceModal(WINNICODE_EXPERIENCE)}
                className="w-52 sm:w-60 md:w-64 rounded-2xl overflow-hidden border border-white/20 bg-neutral-900 shadow-[0_20px_40px_rgba(0,0,0,0.8)] rotate-[-3deg] cursor-pointer hover:scale-105 hover:border-blue-400 transition-all duration-300"
              >
                <img
                  src="/images/experience/winnicode/20.png"
                  alt="Winnicode News CMS - List & Kelola Berita"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto object-cover"
                />
                <div className="p-2 bg-neutral-950/90 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-neutral-300 font-medium">CMS Kelola Berita</span>
                  <span className="text-[9px] font-mono text-blue-400">Next.js · REST API</span>
                </div>
              </div>
            </div>

            {/* Card 2: Real Analytics Dashboard Screenshot */}
            <div
              data-k="-0.08"
              className="absolute right-[8%] top-[12%] hidden md:block will-change-transform"
            >
              <div
                onClick={() => openExperienceModal(WINNICODE_EXPERIENCE)}
                className="w-52 sm:w-64 md:w-68 rounded-2xl overflow-hidden border border-white/20 bg-neutral-900 shadow-[0_20px_40px_rgba(0,0,0,0.8)] rotate-[2deg] cursor-pointer hover:scale-105 hover:border-blue-400 transition-all duration-300"
              >
                <img
                  src="/images/experience/winnicode/21.png"
                  alt="Live Reader Analytics Dashboard"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto object-cover"
                />
                <div className="p-2 bg-neutral-950/90 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-neutral-300 font-medium">Dasbor Analitik</span>
                  <span className="text-[9px] font-mono text-emerald-400">Live Metrics</span>
                </div>
              </div>
            </div>

            {/* Card 3: Real Content Editor Screenshot */}
            <div
              data-k="-0.12"
              className="absolute left-[10%] bottom-[14%] hidden md:block will-change-transform"
            >
              <div
                onClick={() => openExperienceModal(WINNICODE_EXPERIENCE)}
                className="w-48 sm:w-56 md:w-60 rounded-2xl overflow-hidden border border-white/20 bg-neutral-900 shadow-[0_20px_40px_rgba(0,0,0,0.8)] rotate-[2deg] cursor-pointer hover:scale-105 hover:border-blue-400 transition-all duration-300"
              >
                <img
                  src="/images/experience/winnicode/22.png"
                  alt="Interactive Content Editor"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto object-cover"
                />
                <div className="p-2 bg-neutral-950/90 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-neutral-300">Editor Artikel Interaktif</span>
                </div>
              </div>
            </div>

            {/* Card 4: Real Portal Interface */}
            <div
              data-k="0.07"
              className="absolute right-[12%] bottom-[16%] hidden md:block will-change-transform"
            >
              <div
                onClick={() => openExperienceModal(WINNICODE_EXPERIENCE)}
                className="w-48 sm:w-56 md:w-60 rounded-2xl overflow-hidden border border-white/20 bg-neutral-900 shadow-[0_20px_40px_rgba(0,0,0,0.8)] rotate-[-2deg] cursor-pointer hover:scale-105 hover:border-blue-400 transition-all duration-300"
              >
                <img
                  src="/images/experience/winnicode/24.png"
                  alt="Winnicode Portal Berita"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto object-cover"
                />
                <div className="p-2 bg-neutral-950/90 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-neutral-300">Portal Publikasi Berita</span>
                </div>
              </div>
            </div>

            {/* Floating Tags */}
            <div
              data-k="-0.18"
              className="absolute left-[28%] bottom-[8%] px-4 py-2 rounded-xl bg-blue-600/90 text-white font-mono text-xs font-semibold shadow-lg hidden lg:block rotate-[-4deg] pointer-events-none will-change-transform"
            >
              Fullstack Web & CMS Architecture
            </div>

            <div
              data-k="0.16"
              className="absolute right-[28%] bottom-[10%] px-4 py-2 rounded-xl bg-emerald-600/90 text-white font-mono text-xs font-semibold shadow-lg hidden lg:block rotate-[4deg] pointer-events-none will-change-transform"
            >
              Predikat A · Sangat Baik Sekali
            </div>
          </div>

          {/* PANEL 3: IROSTECH (PEOPLE/TEAM FOCUS + WEB SCREENSHOTS & REAL TRANSCRIPT) */}
          <div
            id="exp-iro"
            className="panel-slide w-[140vw] sm:w-[130vw] md:w-[1650px] shrink-0 h-full relative flex items-center justify-center px-8"
          >
            {/* Background SVG Accents */}
            <svg
              className="absolute pointer-events-none inset-0 w-full h-full opacity-30"
              viewBox="0 0 1650 800"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M 300 150 C 450 60, 600 220, 750 140"
                stroke="#10b981"
                strokeWidth="2.5"
                fill="none"
              />
              <path
                d="M 900 240 C 1100 280, 1300 180, 1450 250"
                stroke="#38bdf8"
                strokeWidth="2"
                fill="none"
              />
            </svg>

            {/* Main Center Content */}
            <div className="relative z-10 flex flex-col items-center text-center max-w-xl">
              <span className="text-xs font-mono font-semibold tracking-widest uppercase text-emerald-400 mb-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                {IROSTECH_EXPERIENCE.role}
              </span>

              <h2 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tight text-white mb-2">
                {IROSTECH_EXPERIENCE.shortName}
              </h2>

              <div className="space-y-1 mb-8">
                <p className="text-base sm:text-lg font-semibold text-white">
                  {IROSTECH_EXPERIENCE.company}
                </p>
                <p className="text-xs sm:text-sm font-mono text-neutral-400">
                  {IROSTECH_EXPERIENCE.tagline}
                </p>
              </div>

              {/* Interactive Transcript / Credential Card */}
              <button
                type="button"
                onClick={() => openExperienceModal(IROSTECH_EXPERIENCE)}
                aria-haspopup="dialog"
                aria-label="Buka transkrip nilai resmi dan dokumentasi tim di Irostech"
                className="group relative flex w-80 sm:w-96 rounded-2xl bg-white text-neutral-950 text-left overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-neutral-200/40 transition-all duration-300 hover:scale-105 hover:-rotate-1 ring-2 ring-emerald-500/30 hover:ring-emerald-500 cursor-pointer"
              >
                <div className="w-12 bg-neutral-950 flex flex-col items-center justify-around py-3 shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                </div>

                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-center space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-semibold flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      Transkrip Resmi & Evaluasi
                    </span>
                    <Award className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <strong className="text-sm sm:text-base font-bold text-neutral-950 tracking-tight block">
                    {IROSTECH_EXPERIENCE.recipient}
                  </strong>
                  <span className="text-xs text-neutral-600 leading-snug block">
                    {IROSTECH_EXPERIENCE.type} · BRIN Kolaborasi
                    <br />
                    <span className="font-semibold text-emerald-700">
                      Predikat: {IROSTECH_EXPERIENCE.predicate}
                    </span>
                  </span>
                </div>
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs font-mono text-neutral-400">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span>Klik untuk buka foto tim, dokumen transkrip, & detail</span>
              </div>
            </div>

            {/* Parallax Floating Cards: TEAM PHOTOS */}
            {/* Card 1: Team selfie with laptop in office */}
            <div
              data-k="0.11"
              className="absolute left-[6%] top-[8%] hidden md:block will-change-transform"
            >
              <div
                onClick={() => openExperienceModal(IROSTECH_EXPERIENCE)}
                className="w-52 sm:w-64 md:w-68 rounded-2xl overflow-hidden border border-white/20 bg-neutral-900 shadow-[0_20px_40px_rgba(0,0,0,0.8)] rotate-[-4deg] cursor-pointer hover:scale-105 hover:border-emerald-400 transition-all duration-300"
              >
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img
                    src="/images/experience/irostech/orang/team-1.jpg"
                    alt="Team engineering Irostech demo laptop"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2.5 bg-neutral-950/90 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[11px] font-mono text-white font-medium">Tim Engineering</span>
                  </div>
                  <span className="text-[9px] font-mono text-neutral-400">Bandung</span>
                </div>
              </div>
            </div>

            {/* Card 2: Team presentation on screen */}
            <div
              data-k="-0.09"
              className="absolute right-[7%] top-[10%] hidden md:block will-change-transform"
            >
              <div
                onClick={() => openExperienceModal(IROSTECH_EXPERIENCE)}
                className="w-52 sm:w-64 md:w-68 rounded-2xl overflow-hidden border border-white/20 bg-neutral-900 shadow-[0_20px_40px_rgba(0,0,0,0.8)] rotate-[3deg] cursor-pointer hover:scale-105 hover:border-emerald-400 transition-all duration-300"
              >
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img
                    src="/images/experience/irostech/orang/team-2.jpg"
                    alt="Presentasi sistem di ruang rapat"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2.5 bg-neutral-950/90 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[11px] font-mono text-white font-medium">Presentasi Sistem</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Team selfie fun in office */}
            <div
              data-k="-0.14"
              className="absolute left-[9%] bottom-[12%] hidden md:block will-change-transform"
            >
              <div
                onClick={() => openExperienceModal(IROSTECH_EXPERIENCE)}
                className="w-48 sm:w-56 md:w-60 rounded-2xl overflow-hidden border border-white/20 bg-neutral-900 shadow-[0_20px_40px_rgba(0,0,0,0.8)] rotate-[3deg] cursor-pointer hover:scale-105 hover:border-emerald-400 transition-all duration-300"
              >
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img
                    src="/images/experience/irostech/orang/team-3.jpg"
                    alt="Kebersamaan tim developer"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2 bg-neutral-950/90 border-t border-white/10">
                  <span className="text-[10px] font-mono text-neutral-200">Kekompakan Tim</span>
                </div>
              </div>
            </div>

            {/* Card 4: Team standup & discussion */}
            <div
              data-k="0.08"
              className="absolute right-[10%] bottom-[14%] hidden md:block will-change-transform"
            >
              <div
                onClick={() => openExperienceModal(IROSTECH_EXPERIENCE)}
                className="w-48 sm:w-56 md:w-60 rounded-2xl overflow-hidden border border-white/20 bg-neutral-900 shadow-[0_20px_40px_rgba(0,0,0,0.8)] rotate-[-3deg] cursor-pointer hover:scale-105 hover:border-emerald-400 transition-all duration-300"
              >
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img
                    src="/images/experience/irostech/orang/team-4.jpg"
                    alt="Team standup & koordinasi"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2 bg-neutral-950/90 border-t border-white/10">
                  <span className="text-[10px] font-mono text-neutral-200">Diskusi & Evaluasi Fitur</span>
                </div>
              </div>
            </div>

            {/* Floating Thumbnail: Project MBG Screenshot */}
            <div
              data-k="-0.04"
              className="absolute left-[26%] top-[6%] hidden xl:block will-change-transform"
            >
              <div
                onClick={() => openExperienceModal(IROSTECH_EXPERIENCE)}
                className="w-44 rounded-xl overflow-hidden border border-white/15 bg-neutral-950 shadow-xl rotate-[2deg] cursor-pointer hover:scale-105 transition-transform duration-300"
              >
                <img
                  src="/images/experience/irostech/projects/dashboard-admin.png"
                  alt="Dashboard MBG"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto object-cover opacity-80"
                />
                <div className="p-1.5 text-center text-[10px] font-mono text-neutral-400">
                  Portal MBG & AI
                </div>
              </div>
            </div>

            {/* Floating Tags */}
            <div
              data-k="-0.2"
              className="absolute left-[30%] bottom-[8%] px-4 py-2 rounded-xl bg-emerald-600/90 text-white font-mono text-xs font-semibold shadow-lg hidden lg:block rotate-[-4deg] pointer-events-none will-change-transform"
            >
              Program Makan Bergizi Gratis (MBG) · BRIN
            </div>

            <div
              data-k="0.18"
              className="absolute right-[30%] bottom-[10%] px-4 py-2 rounded-xl bg-sky-600/90 text-white font-mono text-xs font-semibold shadow-lg hidden lg:block rotate-[4deg] pointer-events-none will-change-transform"
            >
              FastAPI · LLM Vision · Discord Webhook
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
                Featured Projects
              </h2>
              <p className="text-sm font-mono text-neutral-400">
                Lanjutkan untuk melihat 4 proyek unggulan: Subarvibe, FoodGuard, TheAgents, dan AIgency.
              </p>
              <div className="pt-2">
                <a
                  href="#projects"
                  onClick={scrollToProjects}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-neutral-950 font-semibold text-sm hover:bg-neutral-200 transition-all cursor-pointer shadow-lg shadow-white/10 hover:scale-105"
                >
                  <span>Lihat 4 Proyek Unggulan</span>
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
            {/* GPU-accelerated scaleX progress bar */}
            <div
              id="experience-timeline-fill"
              ref={fillRef}
              className="absolute left-0 top-0 h-full w-full bg-blue-600 rounded-full shadow-[0_0_14px_rgba(37,99,235,0.85)] origin-left will-change-transform"
              style={{ transform: "scaleX(0)" }}
            />

            {/* Interactive Timeline Dots */}
            {TIMELINE_STOPS.map((stop, idx) => {
              const isActive = idx === activeDotIndex;
              const positions = ["0%", "33%", "66%", "100%"];

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
                    className={`block w-3.5 h-3.5 rounded-full border-2 transition-all duration-200 ${
                      isActive
                        ? "border-blue-400 bg-blue-500 scale-125 shadow-[0_0_12px_rgba(59,130,246,0.9)]"
                        : "border-neutral-700 bg-neutral-950 group-hover:border-neutral-400"
                    }`}
                  />

                  {/* Label */}
                  <span
                    className={`absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-mono transition-colors duration-200 ${
                      isActive
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
        data={selectedExperience}
      />
    </section>
  );
}
