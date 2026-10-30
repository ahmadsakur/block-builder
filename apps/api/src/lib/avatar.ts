import type { AvatarType } from "@block-builder/shared/avatar";

const PREFIX = "avatars/";
const PUBLIC_PATH = "/api/";

const EXTENSIONS: Record<AvatarType, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function newAvatarKey(userId: string, type: AvatarType): string {
  return `${PREFIX}${userId}/${crypto.randomUUID()}.${EXTENSIONS[type]}`;
}

export function avatarImageUrl(key: string): string {
  return `${PUBLIC_PATH}${key}`;
}

export function avatarKeyFromImage(image?: string | null): string | null {
  if (!image?.startsWith(`${PUBLIC_PATH}${PREFIX}`)) return null;
  return image.slice(PUBLIC_PATH.length);
}
