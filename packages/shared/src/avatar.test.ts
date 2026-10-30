import { expect, test } from "vitest";
import { isAvatarType } from "./avatar";

test("accepts the image types both apps handle", () => {
  expect(isAvatarType("image/png")).toBe(true);
  expect(isAvatarType("image/jpeg")).toBe(true);
  expect(isAvatarType("image/webp")).toBe(true);
});

test("rejects anything else", () => {
  expect(isAvatarType("image/gif")).toBe(false);
  expect(isAvatarType("")).toBe(false);
});
