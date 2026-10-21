import { expect, test } from "vitest";
import { initials } from "./profile.logic";

test("takes the first and last initial", () => {
  expect(initials("Jane Mary Doe")).toBe("JD");
});

test("uses one letter for a single name", () => {
  expect(initials("  jane ")).toBe("J");
});

test("falls back when the name is blank", () => {
  expect(initials("   ")).toBe("?");
});
