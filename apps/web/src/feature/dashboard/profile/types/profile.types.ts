export type {
  AuthUser,
  ChangePasswordInput,
  ProfileInput,
  Session,
} from "@block-builder/shared/auth";
export {
  changePasswordSchema,
  profileSchema,
} from "@block-builder/shared/auth";
export { AVATAR_TYPES } from "@block-builder/shared/avatar";

export const THEME_PREFERENCES = ["light", "dark", "system"] as const;

export type ThemePreference = (typeof THEME_PREFERENCES)[number];

export const AVATAR_PICK_MAX_BYTES = 5 * 1024 * 1024;

export const AVATAR_SIZE_PX = 256;
