import { describe, expect, test } from "vitest";
import { authErrorMessage } from "./errors";

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
