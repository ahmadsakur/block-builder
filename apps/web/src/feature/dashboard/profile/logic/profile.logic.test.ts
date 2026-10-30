import { expect, test } from "vitest";
import { avatarFileError, initials } from "./profile.logic";

test("takes the first and last initial", () => {
  expect(initials("Jane Mary Doe")).toBe("JD");
});

test("uses one letter for a single name", () => {
  expect(initials("  jane ")).toBe("J");
});

test("falls back when the name is blank", () => {
  expect(initials("   ")).toBe("?");
});

test("accepts PNG, JPEG and WebP images up to 5 MB", () => {
  expect(avatarFileError({ size: 5 * 1024 * 1024, type: "image/webp" })).toBe(
    undefined,
  );
  expect(avatarFileError({ size: 1000, type: "image/jpeg" })).toBe(undefined);
});

test("rejects other file types and files over 5 MB", () => {
  expect(avatarFileError({ size: 1000, type: "image/gif" })).toBe(
    "Use a PNG, JPEG or WebP image.",
  );
  expect(
    avatarFileError({ size: 5 * 1024 * 1024 + 1, type: "image/png" }),
  ).toBe("Use an image under 5 MB.");
});
