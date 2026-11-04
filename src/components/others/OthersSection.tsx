"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import {
  CERTIFICATES_DATA,
  PUBLICATIONS_DATA,
  AWARDS_DATA,
} from "@/data/othersData";

type CategoryKey = "cert" | "pub" | "hon";

interface CategoryMeta {
  key: CategoryKey;
  num: string;
  title: string;
  tag: string;
  color: string;
  subtitle: string;
  count: number;
}

const CATEGORIES: Record<CategoryKey, CategoryMeta> = {
  cert: {
    key: "cert",
    num: "01",
    title: "Certifications",
    tag: "// certifications",
    color: "#2f6bff",
    subtitle: `${CERTIFICATES_DATA.length} credentials. Hover to pause.`,
    count: CERTIFICATES_DATA.length,
  },
  pub: {
    key: "pub",
    num: "02",
    title: "Publications",
    tag: "// papers",
    color: "#ff6a2b",
    subtitle: `${PUBLICATIONS_DATA.length} published research papers.`,
    count: PUBLICATIONS_DATA.length,
  },
  hon: {
    key: "hon",
    num: "03",
    title: "Honor & Awards",
    tag: "// honors",
    color: "#7c5cff",
    subtitle: "Recognition and awards along the way.",
    count: AWARDS_DATA.length,
  },
};

export function OthersSection() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<CategoryKey | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeCategory) {
        setActiveCategory(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeCategory]);

  const activeColor = hoveredCategory
    ? CATEGORIES[hoveredCategory].color
    : activeCategory
    ? CATEGORIES[activeCategory].color
    : "#ffffff";

  return (
    <section
      id="others"
      className="relative w-full min-h-screen bg-[#000000] text-white py-20 sm:py-28 px-4 sm:px-8 md:px-14 selection:bg-neutral-800"
      aria-label="Others Section: Credentials, Research, and Recognition"
    >
      <div className="max-w-7xl mx-auto">
        {/* Top Eyebrow Header */}
        <div className="flex items-center gap-4 pb-4 border-b border-neutral-800 font-mono text-xs uppercase tracking-widest text-neutral-400">
          <span className="w-8 h-[1px] bg-white inline-block" />
          <span>Others / credentials, research and recognition</span>
        </div>

        {/* OVERVIEW VIEW */}
        {!activeCategory && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 pt-8 sm:pt-12 items-center min-h-[500px] animate-in fade-in duration-300">
            {/* Left Column: Orbital Wireframe Animation */}
            <div className="flex flex-col items-center justify-center relative">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center">
                <svg
                  className="w-full h-full animate-slow-spin select-none pointer-events-none"
                  viewBox="0 0 200 200"
                  aria-hidden="true"
                >
                  {Array.from({ length: 14 }).map((_, i) => {
                    const isAccent = i % 3 === 0;
                    return (
                      <ellipse
                        key={i}
                        cx="100"
                        cy="100"
                        rx={72 - i * 2}
                        ry={22 + (i % 5) * 3}
                        transform={`rotate(${i * 13} 100 100) translate(0 ${(i - 7) * 3})`}
                        fill="none"
                        stroke={isAccent ? activeColor : "#ffffff"}
                        strokeWidth={isAccent ? 0.9 : 0.4}
                        strokeOpacity={isAccent ? 0.9 : 0.25}
                        className="transition-colors duration-400"
                      />
                    );
                  })}
                </svg>
              </div>

              {/* Wireframe Caption */}
              <div className="w-full max-w-sm flex items-center justify-between pt-3 border-t border-neutral-800 font-mono text-[11px] text-neutral-500">
                <span>ORBITAL VERIFICATION INDEX</span>
                <div className="flex gap-1 items-center">
                  <span className="w-0.5 h-1.5 bg-neutral-400" />
                  <span className="w-0.5 h-2.5 bg-white" />
                  <span className="w-0.5 h-2 bg-neutral-400" />
                </div>
              </div>
            </div>

            {/* Right Column: Heading & 3 Interactive Category Rows */}
            <div className="flex flex-col justify-between space-y-8">
              <div>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-4 leading-[1.05]">
                  Certificates, research and recognition.
                </h2>
                <p className="text-base sm:text-lg text-neutral-300 font-normal leading-relaxed mb-2 max-w-xl">
                  Courses I completed, papers I helped publish, and awards I earned along the way.
                </p>
                <p className="text-xs sm:text-sm font-mono text-neutral-500">
                  Open any category to see everything inside it.
                </p>
              </div>

              {/* Category Rows */}
              <div className="border-t border-neutral-800">
                {(Object.keys(CATEGORIES) as CategoryKey[]).map((key) => {
                  const cat = CATEGORIES[key];
                  const isHovered = hoveredCategory === key;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActiveCategory(key)}
                      onMouseEnter={() => setHoveredCategory(key)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      onFocus={() => setHoveredCategory(key)}
                      onBlur={() => setHoveredCategory(null)}
                      className="group w-full py-5 sm:py-6 border-b border-neutral-800 flex items-center justify-between text-left transition-all duration-200 hover:pl-3 cursor-pointer focus:outline-none"
                    >
                      <div className="flex items-center gap-4 sm:gap-6">
                        <span className="font-mono text-xs sm:text-sm text-neutral-500">
                          {cat.num}
                        </span>
                        <span
                          className="text-xl sm:text-2xl md:text-3xl font-semibold transition-colors duration-200"
                          style={{
                            color: isHovered ? cat.color : "#ffffff",
                          }}
                        >
                          {cat.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 font-mono text-xs sm:text-sm text-neutral-500">
                        <span>{String(cat.count).padStart(2, "0")}</span>
                        <ArrowUpRight
                          className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
                          style={{ color: isHovered ? cat.color : undefined }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* DETAIL VIEW */}
        {activeCategory && (
          <div className="pt-6 sm:pt-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
            {/* Detail Top Header */}
            <div className="flex items-center justify-between pb-6">
              <button
                type="button"
                onClick={() => setActiveCategory(null)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 text-xs font-mono text-white transition-all cursor-pointer hover:border-neutral-600"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>← Others</span>
              </button>

              <span
                className="font-mono text-xs sm:text-sm font-medium"
                style={{ color: CATEGORIES[activeCategory].color }}
              >
                {CATEGORIES[activeCategory].tag}
              </span>
            </div>

            {/* Detail Title */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-2">
              {CATEGORIES[activeCategory].title}
            </h2>
            <p className="text-sm sm:text-base font-mono text-neutral-400 mb-8 sm:mb-12">
              {CATEGORIES[activeCategory].subtitle}
            </p>

            {/* DETAIL BODY BY CATEGORY */}
            {activeCategory === "cert" && (
              /* ===== CERTIFICATIONS MARQUEE ===== */
              <div className="overflow-hidden -mx-4 sm:-mx-8 md:-mx-14 py-4 [mask-image:linear-gradient(90deg,transparent,#000_5%,#000_95%,transparent)]">
                <div className="animate-marquee flex gap-5">
                  {/* First and Second sets for infinite loop */}
                  {[...CERTIFICATES_DATA, ...CERTIFICATES_DATA].map((cert, idx) => (
                    <article
                      key={`${cert.id}-${idx}`}
                      className="w-[260px] sm:w-[320px] rounded-2xl bg-neutral-900/80 border border-neutral-800 p-3.5 hover:border-blue-500 hover:-translate-y-1.5 transition-all duration-200 flex flex-col justify-between shrink-0 shadow-lg group"
                    >
                      {/* Physical Certificate Thumbnail Mockup matching others.html */}
                      <div className="relative aspect-[16/10] bg-white text-black rounded-lg p-3 flex flex-col justify-between overflow-hidden shadow-inner mb-3">
                        {/* Corner Ribbon Notch */}
                        <div
                          className="absolute right-3 top-0 w-4 h-7 bg-black"
                          style={{
                            clipPath:
                              "polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)",
                          }}
                        />

                        <div>
                          <b className="block text-[11px] font-bold tracking-tight">
                            {cert.issuer}
                          </b>
                          <small className="block text-[7px] text-neutral-500 uppercase tracking-wider mt-1">
                            Certificate of completion
                          </small>
                          <span className="block text-[9px] font-semibold text-blue-600 mt-1 truncate">
                            {cert.recipient}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <div className="h-1 bg-neutral-200 rounded w-3/4" />
                          <div className="h-1 bg-neutral-200 rounded w-1/2" />
                        </div>
                      </div>

                      {/* Certificate Meta */}
                      <div>
                        <h3 className="font-semibold text-sm sm:text-base text-white line-clamp-1 mb-1">
                          {cert.title}
                        </h3>
                        <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                          {cert.description}
                        </p>
                      </div>

                      <a
                        href={cert.credentialUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-blue-400 hover:text-blue-300 transition-colors self-end"
                      >
                        <span>View Credential</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {activeCategory === "pub" && (
              /* ===== PUBLICATIONS NUMBERED LIST ===== */
              <ol className="divide-y divide-neutral-800 max-w-4xl">
                {PUBLICATIONS_DATA.map((pub, idx) => (
                  <li key={pub.id} className="py-6 sm:py-8 grid grid-cols-[40px_1fr] sm:grid-cols-[56px_1fr] gap-3 items-start group">
                    <span className="font-mono text-xs sm:text-sm text-orange-400 pt-1">
                      {String(idx + 1).padStart(2, "0")}
                    </span>

                    <div className="space-y-2">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-white group-hover:text-orange-400 transition-colors">
                        <a
                          href={pub.paperUrl || "#"}
                          className="inline-flex items-center gap-1.5"
                        >
                          <span>{pub.title}</span>
                          <ArrowUpRight className="w-4 h-4 text-orange-400 inline shrink-0" />
                        </a>
                      </h3>
                      <p className="font-mono text-xs sm:text-sm text-orange-400/90 tracking-wide">
                        {pub.venue} · {pub.year}
                      </p>
                      <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                        {pub.authors}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            )}

            {activeCategory === "hon" && (
              /* ===== AWARDS NUMBERED LIST ===== */
              <ol className="divide-y divide-neutral-800 max-w-4xl">
                {AWARDS_DATA.map((award, idx) => (
                  <li key={award.id} className="py-6 sm:py-8 grid grid-cols-[40px_1fr] sm:grid-cols-[56px_1fr] gap-3 items-start group">
                    <span className="font-mono text-xs sm:text-sm text-purple-400 pt-1">
                      {String(idx + 1).padStart(2, "0")}
                    </span>

                    <div className="space-y-2">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-white group-hover:text-purple-400 transition-colors">
                        <span>{award.title}</span>
                      </h3>
                      <p className="font-mono text-xs sm:text-sm text-purple-400/90 tracking-wide">
                        {award.organizer} · {award.year}
                      </p>
                      <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                        {award.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}

        {/* Section Footer */}
        <div className="mt-14 sm:mt-20 pt-4 border-t border-neutral-800 flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-neutral-500">
          <span>OTHERS INDEX</span>
          <span>/ 03 CREDENTIAL TIERS</span>
        </div>
      </div>
    </section>
  );
}
