import { createReadStream } from "node:fs";
import { mkdir, rm, stat, writeFile } from "node:fs/promises";
import { dirname, extname, resolve, sep } from "node:path";
import { Readable } from "node:stream";
import type { Storage } from ".";

const CONTENT_TYPES: Record<string, string> = {
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export function createLocalStorage(dir: string): Storage {
  const root = resolve(dir);

  function pathFor(key: string): string {
    const path = resolve(root, key);
    if (!path.startsWith(root + sep)) throw new Error(`Invalid key: ${key}`);
    return path;
  }

  return {
    async init() {
      await mkdir(root, { recursive: true });
    },
    async put(key, body) {
      const path = pathFor(key);
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, body);
    },
    async get(key) {
      try {
        const path = pathFor(key);
        await stat(path);
        return {
          body: Readable.toWeb(createReadStream(path)) as ReadableStream,
          contentType:
            CONTENT_TYPES[extname(path)] ?? "application/octet-stream",
        };
      } catch {
        return null;
      }
    },
    async delete(key) {
      await rm(pathFor(key), { force: true });
    },
  };
}
