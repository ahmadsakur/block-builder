import { apiRequest, authClient, unwrap } from "@/lib/auth/client";
import { currentSession } from "@/lib/auth/session";
import { squareImage } from "@/lib/image";
import {
  AVATAR_SIZE_PX,
  type ChangePasswordInput,
  type ProfileInput,
  type Session,
} from "../types/profile.types";

export async function updateProfile({
  name,
  email,
}: ProfileInput): Promise<Session> {
  const { user } = await currentSession();
  await unwrap(authClient.updateUser({ name }));
  if (email !== user.email) {
    await unwrap(authClient.changeEmail({ newEmail: email }));
  }
  return currentSession();
}

export async function changePassword({
  currentPassword,
  newPassword,
}: ChangePasswordInput): Promise<void> {
  await unwrap(
    authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    }),
  );
}

export async function uploadAvatar(file: Blob): Promise<Session> {
  const body = new FormData();
  body.append("file", await squareImage(file, AVATAR_SIZE_PX), "avatar.webp");
  await apiRequest("/api/avatars", { body, method: "PUT" });
  return currentSession();
}

export async function removeAvatar(): Promise<Session> {
  await apiRequest("/api/avatars", { method: "DELETE" });
  return currentSession();
}

export async function deleteAccount(): Promise<void> {
  await unwrap(authClient.deleteUser());
}
