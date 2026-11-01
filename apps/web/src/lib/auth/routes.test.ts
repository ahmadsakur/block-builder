import { describe, expect, test } from "vitest";
import {
  gateFor,
  homeFor,
  proGate,
  proxyRedirect,
  upgradeHref,
} from "./routes";

describe("homeFor", () => {
  test("sends each role to its own area", () => {
    expect(homeFor("root")).toBe("/back-office");
    expect(homeFor("user")).toBe("/dashboard");
  });
});

describe("proxyRedirect", () => {
  test("sends signed-out visitors of an area to sign-in", () => {
    expect(proxyRedirect("/back-office/home", null)).toBe("/sign-in");
    expect(proxyRedirect("/dashboard", null)).toBe("/sign-in");
  });

  test("lets each role into its own area only", () => {
    expect(proxyRedirect("/back-office/customers", "root")).toBeNull();
    expect(proxyRedirect("/dashboard/home", "user")).toBeNull();
    expect(proxyRedirect("/back-office/home", "user")).toBe("/dashboard");
    expect(proxyRedirect("/dashboard/profile", "root")).toBe("/back-office");
  });

  test("moves signed-in users off the auth pages", () => {
    expect(proxyRedirect("/sign-in", "user")).toBe("/dashboard");
    expect(proxyRedirect("/sign-up", null)).toBeNull();
  });

  test("doesn't treat look-alike paths as an area", () => {
    expect(proxyRedirect("/dashboards", null)).toBeNull();
  });
});

describe("gateFor", () => {
  test("finds the permission a dashboard page needs", () => {
    expect(gateFor("/dashboard/analytics")).toBe("analytics.view");
    expect(gateFor("/dashboard/analytics/weekly")).toBe("analytics.view");
  });

  test("leaves open pages and look-alikes alone", () => {
    expect(gateFor("/dashboard/projects")).toBeUndefined();
    expect(gateFor("/dashboard/analyticsx")).toBeUndefined();
  });
});

test("upgradeHref names the locked permission", () => {
  expect(upgradeHref("analytics.view")).toBe(
    "/dashboard/upgrade?permission=analytics.view",
  );
});

describe("proGate", () => {
  const page = (query = "") =>
    new URL(`http://localhost:3000/dashboard/analytics${query}`);

  test("marks a locked page so the next request shows the Pro dialog", () => {
    expect(proGate(page("?range=7d"), true)).toEqual({
      kind: "redirect",
      url: page("?range=7d&requirePro=true"),
    });
  });

  test("serves the blank Pro page in place of a marked locked page", () => {
    expect(proGate(page("?requirePro=true"), true)).toEqual({
      kind: "rewrite",
      url: new URL("http://localhost:3000/pro-required"),
    });
  });

  test("drops the mark once the page is open to the plan", () => {
    expect(proGate(page("?requirePro=true&range=7d"), false)).toEqual({
      kind: "redirect",
      url: page("?range=7d"),
    });
  });

  test("leaves open pages alone", () => {
    expect(proGate(page(), false)).toBeNull();
  });
});
