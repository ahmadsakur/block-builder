export function queryStatus(query: { isError: boolean; isPending: boolean }) {
  if (query.isError) return "error" as const;
  if (query.isPending) return "loading" as const;
  return undefined;
}
