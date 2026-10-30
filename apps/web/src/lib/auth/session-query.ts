"use client";

import type { Session } from "@block-builder/shared/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSession, signOut } from "./session";

export const SESSION_KEY = ["auth", "session"] as const;

export function useSessionQuery() {
  return useQuery({ queryKey: SESSION_KEY, queryFn: getSession });
}

export function useSetSession() {
  const client = useQueryClient();
  return (session: Session | null) => client.setQueryData(SESSION_KEY, session);
}

export function useSignOut() {
  const setSession = useSetSession();
  return useMutation({
    mutationFn: signOut,
    onSuccess: () => setSession(null),
  });
}
