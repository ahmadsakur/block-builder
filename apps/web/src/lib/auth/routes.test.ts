import { describe, expect, test } from "vitest";
import { homeFor, proxyRedirect } from "./routes";

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
