"use client";

import { useMutation } from "@tanstack/react-query";
import { useSetSession } from "@/lib/auth/session-query";
import {
  requestPasswordReset,
  resetPassword,
  signIn,
  signUp,
} from "../service/auth.service";

export function useSignIn() {
  const setSession = useSetSession();
  return useMutation({ mutationFn: signIn, onSuccess: setSession });
}

export function useSignUp() {
  return useMutation({ mutationFn: signUp });
}

export function useRequestPasswordReset() {
  return useMutation({ mutationFn: requestPasswordReset });
}

export function useResetPassword() {
  return useMutation({ mutationFn: resetPassword });
}
