import { describe, it, expect } from "vitest";
import { DevelopmentModal } from "../src/components/ui/DevelopmentModal";
import fs from "fs";

describe("Development Notice and Resume Redirection", () => {
  it("exports DevelopmentModal as a React component function", () => {
    expect(DevelopmentModal).toBeDefined();
    expect(typeof DevelopmentModal).toBe("function");
  });

  it("verifies resume URL is configured correctly in DevelopmentModal", () => {
    const modalContent = fs.readFileSync("src/components/ui/DevelopmentModal.tsx", "utf-8");
    const resumeUrl = "https://resume-phi-smoky-95.vercel.app/index.html";

    expect(modalContent).toContain(resumeUrl);
    expect(modalContent).toContain("Website Sedang Dalam Tahap Pembangunan");
  });

  it("verifies OverlayUI contains development notice and resume link at bottom of hero", () => {
    const overlayContent = fs.readFileSync("src/components/ui/OverlayUI.tsx", "utf-8");
    const resumeUrl = "https://resume-phi-smoky-95.vercel.app/index.html";

    expect(overlayContent).toContain("Website is on development");
    expect(overlayContent).toContain(resumeUrl);
  });
});
