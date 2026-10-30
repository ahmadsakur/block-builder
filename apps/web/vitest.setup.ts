import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// RTL only auto-cleans when Vitest globals are on; they're off here.
afterEach(() => {
  cleanup();
});

// jsdom lacks these browser APIs; charts, popovers and reveal effects call them.
class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

vi.stubGlobal("ResizeObserver", NoopObserver);
vi.stubGlobal("IntersectionObserver", NoopObserver);
vi.stubGlobal("matchMedia", (media: string) => ({
  matches: false,
  media,
  onchange: null,
  addEventListener() {},
  removeEventListener() {},
  addListener() {},
  removeListener() {},
  dispatchEvent: () => false,
}));
