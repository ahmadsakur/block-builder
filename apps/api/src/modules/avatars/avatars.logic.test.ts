import { describe, expect, test } from "vitest";
import {
  avatarImageUrl,
  avatarKeyFromImage,
  newAvatarKey,
} from "./avatars.logic";

describe("avatar keys", () => {
  test("round-trips a key through its public URL", () => {
    const key = newAvatarKey("user-1", "image/webp");
    expect(key).toMatch(/^avatars\/user-1\/[0-9a-f-]+\.webp$/);
    expect(avatarKeyFromImage(avatarImageUrl(key))).toBe(key);
  });

  test("names the file after its type", () => {
    expect(newAvatarKey("user-1", "image/png")).toMatch(/\.png$/);
    expect(newAvatarKey("user-1", "image/jpeg")).toMatch(/\.jpg$/);
  });

  test("ignores images we don't store", () => {
    expect(avatarKeyFromImage("https://example.com/a.png")).toBeNull();
    expect(avatarKeyFromImage(null)).toBeNull();
  });
});
