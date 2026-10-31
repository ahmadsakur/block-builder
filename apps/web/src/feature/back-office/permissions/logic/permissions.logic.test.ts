import { describe, expect, test } from "vitest";
import type { PermissionMatrix } from "../types/permissions.types";
import {
  cellIndex,
  changedCells,
  parseLimit,
  toCells,
} from "./permissions.logic";

const MATRIX: PermissionMatrix = {
  plans: [
    { description: "", id: "free", name: "Free", sort: 0 },
    { description: "", id: "pro", name: "Pro", sort: 1 },
  ],
  values: [
    { enabled: true, key: "projects.max", limit: 3, planId: "free" },
    { enabled: true, key: "projects.max", limit: null, planId: "pro" },
    { enabled: true, key: "analytics.view", limit: null, planId: "pro" },
  ],
};

describe("toCells", () => {
  const cells = toCells(MATRIX);

  test("has one cell per catalog permission and plan", () => {
    expect(cells).toHaveLength(6);
  });

  test("copies stored values and denies missing ones", () => {
    expect(cells[cellIndex(cells, "pro", "projects.max")]).toEqual({
      enabled: true,
      key: "projects.max",
      limit: null,
      planId: "pro",
    });
    expect(cells[cellIndex(cells, "free", "analytics.view")]).toMatchObject({
      enabled: false,
    });
  });
});

test("changedCells returns only cells that differ", () => {
  const saved = toCells(MATRIX);
  const draft = saved.map((cell) =>
    cell.planId === "free" && cell.key === "projects.max"
      ? { ...cell, limit: 5 }
      : cell,
  );
  expect(changedCells(saved, saved)).toEqual([]);
  expect(changedCells(saved, draft)).toEqual([
    { enabled: true, key: "projects.max", limit: 5, planId: "free" },
  ]);
});

test("parseLimit treats an empty input as unlimited", () => {
  expect(parseLimit("")).toBeNull();
  expect(parseLimit(" 12 ")).toBe(12);
});
