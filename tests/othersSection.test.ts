import { describe, it, expect } from "vitest";
import { OthersSection } from "../src/components/others/OthersSection";
import {
  CERTIFICATES_DATA,
  PUBLICATIONS_DATA,
  AWARDS_DATA,
} from "../src/data/othersData";
import fs from "fs";

describe("OthersSection Component", () => {
  it("should be defined and export a functional component", () => {
    expect(OthersSection).toBeDefined();
    expect(typeof OthersSection).toBe("function");
  });

  it("verifies certifications, publications, and awards data models", () => {
    expect(CERTIFICATES_DATA.length).toBeGreaterThanOrEqual(10);
    expect(PUBLICATIONS_DATA.length).toBe(4);
    expect(AWARDS_DATA.length).toBe(3);

    expect(CERTIFICATES_DATA[0].recipient).toBe("Muhamad Fahreza Andina Rizki");
    expect(PUBLICATIONS_DATA[0].authors).toContain("Muhamad Fahreza Andina Rizki");
    expect(AWARDS_DATA[0].title).toContain("Google Cloud");
    expect(AWARDS_DATA[1].title).toContain("Medali Perunggu");
  });

  it("verifies page.tsx integrates OthersSection between Projects and Contact", () => {
    const pageContent = fs.readFileSync("src/app/page.tsx", "utf-8");
    const projIdx = pageContent.indexOf("<FeaturedProjectsSection");
    const othersIdx = pageContent.indexOf("<OthersSection");
    const contactIdx = pageContent.indexOf("<ContactSection");

    expect(projIdx).toBeGreaterThan(0);
    expect(othersIdx).toBeGreaterThan(projIdx);
    expect(contactIdx).toBeGreaterThan(othersIdx);
  });

  it("verifies Navbar includes Others link and smooth scroll handler", () => {
    const navbarContent = fs.readFileSync("src/components/ui/Navbar.tsx", "utf-8");
    expect(navbarContent).toContain('href="#others"');
    expect(navbarContent).toContain("scrollToOthers");
    expect(navbarContent).toContain('"others"');
  });
});
