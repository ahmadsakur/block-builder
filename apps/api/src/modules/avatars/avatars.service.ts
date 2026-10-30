import type { AvatarType } from "@block-builder/shared/avatar";
import { storage } from "../../lib/storage";
import {
  avatarImageUrl,
  avatarKeyFromImage,
  newAvatarKey,
} from "./avatars.logic";

export async function storeAvatar(
  userId: string,
  type: AvatarType,
  body: Uint8Array,
): Promise<string> {
  const key = newAvatarKey(userId, type);
  await storage.put(key, body, type);
  return avatarImageUrl(key);
}

export function readAvatar(userId: string, file: string) {
  return storage.get(`avatars/${userId}/${file}`);
}

export async function deleteAvatarFile(
  image: string | null | undefined,
): Promise<void> {
  const key = avatarKeyFromImage(image);
  if (key) await storage.delete(key);
}
