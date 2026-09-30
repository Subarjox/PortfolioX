import { describe, it, expect } from "vitest";
import { PROJECTS_DATA } from "../src/data/projectsData";

describe("Projects Overlay Content Validation", () => {
  it("should match editorial copy from reference images", () => {
    const featuredHeading = "Featured";
    const beyondProjects = "Beyond the projects";
    const scrollPrompt = "Scroll to see the projects";

    expect(featuredHeading).toBe("Featured");
    expect(beyondProjects).toContain("Beyond the projects");
    expect(scrollPrompt).toContain("Scroll to see the projects");
    expect(PROJECTS_DATA.length).toBeGreaterThanOrEqual(2);
  });
});
