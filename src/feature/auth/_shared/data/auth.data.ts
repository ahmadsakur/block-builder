import type { AuthUser } from "../types/auth.types";

export const DEMO_USER: AuthUser = {
  email: "jane@acme.com",
  id: "user-jane",
  name: "Jane Doe",
};

export const WRONG_PASSWORD = "wrong-password";

export const TAKEN_EMAIL = "taken@acme.com";
