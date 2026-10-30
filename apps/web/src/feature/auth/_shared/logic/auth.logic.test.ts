import { describe, expect, test } from "vitest";
import {
  authErrorMessage,
  homeFor,
  proxyRedirect,
  toSession,
} from "./auth.logic";

describe("authErrorMessage", () => {
  test("maps known better-auth codes to our copy", () => {
    expect(authErrorMessage({ code: "INVALID_EMAIL_OR_PASSWORD" })).toBe(
      "That email and password don't match.",
    );
    expect(
      authErrorMessage({ code: "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL" }),
    ).toBe("An account with this email already exists.");
    expect(authErrorMessage({ code: "INVALID_PASSWORD" })).toBe(
      "Your current password is incorrect.",
    );
    expect(authErrorMessage({ code: "EMAIL_NOT_VERIFIED" })).toBe(
      "Verify your email first. We just sent you a new link.",
    );
  });

  test("falls back to the server message, then a generic one", () => {
    expect(authErrorMessage({ code: "OTHER", message: "Rate limited" })).toBe(
      "Rate limited",
    );
    expect(authErrorMessage({})).toBe("Something went wrong. Try again.");
  });
});

describe("toSession", () => {
  test("maps the better-auth image to avatarUrl and keeps the role", () => {
    expect(
      toSession({
        email: "a@b.co",
        id: "1",
        image: "/a.png",
        name: "Ana",
        role: "root",
      }),
    ).toEqual({
      user: {
        avatarUrl: "/a.png",
        email: "a@b.co",
        id: "1",
        name: "Ana",
        role: "root",
      },
    });
  });

  test("leaves avatarUrl out and defaults the role", () => {
    expect(
      toSession({ email: "a@b.co", id: "1", image: null, name: "Ana" }),
    ).toEqual({
      user: { email: "a@b.co", id: "1", name: "Ana", role: "user" },
    });
  });
});

describe("homeFor", () => {
  test("sends each role to its own area", () => {
    expect(homeFor("root")).toBe("/dashboard");
    expect(homeFor("user")).toBe("/app");
  });
});

describe("proxyRedirect", () => {
  test("sends signed-out visitors of an area to sign-in", () => {
    expect(proxyRedirect("/dashboard/home", null)).toBe("/sign-in");
    expect(proxyRedirect("/app", null)).toBe("/sign-in");
  });

  test("lets each role into its own area only", () => {
    expect(proxyRedirect("/dashboard/customers", "root")).toBeNull();
    expect(proxyRedirect("/app/home", "user")).toBeNull();
    expect(proxyRedirect("/dashboard/home", "user")).toBe("/app");
    expect(proxyRedirect("/app/profile", "root")).toBe("/dashboard");
  });

  test("moves signed-in users off the auth pages", () => {
    expect(proxyRedirect("/sign-in", "user")).toBe("/app");
    expect(proxyRedirect("/sign-up", null)).toBeNull();
  });

  test("doesn't treat look-alike paths as an area", () => {
    expect(proxyRedirect("/application", null)).toBeNull();
  });
});
