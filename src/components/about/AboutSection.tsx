"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { ROLES_DATA, ABOUT_STATS } from "@/data/aboutData";

export function AboutSection() {
  const [activeView, setActiveView] = useState<"overview" | "detail">("overview");
  const [selectedRole, setSelectedRole] = useState<"ai" | "softeng">("ai");

  const openRole = (role: "ai" | "softeng") => {
    setSelectedRole(role);
    setActiveView("detail");
  };

  const currentRoleData = ROLES_DATA[selectedRole];
  const isAi = selectedRole === "ai";
  const activeColor = isAi ? "#2f6bff" : "#ff6a2b";

  return (
    <section
      id="about"
      className="relative w-full bg-white text-black py-20 sm:py-28 px-4 sm:px-8 md:px-12 selection:bg-neutral-200"
      aria-label="About Me Section"
    >
      <div className="max-w-[1120px] mx-auto">
        {/* Header Heading with Enlarged Display Typography */}
        <div className="text-center">
          <h2 className="font-black text-5xl sm:text-7xl md:text-8xl lg:text-[5.75rem] tracking-[-0.035em] leading-[1.02] text-black">
            Hello, I&apos;m{" "}
            <span className="relative inline-block text-black">
              Fahreza
              <svg
                className="absolute left-[-2%] -bottom-2 w-[104%] h-3.5 overflow-visible pointer-events-none"
                viewBox="0 0 300 12"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M3 8 C 80 2, 200 3, 297 6"
                  fill="none"
                  stroke="#2f6bff"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>

          <p className="text-center text-base sm:text-lg md:text-xl text-black mt-6 font-normal">
            I build{" "}
            <span className="relative inline-block pb-1 font-semibold text-black">
              websites and AI systems
              <svg
                className="absolute left-0 bottom-0 w-full h-2.5 overflow-visible pointer-events-none"
                viewBox="0 0 100 8"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M1 6 C 30 2, 70 3, 99 1"
                  fill="none"
                  stroke="#ffd23f"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            , and{" "}
            <span className="inline-block border-2 border-[#ff6a2b] rounded-[55%_45%_52%_48%/60%_55%_45%_40%] px-3.5 py-0.5 mx-1 -rotate-[1.5deg] font-semibold text-black transition-transform hover:rotate-0">
              automate
            </span>{" "}
            everything in between.
          </p>
        </div>

        {/* Free-Standing 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1.25fr_0.75fr] gap-8 md:gap-14 mt-12 md:mt-16 items-end">
          {/* LEFT: Overview or Detail with Smooth View Transitions */}
          <div className="min-h-[440px] relative">
            {activeView === "overview" ? (
              /* ===== OVERVIEW VIEW (Animated Floating Canvas) ===== */
              <div
                key="view-overview"
                className="relative w-full h-[440px] animate-in fade-in slide-in-from-bottom-2 duration-300"
              >
                {/* Floating Interactive Role Headings */}
                <button
                  type="button"
                  onClick={() => openRole("ai")}
                  className="absolute left-[24%] top-[6%] text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.02em] text-black hover:text-[#2f6bff] hover:scale-105 transition-all duration-300 cursor-pointer focus:outline-none animate-float select-none"
                >
                  AI Engineer
                </button>

                <button
                  type="button"
                  onClick={() => openRole("softeng")}
                  className="absolute left-[2%] top-[50%] text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.02em] text-black hover:text-[#ff6a2b] hover:scale-105 transition-all duration-300 cursor-pointer focus:outline-none animate-float-delayed select-none"
                >
                  Software Engineer
                </button>

                {/* Floating Tech Chips with Gentle Bobbing */}
                <span className="absolute left-[6%] top-[14%] -rotate-4 text-xs sm:text-sm font-semibold text-[#6b6b72] opacity-80 pointer-events-none animate-float select-none">
                  Flutter
                </span>
                <span className="absolute left-[62%] top-[26%] rotate-3 text-xs sm:text-sm font-semibold text-[#6b6b72] opacity-80 pointer-events-none animate-float-delayed select-none">
                  Gemini API
                </span>
                <span className="absolute left-[44%] top-[46%] -rotate-3 text-xs sm:text-sm font-semibold text-[#6b6b72] opacity-80 pointer-events-none hidden sm:inline-block animate-float-slow select-none">
                  TensorFlow
                </span>
                <span className="absolute left-[48%] top-[78%] rotate-4 text-xs sm:text-sm font-semibold text-[#6b6b72] opacity-80 pointer-events-none animate-float select-none">
                  Firebase
                </span>
                <span className="absolute left-[78%] top-[58%] -rotate-5 text-xs sm:text-sm font-semibold text-[#6b6b72] opacity-80 pointer-events-none hidden sm:inline-block animate-float-delayed select-none">
                  Automation
                </span>

                {/* Star Accent */}
                <span className="absolute left-[58%] top-[34%] text-3xl text-[#7c5cff] font-mono pointer-events-none select-none animate-float-slow">
                  ✱
                </span>

                {/* Hand-Drawn Loop SVG */}
                <svg
                  className="absolute right-[6%] bottom-[6%] w-36 h-36 pointer-events-none select-none animate-float-slow"
                  viewBox="0 0 100 100"
                  aria-hidden="true"
                >
                  <path
                    d="M30 60 C 8 50, 14 20, 40 18 C 66 16, 76 46, 66 70 C 58 90, 30 92, 22 74 C 14 56, 52 40, 72 52"
                    fill="none"
                    stroke="#2f6bff"
                    strokeWidth="1.6"
                  />
                </svg>

                {/* Hintline */}
              </div>
            ) : (
              /* ===== DETAIL VIEW (Animated Slide & Fade Transition) ===== */
              <div
                key={`view-detail-${selectedRole}`}
                className="relative w-full animate-in fade-in zoom-in-95 slide-in-from-bottom-3 duration-300"
              >
                {/* Role Pill Switchers */}
                <div className="flex items-center gap-2.5 mb-5" role="tablist">
                  <button
                    type="button"
                    onClick={() => setSelectedRole("ai")}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold font-mono transition-all duration-200 cursor-pointer ${isAi
                        ? "bg-[#2f6bff] text-white shadow-md shadow-[#2f6bff]/20 scale-105"
                        : "border border-[#e3e3df] text-[#6b6b72] hover:text-[#2f6bff] hover:border-[#2f6bff]"
                      }`}
                  >
                    AI Engineer
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole("softeng")}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold font-mono transition-all duration-200 cursor-pointer ${!isAi
                        ? "bg-[#ff6a2b] text-white shadow-md shadow-[#ff6a2b]/20 scale-105"
                        : "border border-[#e3e3df] text-[#6b6b72] hover:text-[#ff6a2b] hover:border-[#ff6a2b]"
                      }`}
                  >
                    Software Engineer
                  </button>
                </div>

                {/* Role Title */}
                <h3
                  className="font-extrabold text-2xl sm:text-4xl tracking-[-0.02em] mb-2.5 transition-colors duration-200"
                  style={{ color: activeColor }}
                >
                  {currentRoleData.title}
                </h3>

                {/* Description */}
                <p className="text-sm sm:text-base text-neutral-700 leading-relaxed mb-6 max-w-[48ch]">
                  {currentRoleData.description}
                </p>

                {/* Tech Stacks Heading */}
                <h4 className="font-extrabold text-base sm:text-lg text-black mb-3">
                  Tech Stacks
                </h4>

                {/* 8 Tech Stack Tiles (4 columns x 2 rows) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-[540px]">
                  {currentRoleData.stack.map((item, idx) => (
                    <div
                      key={item.name}
                      className="group rounded-xl py-3 px-2 text-center text-xs font-semibold transition-all duration-200 hover:-translate-y-1.5 hover:shadow-md cursor-pointer border"
                      style={{
                        borderColor: isAi ? "rgba(47, 107, 255, 0.35)" : "rgba(255, 106, 43, 0.35)",
                        backgroundColor: isAi ? "rgba(47, 107, 255, 0.08)" : "rgba(255, 106, 43, 0.08)",
                        animationDelay: `${idx * 40}ms`,
                      }}
                    >
                      {/* Icon Badge */}
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center p-1.5 mx-auto mb-2 text-white shadow-sm transition-transform duration-200 group-hover:scale-110"
                        style={{ backgroundColor: activeColor }}
                      >
                        <Image
                          src={item.icon}
                          alt={item.name}
                          width={20}
                          height={20}
                          className="w-4 h-4 object-contain brightness-0 invert"
                          unoptimized
                        />
                      </div>

                      {/* Tech Name */}
                      <span className="text-[11px] sm:text-xs font-semibold text-neutral-900 block truncate">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Back Button */}
                <button
                  type="button"
                  onClick={() => setActiveView("overview")}
                  className="mt-6 text-sm text-[#6b6b72] hover:text-black font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer group"
                >
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  <span>Kembali</span>
                </button>
              </div>
            )}
          </div>

          {/* RIGHT: Photo & Stats (Crisp Uncompressed Photo + Radial Backing) */}
          <div className="flex flex-col items-center">
            {/* Cutout Photo with unoptimized=true for Tack-Sharp Retina Rendering */}
            <div className="w-full max-w-[340px] sm:max-w-[360px] aspect-[1/1.05] rounded-t-[28px] bg-[radial-gradient(circle_at_50%_30%,#8d8d93,#3a3a40_70%)] flex items-end justify-center overflow-hidden shadow-2xl group">
              <Image
                src="/face.png"
                alt="Muhamad Fahreza - Profile Photo"
                width={720}
                height={800}
                unoptimized
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500 ease-out"
                priority
              />
            </div>

            {/* Clean Stats Row */}
            <div className="w-full max-w-[340px] sm:max-w-[360px] grid grid-cols-3 mt-4 text-center border-t border-[#e3e3df] pt-4">
              {ABOUT_STATS.map((stat) => (
                <div key={stat.label}>
                  <b className="block text-base sm:text-lg font-bold text-black tracking-tight">
                    {stat.value}
                  </b>
                  <span className="text-xs text-[#6b6b72] font-medium">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
