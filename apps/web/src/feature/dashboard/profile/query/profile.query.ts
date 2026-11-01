"use client";

import { useMutation } from "@tanstack/react-query";
import { useSetSession } from "@/lib/auth/session-query";
import {
  changePassword,
  deleteAccount,
  removeAvatar,
  updateProfile,
  uploadAvatar,
} from "../service/profile.service";

export function useUpdateProfile() {
  const setSession = useSetSession();
  return useMutation({ mutationFn: updateProfile, onSuccess: setSession });
}

export function useChangePassword() {
  return useMutation({ mutationFn: changePassword });
}

export function useDeleteAccount() {
  const setSession = useSetSession();
  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => setSession(null),
  });
}

export function useUploadAvatar() {
  const setSession = useSetSession();
  return useMutation({ mutationFn: uploadAvatar, onSuccess: setSession });
}

export function useRemoveAvatar() {
  const setSession = useSetSession();
  return useMutation({ mutationFn: removeAvatar, onSuccess: setSession });
}
