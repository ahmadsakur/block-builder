import { expect, test } from "vitest";
import { planIdSchema, planSlug, toPlanId } from "./plans";

test("planSlug turns a name into a valid plan id", () => {
  expect(planSlug("Team Plus!")).toBe("team-plus");
  expect(planSlug("  ")).toBe("plan");
  expect(planIdSchema.safeParse(planSlug("Équipe 2026")).success).toBe(true);
});

test("toPlanId falls back to the default plan", () => {
  expect(toPlanId("pro")).toBe("pro");
  expect(toPlanId(null)).toBe("free");
});
