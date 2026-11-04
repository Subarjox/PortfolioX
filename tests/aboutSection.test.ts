import { describe, it, expect } from "vitest";
import { AboutSection } from "../src/components/about/AboutSection";
import { SOFTENG_STACK, AI_STACK, ROLES_DATA, ABOUT_STATS } from "../src/data/aboutData";
import fs from "fs";

describe("AboutSection Component", () => {
  it("should be defined and export a functional component", () => {
    expect(AboutSection).toBeDefined();
    expect(typeof AboutSection).toBe("function");
  });

  it("verifies softeng tech stack contains exactly 8 items matching user specification", () => {
    expect(SOFTENG_STACK).toHaveLength(8);
    const names = SOFTENG_STACK.map((i) => i.name.toLowerCase());
    expect(names).toContain("nextjs");
    expect(names).toContain("laravel");
    expect(names).toContain("java");
    expect(names).toContain("supabase");
    expect(names).toContain("fastapi");
    expect(names).toContain("react");
    expect(names).toContain("express");
    expect(names).toContain("and many more");
  });

  it("verifies ai-eng tech stack contains exactly 8 items matching user specification", () => {
    expect(AI_STACK).toHaveLength(8);
    const names = AI_STACK.map((i) => i.name.toLowerCase());
    expect(names).toContain("llama cpp");
    expect(names).toContain("tensorflow");
    expect(names).toContain("keras");
    expect(names).toContain("comfyui");
    expect(names).toContain("claude code");
    expect(names).toContain("agy");
    expect(names).toContain("pytorch");
    expect(names).toContain("and many more");
  });

  it("verifies all downloaded local svg icons and face.png exist in public directory", () => {
    const allStacks = [...SOFTENG_STACK, ...AI_STACK];
    allStacks.forEach((item) => {
      const publicPath = `public${item.icon}`;
      expect(fs.existsSync(publicPath)).toBe(true);
    });

    expect(fs.existsSync("public/face.png")).toBe(true);
  });

  it("verifies page.tsx positions AboutSection between Hero and ExperienceSection", () => {
    const pageContent = fs.readFileSync("src/app/page.tsx", "utf-8");
    const heroIdx = pageContent.indexOf('id="home"');
    const aboutIdx = pageContent.indexOf("<AboutSection");
    const expIdx = pageContent.indexOf("<ExperienceSection");
    const projIdx = pageContent.indexOf("<FeaturedProjectsSection");

    expect(heroIdx).toBeGreaterThan(0);
    expect(aboutIdx).toBeGreaterThan(heroIdx);
    expect(expIdx).toBeGreaterThan(aboutIdx);
    expect(projIdx).toBeGreaterThan(expIdx);
  });

  it("verifies Navbar includes About link and smooth scroll", () => {
    const navbarContent = fs.readFileSync("src/components/ui/Navbar.tsx", "utf-8");
    expect(navbarContent).toContain('href="#about"');
    expect(navbarContent).toContain("scrollToAbout");
    expect(navbarContent).toContain('"about"');
  });
});
