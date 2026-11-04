"use client";

import React from "react";
import { Github, Instagram, Linkedin, Mail, Download } from "lucide-react";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="relative w-full bg-white text-black py-24 sm:py-36 px-6 text-center select-none border-t border-neutral-100"
      aria-label="Contact Section"
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Main Title matching contact.png */}
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-neutral-950 mb-8 sm:mb-10 max-w-2xl leading-[1.1]">
          Let’s Connect &amp; Work Together
        </h2>

        {/* Primary Resume Action Button: Downloads CV_ENG.pdf */}
        <a
          href="/CV_ENG.pdf"
          download="CV_ENG.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2.5 px-10 sm:px-14 py-3.5 sm:py-4 rounded-2xl bg-black text-white font-bold text-base sm:text-lg tracking-wide hover:bg-neutral-800 transition-all duration-200 shadow-md hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Download className="w-5 h-5 text-white" />
          <span>Resume (CV)</span>
        </a>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-neutral-600 font-normal mt-8 sm:mt-10 mb-6 tracking-wide">
          or through these socials
        </p>

        {/* Social Icons Row matching contact.png */}
        <div className="flex items-center justify-center gap-6 sm:gap-9">
          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/muhamad-fahreza-andina-rizki-863835265/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            className="text-neutral-900 hover:text-blue-600 transition-all duration-200 hover:scale-115 cursor-pointer p-1"
          >
            <Linkedin className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2]" />
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/Subarjox"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="text-neutral-900 hover:text-neutral-700 transition-all duration-200 hover:scale-115 cursor-pointer p-1"
          >
            <Github className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2]" />
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram Profile"
            className="text-neutral-900 hover:text-pink-600 transition-all duration-200 hover:scale-115 cursor-pointer p-1"
          >
            <Instagram className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2]" />
          </a>

          {/* Email */}
          <a
            href="mailto:mfahrezza12@gmail.com"
            aria-label="Send Email"
            className="text-neutral-900 hover:text-blue-600 transition-all duration-200 hover:scale-115 cursor-pointer p-1"
          >
            <Mail className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2]" />
          </a>
        </div>

        {/* Subtle Bottom Copyright */}
        <div className="mt-20 sm:mt-28 pt-8 border-t border-neutral-200/80 w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-neutral-400">
          <span>© {new Date().getFullYear()} Muhamad Fahreza. All rights reserved.</span>
          <span>Cimahi, West Java, Indonesia</span>
        </div>
      </div>
    </section>
  );
}
