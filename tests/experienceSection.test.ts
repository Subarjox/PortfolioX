import { describe, it, expect } from "vitest";
import { ExperienceSection } from "../src/components/experience/ExperienceSection";
import { ExperienceModal } from "../src/components/experience/ExperienceModal";
import { WINNICODE_EXPERIENCE, TIMELINE_STOPS } from "../src/data/experienceData";
import fs from "fs";

describe("ExperienceSection Component (Native Next.js Architecture)", () => {
  it("should be defined and export functional components", () => {
    expect(ExperienceSection).toBeDefined();
    expect(typeof ExperienceSection).toBe("function");
    expect(ExperienceModal).toBeDefined();
    expect(typeof ExperienceModal).toBe("function");
  });

  it("verifies typed data model for Winnicode and timeline stops", () => {
    expect(WINNICODE_EXPERIENCE.company).toBe("PT Winnicode Garuda Teknologi");
    expect(WINNICODE_EXPERIENCE.recipient).toBe("Muhamad Fahreza Andina Rizki");
    expect(WINNICODE_EXPERIENCE.predicate).toContain("Sangat Baik Sekali");
    expect(TIMELINE_STOPS.length).toBe(4);
    expect(TIMELINE_STOPS[0].id).toBe("intro");
    expect(TIMELINE_STOPS[1].id).toBe("winnicode");
  });

  it("verifies native Tailwind blue timeline bar in ExperienceSection.tsx", () => {
    const sectionContent = fs.readFileSync(
      "src/components/experience/ExperienceSection.tsx",
      "utf-8"
    );

    // Verify blue timeline progress fill and active dot
    expect(sectionContent).toContain("bg-blue-600");
    expect(sectionContent).toContain("bg-blue-500");
    expect(sectionContent).toContain("border-blue-400");
    expect(sectionContent).toContain("experience-timeline-fill");
  });

  it("verifies page.tsx integrates ExperienceSection above FeaturedProjectsSection", () => {
    const pageContent = fs.readFileSync("src/app/page.tsx", "utf-8");
    const expIdx = pageContent.indexOf("<ExperienceSection");
    const projIdx = pageContent.indexOf("<FeaturedProjectsSection");

    expect(expIdx).toBeGreaterThan(0);
    expect(projIdx).toBeGreaterThan(0);
    expect(expIdx).toBeLessThan(projIdx);
  });

  it("verifies Navbar includes experience navigation item with scroll spy", () => {
    const navbarContent = fs.readFileSync("src/components/ui/Navbar.tsx", "utf-8");
    expect(navbarContent).toContain('href="#experience"');
    expect(navbarContent).toContain("scrollToExperience");
    expect(navbarContent).toContain('"experience"');
  });
});
