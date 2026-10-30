const PREFIX = "avatars/";
const PUBLIC_PATH = "/api/";

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export const AVATAR_MAX_BYTES = 1024 * 1024;

export function isAvatarType(type: string): boolean {
  return type in EXTENSIONS;
}

export function newAvatarKey(userId: string, type: string): string {
  return `${PREFIX}${userId}/${crypto.randomUUID()}.${EXTENSIONS[type]}`;
}

export function avatarImageUrl(key: string): string {
  return `${PUBLIC_PATH}${key}`;
}

export function avatarKeyFromImage(image?: string | null): string | null {
  if (!image?.startsWith(`${PUBLIC_PATH}${PREFIX}`)) return null;
  return image.slice(PUBLIC_PATH.length);
}
