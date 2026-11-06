import { describe, it, expect } from "vitest";
import { PROJECTS_DATA } from "../src/data/projectsData";

describe("Project Details & Thumbnails Data Integrity", () => {
  it("should have thumbnail images matching the new thumbnail assets for all projects", () => {
    for (const project of PROJECTS_DATA) {
      expect(project.image).toMatch(/Thumbnail\.png$/i);
      expect(project.screenshots).toBeDefined();
      expect(project.screenshots!.length).toBeGreaterThan(0);
      expect(project.details).toBeDefined();
      expect(project.details!.length).toBeGreaterThan(20);
    }
  });

  it("should verify all 4 projects have expected id and screenshot collections", () => {
    const ids = PROJECTS_DATA.map((p) => p.id);
    expect(ids).toEqual(["01", "02", "03", "04"]);

    const subarvibe = PROJECTS_DATA.find((p) => p.id === "01");
    expect(subarvibe?.title).toBe("Subarvibe");
    expect(subarvibe?.screenshots?.length).toBeGreaterThanOrEqual(4);

    const foodguard = PROJECTS_DATA.find((p) => p.id === "02");
    expect(foodguard?.title).toBe("FoodGuard");
    expect(foodguard?.screenshots?.length).toBeGreaterThanOrEqual(5);

    const theagents = PROJECTS_DATA.find((p) => p.id === "03");
    expect(theagents?.title).toBe("TheAgents");
    expect(theagents?.screenshots?.length).toBeGreaterThanOrEqual(3);

    const aigency = PROJECTS_DATA.find((p) => p.id === "04");
    expect(aigency?.title).toBe("AIgency");
    expect(aigency?.screenshots?.length).toBeGreaterThanOrEqual(3);
  });

  it("should verify ProjectsOverlay contains GitHub transition CTA slide matching experience.png", async () => {
    const fs = await import("fs");
    const overlayContent = fs.readFileSync(
      "src/components/projects/ProjectsOverlay.tsx",
      "utf-8"
    );
    expect(overlayContent).toContain("Ingin melihat daftar projek lengkap saya ?");
    expect(overlayContent).toContain("Silahkan kunjungi github.");
    expect(overlayContent).toContain("https://github.com/Subarjox");
  });
});
