import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import type { Storage } from ".";
import { createLocalStorage } from "./local";

describe("local storage", () => {
  let dir: string;
  let storage: Storage;

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), "storage-"));
    storage = createLocalStorage(dir);
    await storage.init();
  });

  afterEach(() => rm(dir, { force: true, recursive: true }));

  test("puts, gets and deletes an object", async () => {
    await storage.put(
      "avatars/u1/a.webp",
      new Uint8Array([1, 2, 3]),
      "image/webp",
    );

    const object = await storage.get("avatars/u1/a.webp");
    expect(object?.contentType).toBe("image/webp");
    expect(
      new Uint8Array(await new Response(object?.body).arrayBuffer()),
    ).toEqual(new Uint8Array([1, 2, 3]));

    await storage.delete("avatars/u1/a.webp");
    expect(await storage.get("avatars/u1/a.webp")).toBeNull();
  });

  test("returns null for a missing object", async () => {
    expect(await storage.get("avatars/none.webp")).toBeNull();
  });

  test("rejects keys that escape the storage folder", async () => {
    await expect(
      storage.put("../escape.webp", new Uint8Array(), "image/webp"),
    ).rejects.toThrow();
    expect(await storage.get("avatars/../../escape.webp")).toBeNull();
  });
});
