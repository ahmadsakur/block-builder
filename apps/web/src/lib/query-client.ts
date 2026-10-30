import { QueryClient } from "@tanstack/react-query";

const STALE_TIME_MS = 60_000;

let browserQueryClient: QueryClient | undefined;

function createQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { staleTime: STALE_TIME_MS } },
  });
}

export function getQueryClient() {
  if (typeof window === "undefined") return createQueryClient();
  browserQueryClient ??= createQueryClient();
  return browserQueryClient;
}
