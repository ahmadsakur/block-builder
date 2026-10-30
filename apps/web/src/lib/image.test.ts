import { expect, test } from "vitest";
import { centerSquare } from "./image";

test("crops the middle of a landscape image", () => {
  expect(centerSquare(1200, 800)).toEqual({ side: 800, x: 200, y: 0 });
});

test("crops the middle of a portrait image", () => {
  expect(centerSquare(600, 1000)).toEqual({ side: 600, x: 0, y: 200 });
});

test("keeps a square image whole", () => {
  expect(centerSquare(512, 512)).toEqual({ side: 512, x: 0, y: 0 });
});
