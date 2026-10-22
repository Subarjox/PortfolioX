import { describe, it, expect } from "vitest";
import { Navbar } from "../src/components/ui/Navbar";

describe("Navbar Component", () => {
  it("should be defined and export a functional component", () => {
    expect(Navbar).toBeDefined();
    expect(typeof Navbar).toBe("function");
  });
});
