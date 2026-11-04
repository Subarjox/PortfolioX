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
  const [activeSection, setActiveSection] = useState<
    "home" | "about" | "experience" | "projects" | "others"
  >("home");

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const othersSection = document.getElementById("others");
      const projectsSection = document.getElementById("projects");
      const experienceSection = document.getElementById("experience");
      const aboutSection = document.getElementById("about");

      if (othersSection) {
        const rect = othersSection.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.4) {
          setActiveSection("others");
          return;
        }
      }

      if (projectsSection) {
        const rect = projectsSection.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.4) {
          setActiveSection("projects");
          return;
        }
      }

      if (experienceSection) {
        const rect = experienceSection.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.4) {
          setActiveSection("experience");
          return;
        }
      }

      if (aboutSection) {
        const rect = aboutSection.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.4) {
          setActiveSection("about");
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

  const scrollToAbout = (e: React.MouseEvent) => {
    e.preventDefault();
    const aboutEl = document.getElementById("about");
    if (aboutEl) {
      aboutEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToExperience = (e: React.MouseEvent) => {
    e.preventDefault();
    const experienceEl = document.getElementById("experience");
    if (experienceEl) {
      experienceEl.scrollIntoView({ behavior: "smooth" });
    }
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

  const scrollToOthers = (e: React.MouseEvent) => {
    e.preventDefault();
    const othersEl = document.getElementById("others");
    if (othersEl) {
      othersEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const contactEl = document.getElementById("contact");
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-3 sm:top-5 inset-x-0 mx-auto z-50 w-[96%] sm:w-[92%] max-w-4xl pointer-events-none transition-all duration-300">
      <nav
        aria-label="Main Navigation"
        className="pointer-events-auto flex items-center justify-between px-2 sm:px-4 py-2 rounded-full bg-neutral-950/60 backdrop-blur-xl border border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.45),inset_0_1px_1px_0_rgba(255,255,255,0.12)] transition-all duration-300 select-none"
      >
        {/* Brand / Logo (Left) */}
        <a
          href="#home"
          onClick={scrollToHero}
          className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded-full pr-1 sm:pr-2"
        >
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-black/90 border border-white/15 flex items-center justify-center p-1 sm:p-1.5 shadow-inner shrink-0 group-hover:border-white/30 transition-colors">
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
            <span className="text-[9px] sm:text-[11px] text-zinc-400 font-normal leading-tight hidden xs:block">
              {brandSubtitle}
            </span>
          </div>
        </a>

        {/* Navigation Links (Center) */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          {/* Home Nav Item */}
          <a
            href="#home"
            onClick={scrollToHero}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs md:text-sm font-medium transition-all duration-200 cursor-pointer ${
              activeSection === "home"
                ? "bg-white/15 text-white shadow-sm border border-white/15"
                : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            Home
          </a>

          {/* About Nav Item */}
          <a
            href="#about"
            onClick={scrollToAbout}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs md:text-sm font-medium transition-all duration-200 cursor-pointer ${
              activeSection === "about"
                ? "bg-white/15 text-white shadow-sm border border-white/15"
                : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            About
          </a>

          {/* Experience Nav Item */}
          <a
            href="#experience"
            onClick={scrollToExperience}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs md:text-sm font-medium transition-all duration-200 cursor-pointer ${
              activeSection === "experience"
                ? "bg-white/15 text-white shadow-sm border border-white/15"
                : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            Experience
          </a>

          {/* Projects Nav Item */}
          <a
            href="#projects"
            onClick={scrollToProjects}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs md:text-sm font-medium transition-all duration-200 cursor-pointer ${
              activeSection === "projects"
                ? "bg-white/15 text-white shadow-sm border border-white/15"
                : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            Projects
          </a>

          {/* Others Nav Item */}
          <a
            href="#others"
            onClick={scrollToOthers}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs md:text-sm font-medium transition-all duration-200 cursor-pointer ${
              activeSection === "others"
                ? "bg-white/15 text-white shadow-sm border border-white/15"
                : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            Others
          </a>
        </div>

        {/* CTA Button (Far Right) */}
        <a
          href="#contact"
          onClick={handleContactClick}
          className="flex items-center gap-1 sm:gap-2 pl-2 sm:pl-3.5 pr-1 sm:pr-1.5 py-1 sm:py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white text-[11px] sm:text-xs md:text-sm font-medium transition-all duration-200 group cursor-pointer shadow-sm shrink-0"
        >
          <span>Contact</span>
          <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white text-black flex items-center justify-center shrink-0 shadow-sm transition-transform duration-200 group-hover:scale-105 group-hover:rotate-45">
            <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
          </span>
        </a>
      </nav>
    </header>
  );
}
