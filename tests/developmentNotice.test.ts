import { describe, it, expect } from "vitest";
import { DevelopmentModal } from "../src/components/ui/DevelopmentModal";
import fs from "fs";

describe("Development Notice Removal Verification", () => {
  it("exports DevelopmentModal as a React component function", () => {
    expect(DevelopmentModal).toBeDefined();
    expect(typeof DevelopmentModal).toBe("function");
  });

  it("verifies DevelopmentModal is removed from page.tsx to keep portfolio clean", () => {
    const pageContent = fs.readFileSync("src/app/page.tsx", "utf-8");
    expect(pageContent).not.toContain("<DevelopmentModal");
  });

  it("verifies OverlayUI does not display disruptive development notice banner", () => {
    const overlayContent = fs.readFileSync("src/components/ui/OverlayUI.tsx", "utf-8");
    expect(overlayContent).not.toContain("Website is on development");
  });
});
