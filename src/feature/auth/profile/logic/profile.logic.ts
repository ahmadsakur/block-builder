import { AVATAR_MAX_BYTES, AVATAR_TYPES } from "../types/profile.types";

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts.at(-1)?.[0] ?? "") : "";
  return `${first}${last}`.toUpperCase() || "?";
}

export function avatarFileError(file: {
  type: string;
  size: number;
}): string | undefined {
  if (!(AVATAR_TYPES as readonly string[]).includes(file.type)) {
    return "Use a PNG, JPEG or WebP image.";
  }
  if (file.size > AVATAR_MAX_BYTES) return "Use an image under 5 MB.";
  return undefined;
}
