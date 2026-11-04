import { describe, it, expect } from "vitest";
import { ContactSection } from "../src/components/contact/ContactSection";
import fs from "fs";

describe("ContactSection Component", () => {
  it("should be defined and export a functional component", () => {
    expect(ContactSection).toBeDefined();
    expect(typeof ContactSection).toBe("function");
  });

  it("verifies heading, resume button, and social links matching contact.png", () => {
    const fileContent = fs.readFileSync(
      "src/components/contact/ContactSection.tsx",
      "utf-8"
    );

    expect(fileContent).toContain("Let’s Connect &amp; Work Together");
    expect(fileContent).toContain("Resume");
    expect(fileContent).toContain("or through these socials");
    expect(fileContent).toContain("https://resume-phi-smoky-95.vercel.app/index.html");
    expect(fileContent).toContain("linkedin.com");
    expect(fileContent).toContain("github.com/Subarjox");
    expect(fileContent).toContain("instagram.com");
    expect(fileContent).toContain("mailto:mfahrezza12@gmail.com");
  });

  it("verifies page.tsx integrates ContactSection at the bottom of the page", () => {
    const pageContent = fs.readFileSync("src/app/page.tsx", "utf-8");
    const projIdx = pageContent.indexOf("<FeaturedProjectsSection");
    const contactIdx = pageContent.indexOf("<ContactSection");

    expect(projIdx).toBeGreaterThan(0);
    expect(contactIdx).toBeGreaterThan(projIdx);
  });

  it("verifies Navbar smoothly targets contact section", () => {
    const navbarContent = fs.readFileSync("src/components/ui/Navbar.tsx", "utf-8");
    expect(navbarContent).toContain('getElementById("contact")');
    expect(navbarContent).toContain('href="#contact"');
  });
});
