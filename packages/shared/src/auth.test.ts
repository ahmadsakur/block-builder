import { expect, test } from "vitest";
import { toRole } from "./auth";

test("keeps known roles", () => {
  expect(toRole("root")).toBe("root");
  expect(toRole("user")).toBe("user");
});

test("falls back to the default role for anything else", () => {
  expect(toRole("admin")).toBe("user");
  expect(toRole(null)).toBe("user");
});
