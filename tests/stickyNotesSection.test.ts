import { describe, it, expect } from "vitest";
import { StickyNotesSection } from "../src/components/stickynotes/StickyNotesSection";
import { INITIAL_STICKY_NOTES } from "../src/data/stickyNotesData";
import fs from "fs";

describe("StickyNotesSection Component", () => {
  it("should be defined and export a functional component", () => {
    expect(StickyNotesSection).toBeDefined();
    expect(typeof StickyNotesSection).toBe("function");
  });

  it("verifies all 7 requested authors are present in mock data", () => {
    expect(INITIAL_STICKY_NOTES.length).toBe(7);

    const authors = INITIAL_STICKY_NOTES.map((n) => n.author);
    const expectedAuthors = [
      "Wak Hj. Umuh",
      "Asep S.",
      "Sri W.",
      "Ijal P.",
      "Jumadi",
      "Ojanx",
      "Pehul",
    ];

    expectedAuthors.forEach((author) => {
      expect(authors).toContain(author);
    });
  });

  it("verifies notes have positive/encouraging content and valid colors", () => {
    const validColors = ["yellow", "salmon", "blue"];

    INITIAL_STICKY_NOTES.forEach((note) => {
      expect(note.message.trim().length).toBeGreaterThan(10);
      expect(note.message.length).toBeLessThanOrEqual(130);
      expect(validColors).toContain(note.color);
      expect(typeof note.rotation).toBe("number");
    });
  });

  it("verifies page.tsx integrates StickyNotesSection between OthersSection and ContactSection", () => {
    const pageContent = fs.readFileSync("src/app/page.tsx", "utf-8");
    const othersIdx = pageContent.indexOf("<OthersSection");
    const stickyIdx = pageContent.indexOf("<StickyNotesSection");
    const contactIdx = pageContent.indexOf("<ContactSection");

    expect(othersIdx).toBeGreaterThan(0);
    expect(stickyIdx).toBeGreaterThan(othersIdx);
    expect(contactIdx).toBeGreaterThan(stickyIdx);
  });

  it("verifies StickyNotesSection contains interactive elements like modal, form, and zoom", () => {
    const componentContent = fs.readFileSync(
      "src/components/stickynotes/StickyNotesSection.tsx",
      "utf-8"
    );

    expect(componentContent).toContain("Leave Your");
    expect(componentContent).toContain("Mark Here!");
    expect(componentContent).toContain("Stick a note");
    expect(componentContent).toContain("maxLength={80}");
    expect(componentContent).toContain("zoomedNote");
    expect(componentContent).toContain("font-handwriting");
  });
});
