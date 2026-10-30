export const THEME_PREFERENCES = ["light", "dark", "system"] as const;

export type ThemePreference = (typeof THEME_PREFERENCES)[number];

export const AVATAR_TYPES = ["image/png", "image/jpeg", "image/webp"] as const;

export const AVATAR_MAX_BYTES = 5 * 1024 * 1024;
