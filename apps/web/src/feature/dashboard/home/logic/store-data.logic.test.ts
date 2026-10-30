import { describe, expect, test } from "vitest";
import { DEFAULT_QUERY, TODAY } from "../data/home.data";
import { buildStoreData, splitTotal } from "./store-data.logic";

const total = (values: number[]) => values.reduce((sum, value) => sum + value);

describe("splitTotal", () => {
  test("parts always add up to the total", () => {
    expect(total(splitTotal(1001, [0.33, 0.33, 0.34]))).toBe(1001);
  });
});

describe("buildStoreData", () => {
  test("channels and products both split the same revenue", () => {
    const data = buildStoreData(DEFAULT_QUERY, TODAY);
    expect(total(data.channels.map((channel) => channel.value))).toBe(
      total(data.products.map((product) => product.revenue)),
    );
  });

  test("one point per day, or per hour for today", () => {
    expect(buildStoreData(DEFAULT_QUERY, TODAY).chart).toHaveLength(30);
    expect(
      buildStoreData({ ...DEFAULT_QUERY, preset: "today" }, TODAY).chart,
    ).toHaveLength(24);
  });

  test("turning compare off drops the previous values", () => {
    const data = buildStoreData({ ...DEFAULT_QUERY, compare: false }, TODAY);
    expect(data.stats.every((stat) => stat.previous === undefined)).toBe(true);
  });

  test("a region filter narrows revenue", () => {
    const all = buildStoreData(DEFAULT_QUERY, TODAY);
    const europe = buildStoreData(
      { ...DEFAULT_QUERY, region: "Europe" },
      TODAY,
    );
    expect(europe.month.current).toBeLessThan(all.month.current);
  });
});
