import { z } from "zod";
import type { PlanId } from "./plans";

export const ROLES = ["root", "user"] as const;
export type Role = (typeof ROLES)[number];
export const DEFAULT_ROLE: Role = "user";

export function toRole(value: unknown): Role {
  return ROLES.find((role) => role === value) ?? DEFAULT_ROLE;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  plan: PlanId;
  avatarUrl?: string;
}

export interface Session {
  user: AuthUser;
}

const email = z.email("Enter a valid email address.");
const newPassword = z.string().min(8, "Use at least 8 characters.");

export const signInSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password."),
});
export type SignInInput = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
  name: z.string().trim().min(1, "Enter your name."),
  email,
  password: newPassword,
});
export type SignUpInput = z.infer<typeof signUpSchema>;

export const forgotPasswordSchema = z.object({ email });
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({ password: newPassword, confirmPassword: z.string() })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const profileSchema = z.object({
  name: z.string().trim().min(1, "Enter your name."),
  email,
});
export type ProfileInput = z.infer<typeof profileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    newPassword,
    confirmPassword: z.string(),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
