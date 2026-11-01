import { expect, test } from "vitest";
import type { ManagedUser } from "../types/users.types";
import { userStatus } from "./users.logic";

const USER: ManagedUser = {
  banned: false,
  createdAt: "2026-10-31T00:00:00.000Z",
  email: "ana@example.com",
  emailVerified: true,
  id: "u1",
  name: "Ana",
  plan: "free",
};

test("a banned user reads banned even when verified", () => {
  expect(userStatus({ ...USER, banned: true })).toBe("banned");
});

test("verification decides between active and unverified", () => {
  expect(userStatus(USER)).toBe("active");
  expect(userStatus({ ...USER, emailVerified: false })).toBe("unverified");
});
