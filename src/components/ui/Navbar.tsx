"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

interface NavbarProps {
  brandName?: string;
  brandSubtitle?: string;
  logoSrc?: string;
}

export function Navbar({
  brandName = "FAHREZA",
  brandSubtitle = "AI & Software Engineer",
  logoSrc = "/logo.png",
}: NavbarProps) {
  const [activeSection, setActiveSection] = useState<"home" | "projects">("home");

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const projectsSection = document.getElementById("projects");
      if (projectsSection) {
        const rect = projectsSection.getBoundingClientRect();
        // If projects section is in view or scrolled past hero
        if (rect.top <= window.innerHeight * 0.4) {
          setActiveSection("projects");
          return;
        }
      }
      setActiveSection("home");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToHero = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    const projectsEl = document.getElementById("projects");
    if (projectsEl) {
      projectsEl.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    }
  };

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Scroll to bottom or open contact
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  };

  return (
    <header className="fixed top-4 md:top-6 inset-x-0 mx-auto z-50 w-[94%] sm:w-[90%] max-w-4xl pointer-events-none transition-all duration-300">
      <nav
        aria-label="Main Navigation"
        className="pointer-events-auto flex items-center justify-between px-2.5 py-2 sm:px-4 sm:py-2.5 rounded-full bg-neutral-950/50 backdrop-blur-xl border border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.37),inset_0_1px_1px_0_rgba(255,255,255,0.12)] transition-all duration-300 select-none"
      >
        {/* Brand / Logo (Left) */}
        <a
          href="#home"
          onClick={scrollToHero}
          className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded-full pr-2"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl bg-black/90 border border-white/15 flex items-center justify-center p-1.5 shadow-inner shrink-0 group-hover:border-white/30 transition-colors">
            <Image
              src={logoSrc}
              alt={`${brandName} Logo`}
              width={32}
              height={32}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs sm:text-sm font-semibold tracking-wide text-white leading-tight group-hover:text-zinc-200 transition-colors">
              {brandName}
            </span>
            <span className="text-[10px] sm:text-[11px] text-zinc-400 font-normal leading-tight hidden xs:block">
              {brandSubtitle}
            </span>
          </div>
        </a>

        {/* Navigation Links (Center / Right) */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Home Nav Item */}
          <a
            href="#home"
            onClick={scrollToHero}
            className={`px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
              activeSection === "home"
                ? "bg-white/15 text-white shadow-sm border border-white/15"
                : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            Home
          </a>

          {/* Projects Nav Item */}
          <a
            href="#projects"
            onClick={scrollToProjects}
            className={`px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
              activeSection === "projects"
                ? "bg-white/15 text-white shadow-sm border border-white/15"
                : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            Projects
          </a>
        </div>

        {/* CTA Button (Far Right) */}
        <a
          href="#contact"
          onClick={handleContactClick}
          className="flex items-center gap-2 pl-3 sm:pl-4 pr-1.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs sm:text-sm font-medium transition-all duration-200 group cursor-pointer shadow-sm shrink-0"
        >
          <span>Contact</span>
          <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white text-black flex items-center justify-center shrink-0 shadow-sm transition-transform duration-200 group-hover:scale-105 group-hover:rotate-45">
            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
          </span>
        </a>
      </nav>
    </header>
  );
}
