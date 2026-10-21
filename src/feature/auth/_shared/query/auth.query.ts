"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changePassword,
  deleteAccount,
  getSession,
  requestPasswordReset,
  resetPassword,
  signIn,
  signOut,
  signUp,
  updateProfile,
} from "../service/auth.service";
import type { Session } from "../types/auth.types";

export const authKeys = {
  session: ["auth", "session"] as const,
};

export function useSessionQuery() {
  return useQuery({ queryKey: authKeys.session, queryFn: getSession });
}

function useSetSession() {
  const client = useQueryClient();
  return (session: Session | null) =>
    client.setQueryData(authKeys.session, session);
}

export function useSignIn() {
  const setSession = useSetSession();
  return useMutation({ mutationFn: signIn, onSuccess: setSession });
}

export function useSignUp() {
  const setSession = useSetSession();
  return useMutation({ mutationFn: signUp, onSuccess: setSession });
}

export function useSignOut() {
  const setSession = useSetSession();
  return useMutation({
    mutationFn: signOut,
    onSuccess: () => setSession(null),
  });
}

export function useRequestPasswordReset() {
  return useMutation({ mutationFn: requestPasswordReset });
}

export function useResetPassword() {
  return useMutation({ mutationFn: resetPassword });
}

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
